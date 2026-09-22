<script>
import { h } from 'vue'
import { renderMarkdown, htmlToVNodes } from '@/utils/markdown.js'

// 用渲染函数把「已 DOMPurify 清洗的 HTML」转成 VNode，彻底避免 v-html / innerHTML
export default {
  name: 'MarkdownContent',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  render() {
    const html = renderMarkdown(this.content)
    return h('div', { class: 'markdown-body' }, html ? htmlToVNodes(html) : undefined)
  }
}
</script>
