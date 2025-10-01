<template>

  <div class="resourcebox">
    <div class="search">
      <el-input placeholder="请输入关键字" v-model="keyword" clearable></el-input>
      <el-button type="primary" class="search-buttion" @click="searchResouce">开始查询</el-button>
      <el-button id="editbutton" type="primary" icon="el-icon-edit" circle @click="isshow = true"></el-button>
    </div>
    <el-table :data="resourceList" style="width: 100%" max-height="600px" :header-cell-style="{
            height: '80px',
        }">
      <el-table-column prop="id" label="资源id" width="200">
      </el-table-column>
      <el-table-column prop="title" label="资源标题" width="100">
      </el-table-column>
      <el-table-column prop="logo" label="logo地址" width="320">
      </el-table-column>
      <el-table-column prop="url" label="资源地址" width="350">
      </el-table-column>
      <el-table-column prop="tagflag" label="资源类型" width="100">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="130">
        <template slot-scope="scope">
          <el-button @click.native.prevent="delResource(scope.row.id)" type="text" size="small">
            删除
          </el-button>
          <el-button @click.native.prevent="OpenEditView(scope.row.id)" type="text" size="small">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer :visible.sync="isshow" title="增改数据" direction="rtl" size="30%" :before-close="handleClose">
      <el-form :model="resourceObj">
        <el-form-item label="资源名称" :label-width="formLabelWidth">
          <el-input v-model="resourceObj.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源地址" :label-width="formLabelWidth">
          <el-input v-model="resourceObj.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="logo地址" :label-width="formLabelWidth">
          <el-input v-model="resourceObj.logo" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" :label-width="formLabelWidth">
          <el-select v-model="resourceObj.tagflag" placeholder="请选择资源类型">
            <el-option label="学习" value=1></el-option>
            <el-option label="娱乐" value=2></el-option>
            <el-option label="视频" value=3></el-option>
          </el-select>
        </el-form-item>
        <div class="demo-drawer__footer">
          <el-button v-if="!isEdit" type="primary" @click="addResource">提交</el-button>
          <el-button v-if="isEdit" type="primary" @click="editResource">修改</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </div>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import resourceApi from "@/api/resource";
export default {
  data() {
    return {
      isEdit: false,
      isshow: false,
      keyword: "",
      resourceList: [],
      resourceObj: {
        title: "",
        url: "",
        logo: "",
        tagflag: "",
      },
    };
  },
  methods: {
    handleClose() {
      this.isshow = false;
      this.isEdit = false;
      this.resourceObj = {};
    },
    getAllResource() {
      resourceApi.getResourceList().then((response) => {
        this.resourceList = response.data.resourceList;
      });
    },
    delResource(id) {
      resourceApi.delResource(id).then((response) => {
        this.$message.success("删除成功");
        this.getAllResource();
      });
    },
    addResource() {
      resourceApi.addResource(this.resourceObj).then((response) => {
        this.$message.success("添加成功");
        this.getAllResource();
        this.isshow = false;
      });
    },
    getResourceDetail(id) {
      resourceApi.getResourceByid(id).then((response) => {
        this.resourceObj = response.data.resourceObj;
      });
    },
    OpenEditView(id) {
      this.isEdit = true;
      this.isshow = true;
      this.getResourceDetail(id);
    },
    editResource() {
      resourceApi.editResource(this.resourceObj).then((response) => {
        this.$message.success("修改成功");
        this.getAllResource();
        this.isshow = false;
        this.isEdit = false;
      });
    },
    searchResouce() {
      resourceApi.searchResource(this.keyword).then((response) => {
        this.resourceList = response.data.resourceList
      });
    },
  },
  created() {
    this.getAllResource();
  },
};
</script>

<style scoped>
.el-form {
  margin-left: 50px;
}
</style>