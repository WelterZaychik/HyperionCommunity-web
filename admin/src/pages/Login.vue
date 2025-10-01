<template>
  <div class="LoginComponent">
    <div class="Loginbox">
      <div class="LoginBoxHeader">
        <h1 style="color:#fff">AdminLogin</h1>
      </div>
      <el-divider></el-divider>
      <div class="LoginBoxForm">
        <div class="loginInputbox"><input type="text" placeholder="请输入账号" v-model="loginForm.username"></div>
        <div class="loginInputbox"><input type="password" placeholder="请输入密码" v-model="loginForm.password"></div>
      </div>
      <div class="LoginBoxFooter">
        <div class="LoginButton" @click="loginSuccess()">
          login
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import userApi from "@/api/user";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    loginSuccess() {
      if (this.loginForm.username == "") {
        this.$message.warning("用户名未填写");
      } else if (this.loginForm.password == "") {
        this.$message.warning("密码未填写");
      } else {
        userApi
          .userLogin(this.loginForm.username, this.loginForm.password)
          .then((response) => {
            if (response.code > 200) {
              // this.$message.error(response.data.msg);
              this.$message.error(response.msg);
            } else {
              localStorage.setItem(
                "userInfo",
                JSON.stringify(response.data.userInfo)
                // JSON.stringify(response.userInfo)
              );
              localStorage.setItem("token", response.data.token, {
                expires: Date.now() + 1000 * 60 * 60 * 72, // 过期时间为 3 天
              });
              // localStorage.setItem("token", "aa");
              this.$message.success("登录成功");
              this.$router.push("/");
            }
          });
      }
    },
    ChangeLor() {
      this.loginForm = {
        username: "",
        password: "",
      };
    },
  },
};
</script>

<style scoped>
input::placeholder {
  color: #ffffff98;
}
.LoginComponent {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-color: #23232ee6;
}

.Loginbox {
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
  width: 500px;
  /* height: 500px; */
  padding: 50px;
  box-sizing: border-box;
  /* border: 1px solid blue; */
  box-shadow: 0 2px 12px 0 #a7a7a79c;
  border-radius: 5px;
  transition: 1s ease 0s;
  background-color: #2a2a34;
}

/* .LoginBoxForm{
    flex: 0 0 40%;
} */

.loginInputbox {
  height: 33px;
  margin: 20px 0px;
}

.LoginBoxForm i {
  color: #fff;
}

.LoginBoxForm input {
  display: block;
  border: none;
  outline: none;
  border-bottom: 1px solid rgba(72, 72, 72, 0.881);
  width: 300px;
  height: 30px;
  padding: 10px;
  transition: 0.3s ease 0s;
  background-color: #2a2a34;
  color: #fff;
}

.LoginBoxForm input:focus {
  border-bottom: 3px solid rgb(159, 159, 159);
}

.LoginButton {
  background-color: rgb(183, 209, 255);
  color: #525252;
  width: 200px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  transition: 0.3s ease 0s;
  border-radius: 5px;
  border: 1px solid rgb(100, 154, 254);
  cursor: pointer;
  margin-top: 30px;
}

.LoginButton:hover {
  background-color: rgb(100, 154, 254);
  color: #fff;
}
</style>