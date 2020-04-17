<template>
    <div>
        <h1>设备列表</h1>
        <el-table :data="items">
            <el-table-column prop="_id" label="ID" width="240"></el-table-column>
            <el-table-column prop="name" label="设备名称"></el-table-column>
            <el-table-column prop="theMapId.name" label="所属地图"></el-table-column>
            <el-table-column prop="description" label="设备描述" show-overflow-tooltip></el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="$router.push(`/device/edit/${scope.row._id}`)">编辑</el-button>
                    <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="showAdd(scope.row)">图示</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data() {
            return{
                items: []
            }
        },
        methods: {
            async fetch(){
                const res = await this.$http.get('rest/device');
                this.items = res.data;
            },
            async remove(row){
                this.$confirm(`是否确定要删除"${row.name}"`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    await this.$http.delete(`rest/device/${row._id}`)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.fetch()
                })
            },
            showAdd(row){
                this.$store.commit('shouldShowAdd',row.name)
            }
        },
        created(){
            this.fetch();
        },
        computed: {},
        components: {}
    }
</script>

<style scoped>

</style>