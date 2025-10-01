const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: 82,
    // 配置跨域-请求后端的接口
    proxy: { 
     "/api": {
       target: "http://127.0.0.1:9999", //对应自己的接口
       changeOrigin: true,
       ws: true,
       pathRewrite: {
         "^/api": " "
       }
     }
    }
  }
})
