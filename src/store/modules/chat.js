import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// 持久化上限：AI 长回复持续累积容易撑爆 localStorage(约5MB) 配额
const MAX_CONVERSATIONS = 30
const MAX_MESSAGES_PER_CONVERSATION = 100

// 新建一个空对话
const newConversation = () => ({
  id: uuidv4(),
  title: '新对话',
  messages: [],
  createdAt: Date.now()
})

// 超限时丢弃最旧的会话/消息（就地修改）
const trimConversations = (list) => {
  if (list.length > MAX_CONVERSATIONS) {
    list.splice(0, list.length - MAX_CONVERSATIONS)
  }
  list.forEach((c) => {
    if (Array.isArray(c.messages) && c.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
      c.messages.splice(0, c.messages.length - MAX_MESSAGES_PER_CONVERSATION)
    }
  })
}

// localStorage 写入可能抛 QuotaExceededError，包装一层避免整页崩溃
const safeStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error('[chat] 会话持久化失败(可能超出配额)', e)
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
    } catch {
      /* 忽略 */
    }
  }
}

export const useChatStore = defineStore(
  'chat',
  () => {
    // 所有对话列表（初始仅一个空对话，不内置 mock 数据）
    const conversations = ref([newConversation()])

    // 当前选中的对话id
    const currentConversationId = ref(conversations.value[0].id)

    // 当前对话
    const currentConversation = computed(() => {
      return conversations.value.find((item) => item.id === currentConversationId.value) || null
    })

    // 当前对话的message
    const currentMessages = computed(() => {
      return currentConversation.value?.messages || []
    })

    // 创建新对话并返回
    const createConversation = () => {
      const conv = newConversation()
      conversations.value.push(conv)
      trimConversations(conversations.value)
      currentConversationId.value = conv.id
      return conv
    }

    // 切换对话
    const switchConversation = (id) => {
      currentConversationId.value = id
    }

    // 清空全部会话（退出登录 / 401 时调用）
    const resetChat = () => {
      const conv = newConversation()
      conversations.value = [conv]
      currentConversationId.value = conv.id
    }

    // 根据首条用户消息生成对话标题
    const updateTitleFromMessage = (message) => {
      const conversation = conversations.value.find(
        (item) => item.id === currentConversationId.value
      )
      if (!conversation || conversation.title !== '新对话') return
      const text = (message.content || '').trim()
      if (text) {
        conversation.title = text.length > 12 ? text.slice(0, 12) + '...' : text
      }
    }

    // 添加消息到当前对话，若当前无对话则自动新建
    const addMessage = (message) => {
      let conversation = conversations.value.find((item) => item.id === currentConversationId.value)
      if (!conversation) {
        conversation = createConversation()
      }
      const msg = { id: uuidv4(), ...message }
      conversation.messages.push(msg)
      if (conversation.messages.length > MAX_MESSAGES_PER_CONVERSATION) {
        conversation.messages.splice(
          0,
          conversation.messages.length - MAX_MESSAGES_PER_CONVERSATION
        )
      }
      if (message.role === 'user') {
        updateTitleFromMessage(message)
      }
      return msg
    }

    // 更新当前对话中指定消息的内容（用于流式增量）
    const updateMessage = (msgId, content) => {
      const conversation = conversations.value.find(
        (item) => item.id === currentConversationId.value
      )
      if (!conversation) return
      const target = conversation.messages.find((m) => m.id === msgId)
      if (target) {
        target.content = content
      }
    }

    // 删除对话
    const deleteConversation = (id) => {
      const arr = conversations.value
      // 匹配id的元素下标
      const targetIndex = arr.findIndex((item) => item.id === id)
      // 找到才删除，避免-1报错
      if (targetIndex !== -1) {
        // splice(起始下标, 删除个数) 直接修改原数组
        arr.splice(targetIndex, 1)
      }
      // 若删除的是当前对话，或删除后列表为空，保证 currentConversationId 始终有效
      const stillExists = arr.some((item) => item.id === currentConversationId.value)
      if (!stillExists) {
        if (arr.length > 0) {
          currentConversationId.value = arr[0].id
        } else {
          createConversation()
        }
      }
    }

    // 初始化守卫：持久化恢复后保证 currentConversationId 有效
    const validCurrent = conversations.value.some((item) => item.id === currentConversationId.value)
    if (!validCurrent) {
      if (conversations.value.length > 0) {
        currentConversationId.value = conversations.value[0].id
      } else {
        createConversation()
      }
    }

    return {
      conversations,
      currentConversationId,
      currentConversation,
      currentMessages,
      createConversation,
      switchConversation,
      deleteConversation,
      resetChat,
      addMessage,
      updateMessage
    }
  },
  {
    persist: {
      storage: safeStorage,
      // 恢复历史数据时做一次裁剪与校正，防止旧版本数据超限或脏数据
      afterRestore: (ctx) => {
        const store = ctx.store
        if (!Array.isArray(store.conversations) || store.conversations.length === 0) {
          store.resetChat()
          return
        }
        trimConversations(store.conversations)
        const valid = store.conversations.some((c) => c.id === store.currentConversationId)
        if (!valid) {
          store.currentConversationId = store.conversations[0].id
        }
      }
    }
  }
)
