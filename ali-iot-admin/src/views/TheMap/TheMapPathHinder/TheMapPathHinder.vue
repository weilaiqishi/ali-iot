<template>
  <div
    style="height: 100px;display: flex;width: 100%;padding-left: 10px;overflow-x: scroll;overflow-y: hidden;"
  >
    <h1
      style="position: absolute;top: -4px;left: 50px;width: 14px;font-size: 14px;word-wrap: break-word;"
    >
      模拟火情
    </h1>
    <el-card
      v-for="(value, item) in asAlarmPoint"
      :id="item"
      :key="item"
    >
      <el-row style="height: 100%;">
        <el-row>
          <el-col>{{item}}</el-col>
        </el-row>
        <el-button type="danger" size="mini" @click="alarmDelete(item)"
          >删除</el-button
        >
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    asAlarmPoint: Object
  },
  methods: {
    alarmDelete(xy) {
      this.$emit('deleteAsAlarmPoint', xy)
    }
  },
};
</script>

<style scoped>
.el-card {
  margin: 15px 0;
  flex-shrink: 0;
  height: 54px;
  width: 60px;
}
.el-card .el-button {
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
