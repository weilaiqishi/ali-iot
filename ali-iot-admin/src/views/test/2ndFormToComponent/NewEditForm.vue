<template>
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
</template>
<script>
export default {
  name: "EditForm",
  props: {
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
    // 对外暴露获取数据的方法，内部进行表单的校验，父组件中通过refs调用
    getValue() {
      return new Promise((resolve, reject) => {
        this.$refs.EditForm.validate((valid) => {
          if (valid) {
            resolve({ ...this.form });
          } else {
            reject("表单校验没通过，可以抛出一个异常");
          }
        });
      });
    },
  },
};
</script>
