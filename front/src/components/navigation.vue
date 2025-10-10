<template>
  <div class="nav-container">
    <nav class="nav">
      <div class="nav-brand">
        <img :src="require('../assets/logo.png')" alt="闪电鼠" class="nav-logo">
        <h1 class="nav-title">闪电鼠</h1>
      </div>
      
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/Home" class="nav-link" :class="{ 'nav-link--active': ifActive === 1 }">
            <i class="el-icon-house"></i>
            <span>首页</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Community" class="nav-link" :class="{ 'nav-link--active': ifActive === 2 }">
            <i class="el-icon-chat-dot-round"></i>
            <span>社区</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Official" class="nav-link" :class="{ 'nav-link--active': ifActive === 3 }">
            <i class="el-icon-office-building"></i>
            <span>官方</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Resources" class="nav-link" :class="{ 'nav-link--active': ifActive === 4 }">
            <i class="el-icon-folder-opened"></i>
            <span>资源</span>
          </router-link>
        </li>
      </ul>
      
      <div class="nav-actions">
        <el-button 
          v-if="token" 
          type="primary" 
          icon="el-icon-edit" 
          size="small" 
          class="create-btn" 
          @click="goCreatePage()">
          创作中心
        </el-button>
        
        <div class="user-avatar" @click="goUserInfo()">
          <el-avatar 
            :src="avatar || Avatar" 
            :size="36"
            class="avatar">
            <i v-if="!avatar" class="el-icon-user"></i>
          </el-avatar>
          <div class="avatar-indicator" :class="{ 'avatar-indicator--online': token }"></div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "navigation",
  data() {
    return {
      ifActive: 0,
      avatar: "",
      Avatar: "https://browne.oss-cn-shenzhen.aliyuncs.com/Avatar.jpg",
      token: "",
    };
  },
  // props: ['active'],
  created() {
    if (localStorage.getItem("token")) {
      this.avatar = JSON.parse(localStorage.getItem("userInfo")).avatar;
      // console.log(JSON.parse(localStorage.getItem("userInfo")));
      this.token = localStorage.getItem("token");
    }
  },
  mounted() {
    this.mobileMenu = document.querySelector(".mobile-menu");
    this.navList = document.querySelector(".nav-list");
    this.navLinks = document.querySelectorAll(".nav-list li");
    this.activeClass = "active";
    this.handleClick = this.handleClick.bind(this);
    this.init();
    this.changeTag();
  },
  methods: {
    animateLinks() {
      this.navLinks.forEach((link, index) => {
        link.style.animation
          ? (link.style.animation = "")
          : (link.style.animation = `navLinkFade 0.5s ease forwards ${
              index / 7 + 0.3
            }s`);
      });
    },
    handleClick() {
      this.navList.classList.toggle(this.activeClass);
      this.mobileMenu.classList.toggle(this.activeClass);
      this.animateLinks();
    },
    addClcikEvent() {
      this.mobileMenu.addEventListener("click", this.handleClick);
    },
    init() {
      if (this.mobileMenu) {
        this.addClcikEvent();
      }
      return this;
    },
    changeTag() {
      if (this.$route.path == "/Home" || this.$route.path == "/") {
        this.ifActive = 1;
      } else if (this.$route.path == "/Community") {
        this.ifActive = 2;
      } else if (this.$route.path == "/Official") {
        this.ifActive = 3;
      } else if (this.$route.path == "/Resources") {
        this.ifActive = 4;
      } else if (this.$route.path == "/Wiki") {
        this.ifActive = 5;
      }
    },
    goCreatePage() {
      this.$router.push("/CreateTopic");
    },
    goUserInfo() {
      var token = localStorage.getItem("token");
      if (token) {
        this.$router.push("/UserInfo");
      } else {
        this.$router.push("/Login");
      }
    },
  },
};
</script>

<style scoped>
.nav-container {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  height: 64px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.nav-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.nav-title {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 14px;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link--active {
  color: white;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link i {
  font-size: 16px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.create-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;
}

.create-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: border-color 0.3s ease;
}

.user-avatar:hover .avatar {
  border-color: rgba(255, 255, 255, 0.6);
}

.avatar-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
  border: 2px solid white;
  transition: background-color 0.3s ease;
}

.avatar-indicator--online {
  background: var(--success-color);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav {
    padding: 0 16px;
  }
  
  .nav-menu {
    gap: 4px;
  }
  
  .nav-link {
    padding: 10px 16px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 0 12px;
    height: 56px;
  }
  
  .nav-title {
    font-size: 18px;
  }
  
  .nav-logo {
    width: 32px;
    height: 32px;
  }
  
  .nav-menu {
    gap: 2px;
  }
  
  .nav-link {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link i {
    font-size: 14px;
  }
  
  .create-btn span {
    display: none;
  }
  
  .create-btn .el-icon-edit {
    margin-right: 0;
  }
}

@media (max-width: 480px) {
  .nav-brand {
    gap: 8px;
  }
  
  .nav-title {
    font-size: 16px;
  }
  
  .nav-actions {
    gap: 12px;
  }
}
</style>