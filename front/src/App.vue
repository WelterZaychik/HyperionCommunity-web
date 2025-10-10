<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <el-backtop :visibility-height="200" :bottom="120">
      <div class="backtop-content">
        <i class="el-icon-arrow-up"></i>
      </div>
    </el-backtop>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
:root {
  --primary-color: #3a6ea5;
  --primary-hover: #2c5282;
  --secondary-color: #667eea;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --danger-color: #f56565;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-primary: #2d3748;
  --text-secondary: #718096;
  --text-muted: #a0aec0;
  --border-color: #e2e8f0;
  --border-radius: 8px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  line-height: 1.6;
  color: var(--text-primary);
}

a {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-color);
}

.contentBody {
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  min-height: 90vh;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.leftBox {
  margin-top: 25px;
  width: 100%;
  max-width: 850px;
  min-height: 1000px;
  flex: 1;
}

.rightBox {
  margin-top: 25px;
  margin-left: 30px;
  width: 300px;
  height: 100%;
  flex-shrink: 0;
}

.Footer {
  width: 100%;
  height: 100px;
  background: #23232e;
  margin-top: 80px;
  position: relative;
  z-index: 999;
  text-align: center;
  padding-top: 30px;
  box-sizing: border-box;
}

.Footer-content {
  color: #ffffff8a;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.backtop-content {
  text-align: center;
  line-height: 40px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.backtop-content:hover {
  background: var(--primary-hover);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .contentBody {
    flex-direction: column;
    padding: 0 16px;
  }
  
  .leftBox {
    width: 100%;
    max-width: none;
    margin-right: 0;
  }
  
  .rightBox {
    width: 100%;
    margin-left: 0;
    margin-top: 20px;
  }
}

@media (max-width: 768px) {
  .contentBody {
    padding: 0 12px;
  }
  
  .leftBox,
  .rightBox {
    margin-top: 15px;
  }
}

/* 卡片通用样式 */
.card {
  background: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* 加载动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
