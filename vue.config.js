const { defineConfig } = require('@vue/cli-service')
const target = process.env.VUE_APP_CONSOLE_URL
let port = 9999
module.exports = defineConfig({
  //第三方依赖是否需要转移,避免出现第三方的转移
  transpileDependencies: true,
  //是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。这个值会在 @vue/cli-plugin-eslint 被安装之后生效。
  lintOnSave: false,
  //代理端口配置
  devServer: {
    // 是否自动打开浏览器
    open: false,
    // 代理的地址
    port,
    // 配置代理
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  }
})
