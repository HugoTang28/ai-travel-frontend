<template>
  <div
    class="chat-bubble"
    :class="messageClass"
  >
    <div class="bubble-content">
      <div
        v-if="message.role === 'user'"
        class="message-text"
      >
        {{ message.content }}
      </div>
      <div
        v-else
        class="message-text ai-message"
      >
        <!-- 已闭合部分：用渲染函数把清洗后的 HTML 转成 VNode，不使用 v-html -->
        <MarkdownContent
          v-if="completeMarkdown"
          :content="completeMarkdown"
        />
        <!-- 流式未闭合的代码块：原样输出，等 ``` 闭合后再走 marked + 高亮 -->
        <pre
          v-if="pendingCode"
          class="md-pending-code"
        ><code :class="pendingLangClass">{{ pendingCode }}</code></pre>
        <span
          v-if="streaming"
          class="md-cursor"
        ></span>
      </div>
    </div>
    <VanButton
      v-if="message.content && !streaming"
      class="copy-btn"
      size="mini"
      plain
      :icon="copied ? 'success' : 'notes-o'"
      :title="copied ? '已复制' : '复制'"
      @click="copyContent"
    ></VanButton>
    <div
      v-if="showTime"
      class="message-time"
    >
      {{ formatTime }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { splitStreamMarkdown } from '@/utils/streamBuffer.js'
import { showToast } from 'vant'
import MarkdownContent from '@/components/chat/MarkdownContent.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  // 是否正在流式输出（用于显示打字光标）
  streaming: {
    type: Boolean,
    default: false
  }
})

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'user-message' : 'ai-message'
})

// 流式场景下把「已闭合内容」和「未闭合的代码块」切开，避免半个 ``` 导致渲染错乱
const streamParts = computed(() => splitStreamMarkdown(props.message.content || ''))

// 已闭合部分（user 消息不解析），交给 MarkdownContent 渲染
const completeMarkdown = computed(() => {
  if (props.message.role !== 'ai') return ''
  return streamParts.value.complete || ''
})

// 未闭合代码块内的代码（不含 ``` 行），流式结束前不高亮
const pendingCode = computed(() => (props.message.role === 'ai' ? streamParts.value.pending : ''))

const pendingLangClass = computed(() => {
  const lang = streamParts.value.lang
  return lang ? `language-${lang}` : ''
})

// 复制消息原文（AI 为 markdown 源码，用户为纯文本），便于二次粘贴
const copied = ref(false)
let copyTimer = null
const copyContent = async () => {
  const text = props.message.content || ''
  if (!text) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    showToast('已复制')
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    showToast('复制失败')
  }
}

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
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  align-items: flex-end;
}

.ai-message {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble-content {
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.user-message .bubble-content {
  background: #1989fa;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.ai-message .bubble-content {
  background: #f5f5f5;
  color: #323233;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  padding: 0 4px;
}

/* 复制按钮：跟随气泡对齐方向（ai 居左 / user 居右） */
.copy-btn {
  margin-top: 4px;
  align-self: flex-start;
}

.user-message .copy-btn {
  align-self: flex-end;
}

/* AI 回复的 Markdown 排版 */
.markdown-body {
  word-break: break-word;

  :deep(p) {
    margin: 0 0 8px;
  }
  :deep(p:last-child) {
    margin-bottom: 0;
  }
  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin: 12px 0 8px;
    font-weight: 600;
    line-height: 1.3;
  }
  :deep(h1) {
    font-size: 19px;
  }
  :deep(h2) {
    font-size: 17px;
  }
  :deep(h3) {
    font-size: 16px;
  }
  :deep(ul),
  :deep(ol) {
    padding-left: 20px;
    margin: 0 0 8px;
  }
  :deep(li) {
    margin: 4px 0;
  }
  :deep(code) {
    background: #e9e9e9;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 13px;
    font-family: monospace;
  }
  :deep(pre) {
    background: #2d2d2d;
    color: #f8f8f2;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 0 0 8px;
  }
  :deep(pre code) {
    background: none;
    padding: 0;
    color: inherit;
    font-size: 13px;
  }
  :deep(a) {
    color: #1989fa;
    word-break: break-all;
  }
  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 0 0 8px;
    font-size: 14px;
  }
  :deep(th),
  :deep(td) {
    border: 1px solid #ddd;
    padding: 6px 8px;
    text-align: left;
  }
  :deep(blockquote) {
    border-left: 3px solid #ccc;
    margin: 0 0 8px;
    padding-left: 12px;
    color: #666;
  }
  :deep(strong) {
    font-weight: 600;
  }
}

/* 流式过程中未闭合的代码块（先不上高亮，避免每个 chunk 都重算） */
.md-pending-code {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0;
  font-size: 13px;
  font-family: monospace;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 打字光标 */
.md-cursor {
  display: inline-block;
  width: 2px;
  height: 15px;
  margin-left: 2px;
  vertical-align: text-bottom;
  background: #323233;
  animation: md-cursor-blink 1s step-end infinite;
}

@keyframes md-cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.typing {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
