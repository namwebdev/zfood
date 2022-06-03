import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/css/index.css";

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PerfectScrollbar)

app.config.globalProperties.$filter = {
  formatCurrency(value) {
    return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  },
};

app.mount("#app");
