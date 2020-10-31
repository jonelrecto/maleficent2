// import something here
import vuefire from 'vuefire'
// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
  // something to do
  const bindAsObject = Vue.prototype.$bindAsObject
  Vue.prototype.$bindAsObject = async function bindAsObject(key, ref, cancelCallback) {
    return new Promise(resolve => {
      bindAsObject(key, ref, cancelCallback, resolve)
    })
  }
  Vue.use(vuefire)
}
