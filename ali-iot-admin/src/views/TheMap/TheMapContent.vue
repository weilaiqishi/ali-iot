<template>
  <div class="container one">
    <div class="toolList wB">
      <el-row class="one">
        <el-col
          :span="4"
          class="hB textCenterX"
          style="background: rgb(238, 241, 246)"
        >
          <h1>IN{{ model.name }}地图</h1>
          <el-tooltip effect="dark" content="保存" placement="top-start">
            <el-button
              @click="save"
              size="mini"
              type="info"
              icon="el-icon-upload"
              style="font-size: 20px;position: relative;top: -16px;"
            ></el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="20" class="hB">
          <el-carousel height="100px" :autoplay="false" trigger="click">
            <el-carousel-item>
              <el-row class="one">
                <h1
                  style="position: absolute;top: -15px;left: -20px;width: 14px;font-size: 14px;word-wrap: break-word;"
                >
                  逃生路线
                </h1>
                <h1 class="center" style="font-size: 20px;top: 10%;">查看逃生路线请地图点击格子</h1>
              </el-row>
            </el-carousel-item>
            <el-carousel-item>
              <el-row class="one">
                <h1
                  style="position: absolute;top: -15px;left: -20px;width: 14px;font-size: 14px;word-wrap: break-word;"
                >
                  地图大小
                </h1>
                <el-col :span="12" class="hB textCenterX">
                  <el-row>sizeX 地图X大小</el-row>
                  <el-input-number
                    :min="0"
                    v-model="model.sizeX"
                  ></el-input-number>
                </el-col>
                <el-col :span="12" class="hB textCenterX">
                  <el-row>sizeY 地图Y大小</el-row>
                  <el-input-number
                    :min="0"
                    v-model="model.sizeY"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-carousel-item>
            <el-carousel-item style="padding-top: 0px;padding-bottom: 0px">
              <TheMapPoint
                :sizeX="model.sizeX"
                :sizeY="model.sizeY"
              ></TheMapPoint>
            </el-carousel-item>
            <el-carousel-item style="padding-top: 0px;padding-bottom: 0px">
              <TheMapPathHinder
                :asAlarmPoint="asAlarmPoint"
                @deleteAsAlarmPoint="deleteAsAlarmPoint"
              ></TheMapPathHinder>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </div>
    <div class="mapBox">
      <div class="one map">
        <div class="content" ref="map">
          <div v-for="y in model.sizeY" :key="y" style="display: flex;">
            <TheMapContentItem
              v-for="x in model.sizeX"
              :key="x"
              :coordinateX="x"
              :coordinateY="y"
              @addAsAlarmPoint="addAsAlarmPoint"
              @addAlarmPoint="addAlarmPoint"
              :asAlarmPoint="asAlarmPoint"
              @Astar="astar"
              :path="path"
            ></TheMapContentItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheMapContentItem from "./TheMapContentItem.vue";
import TheMapPoint from "./TheMapPoint/TheMapPoint.vue";
import TheMapPathHinder from "./TheMapPathHinder/TheMapPathHinder.vue";
export default {
  components: {
    TheMapContentItem,
    TheMapPoint,
    TheMapPathHinder
  },
  props: {
    id: {},
  },
  data() {
    return {
      model: {
        name: "",
        description: "",
        image: "",
        sizeX: 0,
        sizeY: 0,
        point: "",
      },
      asAlarmPoint: {},
      alarmPoint: {},
      path: {}
    };
  },
  methods: {
    async save() {
      if (this.id) {
        this.$store.state.map.mapPoint &&
          (this.model.point =
            JSON.stringify(this.$store.state.map.mapPoint) || "");
        await this.$http.put(`rest/theMap/${this.id}`, this.model);
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.fetch();
      }
    },
    async fetch() {
      const res = await this.$http.get(`rest/theMap/${this.id}`);
      this.model = res.data;
      this.$store.commit(
        "mapMapPointInit",
        (this.model.point && JSON.parse(this.model.point)) || {}
      );
      this.$store.commit("mapDevicePointInit", this.model.deviceList || []);
      this.$refs.map.style.background = this.model.image
        ? `url(${this.model.image}) no-repeat`
        : "";
      this.$message.success("地图请求成功");
    },
    addAsAlarmPoint(xy) {
      this.$set(this.asAlarmPoint, xy, true);
    },
    deleteAsAlarmPoint(xy) {
      this.$delete(this.asAlarmPoint, xy);
    },
    addAlarmPoint(xy) {
      this.$set(this.alarmPoint, xy, true);
    },
    astar(xy) {
      this.path = {};
      const map = this.$astar.mapInit(this.model.sizeX, this.model.sizeY);
      // 建筑物和逃生点
      const mapPoint = this.$store.state.map.mapPoint;
      let exitList = [];
      for (let i in mapPoint) {
        if (
          mapPoint[i].coordinateX <= this.model.sizeX &&
          mapPoint[i].coordinateY <= this.model.sizeY
        ) {
          map.data[mapPoint[i].coordinateX - 1][
            mapPoint[i].coordinateY - 1
          ] = 1;
        }
        mapPoint[i].type === 'exit' && exitList.push(mapPoint[i])
      }
      function parsexy(xy){
        const yIndex = xy.indexOf('y')
        return {
          coordinateX: Number(xy.substr(1, yIndex - 1)),
          coordinateY: Number(xy.substr(yIndex + 1))
        }
      }
      // 真火情 地图中该点设置为不能行走
      for (let i in this.alarmPoint) {
        const xy = parsexy(i);
        if (
          xy.coordinateX <= this.model.sizeX &&
          xy.coordinateY <= this.model.sizeY
        ) {
          map.data[xy.coordinateX - 1][
            xy.coordinateY - 1
          ] = 0;
        }
      }
      // 模拟火情 地图中该点设置为不能行走
      for (let i in this.asAlarmPoint) {
        const xy = parsexy(i);
        if (
          xy.coordinateX <= this.model.sizeX &&
          xy.coordinateY <= this.model.sizeY
        ) {
          map.data[xy.coordinateX - 1][
            xy.coordinateY - 1
          ] = 0;
        }
      }
      // 出口的点作为寻路的end
      for (let i of exitList) {
        let point = this.$astar.AStar(map,this.$astar.Point(parsexy(xy).coordinateX - 1,parsexy(xy).coordinateY - 1),this.$astar.Point(i.coordinateX - 1,i.coordinateY - 1)).start();
        point.forEach((i) => {
          this.$set(this.path, `x${i.x + 1}y${i.y + 1}`, true)
        })
      }
    },
  },
  created() {
    this.id && this.fetch();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.mapBox {
  box-sizing: border-box;
  padding-top: 10px;
  flex: 1;
  width: 100%;
  overflow-y: auto;
}
.map {
  background: #b3c0d1;
  padding: 10px;
}
.content {
  background: #99a9bf;
  overflow-x: scroll;
  overflow-y: scroll;
  width: calc(100% - 1px);
  height: calc(100% - 1px) !important;
}
.toolList {
  height: 100px;
}
.el-carousel__item {
  box-sizing: border-box;
  color: #eee;
  background-color: #99a9bf;
  padding: 10px 70px;
}
.cell {
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #99a9bf;
  opacity: 0.8;
  flex-shrink: 0;
}
</style>
