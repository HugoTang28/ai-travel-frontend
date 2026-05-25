<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar
        title="AI智能助手"
        left-arrow
        left-text="返回"
        @click-left="router.back()"
      />
    </div>

    <div ref="messageContainer" class="chat-container">
      <div v-if="!messageBox.length" class="chat-empty">
        <div class="welcome-card">
          <div class="welcome-badge">AI Travel Copilot</div>
          <div class="empty-title">今天想去哪儿？</div>
          <div class="empty-subtitle">
            输入目的地、预算、天数或者想玩的类型，我会按聊天的方式帮你整理出行思路。
          </div>

          <div class="suggestion-list">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="suggestion-chip"
              type="button"
              @click="fillSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="message-list">
        <ChatBubble
          v-for="message in messageBox"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>

    <div class="chat-input-area">
      <div class="chat-input-shell">
        <van-field
          v-model="inputValue"
          type="textarea"
          rows="1"
          autosize
          clearable
          placeholder="问我行程、预算、美食或者住宿"
          @keydown.enter.exact.prevent="sendMessage"
        >
          <template #button>
            <van-button
              type="primary"
              size="small"
              :loading="isSending"
              :disabled="!canSend"
              @click="sendMessage"
            >
              发送
            </van-button>
          </template>
        </van-field>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import ChatBubble from '@/components/ChatBubble.vue'

const router = useRouter()
const inputValue = ref('')
const isSending = ref(false)
const messageBox = ref([])
const messageContainer = ref(null)

const suggestions = [
  '预算 2000，周末去哪里合适？',
  '杭州 3 天行程怎么安排？',
  '想找适合放松的海边城市',
]

const canSend = computed(() => inputValue.value.trim().length > 0 && !isSending.value)

const sleep = (ms) => new Promise((resolve) => {
  window.setTimeout(resolve, ms)
})

const createMessage = (role, content = '', status = 'done') => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  status,
  timestamp: Date.now(),
})

const scrollToBottom = async () => {
  await nextTick()

  if (!messageContainer.value) {
    return
  }

  messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

const fillSuggestion = (suggestion) => {
  inputValue.value = suggestion
}

const buildMockReply = (question) => {
  if (question.includes('预算')) {
    return `可以先把预算拆成 4 块：交通、住宿、餐饮、门票。\n你把总预算和天数告诉我，我可以继续帮你细化到每天的花费。`
  }

  if (question.includes('攻略') || question.includes('行程')) {
    return `做行程前，我建议先确认 3 个信息：\n1. 去哪儿\n2. 玩几天\n3. 人均预算\n\n你把这 3 个信息发我，我就能继续给你拆每日安排。`
  }

  if (question.includes('海边') || question.includes('放松')) {
    return `如果你想走轻松路线，我会优先推荐海边或慢节奏城市。\n你再告诉我是周末短途还是 3 到 5 天出行，我可以继续缩小范围。`
  }

  return `我已经收到你的问题：${question}\n\n现在这版前端已经是标准聊天框结构了。后面你把真实大模型接口接进来，我就能按消息列表继续对话。`
}

const getAssistantReply = async (question) => {
  // 后面接真实接口时，替换成 post('/chat', { messages: messageBox.value })
  await sleep(500)
  return buildMockReply(question)
}

const streamAssistantReply = async (messageId, fullText) => {
  const targetMessage = messageBox.value.find((item) => item.id === messageId)

  if (!targetMessage) {
    return
  }

  targetMessage.status = 'streaming'

  for (let index = 0; index < fullText.length; index += 2) {
    targetMessage.content = fullText.slice(0, index + 2)
    await scrollToBottom()
    await sleep(35)
  }

  targetMessage.status = 'done'
}

const sendMessage = async () => {
  const question = inputValue.value.trim()

  if (!question) {
    showToast('请输入内容')
    return
  }

  if (isSending.value) {
    return
  }

  const userMessage = createMessage('user', question)
  const assistantMessage = createMessage('assistant', '', 'loading')

  messageBox.value.push(userMessage, assistantMessage)
  inputValue.value = ''
  isSending.value = true

  await scrollToBottom()

  try {
    const reply = await getAssistantReply(question)
    await streamAssistantReply(assistantMessage.id, reply)
  } catch (error) {
    assistantMessage.status = 'error'
    assistantMessage.content = '回复失败，请稍后重试。'
  } finally {
    isSending.value = false
    await scrollToBottom()
  }
}
</script>

<style lang="scss" scoped>
.chat-page {
  --chat-primary: #2f8cff;
  --chat-primary-soft: #eaf4ff;
  --chat-text: #243042;
  --chat-subtle: #64748b;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-bottom: 50px;
  overflow: hidden;
  background:
    radial-gradient(circle at top right, rgba(47, 140, 255, 0.18), transparent 32%),
    radial-gradient(circle at top left, rgba(98, 182, 255, 0.12), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #f3f7fb 48%, #f6f8fc 100%);
}

.page-header {
  background: transparent;
}

.page-header :deep(.van-nav-bar) {
  background: rgba(248, 251, 255, 0.72);
  backdrop-filter: blur(14px);
}

.page-header :deep(.van-nav-bar::after) {
  display: none;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 18px 14px 142px;
}

.chat-container::-webkit-scrollbar {
  display: none;
}

.chat-empty {
  display: flex;
  align-items: center;
  min-height: 100%;
}

.welcome-card {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 26px 22px 22px;
  border: 1px solid rgba(148, 173, 208, 0.24);
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(241, 247, 255, 0.92));
  box-shadow: 0 24px 48px rgba(24, 43, 77, 0.1);
}

.welcome-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--chat-primary-soft);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3278d8;
}

.empty-title {
  margin-top: 18px;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.15;
  color: #1e2d46;
}

.empty-subtitle {
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.7;
  color: #5d6d84;
}

.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.suggestion-chip {
  padding: 10px 14px;
  border: 0;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 24px rgba(36, 74, 128, 0.08);
  font-size: 13px;
  line-height: 1.4;
  color: #314866;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding-top: 8px;
}

.chat-input-area {
  position: fixed;
  right: 0;
  bottom: 50px;
  left: 0;
  z-index: 10;
  padding: 10px 14px 14px;
  background: linear-gradient(180deg, rgba(248, 251, 255, 0), rgba(248, 251, 255, 0.84) 24%, rgba(248, 251, 255, 0.96) 100%);
  backdrop-filter: blur(12px);
}

.chat-input-shell {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 10px 12px;
  border: 1px solid rgba(148, 173, 208, 0.28);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 18px 40px rgba(35, 61, 102, 0.12);
}

.chat-input-shell :deep(.van-field) {
  padding: 0;
  background: transparent;
}

.chat-input-shell :deep(.van-cell:after) {
  display: none;
}

.chat-input-shell :deep(.van-field__body) {
  align-items: flex-end;
}

.chat-input-shell :deep(.van-field__control) {
  min-height: 24px;
  max-height: 120px;
  padding: 10px 0;
  font-size: 15px;
  line-height: 1.6;
  color: var(--chat-text);
}

.chat-input-shell :deep(.van-field__control::placeholder) {
  color: #98a6b8;
}

.chat-input-shell :deep(.van-field__button) {
  padding-left: 12px;
}

.chat-input-shell :deep(.van-button--primary) {
  height: 40px;
  padding: 0 18px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f8cff 0%, #5aa7ff 100%);
  box-shadow: 0 12px 24px rgba(47, 140, 255, 0.24);
}

.chat-input-shell :deep(.van-button--disabled) {
  opacity: 0.56;
}

.chat-input-shell :deep(.van-icon-clear) {
  color: #b2bfd1;
}
</style>
