const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/variables.scss"; @import "~@/styles/functions.scss"; @import "~@/styles/mixins.scss";`,
      },
    },
  },
});
