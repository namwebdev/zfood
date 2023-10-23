import { createApp } from "vue";
import "./assets/index.css";
import App from "./App.vue";
import clickOutside from "./directives/click-outside";
import loading from "./directives/loading/loading";

const app = createApp(App);

app.directive("click-outside", clickOutside);
app.directive("loading", loading);

app.mount("#app");
