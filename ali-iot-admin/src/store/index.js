import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        record: {},
        shouldShow: {}
    },
    mutations: {
        recordAdd(state, record) {
            state.record[record.deviceName] = state.record[record.deviceName] || Vue.set(state.record, record.deviceName, {items: []})
            if(state.record[record.deviceName].items.length>5){
                state.record[record.deviceName].items.shift()
            }
            Vue.set(state.record[record.deviceName], 'items', state.record[record.deviceName].items.concat({
                temperature: record.temperature,
                time: record.time
            }))
        },
        shouldShowAdd(state, deviceName) {
            Vue.set(state.shouldShow, deviceName, true)
        },
        shouldShowDelete(state, deviceName) {
            Vue.delete(state.shouldShow, deviceName)
        }
    }
});

export default store;