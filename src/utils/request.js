import axios from 'axios'
import { getToken } from '@/utils/common.js'
import { handleAuthExpired } from '@/utils/auth.js'

// 创建axios实例
const request = axios.create({
  baseURL: '/api/travel',
  timeout: 120000, // 大模型生成类接口较慢，给 2 分钟
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 401：登录态失效，统一清理并跳登录页
    if (error?.response?.status === 401) {
      handleAuthExpired()
    }
    return Promise.reject(error)
  }
)

export default request

/**
 * @desc 发起流式请求（fetch + ReadableStream 解析 SSE 帧）
 * @returns {AbortController} 调用方持有 controller，abort() 即可中断生成
 */
export function fetchStream(url, data, onChunk, onComplete, onError) {
  const controller = new AbortController()

  const run = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const token = getToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const response = await fetch(`${request.defaults.baseURL}/${url}`, {
        method: 'post',
        headers,
        body: JSON.stringify(data),
        signal: controller.signal
      })

      if (response.status === 401) {
        handleAuthExpired()
        onError?.('登录已过期')
        return
      }
      if (!response.ok || !response.body) {
        onError?.(`请求失败(${response.status})`)
        return
      }

      // 先获取响应体的可读取流程
      const reader = response.body.getReader()
      // 将二进制数据解码为字符串
      const decoder = new TextDecoder()
      let completed = false

      // 单个 SSE 帧可能被拆到两次 read 中，必须跨 chunk 缓存半行，否则会丢字
      const handleLine = (line) => {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) return
        const jsonStr = trimmed.slice(5).trim()
        if (!jsonStr || jsonStr === '[DONE]') return
        try {
          const jsonData = JSON.parse(jsonStr)
          if (jsonData.type === 'chunk') {
            onChunk?.(jsonData.content ?? '')
          } else if (jsonData.type === 'complete') {
            completed = true
            onComplete?.(jsonData.data)
          } else if (jsonData.error) {
            completed = true
            onError?.(jsonData.error)
          }
        } catch (error) {
          console.error('流式数据解析异常', error)
        }
      }

      let pendingLine = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        pendingLine += decoder.decode(value, { stream: true })
        const lines = pendingLine.split('\n')
        // 最后一段可能是不完整的半行，留给下一个 chunk 拼接
        pendingLine = lines.pop() ?? ''
        for (const line of lines) {
          handleLine(line)
        }
      }
      // 冲刷解码器残留 + 最后一行（服务端未以 \n 结尾时）
      pendingLine += decoder.decode()
      if (pendingLine.trim()) {
        handleLine(pendingLine)
      }
      // 服务端未下发 complete 事件时兜底收尾，避免界面一直处于流式态
      if (!completed) {
        onComplete?.()
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        // 用户主动停止：按正常完成处理，保留已输出内容
        onComplete?.()
        return
      }
      onError?.(error?.message)
    }
  }

  run()
  return controller
}
