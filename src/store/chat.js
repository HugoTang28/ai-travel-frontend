import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useChatStre = defineStore('chat', () => {
  // 所有对话列表
  const conversations = ref([
    {
      id: '1',
      title: '新对话',
      messages: [], // 消息列表
      createdAt: Date.now(),
    }
  ])

  // 当前选中的对话id
  const currentConversationsId = ref('1') 

  // 当前对话
  const currentConversations = computed(() => {
    return conversations.value.find(item => item.id === currentConversationsId.value)
  })

  // 当前对话的message
  const currentMesages = computed(() => {
    return currentConversations.value.messages || []
  })

  // 创建新对话
  const creatConversations = () => {
    const newConversations = {
      id: Date.now().toString,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
    }
    conversations.value.push(newConversations)
    currentConversationsId.value = newConversations.id
  }

  // 切换对话
  const switchConversations = (id) => {
    currentConversationsId.value = id
  }

  // 添加消息到当前对话
  const addMessage = (message) => {
    
  }

  return {
    conversations,
    currentConversationsId,
    currentConversations,
    currentMesages,
    creatConversations,
    switchConversations,
    
  }
})