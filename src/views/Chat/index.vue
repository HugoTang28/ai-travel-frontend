<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <VanNavBar
        title="AI智能助手"
        left-arrow
        fixed
        left-text="返回"
        @click-left="router.back()"
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
    <SideBar
      v-model:show="conversationListShow"
      :messages="messages"
    ></SideBar>

    <!-- 主体聊天内容 -->
    <div class="chat-container">
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
        @keyup.enter="sendMessage"
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
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed, nextTick } from 'vue'
import { fetchStream } from '@/utils/request.js'
import { showToast } from 'vant'
import ChatBubble from '@/components/chat/ChatBubble.vue'
import sideBar from '@/components/chat/sideBar.vue'
import { useChatStore } from '@/store/index.js'

const router = useRouter()
const route = useRoute()
const inputMessage = ref('')
const conversationListShow = ref(false)

const chatStore = useChatStore()
// 对话数据
const messages = ref([])
const quickQuestions = [
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何选择旅行保险？'
]

const addUserMessage = (content) => {
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content,
    timestamp: new Date().toISOString()
  })
}

const isStreaming = ref(false)

const selectTag = (tag) => {
  inputMessage.value = tag
}

// 获取响应
const fetchAiResponse = (userMsg) => {
  isStreaming.value = true
  messages.value.push({
    id: Date.now() + 1,
    role: 'ai',
    content: '',
    timestamp: new Date().toISOString()
  })
  let fullResponse = ''

  fetchStream(
    'chat',
    { message: userMsg },
    (chunk) => {
      fullResponse += chunk
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg && lastMsg.role === 'ai') {
        lastMsg.content = fullResponse
      }
    },
    () => {
      chatStore.addMessage({
        role: 'ai',
        content: fullResponse,
        timestamp: new Date().toISOString()
      })
      isStreaming.value = false
    },
    (errMsg) => {
      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg && lastMsg.role === 'ai') {
        lastMsg.content = `抱歉，AI发生了错误${errMsg}`
      }
      isStreaming.value = false
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
  if (messages.value.length !== 0) {
    chatStore.creatConversation()
  }
  chatStore.addMessage({
    role: 'user',
    content: msg,
    timestamp: new Date().toISOString()
  })
  addUserMessage(msg)
  inputMessage.value = ''
  // 进行流式请求
  fetchAiResponse(msg)
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
  // flex: 1;
  height: 650px;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 60px;
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
