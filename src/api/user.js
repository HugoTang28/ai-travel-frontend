import request from '@/utils/request'

// 登录
export function login(data) {
  return request.post('/login', data)
}

// 注册
export function register(data) {
  return request.post('/register', data)
}

// 查询用户信息
export function getUserInfo(id) {
  return request.post(`/userInfo/${id}`)
}
