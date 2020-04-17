<template>
    <div class="about">
        <h1>{{id ? '编辑' : '新建'}}地图</h1>
        <!--native表示原生表单 prevent表示阻止默认操作，不跳转页面-->
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="model.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="X大小">
                <el-input v-model="model.sizeX"></el-input>
            </el-form-item>
            <el-form-item label="Y大小">
                <el-input v-model="model.sizeY"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default{
        props:{
          id:{}
        },
        data(){
            return{
                model:{
                    name: '',
                    description: '',
                    sizeX: 0,
                    sizeY: 0,
                }
            }
        },
        methods:{
            async save(){
                if(this.id){
                    await this.$http.put(`rest/theMap/${this.id}`,this.model)
                }else{
                    await this.$http.post('rest/theMap',this.model)
                }
                this.$router.push('/theMap/list')
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
            },
            async fetch(){
                const res = await this.$http.get(`rest/theMap/${this.id}`)
                this.model = res.data
            },
        },
        created(){
            this.id && this.fetch()
        }
    }
</script>

