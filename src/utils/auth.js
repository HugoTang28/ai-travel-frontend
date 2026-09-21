import { showToast } from 'vant'
import router from '@/router/index.js'
import { removeToken } from '@/utils/common.js'
import { useUserStore, useChatStore } from '@/store/index.js'

/**
 * @desc 清空本地登录态（token + 用户/会话 store）
 *       退出登录、401 登录过期都走这里，避免换账号后残留上一个用户的聊天数据
 */
export function clearAuthState() {
  removeToken()
  try {
    useUserStore().resetUser()
    useChatStore().resetChat()
  } catch {
    // store 尚未初始化等场景下忽略
  }
}

// 防止 401 风暴时重复跳转/提示
let handling = false

/**
 * @desc 登录态失效（401）统一处理：清登录态 + 跳登录页 + 提示
 * @param {string} message
 */
export function handleAuthExpired(message = '登录已过期，请重新登录') {
  if (handling) return
  handling = true
  clearAuthState()
  const current = router.currentRoute.value
  if (current.path !== '/login') {
    router.replace({ path: '/login', query: { redirect: current.fullPath } })
  }
  showToast({ message, position: 'top' })
  setTimeout(() => {
    handling = false
  }, 1000)
}
