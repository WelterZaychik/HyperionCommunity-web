<template>
  <div class="AdminwebBox">
    <el-container class="container-father">
      <el-header>
        <span>LightMouse后台管理</span>
        <el-dropdown class="adminavatarbox">
          <el-image style="width: 45px; height: 45px" class="adminavatar" :src="url" fit="fill"></el-image>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item icon="el-icon-set-up">返回首页</el-dropdown-item> -->
            <el-dropdown-item icon="el-icon-close" @click.native="removeToken()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container class="container-father">
        <el-aside width="auto">
          <nav-vue></nav-vue>
        </el-aside>
        <el-container class="container-father">
          <el-main style="height: 94vh">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import navVue from "@/components/nav.vue";
import userApi from "@/api/user";
export default {
  name: "Adminweb",
  data() {
    return {
      url: "",
    };
  },
  components: {
    navVue,
  },
  created() {
    console.log();
    this.url = JSON.parse(localStorage.getItem("userInfo")).avatar;
  },
  methods:{
    removeToken() {
      userApi
        .userLogout(JSON.parse(localStorage.getItem("userInfo")).account)
        .then((response) => {
          localStorage.removeItem("token");
          localStorage.removeItem("userInfo");
          this.$router.push("/Login");
        });
    },
  }
};
</script>

<style>
.AdminwebBox {
  height: 100%;
}
.el-header {
  justify-content: space-around;
  background-color: #23232e;
  color: #fff;
  text-align: center;
  padding: 0 50px;
  line-height: 60px;
}
.adminavatarbox{
  float: right;
  border-radius: 5px;
}

.adminavatar{
  margin-top: 7px;
  float: right;
  border-radius: 5px;
  cursor: pointer;
  border: 0.5px solid #0070ba;
  transition: 0.3s ease 0s;
}

.adminavatar:hover {
  border: 0.5px solid #fff;
}

.el-aside {
  background-color: #23232e;
  color: #fff;
  overflow: hidden;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}

.container-father {
  height: 100%;
}

.search {
  position: relative;
  display: flex;
  justify-content: left;
  margin-bottom: 15px;
  background-color: #fff;
  padding: 5px;
}

/* .search input {
  width: 200px;
} */

.el-input {
  width: 180px;
  margin-left: 10px;
}

.search-buttion {
  position: absolute;
  right: 70px;
}

#editbutton {
  position: absolute;
  right: 10px;
}
</style>