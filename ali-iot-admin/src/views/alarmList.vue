<template>
  <div style="height: 170px;display: flex;width: 100%;padding-left: 10px;overflow-x: scroll;">
    <h1
      style="position: absolute;top: -15px;left: 4px;
        width: 20px;
        font-size: 20px; 
        word-wrap: break-word;   
        letter-spacing: 20px;"
    >
      报警记录
    </h1>
    <el-card
      v-for="(value, item) in alarm"
      :id="item"
      :key="item"
      style="margin: 5px 0;flex-shrink: 0; height: 140px;width: 380px;"
    >
      <el-row style="height: 100%;">
        <el-col :span="20">
          <el-row>
            <el-col :span="6">设备名称</el-col>
            <el-col :span="18">{{ value.deviceName }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">探测温度</el-col>
            <el-col :span="18">{{ value.temperature }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">探测时间</el-col>
            <el-col :span="18">{{ value.time }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">预警温度</el-col>
            <el-col :span="18">{{ value.alarmValue }}</el-col>
          </el-row>
        </el-col>
        <el-col
          :span="4"
          style="display: flex;flex-direction: column;justify-content: space-around;height: 105px;"
        >
          <el-button type="primary" size="small" @click="toMap(value._id)"
            >看地图</el-button
          >
          <el-button
            size="small"
            @click="
              $store.commit('alarmDelete', {
                id: value._id,
                deviceName: value.deviceName,
              })
            "
            >知道了</el-button
          >
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      alarm: {},
    };
  },
  watch: {
    "$store.getters.alarm": {
      handler(newVal) {
        this.alarm = newVal;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    async toMap(id) {
      const res = await this.$http.get(
        `rest/device/${this.alarm[id].deviceId}`
      );
      this.$router.push(`/theMap/content/${res.data.theMapId}`);
    },
  },
};
</script>

<style scoped>
.el-button {
  display: block;
  padding-left: 10px;
}
.el-button + .el-button {
  margin-left: 0px;
}
</style>
