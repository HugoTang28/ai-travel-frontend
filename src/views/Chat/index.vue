<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar
        title="AI智能助手"
        left-arrow
        fixed
        left-text="返回"
        @click-left="router.back()"
      >
        <template #right>
          <van-icon @click="openConversationList" name="clock-o" size="21" />
        </template>
      </van-nav-bar>
    </div>
    <van-popup
      v-model:show="conversationListShow"
      position="right"
      :style="{ width: '50%', height: '100%' }"
    >
      <div class="conversation">
        <div class="addNewConversation" @click="debounceAddNewConversation">
          <img class="newIcon" src="@/assets/images/new.png" alt="">
          <span>新建对话</span>
        </div>
        <div class="historicalConversation">历史对话</div>
        <div class="conversationItem" 
          v-for="item in conversations"
          :key="item.id"
          @click="switchConversation(item.id)"
        >
          <div class="msgTitle">{{ item.title }}</div>
          <van-icon @click.stop="deleteConversations(item.id)" name="delete-o" size="20" />
        </div>
      </div>
    </van-popup>
    <!-- 主体聊天内容 -->
    <div class="chat-container">
      <div v-if="messages.length === 0" class="chat-empty">
        <van-empty
          description="开始和AI助手对话吧"
        ></van-empty>
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag @click="handleClick(tag)" v-for="tag in quickQuestions" :key="tag" size="large" mark class="quick-tag">
            {{ tag }}
          </van-tag>
        </div>
      </div>
      <div v-else class="message-list">
        <ChatBubble v-for="msg in messages" :key="msg.id" :message="msg"></ChatBubble>
        <div class="streaming-indicator" v-if="isStreaming">
          <van-loading type="spinner" size="20px"></van-loading>
          <span>AI正在思考中...</span>
        </div>
      </div>
    </div>
    <!-- 输入框 -->
    <div class="chat-input-area">
      <van-field
        v-model="inputMessage"
        placeholder="请输入你的问题"
        :disabled="isStreaming"
        @keyup.enter="sendMessage"
      >
        <template #button>
          <van-button
            @click="sendMessage"
            type="primary"
            size="small"
            :disabled="isStreaming"
          >
            发送
          </van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, computed, nextTick }  from 'vue'
import { fetchStream } from '@/utils/request.js'
import { showToast } from 'vant'
import ChatBubble from '@/components/ChatBubble.vue'
import { useChatStre } from '@/store/chat.js'
import { debounce } from '@/utils/common.js'

const router = useRouter()
const route = useRoute()
const inputMessage = ref('')
const conversationListShow = ref(false) // 对话列表弹出框
const chatStore = useChatStre()
// 对话数据
let messages = ref([])
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
    timestamp: new Date().toISOString(),
  })
}

const isStreaming = ref(false)

const handleClick = (tag) => {
  inputMessage.value = tag
}

// 获取响应
const fetchAiResponse = (userMsg) => {
  isStreaming.value = true
  messages.value.push({
    id: Date.now() + 1,
    role: 'ai',
    content: '',
    timestamp: new Date().toISOString(),
  })
  let fullResponse = ''

  fetchStream('chat', {message: userMsg}, (chunk) => {
    fullResponse += chunk
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'ai') {
      lastMsg.content = fullResponse
    }
  }, () => {
    // chatStore.addMessage({
    //   id: Date.now(),
    //   role: 'ai',
    //   content: fullResponse,
    //   timestamp: new Date().toISOString(),
    // })
    isStreaming.value = false
  }, (errMsg) => {
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'ai') {
      lastMsg.content = `抱歉，AI发生了错误${errMsg}`
    }
    isStreaming.value = false
    showToast('AI回复失败！')
  })
}

// 发送
const sendMessage = () => {
  const msg = inputMessage.value.trim()
  if (!msg || isStreaming.value) {
    return
  }
  // chatStore.addMessage({
  //   id: Date.now(),
  //   role: 'user',
  //   content: msg,
  //   timestamp: new Date().toISOString(),
  // })
  addUserMessage(msg)
  inputMessage.value = ''
  // 进行流式请求
  fetchAiResponse(msg)
}

const conversations = chatStore.conversations
console.log(conversations.value)

// 打开对话列表弹框
const openConversationList = () => {
  conversationListShow.value = true
}
// 新增一个对话
const addNewConversation = () => {
  chatStore.creatConversation()
  conversationListShow.value = false
}
const debounceAddNewConversation = debounce(addNewConversation, 1000, true)
// 删除对话
const deleteConversations = async (id) => {
  try {
    chatStore.deleteConversation(id)
  } catch (error) {
    console.log("删除对话失败");
  }
}
// 切换对话
const switchConversation = (id) => {
  try {
    chatStore.switchConversation(id)
    messages.value = chatStore.currentConversation.messages
    conversationListShow.value = false
  } catch (error) {
    console.log('对话切换失败：', error);
  }
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

// 历史对话
.conversation {
  padding: 5px 10px;
  .addNewConversation {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
    background-color: #efefef;
    font-size: 20px;
    margin: 5px 0 10px 0;
    border-radius: 8px;
    .newIcon {
      width: 20px;
      height: 20px;
      line-height: 20px;
      padding-right: 5px;
    }
  }
  .historicalConversation {
    margin-top: 14px;
    font-size: 15px;
    color: #7c7c7c;
    font-family: "宋体", serif;
  }
  .conversationItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #bdb6b6;
    border-radius: 8px;
    margin-top: 8px;
    .msgTitle {
      font-size: 20px;
      line-height: 1;
    }
  }
  // .conversationItem:hover {
  //   background-color: #efefef;
  // }
}
</style>