const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:7123",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
      },
    },
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss"; @import "~@/styles/functions.scss"; @import "~@/styles/mixins.scss";`,
      },
    },
  },
});
