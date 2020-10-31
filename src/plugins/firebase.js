// import something here
import fireb from 'firebase'
import store from '../store/index.js'

// firebase config
// maleficent -test
var config = {
  apiKey: "AIzaSyDr3p1gt9MJYHe_DtT3--D24t4gRP8c1V8",
  authDomain: "maleficent-test.firebaseapp.com",
  databaseURL: "https://maleficent-test.firebaseio.com",
  projectId: "maleficent-test",
  storageBucket: "maleficent-test.appspot.com",
  messagingSenderId: "204440127998"
 }

// maleficent database
//  var config = {
//   apiKey: "AIzaSyA4h0owV593lIvITEE-EEEFbs_0JJSwfGk",
//   authDomain: "maleficentdatabase.firebaseapp.com",
//   databaseURL: "https://maleficentdatabase.firebaseio.com",
//   projectId: "maleficentdatabase",
//   storageBucket: "maleficentdatabase.appspot.com",
//   messagingSenderId: "99797226126"
//  }
// configuring the functions
let userTypes = store.getters['users/getUserTypes']
// initialize firebase config
export var firebase = fireb.initializeApp(config)
export var firebase2 = fireb.initializeApp(config, 'firebase2')
//setup authentication manager
export var AUTH = firebase.auth()
export var AUTH2 = firebase2.auth()
// set up database manageri
export var DB = firebase.database()

AUTH.usersRef = DB.ref('users')

export default ({ app, router, Vue}) => {
	// authentication restriction
  console.log('q', Vue.prototype.$q)
	AUTH.onAuthStateChanged(user => {
		store.state.userAuth = user
    if (Vue.prototype.$q.localStorage.has('user')) {
      console.log('localStorage', Vue.prototype.$q.localStorage.has('user'))
      // router.push('/dashboard')
    }
		// if (user) {
		// 	AUTH.usersRef.child(user.uid).on('value', snapshot => {
  //       Vue.set(store.state.user, 'data', snapshot.val())
  //       console.log('AUTH data', store.state.use r)
  //       var currentRoute = router.currentRoute.path
  //       var role = store.state.user.data.role
  //       //
  //       if (router.currentRoute.path === '/' || currentRoute != userTypes[role]) {
  //         console.log('route path', router.currentRoute.path)
  //         console.log('route role', userTypes[role])
  //         router.push(userTypes[role])
  //       }
  //       else if (currentRoute !== userTypes[role]) {
  //         router.push(userTypes[store.state.user.data.role])
  //         console.log('route path', router.currentRoute.path)
  //         console.log('this is userTypes.type', userTypes[store.state.user.data.role])
  //       }
  //       else {
  //         router.push(userTypes[store.state.user.data.role])
  //       }
  //     })
		// }
	})
  // calling globally the firebase managers
  Vue.prototype.$auth = AUTH
  Vue.prototype.$auth2 = AUTH2
  Vue.prototype.$database = DB
  Vue.prototype.$firebase = firebase
}
