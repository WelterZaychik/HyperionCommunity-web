<template>
  <div class="topic-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div v-for="n in 6" :key="n" class="topic-skeleton">
        <el-skeleton animated>
          <template slot="template">
            <div class="skeleton-content">
              <el-skeleton-item variant="image" class="skeleton-image" />
              <div class="skeleton-text">
                <el-skeleton-item variant="h3" class="skeleton-title" />
                <el-skeleton-item variant="text" class="skeleton-desc" />
                <div class="skeleton-meta">
                  <el-skeleton-item variant="text" class="skeleton-meta-item" />
                  <el-skeleton-item variant="text" class="skeleton-meta-item" />
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!topicList || topicList.length === 0" class="empty-container">
      <el-empty 
        description="暂无话题数据" 
        image="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png">
        <el-button type="primary" @click="$router.push('/CreateTopic')">创建第一个话题</el-button>
      </el-empty>
    </div>

    <!-- 话题列表 -->
    <div v-else class="topics-container">
      <div 
        v-for="topic in topicList" 
        :key="topic.id" 
        class="topic-card"
        @click="$router.push('/TopicDetail/' + topic.id)">
        
        <!-- 话题封面 -->
        <div class="topic-cover">
          <el-image 
            :src="topic.coverImage" 
            fit="cover"
            :alt="topic.title"
            class="cover-image">
            <div slot="error" class="image-error">
              <i class="el-icon-picture-outline"></i>
            </div>
            <div slot="placeholder" class="image-loading">
              <i class="el-icon-loading"></i>
            </div>
          </el-image>
          
          <!-- 标签 -->
          <div class="topic-tags">
            <span v-if="topic.createUserId === 0" class="tag tag--official">官方</span>
            <span v-if="topic.tagName" class="tag tag--category">{{ topic.tagName }}</span>
            <span v-if="topic.isVideo" class="tag tag--video">
              <i class="el-icon-video-camera"></i>视频
            </span>
          </div>
        </div>

        <!-- 话题内容 -->
        <div class="topic-content">
          <h3 class="topic-title">{{ topic.title }}</h3>
          <p class="topic-synopsis">{{ topic.synopsis }}</p>
          
          <!-- 话题统计 -->
          <div class="topic-stats">
            <div class="stat-item">
              <i class="el-icon-chat-line-round"></i>
              <span>{{ topic.comments || 0 }}</span>
            </div>
            <div class="stat-item">
              <i class="el-icon-view"></i>
              <span>{{ topic.numberOfViews || 0 }}</span>
            </div>
            <div class="stat-item">
              <i class="el-icon-lollipop"></i>
              <span>{{ topic.numberOfLikes || 0 }}</span>
            </div>
          </div>

          <!-- 作者信息 -->
          <div class="topic-author">
            <el-avatar 
              :src="topic.avatar || 'https://browne.oss-cn-shenzhen.aliyuncs.com/Avatar.jpg'" 
              :size="24"
              class="author-avatar">
              <i v-if="!topic.avatar" class="el-icon-user"></i>
            </el-avatar>
            <span class="author-name">{{ topic.nickName }}</span>
            <span class="create-time">{{ formatTime(topic.createTime) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > 6" class="pagination-container">
      <el-pagination 
        background 
        layout="total, prev, pager, next, jumper" 
        :page-size="6" 
        :total="total" 
        @current-change="CurrentChange"
        :current-page.sync="currentPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import TopicApi from "@/api/topic";

export default {
  name: "TopicList",
  data() {
    return {
      topicList: [],
      total: 0,
      loading: true,
      currentPage: 1,
    };
  },
  props: {
    fuzzyData: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    CurrentChange(curPage) {
      this.currentPage = curPage;
      if (this.$route.path === "/Official") {
        this.getOfficList(curPage);
      } else if (this.$route.path === "/Community") {
        this.fuzzyQuery(curPage);
      }
    },
    
    getOfficList(curPage) {
      this.loading = true;
      TopicApi.getofficallist(curPage).then((response) => {
        this.topicList = response.data.hostList || [];
        this.total = response.data.hostTotal || 0;
      }).catch(error => {
        console.error("获取官方话题列表失败:", error);
        this.$message.error("获取话题列表失败");
      }).finally(() => {
        this.loading = false;
      });
    },
    
    fuzzyQuery(curPage) {
      this.loading = true;
      const queryData = { ...this.fuzzyData, current: curPage };
      TopicApi.fuzzyQueryTopic(queryData).then((response) => {
        this.topicList = response.data.fuzzyList || [];
        this.total = response.data.fuzzyTotal || 0;
      }).catch(error => {
        console.error("搜索话题失败:", error);
        this.$message.error("搜索话题失败");
      }).finally(() => {
        this.loading = false;
      });
    },
    
    formatTime(timeString) {
      if (!timeString) return '';
      try {
        const date = new Date(timeString);
        const now = new Date();
        const diff = now - date;
        
        // 1分钟内
        if (diff < 60000) {
          return '刚刚';
        }
        
        // 1小时内
        if (diff < 3600000) {
          return `${Math.floor(diff / 60000)}分钟前`;
        }
        
        // 1天内
        if (diff < 86400000) {
          return `${Math.floor(diff / 3600000)}小时前`;
        }
        
        // 1周内
        if (diff < 604800000) {
          return `${Math.floor(diff / 86400000)}天前`;
        }
        
        // 超过1周显示具体日期
        return date.toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit'
        });
      } catch (error) {
        return timeString.substring(0, 16);
      }
    },
  },
  created() {
    this.CurrentChange(1);
  },
  watch: {
    '$route.path': {
      handler(newPath) {
        if (newPath === '/Official' || newPath === '/Community') {
          this.CurrentChange(1);
        }
      },
      immediate: true,
    },
    fuzzyData: {
      handler(newData) {
        if (this.$route.path === '/Community') {
          this.CurrentChange(1);
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.topic-list {
  width: 100%;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-skeleton {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: 16px;
}

.skeleton-content {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.skeleton-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
}

.skeleton-desc {
  height: 16px;
  width: 90%;
}

.skeleton-meta {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.skeleton-meta-item {
  height: 14px;
  width: 60px;
}

/* 空状态 */
.empty-container {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: 40px 20px;
  text-align: center;
}

/* 话题列表 */
.topics-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.topic-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

/* 话题封面 */
.topic-cover {
  position: relative;
  flex-shrink: 0;
}

.cover-image {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: #f5f5f5;
}

.image-error,
.image-loading {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 24px;
}

/* 标签 */
.topic-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: white;
  line-height: 1;
}

.tag--official {
  background: var(--danger-color);
}

.tag--category {
  background: var(--primary-color);
}

.tag--video {
  background: var(--warning-color);
}

.tag i {
  font-size: 8px;
  margin-right: 2px;
}

/* 话题内容 */
.topic-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.topic-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.topic-synopsis {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 话题统计 */
.topic-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.stat-item i {
  font-size: 14px;
}

.stat-item span {
  font-weight: 500;
}

/* 作者信息 */
.topic-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.author-avatar {
  border: 1px solid var(--border-color);
}

.author-name {
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 500;
}

.create-time {
  font-size: 11px;
  color: var(--text-muted);
}

/* 分页 */
.pagination-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .topic-card {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  
  .topic-cover {
    align-self: center;
  }
  
  .cover-image {
    width: 100%;
    height: 120px;
  }
  
  .topic-title {
    font-size: 16px;
  }
  
  .topic-synopsis {
    font-size: 13px;
  }
  
  .topic-stats {
    gap: 12px;
  }
  
  .stat-item {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .topic-card {
    padding: 12px;
  }
  
  .topic-stats {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .topic-author {
    flex-wrap: wrap;
    gap: 6px;
  }
}
</style>