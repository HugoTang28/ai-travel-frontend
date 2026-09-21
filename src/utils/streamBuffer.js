/**
 * 流式 Markdown 缓冲区
 *
 * SSE / fetch stream 是按字节分片的，一个 chunk 很可能把 ```代码块``` 从中间劈开，
 * 若每个 chunk 都直接丢给 marked.parse，未闭合的围栏会让后续所有内容被吞进代码块里，
 * 表现为「渲染错乱 + 中途闪烁」。
 *
 * 策略：
 * 1. 所有 chunk 先追加进 buffer（原文永远完整保存，用于持久化与最终渲染）
 * 2. 渲染时只解析「已闭合部分」，未闭合的围栏内容作为 pending 原样输出（不做高亮）
 * 3. 代码块闭合后再走 marked + highlight.js，避免每个 chunk 都高亮导致卡顿
 */

/**
 * @desc 统一换行符（Windows \r\n / 旧 Mac \r → \n）
 * @param {string} text
 * @returns {string}
 */
export const normalizeLineBreaks = (text) => String(text ?? '').replace(/\r\n?/g, '\n')

// 围栏起始行：最多 3 个前导空格 + 至少 3 个 ` 或 ~ + 可选语言标识
const FENCE_RE = /^ {0,3}(`{3,}|~{3,})(.*)$/

/**
 * @desc 切分「已闭合内容」与「未闭合的代码块尾部」
 * @param {string} text 累积到的完整原文
 * @returns {{complete: string, pending: string, lang: string, pendingIsCode: boolean}}
 *          complete 可安全交给 marked；pending 为围栏内尚未闭合的代码（不含 ``` 行）
 */
export function splitStreamMarkdown(text) {
  const src = normalizeLineBreaks(text)
  let offset = 0
  let fenceStart = -1
  let fenceChar = ''
  let fenceLen = 0
  let lang = ''
  let inFence = false

  for (const line of src.split('\n')) {
    const match = line.match(FENCE_RE)
    if (!inFence) {
      if (match) {
        inFence = true
        fenceStart = offset
        fenceChar = match[1][0]
        fenceLen = match[1].length
        lang = (match[2] || '').trim().split(/\s+/)[0] || ''
      }
    } else if (
      // 闭合围栏：同字符、长度不小于起始、且后面不能有语言标识
      match &&
      match[1][0] === fenceChar &&
      match[1].length >= fenceLen &&
      !(match[2] || '').trim()
    ) {
      inFence = false
      fenceStart = -1
      lang = ''
    }
    offset += line.length + 1
  }

  if (!inFence || fenceStart < 0) {
    return { complete: src, pending: '', lang: '', pendingIsCode: false }
  }

  // 围栏未闭合：围栏行之后的内容就是待定代码
  const pendingRaw = src.slice(fenceStart)
  const firstBreak = pendingRaw.indexOf('\n')
  return {
    complete: src.slice(0, fenceStart),
    pending: firstBreak === -1 ? '' : pendingRaw.slice(firstBreak + 1),
    lang,
    pendingIsCode: true
  }
}

/**
 * @desc 创建流式缓冲区（可直接套进 SSE onmessage / fetchStream onChunk）
 * @returns {{push: Function, split: Function, finish: Function, reset: Function, raw: string}}
 */
export function createMarkdownStreamBuffer() {
  let raw = ''

  return {
    /** 当前累积的完整原文 */
    get raw() {
      return raw
    },
    /**
     * @desc 追加一个分片
     * @param {string} chunk
     * @returns 与 split() 相同的切分结果
     */
    push(chunk) {
      raw += normalizeLineBreaks(chunk ?? '')
      return this.split()
    },
    /** @desc 按当前缓冲区内容切分（不追加数据） */
    split() {
      return splitStreamMarkdown(raw)
    },
    /** @desc 流结束：即使围栏未闭合也整体返回，交给 marked 兜底渲染 */
    finish() {
      const text = normalizeLineBreaks(raw)
      return { complete: text, pending: '', lang: '', pendingIsCode: false }
    },
    reset() {
      raw = ''
    }
  }
}

export default createMarkdownStreamBuffer
