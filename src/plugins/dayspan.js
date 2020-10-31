import Vuetify from 'vuetify'
import DaySpanVuetify from 'dayspan-vuetify'

import 'vuetify/dist/vuetify.min.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'




export default ({ app, router, Vue }) => {
  // something to do
  // AddressbarColor.set('faded')

  Vue.use(Vuetify);

  Vue.use(DaySpanVuetify, {
    methods: {
      getDefaultEventColor: () => '#1976d2'
    }
  });
}
