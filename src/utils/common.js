// ============ Token Cookie 工具 ============
const TOKEN_KEY = 'AITRAVEL_TOKEN'
/**
 * @desc  设置 token 到 Cookie
 * @param {string} token
 * @param {number} days 过期天数，默认 1 天
 */
export function setToken(token, days = 1) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  // SameSite=Strict 防止 CSRF；HTTPS 环境下可再追加 Secure
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)};expires=${expires};path=/;SameSite=Strict`
}
/**
 * @desc  从 Cookie 读取 token
 * @returns {string|null}
 */
export function getToken() {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${TOKEN_KEY}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * @desc  删除 token Cookie（退出登录时用）
 */
export function removeToken() {
  document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

/**
 * @desc  函数防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(method, wait, immediate) {
  let timeout
  return function (...args) {
    const context = this
    if (timeout) {
      clearTimeout(timeout)
    }
    // 立即执行需要两个条件，一是immediate为true，二是timeout未被赋值或被置为null
    if (immediate) {
      /**
       * 如果定时器不存在，则立即执行，并设置一个定时器，wait毫秒后将定时器置为null
       * 这样确保立即执行后wait毫秒内不会被再次触发
       */
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) {
        method.apply(context, args)
      }
    } else {
      // 如果immediate为false，则函数wait毫秒后执行
      timeout = setTimeout(() => {
        method.apply(context, args)
      }, wait)
    }
  }
}
