import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "@/styles/global.scss";

import toastr from "toastr";
toastr.options.positionClass = "toast-top-center";
toastr.options.showDuration = 200;
toastr.options.hideDuration = 200;
import "toastr/build/toastr.css";

import "@/styles/vendors.scss";

createApp(App).use(store).use(router).mount("#app");
