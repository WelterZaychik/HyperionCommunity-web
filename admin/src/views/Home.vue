<template>
  <div class="homeBox">
    <h1 id="homeTitle">首页</h1>
    <div class="homeTimeList">
      <el-timeline>
        <el-timeline-item timestamp="至今" placement="top">
          <el-card>
            <h4>项目完善中</h4>
            <p></p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023/5/25" placement="top" type="primary">
          <el-card>
            <h4>更新后台代码</h4>
            <p>提交于 2024/11/26 23:44</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023/5/24" placement="top" type="primary">
          <el-card>
            <h4>更新后台CRUD以及权限需求</h4>
            <p>提交于 2024/11/24 00:00</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023/5/17" placement="top" type="primary">
          <el-card>
            <h4>完成前台所有基本需求</h4>
            <p>提交于 2024/11/17 22:22</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023/5/15" placement="top" type="primary">
          <el-card>
            <h4>完成前台前端基础代码编写</h4>
            <p>提交于 2024/11/1 14:32</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023/5/14" placement="top" type="primary">
          <el-card>
            <h4>完成前台后端基础代码编写</h4>
            <p>提交于 2024/10/14 21:00</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2023/5/3" placement="top" type="primary">
          <el-card>
            <h4>项目立项，开始动工</h4>
            <p>2024/10/1 正式立项</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
#homeTitle {
  font-size: 1.5em;
}
</style>