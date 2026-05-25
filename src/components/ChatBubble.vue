<template>
  <div class="chat-bubble" :class="messageClass">
    <div class="message-row">
      <div v-if="!isUserMessage" class="message-avatar">AI</div>

      <div class="message-main">
        <div class="message-label">{{ roleLabel }}</div>

        <div class="bubble-content">
          <div class="message-text">
            <template v-if="message.content">{{ message.content }}</template>
            <span v-else-if="message.status === 'loading'" class="typing-text">
              正在思考<span class="typing-dots">...</span>
            </span>
            <span v-else-if="message.status === 'error'">回复失败，请稍后重试。</span>
          </div>
        </div>

        <div class="message-time" v-if="showTime">{{ formatTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const isUserMessage = computed(() => props.message.role === 'user')

const messageClass = computed(() => {
  return isUserMessage.value ? 'user-message' : 'ai-message'
})

const roleLabel = computed(() => {
  return isUserMessage.value ? '我的提问' : 'AI 旅行助手'
})

const showTime = computed(() => {
  return props.message.timestamp && props.message.content
})

const formatTime = computed(() => {
  if (!props.message.timestamp) return ''

  const date = new Date(props.message.timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})
</script>

<style scoped>
.chat-bubble {
  width: 100%;
}

.message-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.message-main {
  display: flex;
  flex-direction: column;
  max-width: min(82%, 560px);
}

.message-label {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.message-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  margin-top: 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1f7cff 0%, #68b2ff 100%);
  box-shadow: 0 10px 24px rgba(47, 140, 255, 0.28);
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.bubble-content {
  padding: 14px 16px;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.65;
}

.message-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.message-time {
  margin-top: 8px;
  padding: 0 6px;
  font-size: 11px;
  line-height: 1;
  color: #97a3b6;
}

.user-message .message-row {
  justify-content: flex-end;
}

.user-message .message-main {
  align-items: flex-end;
}

.user-message .message-label {
  color: #7e8aa0;
}

.user-message .bubble-content {
  color: #fff;
  background: linear-gradient(135deg, #2f8cff 0%, #5aa7ff 100%);
  border-bottom-right-radius: 6px;
  box-shadow: 0 14px 28px rgba(47, 140, 255, 0.26);
}

.ai-message .message-main {
  align-items: flex-start;
}

.ai-message .message-label {
  color: #5b6b82;
}

.ai-message .bubble-content {
  color: #243042;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 173, 208, 0.24);
  border-bottom-left-radius: 6px;
  box-shadow: 0 14px 30px rgba(28, 49, 88, 0.08);
}

.typing-text {
  display: inline-flex;
  align-items: center;
}

.typing-dots {
  display: inline-block;
  width: 16px;
  overflow: hidden;
  animation: dots 1.2s steps(4, end) infinite;
}

@keyframes dots {
  0% {
    width: 0;
  }

  100% {
    width: 16px;
  }
}
</style>
