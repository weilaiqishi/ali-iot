import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
    baseURL: 'http://localhost:4100/admin/api'
})

// 请求拦截器
// 与后端约定好error传一个json，全局捕获它然后用elementui消息框显示
http.interceptors.response.use(res =>{
    return res
},err =>{
    if(err.response.data.message) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message,
            duration: 800
        })

        if(err.response.status === 401){
            router.push('/login')
        }
    }
        return Promise.reject(err)
})

export default http