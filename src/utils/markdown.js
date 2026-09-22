import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/common'
import DOMPurifyModule from 'dompurify'
import 'highlight.js/styles/atom-one-dark.css'
import { h } from 'vue'

// 兼容不同构建下 dompurify 的导出形态：实例对象 / 工厂函数
const resolvePurify = () => {
  const mod = DOMPurifyModule
  if (mod && typeof mod.sanitize === 'function') return mod
  if (typeof mod === 'function') return mod()
  return mod?.default ?? mod
}

const purify = resolvePurify()

/**
 * @desc 纯文本 HTML 转义（Markdown 解析/过滤失败时的兜底渲染）
 * @param {string} text
 * @returns {string}
 */
export const escapeHtml = (text) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// 危险的伪协议 / 非图片型 data URI（AI 返回内容不可信，必须拦截）
const UNSAFE_URL_RE = /^\s*(javascript|vbscript|file):|^\s*data:(?!image\/)/i

// DOMPurify 钩子只需注册一次
let hooksReady = false
const ensureHooks = () => {
  if (hooksReady || typeof purify?.addHook !== 'function') return
  hooksReady = true
  purify.addHook('afterSanitizeAttributes', (node) => {
    // 外链新窗口打开，并阻断反向引用（window.opener 钓鱼）
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      const href = node.getAttribute('href') || ''
      if (!UNSAFE_URL_RE.test(href)) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }
    }
    // 图片：拦截危险 src，只允许 http(s) / 站内相对路径 / 图片型 data URI
    if (node.tagName === 'IMG') {
      const src = node.getAttribute('src') || ''
      if (!src || UNSAFE_URL_RE.test(src)) {
        node.remove()
        return
      }
      node.setAttribute('loading', 'lazy')
      node.setAttribute('referrerpolicy', 'no-referrer')
    }
  })
}
ensureHooks()

// marked 实例：GFM（表格/删除线）+ 单换行转 <br>（AI 输出常见）+ 代码高亮
const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    emptyLangClass: 'hljs',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    }
  })
)

marked.use({
  gfm: true, // 表格、删除线、自动链接
  breaks: true, // AI 常返回单个 \n，需要转成换行
  pedantic: false
})

// 渲染结果缓存：切换会话 / 无关状态更新时避免重复解析
const CACHE_LIMIT = 30
const htmlCache = new Map()

/**
 * @desc 将 Markdown 解析为安全的 HTML（marked + DOMPurify，缺一不可）
 * @param {string} text Markdown 原文
 * @returns {string} 已过滤 XSS 的 HTML 字符串
 */
export function renderMarkdown(text) {
  const source = typeof text === 'string' ? text : String(text ?? '')
  if (!source) return ''

  const cached = htmlCache.get(source)
  if (cached !== undefined) return cached

  let html
  try {
    const parsed = marked.parse(source)
    html = typeof purify?.sanitize === 'function' ? purify.sanitize(parsed) : parsed
  } catch (err) {
    // 解析或清洗任一步失败都回退为转义纯文本，保证气泡不空白
    console.error('[markdown] 渲染失败，已回退为纯文本', err)
    html = escapeHtml(source).replace(/\n/g, '<br>')
  }

  if (htmlCache.size >= CACHE_LIMIT) {
    htmlCache.delete(htmlCache.keys().next().value)
  }
  htmlCache.set(source, html)
  return html
}

export default renderMarkdown

// 仅放行安全的 HTML 属性（DOM 已被 DOMPurify 清洗过，这里再做一次白名单收窄）
const ALLOWED_ATTRS = new Set([
  'class',
  'href',
  'src',
  'alt',
  'title',
  'target',
  'rel',
  'loading',
  'referrerpolicy',
  'type',
  'colspan',
  'rowspan',
  'align',
  'width',
  'height'
])

/**
 * @desc 把「已 DOMPurify 清洗」的 HTML 字符串转成 Vue VNode 数组，
 *       用于替代 v-html：全程只创建已知标签 + 文本节点，不碰 innerHTML，从根上杜绝 XSS。
 * @param {string} html 清洗后的安全 HTML
 * @returns {Array} VNode 数组
 */
export function htmlToVNodes(html) {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return []
  const doc = new DOMParser().parseFromString(html || '', 'text/html')

  const build = (node) => {
    if (node.nodeType === 3) return node.nodeValue // 文本节点
    if (node.nodeType !== 1) return null // 跳过注释等
    const tag = node.tagName.toLowerCase()
    const props = {}
    for (const attr of node.attributes) {
      if (ALLOWED_ATTRS.has(attr.name)) props[attr.name] = attr.value
    }
    const children = []
    node.childNodes.forEach((child) => {
      const v = build(child)
      if (v !== null && v !== '') children.push(v)
    })
    return h(tag, props, children.length ? children : undefined)
  }

  const result = []
  doc.body.childNodes.forEach((child) => {
    const v = build(child)
    if (v !== null) result.push(v)
  })
  return result
}
