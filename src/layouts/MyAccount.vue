<template>
  <div class="flex flex-center">
    <div style="width: 420px; max-width: 90vw; " >
      <div class="flex flex-center container row text-center q-pa-lg q-pa-xs" style="background-color: rgba(255, 255, 255, 0.8); border-radius: 50px; max-height: 700px;">
      <div class="col-12">
      </div>
      <div class="col-12 flex flex-center">
      <q-card inline class="q-ma-sm bg-white flex " style="max-width: 350px; max-height: 700px; height:530px; width:350px; border-radius: 20px;">
      <q-card-media class="relative">
        <q-parallax src="statics/unsplash.jpg" :height="230">
          <div slot="loading">Loading...</div>
          <div class="image bg-white" style="width: 140px; height:140px; border-radius: 10px;">
            <img src="statics/MMALogo.jpg" style="width: 130px; height:130px; margin:5px; "/>
          </div>
        </q-parallax>
      </q-card-media>
      <q-card-title>
        <b class="text-dark">WELCOME</b>
      </q-card-title>
      <q-card-separator />
      <q-card-actions>
        <div class="container flex flex-center">
        <div class="col-12 full-width q-pa-sm">
          <q-input value="" v-model="accountNumber" inverted type="text" float-label="Username" color="dark" :before="[{icon: 'account_box', handler () {}}]"/>
        </div>
        <div class="col-12 full-width q-pa-sm">
          <q-input value="" v-model="password" inverted type="password" float-label="Password" color="dark" :before="[{icon: 'lock', handler () {}}]"/>
        </div>
        <div class="col-12 full-width q-pa-sm">
          <q-btn
            color="dark"
            size="lg"
            label="SIGN IN"
            rounded
            outline
            icon-right="send" @click="signIn"
          />
          <!-- $router.push('/accounts/') -->
        </div>
        </div>
      </q-card-actions>
    </q-card>
    </div>
    </div>
  </div>
  </div>
</template>

<style>
</style>

<script>
export default {
  name: 'PageIndex',
  mounted () {
    this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
  },
  data () {
    return {
      contractSigned: [],
      accountNumber: '',
      password: ''
      // NT59MQ5JEW
      // X289Q
    }
  },
  methods: {
    signIn () {
      let index = this.$lodash.findIndex(this.contractSigned, cs => {
        return cs.accountNumber === this.accountNumber && cs.password === this.password
      })
      if (index != -1) {
        console.log('index', index)
        console.log('sign', this.contractSigned)
        this.$q.localStorage.set('modelSigned', this.contractSigned[index]['.key'])
        this.$q.notify({
          message: `Login Succesful`,
          type: 'positive',
          color: 'positive',
          textColor: 'white',
          icon: 'info'
        })
        this.$router.push()
      }
      else {
        this.$q.notify({
          message: `Incorrect Username and Password`,
          type: 'negative',
          color: 'negative',
          textColor: 'white',
          icon: 'warning'
        })
      }
      
    }
  }
}
</script>
