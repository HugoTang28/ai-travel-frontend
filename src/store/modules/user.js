import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref({})

  // 上传用户信息
  const postUserInfo = (user) => {
    userInfo.value = user
  }
  return {
    userInfo,
    postUserInfo
  }
})
