<template>
  <div id="app">
    <RouterView />
    <VanTabbar
      v-if="['home', 'chat', 'user'].includes(route.name)"
      v-model="active"
      route
    >
      <VanTabbarItem
        to="/home"
        name="home"
        icon="home-o"
        >首页</VanTabbarItem
      >
      <VanTabbarItem
        to="/chat"
        name="chat"
        icon="chat-o"
        >对话</VanTabbarItem
      >
      <VanTabbarItem
        to="/user"
        name="user"
        icon="user-o"
        >我的</VanTabbarItem
      >
    </VanTabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref('home')

watch(
  () => route.name,
  (name) => {
    // 直接用路由 name，避免依赖路径拼写
    if (name) active.value = name
  },
  { immediate: true }
)
</script>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
