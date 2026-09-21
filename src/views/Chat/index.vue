<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <VanNavBar
        title="AI智能助手"
        fixed
      >
        <template #right>
          <VanIcon
            name="clock-o"
            size="21"
            @click="openConversationList"
          />
        </template>
      </VanNavBar>
    </div>
    <SideBar v-model:show="conversationListShow"></SideBar>

    <!-- 主体聊天内容 -->
    <div
      ref="chatContainer"
      class="chat-container"
    >
      <div
        v-if="messages.length === 0"
        class="chat-empty"
      >
        <VanEmpty description="开始和AI助手对话吧"></VanEmpty>
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <VanTag
            v-for="tag in quickQuestions"
            :key="tag"
            size="large"
            mark
            class="quick-tag"
            @click="selectTag(tag)"
          >
            {{ tag }}
          </VanTag>
        </div>
      </div>
      <div
        v-else
        class="message-list"
      >
        <ChatBubble
          v-for="msg in messages"
          :key="msg.id"
          :message="msg"
          :streaming="isStreaming && msg.id === streamingId"
        ></ChatBubble>
        <div
          v-if="isStreaming"
          class="streaming-indicator"
        >
          <VanLoading
            type="spinner"
            size="20px"
          ></VanLoading>
          <span>AI正在思考中...</span>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="chat-input-area">
      <VanField
        v-model="inputMessage"
        placeholder="请输入你的问题"
        :disabled="isStreaming"
        @keydown.enter="sendMessage"
      >
        <template #button>
          <VanButton
            type="primary"
            size="small"
            :disabled="isStreaming"
            @click="sendMessage"
          >
            发送
          </VanButton>
        </template>
      </VanField>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, nextTick } from 'vue'
import { fetchStream } from '@/utils/request.js'
import { createMarkdownStreamBuffer } from '@/utils/streamBuffer.js'
import { showToast } from 'vant'
import ChatBubble from '@/components/chat/ChatBubble.vue'
import SideBar from '@/components/chat/sideBar.vue'
import { useChatStore } from '@/store/index.js'

// const router = useRouter()
const route = useRoute()
const inputMessage = ref('')
const conversationListShow = ref(false)

const chatStore = useChatStore()
// 对话数据：直接由 store 的当前对话驱动，避免本地副本与 store 脱节
const messages = computed(() => chatStore.currentMessages)
const quickQuestions = [
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
]

const isStreaming = ref(false)
// 当前正在流式输出的消息 id（用于显示打字光标）
const streamingId = ref('')

// 自动滚动到底部
const chatContainer = ref(null)
const scrollToBottom = () => {
  nextTick(() => {
    const el = chatContainer.value
    if (el) el.scrollTop = el.scrollHeight // scrollHeight:容器里内容的完整总高度,scrollTop:内容从顶部往下滚了多少像素
  })
}

const selectTag = (tag) => {
  inputMessage.value = tag
}

// 最多携带给后端的会话历史条数，避免 token 超限
const MAX_HISTORY = 20

// 获取响应（方案 A：把当前对话的完整历史发给后端，后端无状态）
const fetchAiResponse = () => {
  isStreaming.value = true
  // 先写入一条空的 AI 消息占位，拿到 id 用于流式增量更新
  const aiMsg = chatStore.addMessage({
    role: 'ai',
    content: '',
    timestamp: new Date().toISOString()
  })
  const aiId = aiMsg.id
  streamingId.value = aiId
  // 流式缓冲区：统一换行 + 累积全文（未闭合的代码块由气泡渲染时再切分）
  const buffer = createMarkdownStreamBuffer()

  // 高频 chunk 用 rAF 合并成一帧一次更新，避免长文本时每个分片都触发解析 + 滚动
  let rafId = null
  const cancelScheduled = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
  // done=true 表示流已结束，立即落库并收尾
  const flush = (done = false) => {
    cancelScheduled()
    chatStore.updateMessage(aiId, buffer.raw)
    scrollToBottom()
    if (done) {
      isStreaming.value = false
      streamingId.value = ''
    }
  }
  const scheduleFlush = () => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      rafId = null
      flush()
    })
  }

  // 取当前会话全部消息，排除刚写入的空占位 AI 消息，映射成接口要求的 messages 格式
  // 只保留最近 MAX_HISTORY 条，避免 token 超限
  const history = chatStore.currentMessages
    .filter((m) => !(m.role === 'ai' && m.content === ''))
    .map((m) => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.content
    }))
    .slice(-MAX_HISTORY)

  fetchStream(
    'chat',
    { messages: history },
    (chunk) => {
      // 只做累积，写入与渲染交给下一帧统一处理
      buffer.push(chunk)
      scheduleFlush()
    },
    () => {
      // 流结束：把完整原文落库（此时围栏已闭合，气泡会正常高亮）
      flush(true)
    },
    (errMsg) => {
      // 中断时若代码块还没闭合，先补上围栏，避免错误提示被当成代码
      if (buffer.split().pendingIsCode) {
        buffer.push('\n```\n')
      }
      // 保留已输出的部分内容，只追加错误提示，避免整条消息被覆盖
      buffer.push(`\n\n> 抱歉，AI发生了错误：${errMsg || '未知错误'}`)
      flush(true)
      showToast('AI回复失败！')
    }
  )
}

// 发送
const sendMessage = () => {
  const msg = inputMessage.value.trim()
  if (!msg || isStreaming.value) {
    return
  }
  // 写入用户消息（store 内部会在需要时自动新建对话并更新标题）
  chatStore.addMessage({
    role: 'user',
    content: msg,
    timestamp: new Date().toISOString()
  })
  inputMessage.value = ''
  scrollToBottom()
  // 进行流式请求（历史由当前对话自动构建并发送给后端）
  fetchAiResponse()
}

// 打开对话列表弹框
const openConversationList = () => {
  conversationListShow.value = true
}

onMounted(async () => {
  if (route.query.scene === 'detail' && route.query.city) {
    inputMessage.value = `我想去${route.query.city}，请给我制定一个旅行计划`
  }
})
</script>

<style lang="scss" scoped>
.page-header {
  height: 46px;
}

.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 0px !important;
}

.chat-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 130px;
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.quick-questions {
  margin-top: 32px;
  text-align: center;
}

.quick-title {
  font-size: 14px;
  color: #999;
  margin-bottom: 16px;
}

.quick-tag {
  margin: 8px;
  cursor: pointer;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.streaming-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #999;
  font-size: 14px;
}

.chat-input-area {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 16px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  margin: 0 auto;
}

.chat-input-area :deep(.van-field) {
  background: #f7f8fa;
  border-radius: 20px;
  padding: 8px 16px;
}
</style>
