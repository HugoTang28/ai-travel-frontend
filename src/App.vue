<template>
  <div id="app"> 
    <router-view />
    <van-tabbar v-if="['home','chat','user', 'hotCity', 'contact'].includes(route.name)" route v-model="active">
      <van-tabbar-item to="/home" name="home" icon="home-o">首页</van-tabbar-item>
      <!-- <van-tabbar-item to="/hotCity" name="hotCity" icon="location-o">热门城市</van-tabbar-item>
      <van-tabbar-item to="/contact" name="contact" icon="friends-o">联系人</van-tabbar-item> -->
      <van-tabbar-item to="/chat" name="chat" icon="chat-o">对话</van-tabbar-item>
      <van-tabbar-item to="/user" name="user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref('home')

// const showTabbar = computed(() => route.name === 'home' || route.path === 'chat' || route.path === 'user')

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
