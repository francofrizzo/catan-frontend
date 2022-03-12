const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  publicPath:
    process.env.NODE_ENV === "production"
      ? "https://francofrizzo.com/catan"
      : "/",
  devServer: {
    proxy: {
      "^/catan/api": {
        target: "http://localhost:7123",
        changeOrigin: true,
        pathRewrite: { "^/catan/api": "" },
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
