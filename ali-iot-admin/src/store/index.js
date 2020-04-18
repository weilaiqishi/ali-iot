import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        record: {},
        alarm: {},
        shouldShow: {},
        map: {
            mapPoint: {},
            devicePoint: {},
        }
    },
    mutations: {
        recordAdd(state, record) {
            !state.record[record.deviceName] && Vue.set(state.record, record.deviceName, {items: []});
            if(state.record[record.deviceName].items.length>5){
                state.record[record.deviceName].items.shift()
            }
            Vue.set(state.record[record.deviceName], 'items', state.record[record.deviceName].items.concat([{
                temperature: record.temperature,
                time: record.time
            }]))
            if (record.alarm) {
                state.alarm[record._id] = Vue.set(state.alarm, record._id, record)
            }
        },
        alarmDelete(state, alarm) {
            Vue.delete(state.alarm, alarm)
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
        }
    }
});

export default store;