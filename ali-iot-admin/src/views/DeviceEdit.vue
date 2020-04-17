<template>
    <div class="about">
        <h1>{{id ? '编辑' : '新建'}}设备</h1>
        <!--native表示原生表单 prevent表示阻止默认操作，不跳转页面-->
        <el-form label-width="120px" @submit.native.prevent="save">
            <el-form-item label="所属地图">
                <el-select v-model="model.theMapId">
                    <el-option v-for="item in parents" :key="item._id" :label="item.name" :value="item._id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称">
                <el-input v-model="model.name"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="model.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="X坐标">
                <el-input v-model="model.coordinateX"></el-input>
            </el-form-item>
            <el-form-item label="Y坐标">
                <el-input v-model="model.coordinateY"></el-input>
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
                    theMapId: '',
                    coordinateX: 0,
                    coordinateY: 0,
                },
                parents:[],
            }
        },
        methods:{
            async save(){
                if(this.id){
                    await this.$http.put(`rest/device/${this.id}`,this.model)
                }else{
                    await this.$http.post('rest/device',this.model)
                }
                this.$router.push('/device/list')
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
            },
            async fetch(){
                const res = await this.$http.get(`rest/device/${this.id}`)
                this.model = res.data
            },
            async fetchParents(){
                const res = await this.$http.get(`rest/theMap`)
                this.parents = res.data
            }
        },
        created(){
            this.id && this.fetch()
            this.fetchParents()
        }
    }
</script>

