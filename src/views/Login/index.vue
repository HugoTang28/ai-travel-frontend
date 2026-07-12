<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">
        <VanIcon
          name="travel"
          size="60"
          color="#1989fa"
        />
      </div>
      <h2 class="title">AI 旅行助手</h2>
      <p class="subtitle">登录开启您的智能旅行</p>
    </div>
    <!-- 登录表单 -->
    <div class="login-form">
      <VanForm>
        <VanCellGroup inset>
          <VanField
            v-model="form.username"
            name="username"
            placeholder="请输入用户名/手机号"
            :rules="[{ required: true, message: '请输入用户名' }]"
            left-icon="user-o"
            autocomplete="off"
          />
          <VanField
            v-model="form.password"
            type="password"
            name="password"
            placeholder="请输入密码"
            autocomplete="off"
            :rules="[{ required: true, message: '请输入密码' }]"
            left-icon="lock"
          />
        </VanCellGroup>
        <div class="form-actions">
          <VanButton
            round
            block
            type="primary"
            native-type="submit"
            class="login-btn"
            @click="goHome"
          >
            登录
          </VanButton>
        </div>
      </VanForm>
      <!-- <div class="login-links">
        <span class="link" @click="onRegister">注册账号</span>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { showToast, showFailToast } from 'vant'
import { useRoute, useRouter } from 'vue-router'
import request from '@/utils/request'
import { useUserStore } from '@/store/index.js'
import { setToken } from '@/utils/common.js'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
// 表单数据
const form = reactive({
  username: '',
  password: ''
})

// 提交登录
const goHome = async () => {
  try {
    const res = await request.post('/login', {
      username: form.username,
      password: form.password
    })
    if (res.success) {
      userStore.postUserInfo(res.user) // 上传用户信息到store
      setToken(res.token) // 存入Cookie，默认1天过期
      const redirectPath = route.query.redirect || '/home'
      showToast({
        message: res.message,
        position: 'top'
      })
      router.push(redirectPath)
    }
  } catch (error) {
    showFailToast({
      message: `登录失败!`,
      position: 'top'
    })
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1989fa 0%, #e8f3ff 100%);
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-header {
  padding-top: 60px;
  text-align: center;
  margin-bottom: 40px;
  .logo {
    margin-bottom: 16px;
  }
  .title {
    font-size: 28px;
    color: #fff;
    margin: 0 0 8px 0;
    font-weight: 600;
  }
  .subtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }
}

.login-form {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 50px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  .form-actions {
    margin-top: 24px;
    padding: 0 16px;
    .login-btn {
      height: 44px;
      font-size: 16px;
    }
  }
}
</style>
