import Vue from "vue";
import App from "./App.vue";
import "./plugins/element.js";
import router from "./router";
import "./style.css";

Vue.config.productionTip = false;

import http from "./http";
Vue.prototype.$http = http;

import astar from "./astar";
Vue.prototype.$astar = astar;


import store from "./store";
const io = require("io");
const socket = io.connect("http://localhost:4101");

socket.on("record", (data) => {
  store.commit("recordAdd", data.record);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");