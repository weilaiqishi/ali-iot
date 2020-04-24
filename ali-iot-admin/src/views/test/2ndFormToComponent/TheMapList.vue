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
          <el-button type="text" size="small" @click="edit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建时 -->
    <ElDialog :visible.sync="showAddForm">
      <NewEditForm ref="AddForm" />

      <template #footer>
        <ElButton @click="showAddForm = false">取消</ElButton>
        <ElButton type="primary" @click="handleAddModel">保存</ElButton>
      </template>
    </ElDialog>

    <!-- 编辑时 -->
    <ElDialog :visible.sync="showEditForm">
      <NewEditForm ref="EditForm" :model="editFormData" />

      <template #footer>
        <ElButton @click="showEditForm = false">取消</ElButton>
        <ElButton type="primary" @click="handleEditModel">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script>
import NewEditForm from "./NewEditForm";
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
      console.log(row)
      this.editFormData = row;
      this.showEditForm = true;
    },
    // 编辑
    handleEditModel() {
      this.$refs.EditForm.getValue()
        .then(async (model) => {
          // 调用编辑接口
          await this.$http.put(`rest/theMap/${this.editFormData._id}`, model);
          this.saveSuccess();
        })
        .catch((error) => {
          // 处理表单验证失败
          console.log(error)
        });
    },
    // 添加
    handleAddModel() {
      this.$refs.AddForm.getValue()
        .then(async (model) => {
          // 调用添加接口
          await this.$http.post("rest/theMap", model);
          this.saveSuccess();
        })
        .catch((error) => {
          // 处理表单验证失败
          console.log(error)
        });
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
    NewEditForm,
  },
};
</script>

<style scoped></style>
