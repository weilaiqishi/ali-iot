<template>
  <div style="height: 170px;display: flex;width: 100%;overflow-x: scroll;">
    <el-card v-for="(value, item) in alarm" :id="item" :key="item" style="margin: 5px 0;flex-shrink: 0;">
      <el-row>
          <el-col :span="5">设备名称</el-col>
          <el-col :span="12">{{value.deviceName}}</el-col>
          <el-col :span="3">
              <el-button @click="$store.commit('alarmDelete', value._id)">知道了</el-button>
          </el-col>
      </el-row>
      <el-row>
          <el-col :span="5">探测温度</el-col>
          <el-col :span="19">{{value.temperature}}</el-col>
      </el-row>
      <el-row>
          <el-col :span="5">探测时间</el-col>
          <el-col :span="19">{{value.time}}</el-col>
      </el-row>
      <el-row>
          <el-col :span="5">预警温度</el-col>
          <el-col :span="19">{{value.alarmValue}}</el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
        alarm: {}
    }
  },
  watch: {
    "$store.state.alarm": {
      handler(newVal) {
          this.alarm = newVal;
      },
      immediate: true,
      deep: true,
    },
  }
};
</script>

<style scoped></style>
