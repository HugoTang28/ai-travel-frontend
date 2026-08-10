<template>
  <div class="page-container">
    <div class="page-header">
      <VanNavBar title="智能旅行" />
    </div>
    <div class="page-content">
      <VanNoticeBar
        left-icon="info-o"
        text="基于AI的智能景点介绍与行程规划"
      />
      <!-- 搜索卡片 -->
      <div class="card search-card">
        <div class="section-title">规划你的旅程</div>
        <VanField
          v-model="formData.city"
          label="城市"
          placeholder="输入城市名"
          class="city-field"
          autocomplete="off"
          clearable
          @input="debkeywordChange"
        >
        </VanField>
        <!-- 城市搜索建议下拉 -->
        <div
          v-if="isMenu && searchCityList.length > 0"
          ref="suggestRef"
          class="suggest-list"
        >
          <div
            v-for="item in searchCityList"
            :key="item.value"
            class="suggest-item"
            @click.stop="onSuggestClick(item)"
          >
            {{ item.text }}
          </div>
        </div>
        <!-- 预算 -->
        <VanField
          v-model="formData.budget"
          label="预算"
          type="number"
          autocomplete="off"
          :border="false"
          class="city-field"
          placeholder="请输入预算"
        >
        </VanField>
        <!-- 天数 -->
        <VanField
          v-model="formData.days"
          label="天数"
          type="digit"
          placeholder="请输天数"
          autocomplete="off"
          class="city-field"
        >
          天数
        </VanField>
        <VanButton
          type="primary"
          size="large"
          round
          block
          :loading="loading"
          @click="handleSubmit"
        >
          开始规划
        </VanButton>
      </div>
      <!-- 快捷入口 -->
      <div class="card quick-actions">
        <div class="section-title">快捷入口</div>
        <VanGrid
          :column-num="2"
          :gutter="12"
        >
          <VanGridItem
            to="/chat"
            icon="chat-o"
            text="AI对话"
          />
          <VanGridItem
            to="/user"
            icon="user-o"
            text="我的"
          />
        </VanGrid>
      </div>
      <div class="card popular-destination">
        <div class="section-title">热门目的地</div>
        <VanGrid
          :column-num="4"
          :gutter="8"
        >
          <VanGridItem
            v-for="(item, index) in popularCity"
            :key="index"
            @click="selectCity(item)"
          >
            <div
              class="city-tag"
              :class="{ activecity: formData.city === item }"
            >
              {{ item }}
            </div>
          </VanGridItem>
        </VanGrid>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { debounce } from '@/utils/common.js'
import request from '@/utils/request.js'

const router = useRouter()
const loading = ref(false)
const showBottom = ref(false)
const formData = reactive({
  city: '',
  budget: null,
  days: null
})

const popularCity = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '成都',
  '杭州',
  '西安',
  '重庆',
  '南京',
  '武汉',
  '苏州',
  '长沙'
]
const selectCity = (city) => {
  formData.city = city
  showBottom.value = false
}

const showError = () => {
  // 判断目的地
  if (!formData.city) {
    showToast('请选择目的地')
    return
  }
  // 判断预算
  if (!formData.budget || formData.budget <= 100) {
    showToast('预算不能低于100元')
    return
  }
  // 判断天数
  if (!formData.days || formData.days < 1 || formData.days > 30) {
    showToast('天数必须在1-30天之间')
    return
  }
}
const handleSubmit = () => {
  loading.value = true
  // if (!showError()) return
  // 判断目的地
  if (!formData.city) {
    showToast('请选择目的地')
    return
  }
  // 判断预算
  if (!formData.budget || formData.budget <= 100) {
    showToast('预算不能低于100元')
    return
  }
  // 判断天数
  if (!formData.days || formData.days < 1 || formData.days > 30) {
    showToast('天数必须在1-30天之间')
    return
  }
  router.push({
    path: '/detail',
    query: {
      city: formData.city,
      budget: formData.budget,
      days: formData.days
    }
  })
}

const suggestRef = ref(null)
const isMenu = ref(false)
// const selectedValues = ref(null)
const searchCityList = ref([])
// 模糊搜索
const keywordChange = async () => {
  const city = formData.city.trim()
  if (!city) {
    searchCityList.value = []
    isMenu.value = false
    return
  }
  try {
    const data = await request.post('/searchCity', { keyword: city })
    const list = data?.data || []
    searchCityList.value = list.map((item) => ({
      text: item.cityName,
      value: item.id
    }))
    isMenu.value = searchCityList.value.length > 0
  } catch (e) {
    console.error('搜索城市失败', e)
    searchCityList.value = []
    isMenu.value = false
  }
}
const debkeywordChange = debounce(keywordChange, 1500, false)
const onSuggestClick = (item) => {
  // click ciytItem
  formData.city = item.text
  isMenu.value = false
}

const handleSuggestPopupOutsideClick = (event) => {
  const wrapper = suggestRef.value
  if (wrapper && !wrapper.contains(event.target)) {
    isMenu.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleSuggestPopupOutsideClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleSuggestPopupOutsideClick)
})
</script>

<style lang="scss" scoped>
.search-card {
  margin: 16px 0;
  .city-field {
    background-color: #f7f8fa;
    border-radius: 8px;
    margin-bottom: 12px;
  }
}
.city-tag.activecity {
  background-color: #1989fa;
  color: #fff;
}
.city-tag {
  // width: 100%;
  // height: 100%;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: #f7f8fa;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}
.suggest-list {
  background: #fff;
  border: 1px solid #ebedf0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 12px;
  .suggest-item {
    padding: 10px 16px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    &:active {
      background-color: #f2f3f5;
    }
  }
}
</style>
