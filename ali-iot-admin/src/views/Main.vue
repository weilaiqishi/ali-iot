<template>
  <el-container style="height: 100vh;">
    <el-aside
      :width="elAsideWidth"
      style="background-color: rgb(238, 241, 246);"
    >
      <!--加入router属性-->
      <!-- 默认打开第一个 然后一次只能展开一个-->
      <el-menu router :default-openeds="['1']" unique-opened>
        <el-submenu index="1">
          <el-menu-item-group>
            <template slot="title"
              >设备</template
            >
            <el-menu-item index="/device/create">新建设备</el-menu-item>
            <el-menu-item index="/device/list">设备列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title"
              >地图</template
            >
            <el-menu-item index="/theMap/create">新建地图</el-menu-item>
            <el-menu-item index="/theMap/list">地图列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title"
              >记录</template
            >
            <el-menu-item index="/record/list">记录列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container style="positon:relative;">
      <el-header style="text-align: right; font-size: 20px;">
        <i
          class="el-icon-setting"
          style="margin-right: 15px;"
          @click="VSHOW = !VSHOW"
        ></i>
      </el-header>

      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>

      <transition name="slide-fade">
        <el-aside class="echartsList" v-show="VSHOW" width="330px">
          <echartsList></echartsList>
        </el-aside>
      </transition>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-main {
  padding-right: 330px;
}
.echartsList {
  position: absolute;
  right: 0px;
  top: 60px;
  bottom: 0px;
  background: rgb(238, 241, 246);
  padding: 0px;
}

/*动画*/
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-active {
  transform: translateY(-100%);
}
</style>

<script>
import echartsList from "./echartsList";
export default {
  data() {
    return {
      elAsideWidth: "200px",
      /*elAsideItemWidth: '100px',*/
      screenWidth: document.body.clientWidth,
      VSHOW: false,
    };
  },
  methods: {
    asideWidthFlex() {
      if (document.body.clientWidth >= 1600) {
        this.elAsideWidth = "250px";
      } else if (document.body.clientWidth >= 800) {
        this.elAsideWidth = "200px";
      } else {
        this.elAsideWidth = "150px";
      }
    },
  },
  created() {
    this.asideWidthFlex();
  },
  mounted() {
    window.onresize = () => {
      this.asideWidthFlex();
    };
  },
  components: {
    echartsList,
  },
};
</script>
