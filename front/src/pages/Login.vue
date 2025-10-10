<template>
  <div class="LoginComponent">
    <div class="container">
      <div class="form-box" :style="{ transform: isRegister ? 'translateX(80%)' : 'translateX(0%)' }">
        <!-- 注册 -->
        <div class="register-box" :class="{ hidden: !isRegister }">
          <h1>register</h1>
          <input type="text" placeholder="昵称" v-model="registerForm.name">
          <input type="text" placeholder="用户名" v-model="registerForm.account">
          <input type="password" placeholder="密码" v-model="registerForm.password">
          <input type="password" placeholder="确认密码" v-model="registerForm.againPass">
          <input type="email" placeholder="邮箱" v-model="registerForm.email">
          <button @click="RegisterSubmit">注册</button>
        </div>
        <!-- 登录 -->
        <div class="login-box" :class="{ hidden: isRegister }">
          <h1>login</h1>
          <input type="text" placeholder="用户名" v-model="loginForm.username">
          <input type="password" placeholder="密码" v-model="loginForm.password">
          <button @click="loginSuccess">登录</button>
        </div>
      </div>
      <div class="con-box left">
        <h2>欢迎加入<span>闪电鼠</span></h2>
        <!-- <p>快来领取你的专属<span>宠物</span>吧</p> -->
        <img src="@/assets/1.png" alt="宠物1">
        <p>已有账号</p>
        <button @click="SwitchRoL">去登录</button>
      </div>
      <div class="con-box right">
        <h2><span>欢迎回来</span></h2>
        <!-- <p>快来看看你的可爱<span>宠物</span>吧</p> -->
        <img src="@/assets/2.png" alt="宠物2">
        <p>没有账号？</p>
        <button @click="SwitchRoL">去注册</button>
      </div>
    </div>
  </div>
</template>
  
  <script>
import userApi from "@/api/user";
export default {
  data() {
    return {
      isRegister: false,
      loginForm: {
        username: "",
        password: "",
      },
      registerForm: {
        account: "",
        password: "",
        againPass: "",
        name: "",
        email: "",
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
              this.$message.error(response.data.msg);
            } else {
              localStorage.setItem(
                "userInfo",
                JSON.stringify(response.data.userInfo)
              );
              localStorage.setItem("token", response.data.token);
              this.$message.success("登录成功");
              // 跳转到首页并刷新页面
              this.$router.push("/").then(() => {
                window.location.reload();
              });
            }
          });
      }
    },
    RegisterSubmit() {
      var emailTes = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var nameTes = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,11}$/;
      var accountpTes = /^[a-zA-Z0-9]{6,12}$/;
      var passwordTes = /^(?=.*[a-zA-Z])(?=.*\d).{6,12}$/;
      if (this.registerForm.name == "") {
        this.$message.warning("昵称未填写");
      } else if (!nameTes.test(this.registerForm.name)) {
        this.$message.warning("昵称格式错误");
        this.$notify.info({
          title: "昵称格式：",
          message: "由3-11位的字母、数字，中文组成",
        });
      } else if (this.registerForm.account == "") {
        this.$message.warning("用户名未填写");
      } else if (!accountpTes.test(this.registerForm.account)) {
        this.$message.warning("用户名格式错误");
        this.$notify.info({
          title: "用户名格式：",
          message: "由6-12位的字母、数字组成",
        });
      } else if (this.registerForm.password == "") {
        this.$message.warning("密码未填写");
      } else if (!passwordTes.test(this.registerForm.password)) {
        this.$message.warning("密码格式错误");
        this.$notify.info({
          title: "密码格式：",
          message: "由6-12位包含至少一个字母，至少一个数字构成",
        });
      } else if (this.registerForm.againPass == "") {
        this.$message.warning("请再次输入密码以验证");
      } else if (this.registerForm.againPass != this.registerForm.password) {
        this.$message.warning("两次密码不一致");
      } else if (this.registerForm.email == "") {
        this.$message.warning("邮箱未填写");
      } else if (!emailTes.test(this.registerForm.email)) {
        this.$message.warning("请按照邮箱格式填写");
        this.$notify.info({
          title: "邮箱格式：",
          message: "如：XXxx123@xxx.xxx\n(本邮箱用作)",
        });
      } else {
        userApi.userRegister(this.registerForm).then((response) => {
          if (response.code > 200) {
            this.$message.error("注册失败");
          } else {
            this.$message.success("注册成功");
            this.$router.push("/Login");
            this.lorrFlog = true;
          }
        });
      }
    },
    SwitchRoL() {
      this.loginForm = {
        username: "",
        password: "",
      };
      this.registerForm = {
        account: "",
        password: "",
        againPass: "",
        name: "",
        email: "",
      };
      this.isRegister = !this.isRegister;
    },
  },
};
</script>
  
  <style scoped>
/* body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(200deg, #f3e7e9, #e3eeff);
  } */

.LoginComponent {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.container {
  background-color: #fff;
  width: 650px;
  height: 415px;
  border-radius: 5px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-box {
  position: absolute;
  top: -10%;
  left: 5%;
  background-color: #8cb4ff;
  width: 320px;
  height: 500px;
  border-radius: 5px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  transition: 0.5s ease-in-out;
}

.register-box,
.login-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.hidden {
  display: none;
  transition: 0.5s;
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 5px;
}

input {
  background-color: transparent;
  width: 70%;
  color: #fff;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  padding: 10px 0;
  text-indent: 10px;
  margin: 8px 0;
  font-size: 14px;
  letter-spacing: 2px;
}

input::placeholder {
  color: #fff;
}

input:focus {
    color: #3b5fa1;
  outline: none;
  border-bottom: 1px solid #3b5fa1;
  transition: 0.5s;
}

input:focus::placeholder {
  opacity: 0;
}

.form-box button {
  width: 70%;
  margin-top: 35px;
  background-color: #f6f6f6;
  outline: none;
  border-radius: 8px;
  padding: 13px;
  color: #436cb9;
  letter-spacing: 2px;
  border: none;
  cursor: pointer;
}

.form-box button:hover {
  background-color: #1e90ff;
  color: #f6f6f6;
  transition: background-color 0.5s ease;
}

.con-box {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.con-box.left {
  left: -2%;
}

.con-box.right {
  right: -2%;
}

.con-box h2 {
  color: #8e9aaf;
  font-size: 25px;
  font-weight: bold;
  letter-spacing: 3px;
  text-align: center;
  margin-bottom: 4px;
}

.con-box p {
  font-size: 12px;
  letter-spacing: 2px;
  color: #8e9aaf;
  text-align: center;
}

.con-box span {
  color: #8cb4ff;
}

.con-box img {
  width: 150px;
  height: 150px;
  opacity: 0.9;
  margin: 40px 0;
}

.con-box button {
  margin-top: 3%;
  background-color: #fff;
  color: #436cb9;
  border: 1px solid #8cb4ff;
  padding: 6px 10px;
  border-radius: 5px;
  letter-spacing: 1px;
  outline: none;
  cursor: pointer;
}

.con-box button:hover {
  background-color: #8cb4ff;
  color: #fff;
}
</style>
  