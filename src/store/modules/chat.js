import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useChatStore = defineStore(
  'chat',
  () => {
    // 所有对话列表
    const conversations = ref([
      {
        id: '1',
        title: '新对话',
        messages: [], // 消息列表
        createdAt: Date.now()
      },
      {
        id: '2',
        title: '测试对话',
        messages: [
          {
            id: uuidv4(),
            role: 'user',
            content: '你好，这是测试消息',
            timestamp: new Date().toISOString()
          },
          {
            id: uuidv4(),
            role: 'ai',
            content: '这是测试消息的回复',
            timestamp: new Date().toISOString()
          }
        ]
      }
    ])

    // 当前选中的对话id
    const currentConversationId = ref('1')

    // 当前对话
    const currentConversation = computed(() => {
      return (
        conversations.value.find((item) => item.id === currentConversationId.value) || null
      )
    })

    // 当前对话的message
    const currentMessages = computed(() => {
      return currentConversation.value?.messages || []
    })

    // 创建新对话并返回
    const creatConversation = () => {
      const newConversations = {
        id: uuidv4(),
        title: '新对话',
        messages: [],
        createdAt: Date.now()
      }
      conversations.value.push(newConversations)
      currentConversationId.value = newConversations.id
      return newConversations
    }

    // 切换对话
    const switchConversation = (id) => {
      currentConversationId.value = id
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
      let conversation = conversations.value.find(
        (item) => item.id === currentConversationId.value
      )
      if (!conversation) {
        conversation = creatConversation()
      }
      const msg = { id: uuidv4(), ...message }
      conversation.messages.push(msg)
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
          creatConversation()
        }
      }
    }

    // 初始化守卫：持久化恢复后保证 currentConversationId 有效
    const validCurrent = conversations.value.some(
      (item) => item.id === currentConversationId.value
    )
    if (!validCurrent) {
      if (conversations.value.length > 0) {
        currentConversationId.value = conversations.value[0].id
      } else {
        creatConversation()
      }
    }

    return {
      conversations,
      currentConversationId,
      currentConversation,
      currentMessages,
      creatConversation,
      switchConversation,
      deleteConversation,
      addMessage,
      updateMessage
    }
  },
  { persist: true }
)
