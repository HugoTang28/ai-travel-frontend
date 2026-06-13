<template>
  <div class="page-container">
    <van-nav-bar
      title="热门城市推荐"
      fixed
    />
    <div class="nav-placeholder"></div>
    <div class="cityRecommend">
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
      <div class="cityItem">
        <div class="cityTitle">广州</div>
        <div class="imgItem">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
          <img class="imgShow" src="https://nfassetoss.southcn.com/__asset/7bc7295f9d/f1a8aebe8b.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

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