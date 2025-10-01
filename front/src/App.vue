<template>
  <div id="app">

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <el-backtop :visibility-height="200" :bottom="120">
      <div style="{
        text-align: center;
        line-height: 40px;
      }">
        <i class="el-icon-arrow-up"></i>
      </div>
    </el-backtop>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
body {
  background-color: rgb(245, 245, 245);
}

* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.contentBody {
  margin: 0 auto;
  width: 1200px;
  min-height: 90vh;
  /* height: 1500px; */
  display: flex;
  justify-content: center;
}
.leftBox {
  margin-top: 25px;
  width: 850px;
  min-height: 1000px;
}
.rightBox {
  margin-top: 25px;
  margin-left: 30px;
  width: 300px;
  height: 100%;
}

.Footer {
  width: 100%;
  height: 100px;
  background: #23232e;
  margin-top: 80px;
  min-width: 1200px;
  position: relative;
  z-index: 999;
  text-align: center;
  padding-top: 30px;
  box-sizing: border-box;
}

.Footer-content {
  color: #ffffff8a;
  display: flex;
  flex-direction: column;
}

/* @media (max-width: 750px) {
  .right {
    display: none;
  }
  .left {
    min-width: none;
    width: 85%;
    height: 100%;
  }
  .el-carousel{
    display: none;
  }
} */
</style>
