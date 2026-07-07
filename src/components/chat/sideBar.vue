<template>
  <VanPopup
    v-model:show="show"
    position="right"
    :style="{ width: '50%', height: '100%' }"
  >
    <div class="conversation">
      <div
        class="addNewConversation"
        @click="debounceAddNewConversation"
      >
        <img
          class="newIcon"
          src="@/assets/images/new.png"
          alt=""
        />
        <span>新建对话</span>
      </div>
      <div class="historicalConversation">历史对话</div>
      <div
        v-for="item in conversations"
        :key="item.id"
        class="conversationItem"
        @click="switchConversation(item.id)"
      >
        <div class="msgTitle">{{ item.title }}</div>
        <VanIcon
          name="delete-o"
          size="20"
          @click.stop="deleteConversations(item.id)"
        />
      </div>
    </div>
  </VanPopup>
</template>

<script setup>
import { useChatStore } from '@/store/index.js'
import { debounce } from '@/utils/common.js'

const show = defineModel('show', { default: false })

const emit = defineEmits(['update:show', 'messages'])

const chatStore = useChatStore()
const conversations = chatStore.conversations

// 删除对话
const deleteConversations = (id) => {
  chatStore.deleteConversation(id)
}

// 新建对话
const addNewConversation = () => {
  chatStore.creatConversation()
  emit('messages', [])
  emit('update:show', false)
}
const debounceAddNewConversation = debounce(addNewConversation, 1000, true)

// 切换对话
const switchConversation = (id) => {
  try {
    chatStore.switchConversation(id)
    const msgs = chatStore.currentConversation?.messages || []
    emit('messages', msgs)
    emit('update:show', false)
  } catch (error) {
    console.log('对话切换失败：', error)
  }
}
</script>

<style lang="scss" scoped>
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
    font-family: '宋体', serif;
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
