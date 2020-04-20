import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        record: {},
        // alarm: {},
        shouldShow: {},
        map: {
            mapPoint: {},
            devicePoint: {},
        }
    },
    getters: {
        alarm: state => {
            let arr = {};
            if (!Object.keys(state.record).length) return arr
            for (let i in state.record) {
                if (Object.keys(state.record[i].alarm).length) {
                    for (let j in state.record[i].alarm) {
                        arr[state.record[i].alarm[j]._id] = state.record[i].alarm[j]
                    }
                }
            }
            return arr
        }
    },
    mutations: {
        recordAdd(state, record) {
            !state.record[record.deviceName] && Vue.set(state.record, record.deviceName, {items: [], alarm: {}});
            if(state.record[record.deviceName].items.length>5){
                state.record[record.deviceName].items.shift()
            }
            Vue.set(state.record[record.deviceName], 'items', state.record[record.deviceName].items.concat([{
                temperature: record.temperature,
                time: record.time
            }]))
            // 改用record里面的alarm对象来代替state.alarm对象
            // if (record.alarm) {
            //     state.alarm[record._id] = Vue.set(state.alarm, record._id, record)
            // }
            record.alarm && Vue.set(state.record[record.deviceName].alarm, record._id, record)
            
        },
        alarmDelete(state, {id, deviceName}) {
            Vue.delete(state.record[deviceName].alarm, id)
        },
        shouldShowAdd(state, deviceName) {
            Vue.set(state.shouldShow, deviceName, true)
        },
        shouldShowDelete(state, deviceName) {
            Vue.delete(state.shouldShow, deviceName)
        },
        mapMapPointInit(state, mapPointObj) {
            Vue.set(state.map, 'mapPoint', mapPointObj)
        },
        mapMapPointSet(state, mapPoint) {
            Vue.set(state.map.mapPoint, mapPoint.xy, mapPoint.model)
        },
        mapMapPointDelete(state, mapPoint) {
            Vue.delete(state.map.mapPoint, mapPoint.xy);
        },
        mapDevicePointInit(state, devicePointArr) {
            const devicePointObj = devicePointArr.reduce((acc,cur) => {
                if (!cur.coordinateX || !cur.coordinateY) return acc;
                acc[`x${cur.coordinateX}y${cur.coordinateY}`] = {
                    name: cur.name,
                    coordinateX: cur.coordinateX,
                    coordinateY: cur.coordinateY
                };
                return acc;
            }, {})
            Vue.set(state.map, 'devicePoint', devicePointObj)
        },
    }
});

export default store;