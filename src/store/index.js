import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
// import VuexPersistence from 'vuex-persist'
import users from './module-example'
import schedules from './schedules'
import settings from './settings'
import model from './model'
import startUp from './startUpConfig'
import register from './register'
// import Vuefire from 'vuefire'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    users,
    schedules,
    settings,
    model,
    startUp,
    register
  },
  // plugins: [new VuexPersistence().plugin]
})

export default store
