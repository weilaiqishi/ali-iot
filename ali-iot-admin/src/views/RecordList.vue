<template>
  <div style="display: flex;flex-direction: column;height: 100%;">
    <h1>记录列表</h1>
    <el-table :data="items" style="flex: 1;overflow: scroll;">
      <el-table-column prop="deviceId.name" label="设备名称"></el-table-column>
      <el-table-column prop="alarmValue" label="报警值"></el-table-column>
      <el-table-column prop="alarm" label="报警" :formatter="formatter"></el-table-column>
      <el-table-column prop="temperature" label="温度"></el-table-column>
      <el-table-column prop="time" label="时间"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;">
      <el-form> </el-form>
      <!-- <el-pagination> </el-pagination> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/record");
      this.items = res.data;
    },
    async remove(row) {
      this.$confirm(`是否确定要删除`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await this.$http.delete(`rest/record/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.fetch();
      });
    },
    formatter(item) {
      return item.alarm ? '是' : '否';
    }
  },
  created() {
    this.fetch();
  },
  computed: {},
  components: {}
};
</script>

<style scoped></style>
