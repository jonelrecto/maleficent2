<template>
	<div>
		<div
		  class="fb-like"
		  data-share="true"
		  data-width="450"
		  data-show-faces="true">
		</div>

		<facebook-login class="button"
      appId="442419382914874"
      @login="getUserData"
      @logout="onLogout"
      @sdk-loaded="sdkLoaded"
      @get-initial-status="getUserData">
    </facebook-login>
    <!-- <q-btn label="test" @click="test" /> -->
	</div>
</template>
<script>
	import facebookLogin from 'facebook-login-vuejs'
// FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });

let response = {
  status: 'connected',
  authResponse: {
      accessToken: '',
      expiresIn:'',
      signedRequest:'',
      userID:''
  }
}

export default {
	components: {
		facebookLogin
	},
	data () {
		return {
      isConnected: false,
      name: '',
      email: '',
      personalID: '',
      link: '',
      birthday: '',
      FB: undefined
		}
	},
	methods: {
		getUserData (data) {
			console.log('fb data', data)
			let self = this
			data.FB.api('/me', 'GET', { fields: 'id,name,email,link' },
        userInformation => {
        	console.log('userinfo', userInformation)
          self.personalID = userInformation.id;
          self.email = userInformation.email;
          self.name = userInformation.name;
          self.link = userInformation.link;
          // self.birthday = userInformation.birthday;
        }
      )
		},
		sdkLoaded(payload) {
      // this.isConnected = payload.isConnected
      // this.FB = payload.FB
      // console.log('fb', this.FB)
      // if (this.isConnected) this.getUserData()
    },
	  onLogout() {
      this.isConnected = false;
    },
    test () {
    	console.log('personal', this.personalID)
      console.log('email', this.email)
      console.log('name', this.name)
      console.log('name', this.link)
      console.log('name', this.birthday)
    }
	}
}

</script>
