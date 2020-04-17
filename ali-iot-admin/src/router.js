import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import DeviceEdit from './views/DeviceEdit.vue'
import DeviceList from './views/DeviceList.vue'
import TheMapEdit from './views/TheMapEdit.vue'
import TheMapList from './views/TheMapList.vue'
import RecordList from './views/RecordList.vue'


Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Main',
            component: Main,
            children: [
                { path: '/device/create',component: DeviceEdit },
                { path: '/device/edit/:id',component: DeviceEdit,props: true},
                { path: '/device/list',component: DeviceList },
                { path: '/theMap/create',component: TheMapEdit },
                { path: '/theMap/edit/:id',component: TheMapEdit,props: true},
                { path: '/theMap/list',component: TheMapList },
                { path: '/record/list',component: RecordList },
            ]
        },
    ]
})

router.beforeEach((to, from, next)=>{
    if (!to.meta.isPublic && !localStorage.token){
        return next('/login')
    }
    next()
})

export default router
