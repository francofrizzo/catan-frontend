const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss"; @import "~@/styles/functions.scss"; @import "~@/styles/mixins.scss";`,
      },
    },
  },
});
