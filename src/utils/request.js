import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:3300/api/travel',
  timeout: 1000000,
  headers: {'Content-Type': 'application/json;charset=UTF-8'},
});

// 请求拦截器
request.interceptors.request.use(
  config => {
  // // 添加token
  // if (localStorage.getItem('token')) {
  //   config.headers.Authorization = localStorage.getItem('token')
  // }
    return config
  }, error => {
    return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data
  }, error => {
    return Promise.reject(error)
})

export function post(url, data) {
  return request.post(url, data)
}
export function get(url, params) {
  return request.get(url, { params })
}

// 处理流式接口
export async function fetchStream(url, data, onChunk, onComplete, onError) {
  // 创建一个请求控制器
  const controller = new AbortController()
  try {
    const response = await fetch(`http://localhost:3300/api/travel/${url}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    signal: controller.signal
  })

  // 先获取响应体的可读取流程
  const reader = response.body.getReader()
  // 将二进制数据解码为字符串
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(line => line.trim())
    for (const line of lines) {
      // console.log(line);
      try {
        if (line.startsWith('data:')) {
        const jsonStr = line.substring(6)
        const jsonData = JSON.parse(jsonStr)
        if (jsonData.type === 'chunk') {
          onChunk(jsonData.content)
        } else if (jsonData.type === 'complete') {
          onComplete(jsonData.data)
        } else if (jsonData.error) {
          onError(jsonData.error)
        }
      }
      } catch (error) {
        onError('流式数据解析异常')
      }
      
    }
  }
  return controller.abort()
  } catch (error) {
    onError(error?.message)
  }
}