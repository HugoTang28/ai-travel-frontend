<template>
  <div class="profile-container">
    <VanNavBar
      title="我的"
      left-text=""
      :left-arrow="false"
    />

    <!-- 用户信息区域 -->
    <div class="user-info">
      <VanImage
        :src="avatar"
        round
        class="avatar"
      />
      <div class="user-details">
        <h2 class="user-name">{{ userName }}</h2>
        <p class="user-desc">{{ userInfo.phone }}</p>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <h3 class="menu-title">我的服务</h3>
      <VanCellGroup>
        <VanCell
          title="我的收藏"
          is-link
          :icon="'star-o'"
          @click="showToast('功能开发中')"
        />
        <VanCell
          title="历史记录"
          is-link
          :icon="'history'"
          @click="showToast('功能开发中')"
        />
        <VanCell
          title="设置"
          is-link
          :icon="'settings'"
          @click="goSetting"
        />
      </VanCellGroup>
    </div>

    <!-- 关于我们 -->
    <div class="menu-section">
      <h3 class="menu-title">关于</h3>
      <VanCellGroup>
        <VanCell
          title="关于我们"
          is-link
          @click="showAboutDialog"
        />
        <VanCell
          title="版本信息"
          value="v1.0.0"
        />
        <VanCell
          title="退出登录"
          @click="layout"
        />
      </VanCellGroup>
    </div>

    <!-- 关于我们对话框 -->
    <VanDialog
      v-model:show="aboutDialogVisible"
      title="关于我们"
      show-cancel-button
    >
      <div class="about-content">
        <p>智能旅游助手 v1.0.0</p>
        <p class="mt-2">基于 AI 技术的智能旅游规划平台</p>
        <p class="mt-2">为您提供个性化的旅游行程推荐和实时旅游咨询服务</p>
        <p class="mt-4 text-center">© 2026 智能旅游助手</p>
      </div>
    </VanDialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/index.js'
import { removeToken } from '@/utils/common.js'
import { getUserInfo } from '@/api/user'

const userInfo = ref({})

const userStore = useUserStore()
const userName = userStore.userInfo.nickname
const avatar = userStore.userInfo.avatar
const id = userStore.userInfo.id
const router = useRouter()
// 对话框状态
const aboutDialogVisible = ref(false)

// 显示关于我们对话框
const showAboutDialog = () => {
  aboutDialogVisible.value = true
}

const goSetting = () => {
  router.push('/setting')
}

const layout = () => {
  removeToken()
  router.push('/login')
  showToast('退出成功')
}

onMounted(async () => {
  const res = await getUserInfo(id)
  if (res.code === 1) {
    userInfo.value = res.data
  } else {
    console.log(res.msg)
  }
})
</script>

<style scoped>
.profile-container {
  padding-bottom: 50px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #1989fa 0%, #36cbcb 100%);
  color: white;
}

.avatar {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  margin-left: 20px;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.user-desc {
  font-size: 14px;
  opacity: 0.9;
}

.menu-section {
  margin-top: 15px;
  background-color: white;
  border-radius: 12px;
  margin: 15px 10px 0;
  overflow: hidden;
}

.menu-title {
  font-size: 14px;
  color: #646566;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.about-content {
  text-align: center;
  line-height: 1.6;
}

.mt-2 {
  margin-top: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.text-center {
  text-align: center;
}
</style>
