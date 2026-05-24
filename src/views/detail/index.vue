<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar fixed left-text="返回" left-arrow @click-left="goBack" :title="formData.city + '行程规划'">
      </van-nav-bar>
    </div>
    <div class="page-content">
      <div v-if="isLoading" class="loading-container">
        <van-loading type="spinner" size="30px">
          正在生成旅游规划...
        </van-loading>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { post } from '../../utils/request.js'

const isLoading = ref(false)
const formData = reactive({
  city: '',
  budget: '',
  days: ''
})
const route = useRoute()
const router = useRouter()
const goBack = () => {
  router.back()
}

const fetchData = async () => { 
  const res = post('/recommend', {
    city: formData.city,
    budget: formData.budget,
    days: formData.days
  })
  console.log(res)
}
onMounted(() => { 
  formData.city = route.query.city
  formData.budget = route.query.budget
  formData.days = route.query.days
  if (formData.city && formData.budget && formData.days) {
    isLoading.value = true
    fetchData()
  }
})
</script>

<style lang="scss" scoped>
.overview-card {
  margin-bottom: 16px;
}
</style>