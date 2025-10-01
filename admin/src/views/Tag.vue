<template>

  <div class="tagbox">
    <div class="search">
      <el-input placeholder="请输入关键字" v-model="keyword" clearable></el-input>
      <el-button type="primary" class="search-buttion" @click="searchTag">开始查询</el-button>
      <el-button id="editbutton" type="primary" icon="el-icon-edit" circle @click="isshow = true"></el-button>
    </div>
    <el-table :data="tagList" style="width: 100%" max-height="600px" :header-cell-style="{
            height: '80px',
        }">
      <el-table-column prop="id" label="标签id" width="400">
      </el-table-column>
      <el-table-column prop="content" label="标签名称" width="400">
      </el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="scope">
          <el-button @click.native.prevent="delTag(scope.row.id)" type="text" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer title="增改数据" :visible.sync="isshow" direction="rtl" size="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="标签名称">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即执行</el-button>
          <el-button @click="isshow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import tagApi from "@/api/tag";
export default {
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
  },
  data() {
    return {
      isshow: false,
      keyword: "",
      value: "",
      startTime: "",
      endTime: "",
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },

        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },

        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
      ],
      form: {
        content: "",
      },
      tagList: [],
    };
  },
  methods: {
    handleClose() {
      this.isshow = false;
      this.form = {};
    },
    getAllTag() {
      tagApi.getTagList().then((response) => {
        this.tagList = response.data.tagList;
      });
    },
    onSubmit() {
      tagApi.addTag(this.form.content).then((response) => {
        this.$message.success("执行成功");
        this.isshow = false;
        this.getAllTag();
      });
    },
    delTag(id) {
      tagApi.delTag(id).then((response) => {
        this.$message.success("删除成功");
        this.getAllTag();
      });
    },
    searchTag() {
      tagApi.searchTag(this.keyword).then((response) => {
        this.tagList = response.data.tagList;
      });
    },
  },
  created() {
    this.getAllTag();
  },
};
</script>