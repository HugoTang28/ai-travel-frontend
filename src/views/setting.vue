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
    <!-- <div class="title">语言</div>
    <van-dropdown-menu class="language">
      <van-dropdown-item v-model="value1" :options="option1" />
    </van-dropdown-menu> -->
    <VanField
      v-model="formData.language"
      label="语言"
      placeholder="输入城市名"
      class="language-field"
      clearable
    >
      <template #right-icon>
        <VanIcon
          name="arrow-down"
          size="18"
          color="#999"
        />
      </template>
    </VanField>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const value1 = ref(0)
const value2 = ref('a')
const option1 = [
  { text: '全部商品', value: 0 },
  { text: '新款商品', value: 1 },
  { text: '活动商品', value: 2 }
]
const formData = {
  language: '中文'
}
</script>

<style lang="scss" scoped>
.nav-placeholder {
  height: 46px;
}
.setting {
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 10px 0 10px 10px;
  }
  .language {
  }
  .language-field {
    background-color: #f7f8fa;
    border-radius: 8px;
    margin-bottom: 12px;
  }
}
</style>
