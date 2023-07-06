import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import router from "./router.js";
import { createPinia } from "pinia";
import axios from "axios";

// router.beforeEach((to, from, next) => {
//   window.scrollTo(0, 0);
//   next();
// });

const pinia = createPinia();

const app = createApp(App).use(Antd).use(router).use(pinia);

const token = localStorage.getItem("token");
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

app.mount("#app");
