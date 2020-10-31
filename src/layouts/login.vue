<template>
 <div class="flex flex-center textLogin"  style="background-image: url('./assets/skyscraper-login.jpg');height: 100vh;">
    <div style="width: 420px; max-width: 95vw; " >
      <div class="flex flex-center container row text-center q-pa-lg q-pa-xs" style="background-color: rgba(255, 255, 255, 0.8); border-radius: 50px; max-height: 700px; height:auto;">
      <div class="col-12">
      </div>
      <div class="col-12 flex flex-center">
      <q-card inline class="q-ma-xs bg-white flex" style="max-height: 700px; height:auto; width:95vw; border-radius: 20px;">
      <q-card-media class="relative">
        <q-parallax src="./statics/unsplash.jpg" :height="230">
          <div slot="loading">Loading...</div>
          <div class="image bg-white bgSignin" style="width: 140px; height:140px; border-radius: 10px;">
<!--             <div class="" :style='"width: 130px; height:130px; margin:5px;background-position: center;background-image: url("+getModelInfo.photo+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"' v-if="getModelInfo"/> -->
            <img src="/statics/MMALogo.jpg" style="width: 130px; height:130px; margin:5px; " class="logoMemp"/>
          </div>
        </q-parallax>
      </q-card-media>
      <q-card-title>
        <b class="text-dark">Great {{getDayOfWeek}}! <span v-if="getUsersName">Hi, <span class="text-info"> {{getUsersName.firstName}} </span> <q-icon name="mood"></q-icon></span></b>
      </q-card-title>
      <q-card-separator />
      <q-card-actions>
        <div class="container flex flex-center" >
        <div class="col-12 full-width q-pa-sm text-left">
          <q-input v-model="email" inverted type="email" float-label="Username" color="dark" :before="[{icon: 'account_box', handler () {}}]" @keyup.enter="login"/>
        </div>
        <div class="col-12 full-width q-pa-sm text-left">
          <q-input value="" v-model="password" inverted type="password" clearable float-label="Password" color="dark" :before="[{icon: 'vpn_key', handler () {}}]" @keyup.enter="login"/>
        </div>
<!--         <div class="col-12 full-width q-pa-sm">
            <a class="txt1" href="#">
              Forgot Password?
            </a>
        </div> -->
        <div class="col-12 full-width q-pa-sm">
          <q-btn
            color="dark"
            size="lg"
            label="SIGN IN"
            rounded
            outline
            icon-right="send" @click="login"
          />
          <!-- $router.push('/accounts/') -->
        </div>
        </div>
      </q-card-actions>
    </q-card>
        <q-inner-loading :visible="spinner">
          <q-spinner-tail size="50px" color="primary"></q-spinner-tail>
        </q-inner-loading>
    </div>
    </div>
  </div>
  </div>

</template>
<script>
import { LocalStorage } from 'quasar'
// import logo from '..assets/MMALogo.jpeg'

export default {
  name: 'login',
  created () {
    if (this.$q.localStorage.has('user')) {
      this.$router.push('/dashboard')
    }
    else {
      this.$router.push('/')
    }
  },
  computed: {
    getDayOfWeek () {
      let date = new Date ()
      return this.$moment(date).format('dddd')
    },
    getUsersName () {
      try{
        if(this.email === ''){
          return 0
        } else {
        let user = this.$lodash.filter(this.users2, e=>{
          return e.email === this.email
        })
        return user[0]
      }
      } catch (err) {
        console.log(err)
        return 0
      }
    }
  },
  mounted () {
    this.$bindAsArray('users2', this.$database.ref('users'))
    this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
    setTimeout(() => {
      this.notifyUsers()
    }, 3000)
  },
  data: function () {
    return {
      schedules: [],
      users2: [],
      email: '',
      password: '',
      spinner: false,
      user: [],
    }
  },
  methods: {
    notifyUsers () {
      let allSched = new Array()
      let scheds = this.schedules
      this.$lodash.forEach(scheds, s => {
        this.$lodash.forEach(s.activities, act => {
          allSched.push(act)
        })
      })
      // console.log('all act', allSched)
      let sorted = this.$lodash.orderBy(allSched,function(value) {return new Date(value.startDate)},'asc')
      // console.log('all act', sorted)
      let upcoming5 = new Array()
      for (var i = 0; i < sorted.length; i++) {
        let dif = this.$mathMixin.dayDiff(new Date(), new Date(sorted[i].startDate))
        if (dif >= 0 && sorted[i].type !== 'payment') {
          upcoming5.push(sorted[i])
          if (upcoming5.length === 5) {
            i = sorted.length
          }
        }
      }
      this.$lodash.forEach(upcoming5, up => {
        up.seen = false
      })
      this.$lodash.forEach(this.users2, u => {
        let key = u['.key']
        this.$database.ref(`users/${key}/notification`).child('upcomingActivities').set(upcoming5)
          .then(() => {
            console.log('done')
          })
          .catch(err => {
            console.log('err', err)
          })
      })
    },
    login () {
      this.spinner = true
      let self = this
      // let username = this.email + '@maleficent.com'

      let username = this.email
      this.$auth.signInWithEmailAndPassword(username, this.password)
        .then(user => {
          console.log('click')
          setTimeout(() => {
            console.log('processing')
            var uid = user.user.uid
            self.$bindAsArray('user', this.$database.ref(`users`).orderByKey().equalTo(uid))
            console.log('user', this.user)
            self.$store.state.user = this.user
            self.$q.localStorage.set('user', uid)
            self.spinner = false
            console.log('userlogin', this.user)
            if (typeof this.user[0] !== 'undefined' && this.user[0].activated === true) {
              self.$router.push('/dashboard')  
            } else {
              this.logout()
              this.$q.notify('Incorrect Email and Password')
              self.$router.push('/')  
            }
            
            // var role = this.userInfo.role
            // console.log('userinfo', this.userInfo, role)
            // if (role === 'Admin') {
            //   this.$store.state.userType = 'Admin'
            //   console.log('usertype', this.$store.state.userType)
            //   this.$router.push('/admin')
            // }
            // else if (role === 'Chef') {
            //   this.$store.state.userType = 'Chef'
            //   this.$router.push('/chef')
            // }
            // else if (role === 'Cashier') {
            //   this.$store.state.userType = 'Cashier'
            //   this.$router.push('/cashier')
            // }
          }, 5000)
        })
        .catch(err => {
          this.$q.dialog({
            title: 'Error',
            message: 'Error Occured'
          })
          this.spinner = false
        })
    },
    logout () {
      this.$auth.signOut().then(() => {
        console.log('Logout Successfull')
        this.$store.state.userType = ''
        this.$router.push('/')
        this.$q.localStorage.remove('user')
      })
    }
    // test () {
    //   console.log('users', this.users2)
    // }
  }
}
</script>

<style>
.textLogin{
  font-family: 'Raleway', sans-serif;
  margin: 0; padding: 0;
  box-sizing: border-box;
  }
</style>
