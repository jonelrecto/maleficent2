// import something here
import  *  as VueCalendar from 'vue-simple-calendar'
import CalendarMathMixin from 'vue-simple-calendar/dist/calendar-math-mixin.js'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  console.log('this', CalendarMathMixin)
  Vue.prototype.$mathMixin = CalendarMathMixin.methods
  Vue.use(VueCalendar)
}
