// import something here
import moment from 'moment'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  Vue.prototype.$moment = moment
}
