import axios from 'axios'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:3300/api/travel',
  timeout: 50000,
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
    return response
  }, error => {
    return Promise.reject(error)
})

export function post(url, data) {
  return request.post(url, data)
}
export function get(url, params) {
  return request.get(url, { params })
}