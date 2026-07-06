<template>
  <div class="page-container contact-page">
    <section
      ref="messageContainer"
      class="chat-panel"
    >
      <!-- <div v-if="activeContact.messages.length === 0" class="chat-empty">
        <p class="chat-empty__tip">点击下方输入框开始聊天</p>
      </div> -->

      <template v-if="activeContact.messages.length !== 0">
        <div class="chat-time">{{ activeContact.sessionLabel }}</div>

        <div
          v-for="message in activeContact.messages"
          :key="message.id"
          class="message-row"
          :class="{
            'message-row--self': message.sender === 'me',
            'message-row--contact': message.sender === 'contact'
          }"
        >
          <div
            v-if="message.sender === 'contact'"
            class="message-avatar"
            :style="{ backgroundColor: activeContact.avatarColor }"
          >
            {{ activeContact.avatarText }}
          </div>

          <div class="message-bubble">
            {{ message.content }}
          </div>

          <div
            v-if="message.sender === 'me'"
            class="message-avatar message-avatar--self"
          >
            我
          </div>
        </div>
      </template>

      <div
        v-if="activeContact.pendingReplies > 0"
        class="message-row message-row--contact"
      >
        <div
          class="message-avatar"
          :style="{ backgroundColor: activeContact.avatarColor }"
        >
          {{ activeContact.avatarText }}
        </div>
        <div class="typing-bubble">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>

    <footer class="composer-wrap">
      <div class="composer-panel">
        <textarea
          v-model="draftMessage"
          class="composer-textarea"
          placeholder=""
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>

        <div class="composer-toolbar">
          <div class="composer-tools">
            <button
              type="button"
              class="tool-btn"
              aria-label="emoji"
            >
              <VanIcon name="smile-o" />
            </button>
            <button
              type="button"
              class="tool-btn"
              aria-label="chat"
            >
              <VanIcon name="chat-o" />
            </button>
            <button
              type="button"
              class="tool-btn"
              aria-label="add"
            >
              <VanIcon name="add-o" />
            </button>
          </div>

          <button
            type="button"
            class="send-btn"
            :class="{ 'send-btn--active': draftMessage.trim() }"
            :disabled="!draftMessage.trim()"
            @click="sendMessage"
          >
            发送
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { showToast } from 'vant'

const formatTime = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const formatSessionLabel = (date = new Date()) => {
  return `${date.getMonth() + 1}月${date.getDate()}日 ${formatTime(date)}`
}

const createMessage = (sender, content) => ({
  id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  sender,
  content
})

const contacts = ref([
  {
    id: 'linxia',
    name: '林夏',
    avatarText: '林',
    avatarColor: '#2db7f5',
    autoReply: '收到，我先记下这条消息，后面按这个继续聊。',
    pendingReplies: 0,
    sessionLabel: '',
    messages: []
  },
  {
    id: 'azhe',
    name: '阿哲',
    avatarText: '哲',
    avatarColor: '#ff7f50',
    autoReply: '看到了，这边先按预设消息回你，后续再接真实接口。',
    pendingReplies: 0,
    sessionLabel: '',
    messages: []
  },
  {
    id: 'mia',
    name: 'Mia',
    avatarText: 'M',
    avatarColor: '#8b5cf6',
    autoReply: '好的，这条先用固定回复占位，页面效果已经能跑通。',
    pendingReplies: 0,
    sessionLabel: '',
    messages: []
  }
])

const activeContactId = ref(contacts.value[0].id)
const draftMessage = ref('')
const messageContainer = ref(null)

const activeContact = computed(() => {
  return contacts.value.find((contact) => contact.id === activeContactId.value) || contacts.value[0]
})

const scrollToBottom = async () => {
  await nextTick()

  if (!messageContainer.value) {
    return
  }

  messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

const sendMessage = () => {
  const content = draftMessage.value.trim()

  if (!content) {
    showToast('请输入消息内容')
    return
  }

  const current = activeContact.value

  if (!current.sessionLabel) {
    current.sessionLabel = formatSessionLabel()
  }

  current.messages.push(createMessage('me', content))
  current.pendingReplies += 1
  draftMessage.value = ''
  scrollToBottom()

  window.setTimeout(() => {
    current.messages.push(createMessage('contact', current.autoReply))
    current.pendingReplies = Math.max(0, current.pendingReplies - 1)
    scrollToBottom()
  }, 650)
}

watch(activeContactId, () => {
  scrollToBottom()
})

watch(
  () => activeContact.value.messages.length,
  () => {
    scrollToBottom()
  }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.page-container {
  background-color: #fff;
}

.contact-page {
  max-height: calc(100vh - 50px);
  // padding: 0 0 168px !important;
  // background: #f5f5f5;
}

.chat-panel {
  max-height: calc(100vh - 218px);
  overflow-y: auto;
  padding: 14px 12px 24px;
  // background: #f5f5f5;
}

.chat-empty {
  margin-top: 24px;
  text-align: center;
  color: #a0a0a0;
}

.chat-time {
  margin: 0 auto 12px;
  font-size: 13px;
  color: #9b9b9b;
  text-align: center;
}

.chat-empty__tip {
  margin: 0;
  font-size: 13px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 14px;
}

.message-row--self {
  justify-content: flex-end;
}

.message-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.message-avatar--self {
  background: #c7cbd1;
  color: #4a4a4a;
}

.message-bubble {
  position: relative;
  max-width: min(72%, 520px);
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 15px;
  line-height: 1.5;
  color: #111111;
  word-break: break-word;
}

.message-row--contact .message-bubble {
  border: 1px solid #ebebeb;
  background: #ffffff;
}

.message-row--contact .message-bubble::before {
  position: absolute;
  top: 12px;
  left: -5px;
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-left: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;
  content: '';
  transform: rotate(45deg);
}

.message-row--self .message-bubble {
  background: #95ec69;
}

.message-row--self .message-bubble::before {
  position: absolute;
  top: 12px;
  right: -5px;
  width: 10px;
  height: 10px;
  background: #95ec69;
  content: '';
  transform: rotate(45deg);
}

.typing-bubble {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 12px 14px;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  background: #ffffff;
}

.typing-bubble span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b8b8b8;
  animation: typing 1s infinite ease-in-out;
}

.typing-bubble span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-bubble span:nth-child(3) {
  animation-delay: 0.3s;
}

.composer-wrap {
  position: fixed;
  right: 0;
  bottom: 50px;
  left: 0;
  padding: 8px 8px calc(8px + env(safe-area-inset-bottom));
  max-width: 750px;
  margin: 0 auto;
}

.composer-panel {
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  background: #ffffff;
  overflow: hidden;
}

.composer-textarea {
  display: block;
  width: 100%;
  min-height: 40px;
  padding: 0px 14px 10px;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  font-size: 15px;
  line-height: 1.5;
  color: #111111;
}

.composer-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 8px 10px;
}

.composer-tools {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #5c5c5c;
  font-size: 21px;
}

.send-btn {
  min-width: 56px;
  height: 30px;
  padding: 0 12px;
  border: 0;
  border-radius: 6px;
  background: #ededed;
  color: #b6b6b6;
  font-size: 14px;
}

.send-btn--active {
  background: #07c160;
  color: #ffffff;
}

@keyframes typing {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.4;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
