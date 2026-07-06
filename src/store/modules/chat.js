import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid';

export const useChatStre = defineStore('chat', () => {
  // 所有对话列表
  const conversations = ref([
    {
      id: '1',
      title: '新对话',
      messages: [], // 消息列表
      createdAt: Date.now(),
    },
    {
      id: '2',
      title: '测试对话',
      messages: [
        {
          id: Date.now(),
          role: 'user',
          content: '你好，这是测试消息',
          timestamp: new Date().toISOString(),
        },
        {
          id: Date.now(),
          role: 'ai',
          content: '这是测试消息的回复',
          timestamp: new Date().toISOString(),
        }
      ]
    }
  ])

  // 当前选中的对话id
  const currentConversationId = ref('1') 

  // 当前对话
  const currentConversation = computed(() => {
    return conversations.value.find(item => item.id === currentConversationId.value)
  })
 
  // 当前对话的message
  const currentMesages = computed(() => {
    return currentConversation.value.messages || []
  })

  // 创建新对话
  const creatConversation = () => {
    const newConversations = {
      id: uuidv4(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
    }
    conversations.value.push(newConversations)
    currentConversationId.value = newConversations.id
  }

  // 切换对话
  const switchConversation = (id) => {
    currentConversationId.value = id
  }

  // 添加消息到当前对话
  const addMessage = (message) => {
    const conversation = conversations.value.find(
      item => item.id === currentConversationId.value
    )
    if (!conversation) return
    conversation.messages.push(message)
  }


  // 删除对话
  const deleteConversation = (id) => {
    const arr = conversations.value
    // 匹配id的元素下标
    const targetIndex = arr.findIndex(item => item.id === id)
    // 找到才删除，避免-1报错
    if (targetIndex !== -1) {
      // splice(起始下标, 删除个数) 直接修改原数组
      arr.splice(targetIndex, 1)
    }
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    currentMesages,
    creatConversation,
    switchConversation,
    deleteConversation,
    addMessage,
  }
}, { persist: true })