<template>
  <div class="page-container">
    <van-nav-bar
      title="热门城市推荐"
      fixed
    />
    <div class="nav-placeholder"></div>
    <div class="cityRecommend">
      <div class="cityItem" v-for="item in cityItem" :key="item.id">
        <div class="cityTitle">{{ item.cityName }}</div>
        <div class="imgItem">
          <img class="imgShow" :src="item.imgUrl" alt="">
          <img class="imgShow" :src="item.imgUrl" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const cityItem = [
  {
    id: 1,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 2,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 3,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 4,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 5,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 6,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 7,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 8,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 9,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
  {
    id: 10,
    cityName: '广州',
    imgUrl: 'https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png'
  },
]
</script>

<style lang="scss" scoped>
.page-container {
  .nav-placeholder {
    height: 46px;
  }
  .cityRecommend {
    height: calc(100vh - 96px);
    overflow-y: auto;
    // padding-bottom: 60px;
    .cityItem {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 5px 10px;
      overflow: hidden;
      margin-top: 10px;
      background-color: #fff;
      .cityTitle {
        font-size: 14px;
        font-weight: 600;
        padding: 0 0 5px 5px;
      }
      .imgItem {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
        .imgShow {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          border-radius: 8px;
        }
      }
  
    }
  }
}
</style>