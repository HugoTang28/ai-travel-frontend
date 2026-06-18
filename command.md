### 一期AI聊天会话管理 —— feature-20260616
- 26618上线
- AI聊天对话永久存储到pinia 
- ai聊天输出内容解析为html markdown

用户发消息
    ↓
chatStore.addMessage(msg)     ← 存入 store 的当前对话 messages
    ↓
saveToStorage()               ← 写入 localStorage
    ↓
addUserMessage(msg)            ← 显示在页面聊天区域

AI 回复完成
    ↓
chatStore.addMessage(aiMsg)   ← 存入 store
    ↓
saveToStorage()               ← 写入 localStorage

刷新页面
    ↓
onMounted()                   ← 从 localStorage 读取
    ↓
恢复 conversations + currentId + messages
