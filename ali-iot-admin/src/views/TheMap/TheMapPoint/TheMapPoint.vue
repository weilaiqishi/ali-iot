<template>
  <div
    style="height: 100px;display: flex;width: 100%;padding-left: 10px;overflow-x: scroll;"
  >
    <h1
      style="position: absolute;top: -4px;left: 50px;width: 14px;font-size: 14px;word-wrap: break-word;"
    >
      地图点位
    </h1>
    <el-card
      v-for="(value, item) in mapPoint"
      :id="item"
      :key="item"
      :class="{over: value.coordinateX > sizeX || value.coordinateX > sizeY}"
      style="margin: 5px 0;flex-shrink: 0; height: 74px;width: 120px;"
    >
      <el-row style="height: 100%;">
        <p v-if="value.coordinateX > sizeX || value.coordinateX > sizeY" style="position: absolute;top: 28px;left: 52px;font-size: 12px;">OverMap</p>
        <el-row>
          <el-col :span="8" class="name">名称</el-col>
          <el-tooltip effect="dark" :content="value.name" placement="top-start">
            <el-col :span="16">{{ value.name.substr(0, 5) }}</el-col>
          </el-tooltip>
        </el-row>
        <el-row>
          <el-col :span="8" class="name">坐标</el-col>
          <el-col :span="16">({{value.coordinateX}},{{value.coordinateY}})</el-col>
        </el-row>
        <el-button type="danger" size="mini" @click="mapPointDelete(item)"
          >删除</el-button
        >
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    sizeX: Number,
    sizeY: Number
  },
  data() {
    return {
      mapPoint: {},
    };
  },
  watch: {
    "$store.state.map.mapPoint": {
      handler(newVal) {
        this.mapPoint = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    mapPointDelete(xy) {
      this.$store.commit("mapMapPointDelete", {
        xy
      });
    },
  },
};
</script>

<style scoped>
.el-button {
  display: block;
  padding: 5px 0;
  width: 50px;
}
.el-col {
  text-align: center;
}
.name {
  position: relative;
  left: 8px;
}
.over {
  background: gray;
}

/deep/ .el-card__body {
  padding: 6px;
  font-size: 14px;
}
</style>
