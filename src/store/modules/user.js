import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const userInfo = ref({})

    // 上传用户信息
    const postUserInfo = (user) => {
      userInfo.value = user
    }

    // 清空用户信息（退出登录 / 401 时调用）
    const resetUser = () => {
      userInfo.value = {}
    }

    return {
      userInfo,
      postUserInfo,
      resetUser
    }
  },
  { persist: true }
)
