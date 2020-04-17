<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}设备</h1>
    <!--native表示原生表单 prevent表示阻止默认操作，不跳转页面-->
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属地图">
        <el-select v-model="model.theMapId">
          <el-option
            v-for="item in parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="报警值">
        <el-input-number v-model="model.alarmValue"></el-input-number>
      </el-form-item>
      <el-form-item label="短信通知电话">
        <el-col :span="1">
          <el-button type="text" @click="model.phone.push({})">
            <i class="el-icon-plus"></i>
            添加
          </el-button>
        </el-col>
        <el-col :span="23">
          <div
            style="box-sizing: border-box;width: 100%;display: flex;height: 256px;border-radius: 4px;overflow-x: auto;"
          >
            <div
              v-for="(item, i) in model.phone"
              :key="i"
              style="box-sizing: border-box;width: 282px;margin: 0 10px;height: 224px;border-radius: 4px;border: 1px solid #DCDFE6;flex-shrink: 0;"
            >
              <p class="p">名称</p>
              <el-input
                v-model="item.name"
                style="margin-left:20px;width: 240px;"
              ></el-input>
              <p class="p">号码</p>
              <el-input
                v-model="item.phone"
                style="margin-left:20px;width: 240px;"
              ></el-input>
              <el-button
                style="position: relative; left: 116px;top: 10px;"
                size="small"
                type="danger"
                @click="model.phone.splice(i, 1)"
              >
                删除
              </el-button>
            </div>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="model.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="X坐标">
        <el-input-number v-model="model.coordinateX"></el-input-number>
      </el-form-item>
      <el-form-item label="Y坐标">
        <el-input-number v-model="model.coordinateY"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {},
  },
  data() {
    return {
      model: {
        name: "",
        description: "",
        alarmValue: 0,
        phone: [],
        theMapId: "",
        coordinateX: 0,
        coordinateY: 0,
      },
      parents: [],
    };
  },
  methods: {
    async save() {
      if (this.id) {
        await this.$http.put(`rest/device/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/device", this.model);
      }
      this.$router.push("/device/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/device/${this.id}`);
      this.model = res.data;
    },
    async fetchParents() {
      const res = await this.$http.get(`rest/theMap`);
      this.parents = res.data;
    },
  },
  created() {
    this.id && this.fetch();
    this.fetchParents();
  },
};
</script>

<style scoped>
.p {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  margin: 0px;
  margin-left: 20px;
}
</style>
