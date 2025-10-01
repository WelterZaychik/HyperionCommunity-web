<template>
  <div class="im-container">
    <navigation></navigation>
    <div class="im-content">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="chat-box">
            <div class="chat-header">
              与 {{ chatUser ? chatUser.name : '未选择用户' }} 的对话
            </div>
            <div class="message-container" ref="messageContainer">
              <div v-for="(msg, index) in filteredMessages" :key="index" 
                   :class="['message-item', msg.from === user.account ? 'sent' : 'received']">
                <div class="avatar">
                  <el-avatar :src="msg.from === user.account ? userAvatar : defaultAvatar"></el-avatar>
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
              <el-input type="textarea" :rows="4" v-model="text" placeholder="输入消息..." @keyup.enter.native="sendMessage"></el-input>
              <div class="send-button">
                <el-button type="primary" :loading="sending" @click="sendMessage" :disabled="!text.trim() || !chatUser">
                  发送
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <el-card class="user-list-card">
            <div slot="header" class="user-list-header">
              <span>在线用户</span>
              <el-tag size="mini" type="info">点击用户开始聊天</el-tag>
            </div>
            <div v-for="user in onlineUsers" :key="user.account" 
                 class="user-item" @click="selectUser(user)">
              <el-avatar :src="defaultAvatar" size="small"></el-avatar>
              <span class="username">{{ user.name }}</span>
              <i class="el-icon-chat-dot-round chat-icon" 
                 :class="{ active: chatUser && chatUser.account === user.account }"></i>
              <span v-if="unreadMessages[user.account]" class="unread-badge">
                {{ unreadMessages[user.account] > 9 ? '9+' : unreadMessages[user.account] }}
              </span>
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

export default {
  name: "Im",
  components: { navigation },
  data() {
    return {
      user: JSON.parse(localStorage.getItem("userInfo")) || {},
      socket: null,
      onlineUsers: [],
      chatUser: null,
      text: "",
      messages: JSON.parse(localStorage.getItem("chatMessages") || "[]"),
      sending: false,
      defaultAvatar: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      userAvatar: "https://browne.oss-cn-shenzhen.aliyuncs.com/Avatar.jpg",
      unreadMessages: JSON.parse(localStorage.getItem("unreadMessages") || "{}"),
      reconnectAttempts: 0,
      maxReconnectAttempts: 5,
    };
  },
  computed: {
    filteredMessages() {
      if (!this.chatUser) return [];
      return this.messages
        .filter(
          (msg) =>
            (msg.from === this.chatUser.account && msg.to === this.user.account) ||
            (msg.from === this.user.account && msg.to === this.chatUser.account)
        )
        .sort((a, b) => a.timestamp - b.timestamp);
    },
  },
  watch: {
    messages: {
      handler(newVal) {
        localStorage.setItem("chatMessages", JSON.stringify(newVal));
      },
      deep: true,
    },
    unreadMessages: {
      handler(newVal) {
        localStorage.setItem("unreadMessages", JSON.stringify(newVal));
      },
      deep: true,
    },
  },
  mounted() {
    this.initWebSocket();
    window.addEventListener("beforeunload", this.closeSocket);
  },
  beforeDestroy() {
    this.closeSocket();
    window.removeEventListener("beforeunload", this.closeSocket);
  },
  methods: {
    initWebSocket() {
      if (!this.user.account) {
        this.$message.error("请先登录");
        return;
      }

      const socketUrl = `ws://localhost:9292/imserver`;
      this.socket = new WebSocket(socketUrl);

      this.socket.onopen = () => {
        console.log("WebSocket连接已建立");
        this.reconnectAttempts = 0;
        this.registerUser();
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === "onlineUsers") {
            this.handleOnlineUsers(data);
          } else if (data.type === "history") {
            this.handleHistoryMessages(data.messages);
          } else {
            this.handleIncomingMessage(data);
          }
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
        this.attemptReconnect();
      };
    },

    registerUser() {
      if (this.socket.readyState === WebSocket.OPEN) {
        const connectMsg = {
          type: "connect",
          account: this.user.account,
          username: this.user.name,
        };
        this.socket.send(JSON.stringify(connectMsg));
      }
    },

    attemptReconnect() {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * this.reconnectAttempts, 5000);

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
      messages.forEach(msg => {
        if (!this.messages.some(m => m.id === msg.id)) {
          this.messages.push(msg);
        }
      });
      this.$nextTick(this.scrollToBottom);
    },

    handleIncomingMessage(data) {
      if (!this.messages.some((msg) => msg.id === data.id)) {
        this.messages.push(data);

        // 更新未读消息计数
        if (data.from !== this.user.account && (!this.chatUser || data.from !== this.chatUser.account)) {
          this.$set(
            this.unreadMessages,
            data.from,
            (this.unreadMessages[data.from] || 0) + 1
          );
        }

        // 如果是当前聊天对象的消息，自动滚动
        if (this.chatUser && data.from === this.chatUser.account) {
          this.$nextTick(this.scrollToBottom);
        }
      }
    },

    selectUser(user) {
      this.chatUser = user;
      this.$set(this.unreadMessages, user.account, );
      
      // 请求历史消息
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        const request = {
          type: "getHistory",
          account: this.user.account,
          withAccount: user.account,
        };
        this.socket.send(JSON.stringify(request));
      }
      
      this.$nextTick(this.scrollToBottom);
    },

    sendMessage() {
      if (!this.validateMessage()) return;

      const message = {
        from: this.user.account,
        to: this.chatUser.account,
        text: DOMPurify.sanitize(this.text.trim()),
        timestamp: Date.now(),
      };

      this.sending = true;

      try {
        this.socket.send(JSON.stringify(message));
        // 本地添加消息，包含用户名信息
        this.messages.push({
          ...message,
          fromName: this.user.name,
          toName: this.chatUser.name,
          id: this.generateMessageId()
        });
        this.text = "";
        this.$nextTick(this.scrollToBottom);
      } catch (error) {
        console.error("发送失败:", error);
        this.$message.error("消息发送失败");
      } finally {
        this.sending = false;
      }
    },

    validateMessage() {
      if (!this.chatUser) {
        this.$message.warning("请选择聊天对象");
        return false;
      }
      if (!this.text.trim()) {
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
      return new Date(timestamp).toLocaleTimeString();
    },

    scrollToBottom() {
      const container = this.$refs.messageContainer;
      if (container) container.scrollTop = container.scrollHeight;
    },

    closeSocket() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    },
  },
};
</script>

<style scoped>
.im-container {
  padding: 20px;
}

.im-content {
  margin-top: 30px;
  margin-bottom: 50px;
}

.chat-box {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-weight: bold;
  background-color: #f9f9f9;
}

.message-container {
  height: 350px;
  padding: 10px;
  overflow-y: auto;
  border-bottom: 1px solid #eee;
}

.message-item {
  display: flex;
  margin-bottom: 15px;
}

.message-item.sent {
  flex-direction: row-reverse;
}

.message-item.received {
  flex-direction: row;
}

.avatar {
  margin: 0 10px;
}

.message-content {
  max-width: 70%;
}

.message-meta {
  margin-bottom: 5px;
  font-size: 12px;
  color: #999;
}

.message-meta .username {
  font-weight: bold;
  margin-right: 10px;
}

.message-meta .time {
  color: #bbb;
}

.message-bubble {
  padding: 10px 15px;
  border-radius: 18px;
  display: inline-block;
  word-break: break-word;
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

.user-list-card {
  height: 100%;
}

.user-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
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
</style>