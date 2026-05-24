<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar
        title="智能旅行"
      />
    </div>
    <div class="page-content">
      <van-notice-bar
        left-icon="info-o"
        text="基于AI的智能景点介绍与行程规划"
      />
      <!-- 搜索卡片 -->
      <div class="card search-card">
        <div class="section-title">
          规划你的旅程
        </div>
        <van-field
          is-link
          readonly
          label="城市"
          @click="showBottom = !showBottom"
          v-model="formData.city" 
          placeholder="请选择城市"
          class="city-field"
        />
        <van-popup
          v-model:show="showBottom"
          round
          position="bottom"
        >
          <van-picker
            show-toolbar
            title="选择目的地"
            :columns="cityList"
            @confirm="onCityConfirm"
            @cancel="showBottom = false"
          />
        </van-popup>
        <van-field 
          v-model="formData.budget" 
          label="预算"
          type="number"
          placeholder="请输入预算">
          :border="false"
          class="city-field"
        </van-field>

        <van-field 
          v-model="formData.days" 
          label="天数"
          type="digit"
          placeholder="请输天数"
        >
          天数
        </van-field>
        <van-button
          type="primary"
          size="large"
          round
          block
          @click="handleSubmit"
          :loading="loading"
        >
           开始规划
        </van-button>
      </div>
      <!-- 快捷入口 -->
      <div class="card quick-actions">
        <div class="section-title">
          快捷入口
        </div>
        <van-grid :column-num="2" :gutter="12">
          <van-grid-item to="/chat" icon="chat-o" text="AI对话" />
          <van-grid-item to="/user" icon="user-o" text="我的" />
        </van-grid>
      </div>
      <div class="card popular-destination">
        <div class="section-title">
          热门目的地
        </div>
        <van-grid :column-num="4" :gutter="8">
          <van-grid-item @click="selectCity(item)" v-for="(item, index) in popularCity" :key="index">
            <div class="city-tag" :class="{activecity: formData.city === item}">{{ item }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';

const loading = ref(false);
const showBottom = ref(false);
const formData = reactive({
  city: '',
  budget: null,
  days: null,
});

const allCityList = [
  '北京', '上海', '广州', '深圳', '成都', '杭州', '西安', '重庆',
  '南京', '武汉', '苏州', '长沙', '天津', '郑州', '济南', '青岛',
  '大连', '沈阳', '哈尔滨', '长春', '福州', '厦门', '南昌', '合肥',
  '昆明', '贵阳', '南宁', '桂林', '海口', '三亚', '丽江', '大理',
  '西安', '兰州', '乌鲁木齐', '拉萨', '呼和浩特', '太原', '石家庄'
]
const popularCity = allCityList.slice(0, 12);
const selectCity = (city) => {
  formData.city = city;
  showBottom.value = false;
}
const cityList = allCityList.map( item => (
  {
    text: item,
    value: item,
  }
))
const onCityConfirm = ({ selectedValues }) => {
  console.log(selectedValues);
  formData.city = selectedValues[0];
  showBottom.value = false;
}

const handleSubmit = () => {
  loading.value = true;
}

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
</style>