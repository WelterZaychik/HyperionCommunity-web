<template>
  <div class="navBox">
    <el-radio-group v-model="isCollapse">
      <el-switch v-model="isCollapse" active-color="#727272" inactive-color="#6bb5ff">
      </el-switch>
    </el-radio-group>

    <el-menu router default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" background-color="#23232e" text-color="#fff">
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-user-solid"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/topic">
        <i class="el-icon-s-management"></i>
        <span slot="title">帖子管理</span>
      </el-menu-item>
      <el-menu-item index="/tag">
        <i class="el-icon-paperclip"></i>
        <span slot="title">标签管理</span>
      </el-menu-item>
      <el-menu-item index="/resource">
        <i class="el-icon-toilet-paper"></i>
        <span slot="title">资源管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu{
  border:none
}

.el-switch{
  position: absolute;
  top: 20px;
  left:20px ;
}
</style>