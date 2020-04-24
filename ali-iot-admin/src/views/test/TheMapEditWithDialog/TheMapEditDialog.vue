<template>
  <ElDialog
    :title="title"
    :visible="visible"
    @update:visible="handleVisibleChange"
  >
    <ElForm ref="EditForm" :model="form" :rules="rules">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="图片" style="margin-top: 0.5rem;">
        <el-upload
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="(res) => $set(form, 'image', res.url)"
        >
          <el-image
            v-if="form.image"
            style="width: 200px; height: 200px;border: 1px solid #DCDFE6;border-radius: 4px;"
            :src="form.image"
            :fit="'scale-down'"
          ></el-image>
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </ElForm>

    <template #footer>
      <ElButton @click="handleVisibleChange(false)">取消</ElButton>
      <ElButton type="primary" @click="handleSave">保存</ElButton>
    </template>
  </ElDialog>
</template>
<script>
export default {
  name: "EditForm",
  props: {
    // 是否显示表单
    visible: {
      type: Boolean,
      default: false,
    },
    // 弹窗的title
    title: String,
    // 回显数据
    model: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: "",
        description: "",
        image: "",
      },
      rules: {
        name: { required: true, message: "请输入地图名", trigger: "blur" },
      },
    };
  },
  watch: {
    // 监听 编辑时回显表单
    model: {
      handler(newVal) {
        console.log(newVal);
        // 浅克隆
        for (let i in this.form) {
          this.form[i] = newVal[i] || "";
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleSave() {
      // 表单验证 返回数据
      this.$refs.EditForm.validate((valid) => {
        if (valid) {
          this.$emit("save", this.form);
        }
      });
    },
    handleVisibleChange(value) {
      this.$emit("update:visible", value);
    },
  },
};
</script>
