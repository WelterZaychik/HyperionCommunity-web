<template>
  <div class="im-container">
    <navigation></navigation>
    <div class="im-content">
      <el-row :gutter="20">
        <!-- 关注列表 -->
        <el-col :span="8">
          <el-card class="user-list-card">
            <div slot="header" class="user-list-header">
              <span>我的关注</span>
              <el-tag size="mini" type="info">点击用户开始聊天</el-tag>
            </div>
            <div v-for="user in followList" :key="user.account" 
                 class="user-item" @click="selectUser(user)">
              <el-avatar :src="user.avatar" size="small"></el-avatar>
              <span class="username">{{ user.name }}</span>
              <i class="el-icon-chat-dot-round chat-icon" 
                 :class="{ active: currentChatUser && currentChatUser.account === user.account }"></i>
              <el-tag v-if="isUserOnline(user.account)" size="mini" type="success" class="online-tag">在线</el-tag>
            </div>
          </el-card>
        </el-col>

        <!-- 聊天主界面 -->
        <el-col :span="10">
          <div class="chat-box">
            <div class="chat-header">
              与 {{ currentChatUser ? currentChatUser.name : '未选择用户' }} 的对话
              <el-tag v-if="currentChatUser && !isMutualFollow(currentChatUser.account)" 
                     type="warning" size="mini">
                对方未关注您
              </el-tag>
            </div>
            <div class="message-container" ref="messageContainer">
              <div v-for="(msg, index) in filteredMessages" :key="index" 
                     :class="['message-item', msg.from === user.account ? 'sent' : 'received']">
                  <div class="avatar">
                    <el-avatar :src="msg.from === user.account ? user.avatar : (msg.avatar || defaultAvatar)"></el-avatar>
                  </div>
                  <div class="message-content">
                    <div class="message-meta">
                      <span class="username">{{ msg.fromName || msg.from }}</span>
                      <span class="time">{{ formatTime(msg.timestamp) }}</span>
                    </div>
                    <div class="message-bubble">{{ msg.text }}</div>
                  </div>
                </div>
              </div>
            <div class="input-area">
              <el-input type="textarea" :rows="4" v-model="messageText" 
                       placeholder="输入消息..." @keyup.enter.native="sendMessage"
                       :disabled="!currentChatUser"></el-input>
              <div class="send-button">
                <el-button type="primary" :loading="sending" @click="sendMessage" 
                          :disabled="!messageText.trim() || !currentChatUser">
                  发送
                </el-button>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 消息通知栏 -->
        <el-col :span="6">
          <el-card class="notification-card">
            <div slot="header" class="notification-header">
              <span>消息通知</span>
              <el-badge :value="unreadNotificationCount" class="badge"></el-badge>
            </div>
            <div v-for="notif in notifications" :key="notif.from" 
                 class="notification-item" @click="openChatFromNotification(notif)">
              <el-avatar :src="getUserAvatar(notif.from)" size="small"></el-avatar>
              <div class="notification-content">
                <div class="notification-user">{{ notif.fromName }}</div>
                <div class="notification-text">{{ notif.text | truncate(20) }}</div>
                <div class="notification-time">{{ formatTime(notif.timestamp) }}</div>
              </div>
              <div class="notification-actions" @click.stop>
                <el-dropdown trigger="click" @command="(command) => handleNotificationCommand(notif, command)">
                  <i class="el-icon-more" style="cursor: pointer;"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="deleteHistory">删除聊天记录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import navigation from "@/components/navigation.vue";
import DOMPurify from "dompurify";
import followsApi from "../api/follows";
import { throttle, debounce } from 'lodash';

// 防抖保存到本地存储的函数
const debouncedSave = debounce((key, value, callback) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    if (callback) callback();
  } catch (error) {
    console.error(`保存${key}到本地存储失败:`, error);
    callback && callback(error);
  }
}, 1000);

// 防抖读取本地存储的函数 - 避免短时间内多次重复读取
const debouncedLoad = debounce((key, defaultValue, callback) => {
  try {
    const data = localStorage.getItem(key);
    callback(null, data ? JSON.parse(data) : defaultValue);
  } catch (error) {
    console.error(`从本地存储读取${key}失败:`, error);
    callback(error, defaultValue);
  }
}, 100);

// 消息比较函数，用于高效查找重复消息
const messageComparator = (msg1, msg2) => {
  return msg1.id === msg2.id || 
         (msg1.from === msg2.from && 
          msg1.to === msg2.to && 
          msg1.timestamp === msg2.timestamp && 
          msg1.text === msg2.text);
};

// 用户查找函数，支持多种数据源
const findUserByAccount = (account, sources = []) => {
  for (const source of sources) {
    if (source instanceof Map) {
      const user = source.get(account);
      if (user) return user;
    } else if (Array.isArray(source)) {
      const user = source.find(u => u.account === account);
      if (user) return user;
    }
  }
  return null;
};

// 高效的消息过滤函数
const filterMessagesByUsers = (messages, account1, account2) => {
  // 创建消息索引，提高重复查找效率
  const messageIndex = new Map();
  const result = [];
  
  for (const msg of messages) {
    // 检查消息是否在两个账户之间
    const isBetweenUsers = 
      (msg.from === account1 && msg.to === account2) ||
      (msg.from === account2 && msg.to === account1);
    
    if (isBetweenUsers) {
      // 使用消息ID作为唯一键，避免重复
      if (!messageIndex.has(msg.id)) {
        messageIndex.set(msg.id, true);
        result.push(msg);
      }
    }
  }
  
  // 按时间戳排序
  return result.sort((a, b) => a.timestamp - b.timestamp);
};

export default {
  name: "Im",
  components: { navigation },
  data() {
    return {
      user: this.loadFromLocalStorage("userInfo", {}),
      followList: [],
      onlineUsers: [],
      currentChatUser: null,
      messageText: "",
      messages: this.loadFromLocalStorage("chatMessages", []),
      sending: false,
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userAvatar: "https://browne.oss-cn-shenzhen.aliyuncs.com/Avatar.jpg",
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
      reconnectDelay: 1000,
      mutualFollows: new Set(),
      // 通知相关数据 - 从localStorage加载
      notifications: this.loadFromLocalStorage("notifications", []),
      notificationUsers: new Map(this.loadFromLocalStorage("notificationUsers", [])),
      // 添加未读通知计数属性
      unreadNotificationCount: 0
    };
  },
  computed: {
    filteredMessages() {
      if (!this.currentChatUser) return [];
      return this.messages
        .filter(msg => 
          (msg.from === this.currentChatUser.account && msg.to === this.user.account) ||
          (msg.from === this.user.account && msg.to === this.currentChatUser.account)
        )
        .sort((a, b) => a.timestamp - b.timestamp);
    },
  },
  watch: {
    messages: {
      handler(newVal) {
        // 使用防抖优化本地存储写入
        debouncedSave("chatMessages", newVal, (error) => {
          if (error) {
            this.$message.error(`数据保存失败，请检查浏览器存储空间`);
          }
        });
      },
      deep: true,
    },
    // 添加notifications的watch
    notifications: { 
      handler(newVal) {
        // 使用防抖优化本地存储写入
        debouncedSave("notifications", newVal, (error) => {
          if (error) {
            this.$message.error(`通知数据保存失败`);
          }
        });
      },
      deep: true,
    },
    // 添加notificationUsers的watch，需要将Map转换为数组存储
    notificationUsers: {
      handler(newVal) {
        // 使用防抖优化本地存储写入
        debouncedSave("notificationUsers", Array.from(newVal.entries()), (error) => {
          if (error) {
            this.$message.error(`用户信息数据保存失败`);
          }
        });
      },
      deep: true,
    },
    currentChatUser(newUser) {
      if (newUser) {
        // 只在本地没有该用户相关消息时才请求历史消息
        const hasMessages = this.messages.some(msg => 
          (msg.from === newUser.account && msg.to === this.user.account) ||
          (msg.from === this.user.account && msg.to === newUser.account)
        );
        if (!hasMessages) {
          this.requestHistory(newUser.account);
        } else {
          this.$nextTick(this.scrollToBottom);
        }
      }
    },
  },
  filters: {
    truncate(value, length) {
      return value.length > length ? value.substring(0, length) + '...' : value;
    }
  },
  mounted() {
    this.fetchFollowList(this.user.id);
    this.initWebSocket();
    window.addEventListener("beforeunload", this.closeSocket);
    window.addEventListener("focus", this.handleWindowFocus);
  },
  beforeDestroy() {
    this.closeSocket();
    window.removeEventListener("beforeunload", this.closeSocket);
    window.removeEventListener("focus", this.handleWindowFocus);
  },
  methods: {
    // 统一的本地存储管理方法 - 优化版
    saveToLocalStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`保存${key}到本地存储失败:`, error);
        this.$message.error(`数据保存失败，请检查浏览器存储空间`);
      }
    },

    // 从本地存储读取数据 - 优化版
    loadFromLocalStorage(key, defaultValue = null) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (error) {
        console.error(`从本地存储读取${key}失败:`, error);
        return defaultValue;
      }
    },

    async fetchFollowList(id) {
      try {
        const response = await followsApi.getFollows(id);
        this.followList = response.data.followsList;
        this.checkMutualFollows();
      } catch (error) {
        console.error("获取关注列表失败:", error);
        this.$message.error("获取关注列表失败");
      }
    },
    
    async checkMutualFollows() {
      try {
        const response = await followsApi.checkMutualFollows(this.user.id);
        this.mutualFollows = new Set(response.data.mutualFollows);
      } catch (error) {
        console.error("检查互关关系失败:", error);
      }
    },
    
    isMutualFollow(account) {
      // 由于没有后端接口提供互相关注状态，暂时默认返回true，避免显示"对方未关注您"标签
      return true;
    },
    
    // 处理通知项的命令 - 修改为专注于删除聊天记录功能
    handleNotificationCommand(notification, command) {
      if (command === 'deleteHistory') {
        this.$confirm('确定要删除与该用户的所有聊天记录吗？', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const account = notification.from;
          // 创建事务性删除操作
          const deleteOperation = () => {
            // 1. 删除与该用户相关的所有消息记录
            this.messages = this.messages.filter(msg => 
              !(msg.from === account && msg.to === this.user.account) &&
              !(msg.from === this.user.account && msg.to === account)
            );
            // 2. 删除对应的通知项
            this.notifications = this.notifications.filter(n => n.from !== account);
            // 3. 从notificationUsers中移除用户信息
            this.notificationUsers.delete(account);
            // 4. 立即保存更新后的消息到localStorage，确保chatMessages被清除
            localStorage.setItem('chatMessages', JSON.stringify(this.messages));
          };
    
          try {
            // 首先向后端发送删除请求
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
              const deleteRequest = {
                type: 'deleteHistory',
                account: this.user.account,
                withAccount: account
              };
              this.socket.send(JSON.stringify(deleteRequest));
            }
            
            // 然后执行本地删除操作
            deleteOperation();
            this.$message.success('聊天记录已成功删除');
          } catch (error) {
            console.error('删除聊天记录失败:', error);
            this.$message.error('删除失败，请稍后重试');
          }
        }).catch(() => {
          // 用户取消删除操作
        });
      }
    },
    
    isUserOnline(account) {
      return this.onlineUsers.some(user => user.account === account);
    },
    
    initWebSocket() {
      if (!this.user.account) {
        this.$message.error("请先登录");
        return;
      }

      const socketUrl = `ws://${window.location.hostname}:9292/imserver`;
      this.socket = new WebSocket(socketUrl);

      this.socket.onopen = () => {
        console.log("WebSocket连接已建立");
        this.reconnectAttempts = 0;
        this.registerUser();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleSocketMessage(data);
        } catch (error) {
          console.error("消息解析错误:", error);
        }
      };

      this.socket.onclose = () => {
        console.log("WebSocket连接关闭");
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket错误:", error);
      };
    },

    handleSocketMessage(data) {
      switch (data.type) {
        case "onlineUsers":
          this.handleOnlineUsers(data);
          break;
        case "history":
          this.handleHistoryMessages(data.messages);
          break;
        case "notifications":
          this.handleNotificationsResponse(data);
          break;
        case "newNotification":
          this.handleNewNotification(data);
          break;
        case "error":
          this.handleError(data);
          break;
        case "deleteHistory":
          // 处理后端返回的删除历史记录成功响应
          if (data.status === "success") {
            console.log("后端历史记录删除成功");
            // 可以在这里添加额外的处理逻辑，如更新UI状态等
          }
          break;
        default:
          this.handleChatMessage(data);
      }
    },

    registerUser() {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const connectMsg = {
          type: "register",
          account: this.user.account,
          username: this.user.name,
        };
        this.socket.send(JSON.stringify(connectMsg));
      }
    },

    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        // 指数退避算法：基础延迟 * (2^重连次数)，但不超过最大延迟
        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 5000);

        console.log(`尝试第 ${this.reconnectAttempts} 次重连，等待 ${delay}ms`);
        setTimeout(() => {
          this.initWebSocket();
        }, delay);
      } else {
        this.$message.error("连接失败，请刷新页面");
      }
    },

    handleOnlineUsers(data) {
      this.onlineUsers = data.users.filter(user => user.account !== this.user.account);
    },

    handleHistoryMessages(messages) {
      // 优化的历史消息处理，避免重复添加
      messages.forEach(msg => {
        // 使用消息比较函数检查是否已存在该消息
        if (!this.messages.some(m => messageComparator(m, msg))) {
          this.messages.push(msg);
        }
      });
      this.$nextTick(this.scrollToBottom);
    },

    handleNotificationsResponse(data) {
      // 创建一个Map，用于按发送者账号分组存储最新的通知
      const notificationMap = new Map();
      
      // 首先添加本地已有的通知
      this.notifications.forEach(notification => {
        notificationMap.set(notification.from, notification);
      });
      
      // 然后用服务器返回的通知更新，只保留最新的通知
      if (data.notifications && data.notifications.length > 0) {
        data.notifications.forEach(notification => {
          // 如果该发送者没有通知，或者当前通知的时间戳更新，则更新
          if (!notificationMap.has(notification.from) || 
              notification.timestamp > notificationMap.get(notification.from).timestamp) {
            notificationMap.set(notification.from, notification);
            
            // 为该发送者添加到notificationUsers（如果不存在）
            this.addNotificationUser(notification.from, notification.fromName);
          }
        });
      }
      
      // 转换为数组并按时间戳排序
      this.notifications = Array.from(notificationMap.values())
        .sort((a, b) => b.timestamp - a.timestamp);
    },

    handleNewNotification(data) {
      const notification = data.notification;
      // 从data中获取头像信息（可能在message或notification对象中）
      const avatar = data.message?.avatar || this.defaultAvatar;
      this.addNotificationUser(notification.from, notification.fromName, avatar);
      
      // 检查是否已存在该发送者的通知
      const existingIndex = this.notifications.findIndex(n => n.from === notification.from);
      
      if (existingIndex >= 0) {
        // 如果存在，更新为最新的通知
        this.notifications.splice(existingIndex, 1, notification);
      } else {
        // 如果不存在，添加到列表顶部
        this.notifications.unshift(notification);
      }
      
      // 重新排序，确保最新的通知在最前面
      this.notifications.sort((a, b) => b.timestamp - a.timestamp);
      
      this.showDesktopNotification(notification);
    },

    addNotificationUser(account, name, avatar = null) {
      if (!this.notificationUsers.has(account)) {
        this.notificationUsers.set(account, {
          account: account,
          name: name,
          avatar: avatar || this.defaultAvatar
        });
      } else if (avatar) {
        // 如果已经存在该用户但有了新的头像信息，更新头像
        const user = this.notificationUsers.get(account);
        if (user.avatar === this.defaultAvatar) {
          user.avatar = avatar;
        }
      }
    },

    handleError(data) {
      this.$message.error(data.message || "发生错误");
      if (data.type === "message") {
        this.sending = false;
      }
    },

    handleChatMessage(data) {
      // 优化的消息处理
      if (!this.messages.some((msg) => msg.id === data.id)) {
        this.messages.push(data);
        
        // 如果消息中有头像信息，更新notificationUsers
        if (data.avatar) {
          this.addNotificationUser(data.from, data.fromName, data.avatar);
        }
        
        if (this.currentChatUser && data.from === this.currentChatUser.account) {
          this.$nextTick(this.scrollToBottom);
        }
      }
    },

    selectUser(user) {
      this.currentChatUser = user;
      // 不再清空当前消息列表，而是依赖watch中的逻辑
      // watch中的currentChatUser会自动处理消息加载
    },

    requestHistory(account) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const request = {
          type: "getHistory",
          account: this.user.account,
          withAccount: account,
          limit: 50
        };
        this.socket.send(JSON.stringify(request));
      }
    },

    openChatFromNotification(notification) {
      // 使用优化的用户查找函数
      let user = findUserByAccount(notification.from, [this.notificationUsers, this.followList]);
      
      // 如果找不到用户，创建一个临时用户对象
      if (!user) {
        user = {
          account: notification.from,
          name: notification.fromName || `用户${notification.from}`,
          avatar: this.defaultAvatar
        };
        // 将临时用户添加到notificationUsers中，以便下次使用
        this.notificationUsers.set(notification.from, user);
      }
      
      this.currentChatUser = user;
      this.$nextTick(this.scrollToBottom);
    },

    sendMessage: throttle(function() {
      if (!this.validateMessage()) return;

      const message = {
        type: "message",
        from: this.user.account,
        to: this.currentChatUser.account,
        text: DOMPurify.sanitize(this.messageText.trim()),
        timestamp: Date.now(),
        avatar: this.user.avatar || this.defaultAvatar // 添加发送者头像信息
      };

      this.sending = true;

      try {
        this.socket.send(JSON.stringify(message));
        this.messages.push({
          ...message,
          fromName: this.user.name,
          toName: this.currentChatUser.name,
          id: this.generateMessageId(),
          delivered: false
        });
        this.messageText = "";
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("发送失败:", error);
        this.$message.error("消息发送失败");
      } finally {
        this.sending = false;
      }
    }, 1000, { leading: true, trailing: false }),

    validateMessage() {
      if (!this.currentChatUser) {
        this.$message.warning("请选择聊天对象");
        return false;
      }
      if (!this.messageText.trim()) {
        this.$message.warning("消息内容不能为空");
        return false;
      }
      if (this.socket.readyState !== WebSocket.OPEN) {
        this.$message.error("连接未就绪");
        return false;
      }
      return true;
    },

    generateMessageId() {
      return `${this.user.account}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) container.scrollTop = container.scrollHeight;
    },

    showDesktopNotification(notification) {
      if (!("Notification" in window)) return;
      
      if (Notification.permission === "granted") {
        new Notification(`新消息来自 ${notification.fromName}`, {
          body: notification.text,
          icon: this.defaultAvatar
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(`新消息来自 ${notification.fromName}`, {
              body: notification.text,
              icon: this.defaultAvatar
            });
          }
        });
      }
    },

    getUserAvatar(account) {
      // 使用优化的用户查找函数
      const user = findUserByAccount(account, [this.followList, this.notificationUsers]);
      return user?.avatar || this.defaultAvatar;
    },

    closeSocket() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    },

    handleWindowFocus() {
      // 简化：不再处理未读通知状态
      this.isMinimized = false;
    },
    beforeUnmount() {
      this.closeSocket();
    },
  },
};
</script>

<style scoped>
.im-container {
  
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.im-content {
  padding: 20px;
  flex: 1;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.chat-box {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-weight: bold;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.message-container {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
  max-width: 80%;
}

.message-item.sent {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-item.received {
  align-self: flex-start;
  flex-direction: row;
}

.avatar {
  margin: 0 10px;
  align-self: flex-end;
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-meta {
  margin-bottom: 5px;
  font-size: 12px;
  color: #999;
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-meta .username {
  font-weight: bold;
}

.message-meta .time {
  color: #bbb;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  word-break: break-word;
  line-height: 1.5;
}

.message-item.sent .message-bubble {
  background-color: #67c23a;
  color: white;
}

.message-item.received .message-bubble {
  background-color: #409eff;
  color: white;
}

.input-area {
  padding: 15px;
}

.send-button {
  margin-top: 10px;
  text-align: right;
}

.notification-card {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-item {
  display: flex;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f5f5f5;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-content {
  margin-left: 10px;
  flex: 1;
  overflow: hidden;
}

.notification-user {
  font-weight: bold;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-text {
  color: #666;
  font-size: 13px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  color: #999;
  font-size: 12px;
}

.badge {
  margin-left: 10px;
}

.user-list-card {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.user-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
  position: relative;
}

.user-item:hover {
  background-color: #f5f5f5;
}

.username {
  margin-left: 10px;
  flex-grow: 1;
}

.chat-icon {
  color: #ccc;
  font-size: 16px;
  margin-right: 25px;
}

.chat-icon.active {
  color: #67c23a;
}

.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background-color: #f56c6c;
  border-radius: 10px;
  color: white;
  font-size: 12px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.online-tag {
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
}

.el-tag {
  margin-left: 5px;
}
</style>