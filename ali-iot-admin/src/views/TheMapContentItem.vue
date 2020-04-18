<template>
  <el-popover placement="right" width="150" v-model="visible">
    <el-button
      slot="reference"
      class="cell"
      :class="{ red: this.cell.type === 'ABC' }"
      >
      <i :class="icon" class="center" style="font-size: 70px;opacity: 0.5;"></i>
      <span style="font-size: 16px;font-weight: bold;color: black;">{{ cell.name.substr(0, 5) }}</span>
      </el-button
    >
    <el-form label-width="60px">
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
    };
  },
  props: {
    coordinateX: Number,
    coordinateY: Number,
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
  },
  computed: {
    xy: function() {
      return `x${this.model.coordinateX}y${this.model.coordinateY}`;
    },
    icon: function() {
      switch (this.cell.type) {
        case "exit":
          return "el-icon-s-flag";
        case "passage":
          return "el-icon-guide";
        case "room":
          return "el-icon-s-home";
        default:
          return "";
      }
    },
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
  background: rgb(255, 29, 29);
}
</style>
