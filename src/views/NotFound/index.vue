<template>
  <div class="not-found">
    <div class="code">404</div>
    <div class="title">页面不存在</div>
    <div class="desc">您访问的页面不存在或已被移除</div>
    <VanButton
      type="primary"
      round
      class="home-btn"
      @click="goHome"
    >
      返回首页
    </VanButton>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Button as VanButton } from 'vant'

const router = useRouter()

const goHome = () => {
  router.replace('/home')
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background: #f7f8fa;
}

.code {
  font-size: 80px;
  font-weight: 700;
  color: #1989fa;
  line-height: 1.1;
}

.title {
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #323233;
}

.desc {
  margin-top: 8px;
  font-size: 14px;
  color: #969799;
}

.home-btn {
  margin-top: 28px;
  width: 160px;
}
</style>
