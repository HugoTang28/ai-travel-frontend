import dayjs from 'dayjs'

// ============ Token Cookie 工具 ============
const TOKEN_KEY = 'AITRAVEL_TOKEN'
/**
 * @desc  设置 token 到 Cookie
 * @param {string} token
 * @param {number} days 过期天数，默认 1 天
 */
export function setToken(token, days = 1) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString()
  // Secure 仅在 HTTPS 下发送；SameSite=Strict 防止 CSRF
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

// ============ 原有工具函数 ============

/**
 * @desc  格式化时间
 * @param {(Object|string|number)} time
 * @param {string} format
 * @returns {string | null}
 */
export function formatDateTime(time = undefined, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(time).format(format)
}

export function formatDate(date = undefined, format = 'YYYY-MM-DD') {
  return formatDateTime(date, format)
}

/**
 * @desc  格式化时间差
 * @param {Number} distance 时间戳间距
 * @returns {Object} 倒计时对象，包含天、小时、分钟、秒
 */
export function formatTimeDiff(distance) {
  if (distance <= 0) {
    return false
  }

  // 时间单位转换
  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  // 返回倒计时字符串
  return {
    days,
    hours: hours < 10 ? `0${hours}` : hours,
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds
  }
}

/**
 * @desc  函数节流
 * @param {Function} fn
 * @param {Number} wait
 * @returns {Function}
 */
export function throttle(fn, wait) {
  let context, args
  let previous = 0

  return function () {
    const now = +new Date()
    context = this
    args = arguments
    if (now - previous > wait) {
      fn.apply(context, args)
      previous = now
    }
  }
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
        /**
         * args是一个类数组对象，所以使用fn.apply
         * 也可写作method.call(context, ...args)
         */
        method.apply(context, args)
      }, wait)
    }
  }
}

/**
 *
 * @param {HTMLElement} el
 * @param {Function} cb
 * @return {ResizeObserver}
 */
export function useResize(el, cb) {
  const observer = new ResizeObserver((entries) => {
    cb(entries[0].contentRect)
  })
  observer.observe(el)
  return observer
}

export function showMsg(masg) {
  window.$dialog.error({
    title: '提示',
    content: masg,
    positiveText: '关闭',
    onPositiveClick: () => {
      // message.success('确定')
    }
  })
}

/**
 * @desc  去除对象中值为null、undefined、空字符串、空对象、空数组的属性
 * @param {Object} obj
 * @returns {Object}
 */
export function removeEmptyValues(obj) {
  const newObj = JSON.parse(JSON.stringify(obj))
  return Object.keys(newObj).reduce((acc, key) => {
    if (
      newObj[key] !== null &&
      newObj[key] !== '' &&
      newObj[key] !== undefined &&
      !(typeof newObj[key] === 'object' && Object.keys(newObj[key]).length === 0)
    ) {
      acc[key] = newObj[key]
    }
    return acc
  }, {})
}

// 数字四舍五入
export function parseFloatFn(num, pos = 2) {
  let f = parseFloat(num)
  if (isNaN(f)) {
    f = 0
  } else {
    f = Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos)
  }
  let s = f.toString()
  let rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + pos) {
    s += '0'
  }
  return s
}

// JS_对象转url参数
export function objectToQueryString(obj) {
  return Object.keys(obj)
    .map((key) => {
      const value = obj[key]
      if (Array.isArray(value)) {
        return value
          .map((arrayValue) => encodeURIComponent(key) + '=' + encodeURIComponent(arrayValue))
          .join('&')
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(value)
    })
    .join('&')
}

// 从文件 URL 中提取文件类型（扩展名）
export function getFileExtension(url) {
  try {
    const parsedUrl = new URL(url)
    const pathname = parsedUrl.pathname
    const filename = pathname.split('/').pop() // 提取文件名
    if (!filename) return ''

    // 处理隐藏文件(以`.`开头)和多个`.`的情况
    const lastDotIndex = filename.lastIndexOf('.')
    if (lastDotIndex <= 0) return '' // 无扩展名或隐藏文件

    const ext = filename.slice(lastDotIndex + 1)
    return ext.toLowerCase()
  } catch (e) {
    return '' // 处理无效 URL
  }
}

// postMessage 发送消息
export function postMessageToParent(data) {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(data, '*')
  }
}

// 图片链接修改大小的参数
export function setImgSize(url, size = 50) {
  if (!url) return ''
  if (url.includes('dsdcp.smartmidea.net') && !url.includes('?')) {
    url = url + `?x-oss-process=image/format,webp/resize,s_${size}`
    return url
  }
  return url
}
