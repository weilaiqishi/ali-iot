<template>
  <el-popover placement="right" width="150" v-model="visible">
    <el-button
      slot="reference"
      class="cell"
      :class="[{ yellow: !!this.deviceCell.name }, { red: this.alarm }, { green: this.green }]"
    >
      <i :class="icon" class="center" style="font-size: 70px;opacity: 0.5;"></i>
      <span style="font-size: 16px;font-weight: bold;color: black;">{{
        cell.name.substr(0, 5)
      }}</span>
      <el-tooltip
        effect="dark"
        :content="deviceCell.name"
        placement="top-start"
      >
        <span
          style="position: absolute;top: 14px;left: 4px;font-size: 14px;color: black;"
          >{{ deviceCell.name.substr(0, 10) }}</span
        >
      </el-tooltip>
      <span
        v-if="deviceCell.name"
        style="position: absolute;bottom: 8px;right: 24%;font-weight: bold;font-size: 18px;color: black;"
        >{{ deviceCell.temperature }}℃</span
      >
    </el-button>
    <el-form label-width="60px">
      <el-form-item label="坐标">
        <h5 style="margin: 0;">({{this.coordinateX}} , {{this.coordinateY}})</h5>
      </el-form-item>
      <el-form-item label="地点名">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="model.type">
          <el-option
            v-for="(item, index) in types"
            :key="index"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row>
      <el-button type="primary" size="mini" @click="mapPointAdd()"
        >设置</el-button
      >
      <el-button size="mini" @click="mapPointDelete()">移除</el-button>
    </el-row>
    <el-row style="margin-top: 6px;">
      <el-button type="danger" size="mini" @click="emitAddAsAlarmPoint"
        >模拟火情</el-button
      >
    </el-row>
        <el-row style="margin-top: 6px;">
      <el-button type="success" size="mini" @click="emitAstar"
        >从此逃生</el-button
      >
    </el-row>
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      model: {
        name: "",
        type: "",
        coordinateX: this.coordinateX,
        coordinateY: this.coordinateY,
      },
      cell: {
        name: "",
        type: "",
        coordinateX: this.coordinateX,
        coordinateY: this.coordinateY,
      },
      deviceCell: {
        name: "",
        coordinateX: this.coordinateX,
        coordinateY: this.coordinateY,
        temperature: 20,
      },
      types: [
        {
          name: "出口",
          type: "exit",
        },
        {
          name: "通道",
          type: "passage",
        },
        {
          name: "房间",
          type: "room",
        },
      ],
      visible: false,
      recordAlarm: false
    };
  },
  props: {
    coordinateX: Number,
    coordinateY: Number,
    asAlarmPoint: Object,
    path: Object
  },
  methods: {
    mapPointAdd() {
      this.$store.commit("mapMapPointSet", {
        xy: `x${this.model.coordinateX}y${this.model.coordinateY}`,
        model: this.model,
      });
      this.visible = false;
    },
    mapPointDelete() {
      this.$store.commit("mapMapPointDelete", {
        xy: this.xy,
      });
      this.visible = false;
    },
    emitAddAsAlarmPoint() {
      this.$emit('addAsAlarmPoint', this.xy);
    },
    emitAstar() {
      this.$emit('Astar', this.xy);
    }
  },
  computed: {
    xy: function() {
      return `x${this.model.coordinateX}y${this.model.coordinateY}`;
    },
    icon: function() {
      switch (this.cell.type) {
        case "exit":
          return "el-icon-s-flag exitIconColor";
        case "passage":
          return "el-icon-guide";
        case "room":
          return "el-icon-s-home";
        default:
          return "";
      }
    },
    alarm: function() {
      return this.recordAlarm || this.asAlarmPoint[this.xy]
    },
    green: function() {
      return this.path[this.xy]
    }
  },
  watch: {
    "$store.state.map.mapPoint": {
      handler(newVal) {
        this.cell = Object.assign(
          this.cell,
          newVal[this.xy] || {
            name: "",
            type: "",
            coordinateX: this.coordinateX,
            coordinateY: this.coordinateY,
          }
        );
      },
      immediate: true,
      deep: true,
    },
    cell: {
      handler(newVal) {
        this.model = {
          name: newVal.name || "",
          type: newVal.type || "",
          coordinateX: this.coordinateX,
          coordinateY: this.coordinateY,
        };
      },
      immediate: true,
      deep: true,
    },
    "$store.state.map.devicePoint": {
      handler(newVal) {
        this.deviceCell = Object.assign(
          this.deviceCell,
          newVal[this.xy] || {
            name: "",
            coordinateX: this.coordinateX,
            coordinateY: this.coordinateY,
          }
        );
      },
      immediate: true,
      deep: true,
    },
    "$store.state.record": {
      handler(newVal) {
        if (!this.deviceCell.name || !newVal[this.deviceCell.name]) return
        this.deviceCell.temperature = newVal[this.deviceCell.name].items.slice(-1)[0].temperature || 20;
        this.recordAlarm = !!Object.keys(newVal[this.deviceCell.name].alarm).length;
        !!Object.keys(newVal[this.deviceCell.name].alarm).length && this.$emit('addAlarmPoint', this.xy);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>

<style scoped>
.cell {
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  padding: 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #ffffff;
  opacity: 0.8;
  flex-shrink: 0;
  font-size: 24px;
  position: relative;
}
.el-form-item {
  margin-bottom: 6px;
}
.red {
  background: rgb(255, 29, 29) !important;
}
.yellow {
  background: rgb(226, 224, 116);
}
.green {
  border: 10px solid #48ff76;
}
.exitIconColor {
  color:#48ff76
}
</style>
