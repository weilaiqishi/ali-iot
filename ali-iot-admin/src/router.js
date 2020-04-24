import Vue from "vue";
import Router from "vue-router";
import Main from "./views/Main.vue";
import DeviceEdit from "./views/DeviceEdit.vue";
import DeviceList from "./views/DeviceList.vue";
import TheMapEdit from "./views/TheMap/TheMapEdit.vue";
import TheMapList from "./views/TheMap/TheMapList.vue";
import TheMapContent from "./views/TheMap/TheMapContent.vue";
import RecordList from "./views/RecordList.vue";
Vue.use(Router);

import testRouter from "./views/test/router.js";

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
      children: [
        { path: "/device/create", component: DeviceEdit },
        { path: "/device/edit/:id", component: DeviceEdit, props: true },
        { path: "/device/list", component: DeviceList },
        { path: "/theMap/create", component: TheMapEdit },
        { path: "/theMap/edit/:id", component: TheMapEdit, props: true },
        { path: "/theMap/list", component: TheMapList },
        { path: "/theMap/content/:id", component: TheMapContent, props: true },
        { path: "/record/list", component: RecordList },
      ].concat(testRouter),
    },
  ],
});

export default router;
