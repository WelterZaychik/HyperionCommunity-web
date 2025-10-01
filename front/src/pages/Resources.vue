<template>
  <div class="friendLink">
    <pcl-line></pcl-line>
    <navigation></navigation>
    <div class="contentBody">
      <div class="leftBox">
        <div class="rescontent">
          <div class="title">
            <h2>资源列表</h2>
          </div>
          <el-divider></el-divider>
          <div class="ResTagList">
            <el-button v-for="item in tagList" key = "index" type="primary" size="small" plain @click="getAllResorce(item.id)">{{item.name}}</el-button>
          </div>
          <el-divider></el-divider>
          <div class="gameRes">

            <div class="chrRes">
              <a :href="item.url" v-for="item in onelist" target="_blank">
                <div class="ResourceItem">
                  <el-image style="width: 60px; height: 60px" :src="item.logo" fit="cover"></el-image>
                  <div>
                    <h3>{{ item.title }}</h3>
                    <p>{{item.intro}}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
      </div>
      <div class="rightBox">
        <rightlist></rightlist>
      </div>
    </div>
    <div class="Footer">
      <div class="Footer-content">
        <span>
          Welt © 2023
        </span>
        <span>
          违法与不良信息举报：198466453@qq.com
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import rightlist from "@/components/rightlist.vue";
import navigation from "../components/navigation.vue";
import resourceApi from "@/api/resource";
import pclLine from "@/components/pcl-line.vue";

export default {
  name: "RESOURSES",
  components: {
    navigation,
    rightlist,
    pclLine,
  },
  data() {
    return {
      onelist: [],
      tagList: [],
    };
  },
  methods: {
    getAllResorce(tagId) {
      resourceApi.getResourceList(tagId).then((response) => {
        this.onelist = response.data.ResouecesList;
      });
    },
    getAllResourceSTag() {
      resourceApi.getAllResourceTag().then((response) => {
        this.tagList = response;
      });
    },
    routeChange() {
      this.getAllResorce(0);
      this.getAllResourceSTag();
    },
  },
  created() {
    this.routeChange();
  },
  watch: {
    $route() {
      this.routeChange();
    },
  },
};
</script>

<style scoped>
.rescontent {
  /* background-color: aqua; */
}

.chrRes {
  /* background-color: rgb(234, 0, 255); */
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.chrRes a {
  display: inline-block;
  background-color: rgb(255, 255, 255);
  width: 350px;
  height: 110px;
  margin: 10px 0 0 10px;
  box-sizing: border-box;
  padding: 10px;
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.16); */
  border: 2px solid rgba(0, 0, 0, 0.16);
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.215); */
  border-radius: 10px;
  color: black;
  transition: all 0.3s ease-out;
}

.chrRes a h3 {
  margin-bottom: 7px;
}

.chrRes a:hover {
  border: 2px solid rgb(28, 153, 255);
}

.ResourceItem {
  display: flex;
}

.ResourceItem div{
  width: 240px;
  margin-left: 10px ;
 
}

.ResourceItem p{
  color:#515767;
  font-size: 15px;
  width: 230px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;    /* 显示的行数，可根据需要调整 */
  overflow: hidden;   
}

.ResTagList {
  padding: 5px 20px;
}
</style>