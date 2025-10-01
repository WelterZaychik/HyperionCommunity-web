<template>
  <div class="userBox">
    <div class="search">
      <el-input placeholder="请输入关键字" v-model="fuzzyUserData.keyword" clearable></el-input>
      <el-input placeholder="请输入联系信息" v-model="fuzzyUserData.contact" clearable></el-input>
      <div class="block">
        <el-date-picker v-model="fuzzyUserData.createTime" type="date" value-format=yyyy-MM-dd placeholder="选择用户创建日期">
        </el-date-picker>
      </div>
      <el-button type="primary" class="search-buttion" @click="fuzzySerchUser">开始查询</el-button>
      <el-button id="editbutton" type="primary" icon="el-icon-edit" circle @click="isshow = true"></el-button>
    </div>
    <el-table :data="userList" style="width: 100%" max-height="600px" :header-cell-style="{
            height: '80px',
        }">
      <el-table-column prop="id" label="用户id" width="200">
      </el-table-column>
      <el-table-column prop="name" label="用户昵称" width="130">
      </el-table-column>
      <el-table-column prop="account" label="账号" width="130">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="130">
      </el-table-column>
      <el-table-column prop="email" label="邮箱地址" width="200">
      </el-table-column>
      <el-table-column prop="roleId" label="角色" width="100">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteUser(scope.row.id)" type="text" size="small">
            删除
          </el-button>
          <el-button @click.native.prevent="openEditUser(scope.row.id)" type="text" size="small">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer title="增改数据" :visible.sync="isshow" direction="rtl" size="30%" :before-close="handleClose">
      <el-form ref="form" :model="registerForm" label-width="80px">
        <el-form-item label="账号：" label-width="100px">
          <el-input v-model="registerForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码：" label-width="100px">
          <el-input v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称：" label-width="100px">
          <el-input v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码(可不填)：" label-width="180px">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" label-width="100px">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="简介(可不填)：" label-width="150px">
          <el-input v-model="registerForm.synopsis"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-if="!isEdit" type="primary" @click="RegisterSubmit">添加</el-button>
          <el-button v-if="isEdit" type="primary" @click="editSubmit">修改</el-button>
          <el-button @click="isshow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>

</template>

<script>
import userApi from "@/api/user";
export default {
  data() {
    return {
      isshow: false,
      isEdit: false,
      fuzzyUserData: {
        keyword: "",
        contact: "",
        createTime: "",
      },
      userList: [],
      registerForm: {
        account: "",
        password: "",
        name: "",
        email: "",
        synopsis: "",
      },
    };
  },
  methods: {
    handleClose() {
      this.isshow = false;
      this.registerForm = {};
      this.isEdit = false;
    },
    getAllUser() {
      userApi.getUserList().then((response) => {
        this.userList = response.data.userList;
      });
    },
    RegisterSubmit() {
      var emailTes = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var nameTes = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,11}$/;
      var accountpTes = /^[a-zA-Z0-9]{6,12}$/;
      var passwordTes = /^(?=.*[a-zA-Z])(?=.*\d).{6,12}$/;
      if (this.registerForm.account == "") {
        this.$message.warning("账号未填写");
      } else if (!accountpTes.test(this.registerForm.account)) {
        this.$message.warning("账号格式错误");
      } else if (this.registerForm.password == "") {
        this.$message.warning("密码未填写");
      } else if (!passwordTes.test(this.registerForm.password)) {
        this.$message.warning("密码格式错误");
      } else if (this.registerForm.name == "") {
        this.$message.warning("昵称未填写");
      } else if (!nameTes.test(this.registerForm.name)) {
        this.$message.warning("昵称格式错误");
      } else if (this.registerForm.email == "") {
        this.$message.warning("邮箱未填写");
      } else if (!emailTes.test(this.registerForm.email)) {
        this.$message.warning("请按照邮箱格式填写");
      } else {
        userApi.userRegister(this.registerForm).then((response) => {
          if (response.code > 200) {
            this.$message.error("添加失败");
          } else {
            this.$message.success("添加成功");
            this.getAllUser();
            this.isEdit = false;
            this.isshow = false;
          }
        });
      }
    },
    fuzzySerchUser() {
      userApi.fuzzySerch(this.fuzzyUserData).then((response) => {
        this.userList = response.data.userList;
        this.isshow = false;
      });
    },
    deleteUser(id) {
      userApi.deleteUserById(id).then((response) => {
        this.$message.success("删除成功");
        this.getAllUser();
      });
    },
    getUserDetail(id) {
      userApi.getUserById(id).then((response) => {
        this.registerForm = response;
      });
    },
    openEditUser(id) {
      this.isEdit = true;
      this.getUserDetail(id);
      this.isshow = true;
    },
    editSubmit() {
      var emailTes = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      var nameTes = /^[\u4e00-\u9fa5a-zA-Z0-9]{3,11}$/;
      var accountpTes = /^[a-zA-Z0-9]{6,12}$/;
      var passwordTes = /^(?=.*[a-zA-Z])(?=.*\d).{6,12}$/;
      if (this.registerForm.account == "") {
        this.$message.warning("账号未填写");
      } else if (!accountpTes.test(this.registerForm.account)) {
        this.$message.warning("账号格式错误");
      } else if (this.registerForm.password == "") {
        this.$message.warning("密码未填写");
      } else if (!passwordTes.test(this.registerForm.password)) {
        this.$message.warning("密码格式错误");
      } else if (this.registerForm.name == "") {
        this.$message.warning("昵称未填写");
      } else if (!nameTes.test(this.registerForm.name)) {
        this.$message.warning("昵称格式错误");
      } else if (this.registerForm.email == "") {
        this.$message.warning("邮箱未填写");
      } else if (!emailTes.test(this.registerForm.email)) {
        this.$message.warning("请按照邮箱格式填写");
      } else {
        userApi.editUserInfo(this.registerForm).then((response) => {
          if (response.code > 200) {
            this.$message.error("修改失败");
          } else {
            this.$message.success("修改成功");
            this.getAllUser();
            this.isEdit = false;
            this.isshow = false;
          }
        });
      }
    },
  },
  created() {
    this.getAllUser();
  },
};
</script>

