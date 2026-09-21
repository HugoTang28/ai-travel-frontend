<template>
  <VanNavBar
    title="设置"
    left-arrow
    fixed
    left-text="返回"
    class="nav-placeholder"
    @click-left="router.back()"
  />
  <div class="nav-placeholder"></div>
  <div class="setting">
    <VanEmpty description="设置功能开发中" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped>
.nav-placeholder {
  height: 46px;
}
.setting {
  padding: 40px 10px;
}
</style>
