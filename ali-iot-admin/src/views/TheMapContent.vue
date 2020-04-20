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
          <el-carousel height="100px" :autoplay="false">
            <el-carousel-item>
              <el-row class="one">
                <el-col :span="12" class="hB textCenterX">
                  sizeX 地图X大小
                  <el-input-number
                    :min="0"
                    v-model="model.sizeX"
                  ></el-input-number>
                </el-col>
                <el-col :span="12" class="hB textCenterX">
                  sizeY 地图Y大小
                  <el-input-number
                    :min="0"
                    v-model="model.sizeY"
                  ></el-input-number>
                </el-col>
              </el-row>
            </el-carousel-item>
            <el-carousel-item>
              asdg
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
            ></TheMapContentItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheMapContentItem from "./TheMapContentItem.vue";
export default {
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
    };
  },
  methods: {
    async save() {
      if (this.id) {
        this.$store.state.map.mapPoint && (this.model.point = JSON.stringify(this.$store.state.map.mapPoint) || "");
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
      this.$store.commit("mapMapPointInit", JSON.parse(this.model.point) || {});
      this.$store.commit("mapDevicePointInit", this.model.deviceList || []);
      this.$refs.map.style.background = this.model.image
        ? `url(${this.model.image}) no-repeat`
        : "";
      this.$message.success('地图请求成功')
    },
  },
  created() {
    this.id && this.fetch();
  },
  components: {
    TheMapContentItem,
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
