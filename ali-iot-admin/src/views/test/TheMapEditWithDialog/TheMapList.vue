<template>
  <div>
    <h1>地图列表</h1>
    <el-tooltip effect="dark" content="新建" placement="top-start">
      <el-button
        @click="showAddForm = true"
        size="mini"
        type="info"
        icon="el-icon-folder-add"
        style="font-size: 20px;position: absolute;top: 100px;left: 310px;"
      ></el-button>
    </el-tooltip>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="240"></el-table-column>
      <el-table-column
        prop="name"
        label="地图名称"
        width="240"
      ></el-table-column>
      <el-table-column prop="image" label="地图图片" width="150">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.image"
            :fit="'contain'"
            style="width: 80px; height: 80px;border: 1px solid #DCDFE6;border-radius: 4px;"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="description"
        label="地图描述"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/theMap/content/${scope.row._id}`)"
            >IN</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <EditForm
      title="新增地图"
      :visible.sync="showAddForm"
      @save="handleAddModel"
    />
    <EditForm
      title="编辑地图"
      :visible.sync="showEditForm"
      @save="handleEditModel"
      :model="editFormData"
    />
  </div>
</template>

<script>
import EditForm from "./TheMapEditDialog.vue";
export default {
  data() {
    return {
      items: [],
      showEditForm: false, // 是否显示编辑表单
      showAddForm: false, // 是否显示新增表单
      editFormData: {},
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("rest/theMap");
      this.items = res.data;
    },
    async remove(row) {
      this.$confirm(`是否确定要删除"${row.name}"`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$http.delete(`rest/theMap/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.fetch();
      });
    },
    edit(row) {
      this.editFormData = row;
      this.showEditForm = true;
    },
    // 添加数据
    async handleAddModel(model) {
      // do something
      await this.$http.post("rest/theMap", model);
      this.saveSuccess()
    },
    // 编辑数据
    async handleEditModel(model) {
      // do something
      await this.$http.put(`rest/theMap/${this.editFormData._id}`, model);
      this.saveSuccess()
    },
    saveSuccess() {
      this.$message({
        type: "success",
        message: "保存成功",
      });
      this.showEditForm = false;
      this.showAddForm = false;
      this.fetch();
    },
  },
  created() {
    this.fetch();
  },
  computed: {},
  components: {
    EditForm
  },
};
</script>

<style scoped></style>
