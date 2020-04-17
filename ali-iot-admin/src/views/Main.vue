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
          :class="{ alarm: alarm }"
          class="el-icon-bell"
          style="margin-right: 315px;"
          @click="dialogVisible = !dialogVisible"
        ></i>
        <i
          class="el-icon-star-on"
          style="margin-right: 15px;"
          @click="VSHOW = !VSHOW"
        ></i>
        <audio
          id="music"
          src="http://mp32.9ku.com/yinxiao/2019/06-20/ghao2mbrvwh.mp3"
          style="visibility:hidden;"
        ></audio>
      </el-header>

      <el-main :class="[{ PRight: VSHOW }, { PBottom: dialogVisible }]">
        <router-view :key="$route.path"></router-view>
      </el-main>

      <transition name="slide-fade">
        <el-aside class="echartsList" v-show="VSHOW" width="330px">
          <echartsList></echartsList>
        </el-aside>
      </transition>
      <transition name="slide-fade">
        <el-footer
          v-show="dialogVisible"
          style="position:absolute;bottom: 0;height: 170px;background: #b3c0d1;left: 200px;right: 330px;z-index: 1000;"
        >
          <alarmList></alarmList>
        </el-footer>
      </transition>
    </el-container>
  </el-container>
</template>

<style>
.PRight {
  margin-right: 330px;
}
.PBottom {
  margin-bottom: 170px;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.alarm {
  font-size: 30px;
  color: rgb(223, 46, 46);
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
import alarmList from "./alarmList";
var throttle = function(func, delay) {
  var prev = Date.now();
  return function() {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - prev >= delay) {
      func.apply(context, args);
      prev = Date.now();
    }
  };
};
export default {
  data() {
    return {
      elAsideWidth: "200px",
      /*elAsideItemWidth: '100px',*/
      screenWidth: document.body.clientWidth,
      VSHOW: false,
      dialogVisible: false,
      alarm: false,
      audio: null,
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    playMusic: throttle(function() {
      this.audio = this.audio || document.getElementById("music");
      if (this.audio !== null) {
        this.audio.play();
      }
    }, 10000),
  },
  watch: {
    "$store.state.alarm": {
      handler(newVal) {
        let flag = this.alarm;
        this.alarm = !!Object.keys(newVal).length;
        if (this.alarm && !flag) {
          this.playMusic();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  components: {
    echartsList,
    alarmList,
  },
};
</script>
