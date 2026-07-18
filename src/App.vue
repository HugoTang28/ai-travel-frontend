<template>
  <div id="app">
    <RouterView />
    <VanTabbar
      v-if="['home', 'chat', 'user', 'hotCity', 'contact'].includes(route.name)"
      v-model="active"
      route
    >
      <VanTabbarItem
        to="/home"
        name="home"
        icon="home-o"
        >首页</VanTabbarItem
      >
      <!-- <van-tabbar-item to="/hotCity" name="hotCity" icon="location-o">热门城市</van-tabbar-item>
      <van-tabbar-item to="/contact" name="contact" icon="friends-o">联系人</van-tabbar-item> -->
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
  () => route.path,
  (path) => {
    // 把 /home → home  /chat → chat
    active.value = path.slice(1)
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
