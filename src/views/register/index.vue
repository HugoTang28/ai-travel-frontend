<template>
  <div class="register-page">
    <div class="register-header">
      <h2 class="title">注册账号</h2>
      <p class="subtitle">创建您的 AI 旅行助手账户</p>
    </div>
    <!-- 注册表单 -->
    <div class="register-form">
      <VanForm @submit="onRegister">
        <VanCellGroup inset>
          <VanField
            v-model="form.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请输入用户名' }]"
            left-icon="user-o"
          />
          <VanField
            v-model="form.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请输入密码' }]"
            left-icon="lock"
          />
          <VanField
            v-model="form.nickname"
            name="nickname"
            label="昵称"
            placeholder="请输入昵称"
            :rules="[{ required: true, message: '请输入昵称' }]"
            left-icon="smile-o"
          />
          <VanField
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
            ]"
            left-icon="phone-o"
          />
          <VanField
            v-model="form.email"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[
              { required: true, message: '请输入邮箱' },
              { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '邮箱格式不正确' }
            ]"
            left-icon="envelop-o"
          />
        </VanCellGroup>
        <div class="form-actions">
          <VanButton
            round
            block
            type="primary"
            native-type="submit"
            class="register-btn"
            :loading="loading"
          >
            注册
          </VanButton>
          <div class="login-link">
            <span @click="goLogin">已有账号？去登录</span>
          </div>
        </div>
      </VanForm>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { showToast, showFailToast } from 'vant'
import { useRouter } from 'vue-router'
import request from '@/utils/request'

const router = useRouter()
const loading = ref(false)

// 表单数据
const form = reactive({
  username: '',
  password: '',
  nickname: '',
  phone: '',
  email: ''
})
// 清空表单
const resetForm = () => {
  form.username = ''
  form.password = ''
  form.nickname = ''
  form.phone = ''
  form.email = ''
}

// 提交注册
const onRegister = async () => {
  loading.value = true
  try {
    const res = await request.post('/register', { ...form })
    console.log('注册返回：', res)
    if (res.code === 1) {
      showToast({ message: '注册成功', position: 'top' })
      resetForm()
    } else {
      showFailToast({ message: res.msg || '注册失败', position: 'top' })
    }
  } catch (error) {
    console.log(error)
    showFailToast({ message: `注册失败：${error}`, position: 'top' })
  } finally {
    loading.value = false
  }
}

// 跳转到登录页
const goLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1989fa 0%, #e8f3ff 100%);
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register-header {
  padding-top: 60px;
  text-align: center;
  margin-bottom: 30px;
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
.register-form {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 30px 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  .form-actions {
    margin-top: 24px;
    padding: 0 16px;
    .register-btn {
      height: 44px;
      font-size: 16px;
    }
    .login-link {
      margin-top: 16px;
      text-align: center;
      font-size: 14px;
      color: #1989fa;
      span {
        cursor: pointer;
      }
    }
  }
}
</style>
