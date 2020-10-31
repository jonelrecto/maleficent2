<template>
	<div>
		<!-- <img src="https://firebasestorage.googleapis.com/v0/b/the-maleficent.appspot.com/o/pagePhotos%2FTFS_eventLogo?alt=media&token=d4301589-7c35-4ebb-af79-f5f0adbf5b1f" alt="" class="width: 100px, height: 100px" />	 -->
		

		<div class="q-pa-md">
			<!-- {{event.pagePhotos.eventLogoUrl}} -->
			<p class="caption">Event Logo</p>
			<img class="" :src="getEventPhotoUrl" alt="Image not set" width="100px" height="100px">
			<q-uploader 
				:url="pagePhotos.eventLogoUrl"
        name="eventLogo"
        hide-upload-progress
        float-label="Upload Event Logo"
        hide-upload-button
        auto-expand
        @add="(photoAdded)"
        @remove="(photoRemoved)"
        ref="upld"
        extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" 
        class="fields"
      />
      <span>{{progress1}}%</span>
		<p class="caption">Home Image</p>
		<img class="" :src="getHomePhotoUrl" alt="Image not set" width="100px" height="100px">
			<q-uploader 
					:url="pagePhotos.homeImageUrl"
	        name="homeImageUrl"
	        hide-upload-progress
	        float-label="Up
	        load Home Image"
	        hide-upload-button
	        auto-expand
	        @add="(photoAdded2)"
	        @remove="(photoRemoved2)"
	        ref="upld2"
	        extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" 
	        class="fields"
	      />
	      <span>{{progress2}}%</span>
		<p class="caption">Title Image</p>
		<img class="" :src="getTitlePhotoUrl" alt="Image not set" width="100px" height="100px">
			<q-uploader 
					:url="pagePhotos.titleImageUrl"
	        name="titleImageUrl"
	        hide-upload-progress
	        float-label="Upload Title Image"
	        hide-upload-button
	        auto-expand
	        @add="(photoAdded3)"
	        @remove="(photoRemoved3)"
	        ref="upld3"
	        extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" 
	        class="fields"
	      />
	      <span>{{progress3}}%</span>
		<p class="caption">Registration Image</p>
		<img class="" :src="getRegistrationPhotoUrl" alt="Image not set" width="100px" height="100px">
			<q-uploader 
					:url="pagePhotos.registrationImageUrl"
	        name="registrationImageUrl"
	        hide-upload-progress
	        float-label="Upload Registration Image"
	        hide-upload-button
	        auto-expand
	        @add="(photoAdded4)"
	        @remove="(photoRemoved4)"
	        ref="upld4"
	        extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'" 
	        class="fields"
	      />
	      <span>{{progress4}}%</span>	
		</div>
		<q-btn
      class="full-width textbox"
      color="primary"
      @click="saveItemPhoto"
      label="Save"
    />
    <q-btn
      class="full-width textbox"
      color="primary"
      @click="clearContent"
      label="clear"
    />
	</div>
</template>

<script>

	export default {
		mounted () {
			this.storageRef = this.$firebase.storage().ref()
		},
		props: {
			data: {
				event: Object
			}
		},
		computed: {
			photoAdded (p) {
				var photo = this.$refs.upld.files[0]
	      this.uploadedPhoto = photo
	    },
	    photoAdded2 (p) {
				var photo = this.$refs.upld2.files[0]
	      this.uploadedPhoto2 = photo
	    },
	    photoAdded3 (p) {
				var photo = this.$refs.upld3.files[0]
	      this.uploadedPhoto3 = photo
	    },
	    photoAdded4 (p) {
				var photo = this.$refs.upld4.files[0]
	      this.uploadedPhoto4 = photo
	    },
	    photoRemoved () {
	      this.uploadedPhoto = null
	    },
	    photoRemoved2 () {
	      this.uploadedPhoto2 = null
	    },
	    photoRemoved3 () {
	      this.uploadedPhoto3 = null
	    },
	    photoRemoved4 () {
	      this.uploadedPhoto4 = null
	    },
			event () {
				return this.$store.getters['users/getEvent']
			},
			modalState () {
				if (!this.$store.state.users.eventPagePhotoModal) {
					console.log('modal', this.$store.state.users.eventPagePhotoModal)
					this.clearData()
				}
			},
			getEventPhotoUrl () {
				try {
					return this.event.pagePhotos.eventLogoUrl
				}catch (err) {}
			},
			getHomePhotoUrl () {
				try {
					return this.event.pagePhotos.homeImageUrl
				}catch (err) {}
			},
			getRegistrationPhotoUrl () {
				try {
					return this.event.pagePhotos.registrationImageUrl
				}catch (err) {}
			},
			getTitlePhotoUrl () {
				try {
					return this.event.pagePhotos.titleImageUrl
				}catch (err) {}
			},
		},
		data: () => ({
			storageRef: null,
			uploadedPhoto: null,
			uploadedPhoto2: null,
			uploadedPhoto3: null,
			uploadedPhoto4: null,
			pagePhotos: {
				eventLogoUrl: '',
				homeImageUrl: '',
				titleImageUrl: '',
				registrationImageUrl: ''
			},
			progress1: 0,
			progress2: 0,
			progress3: 0,
			progress4: 0
		}),
		methods: {
			clearContent () {
				this.uploadedPhoto = null
				this.uploadedPhoto2 = null
				this.uploadedPhoto3 = null
				this.uploadedPhoto4 = null
				this.pagePhotos = {
					eventLogoUrl: '',
					homeImageUrl: '',
					titleImageUrl: '',
					registrationImageUrl: ''
				},
				this.progress1 = 0
				this.progress2 = 0
				this.progress3 = 0
				this.progress4 = 0
				this.$refs.upld.clear()
				this.$refs.upld2.clear()
				this.$refs.upld3.clear()
				this.$refs.upld4.clear()
				this.$refs.upld.reset()
				this.$refs.upld2.reset()
				this.$refs.upld3.reset()
				this.$refs.upld4.reset()
			},
			saveItemPhoto () {
				// commit('updateEventPageLoading', true)
				this.$store.state.users.eventPageLoading = true
				this.upload1()
			},
			upload1 () {
				let vm = this
	      let uploadTask = this.storageRef.child(`pagePhotos/${this.event.eventCode}_${this.$refs.upld.name}`).put(this.uploadedPhoto)

	      uploadTask.on('state_changed', function(snapshot){
				  var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				  vm.progress1 = prog
				  // console.log('Upload is ' + prog + '% done')
				}, function (error) {
				  // Handle unsuccessful uploads
				  this.$q.notify({
	          message: `An error occur`,
	          type: 'negative',
	          color: 'negative',
	          textColor: 'white',
	          icon: 'warning'
	        })
				  console.log('error occur', error)
				}, function () {
				  // Handle successful uploads on complete
				  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
				  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		        vm.pagePhotos.eventLogoUrl = downloadURL
		        vm.upload2()
		        // console.log('url photo', vm.pagePhotos)
				  })
				})
	    },
	    upload2 () {
				let vm = this
	      let uploadTask = this.storageRef.child(`pagePhotos/${this.event.eventCode}_${this.$refs.upld2.name}`).put(this.uploadedPhoto2)

	      uploadTask.on('state_changed', function(snapshot){
				  var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				  vm.progress2 = prog
				}, function (error) {
				  // Handle unsuccessful uploads
				  this.$q.notify({
	          message: `An error occur`,
	          type: 'negative',
	          color: 'negative',
	          textColor: 'white',
	          icon: 'warning'
	        })
				  console.log('error occur', error)
				}, function () {
				  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		        vm.pagePhotos.homeImageUrl = downloadURL
		        vm.upload3()
				  })
				})
			},
			upload3 () {
				let vm = this
	      let uploadTask = this.storageRef.child(`pagePhotos/${this.event.eventCode}_${this.$refs.upld3.name}`).put(this.uploadedPhoto3)

	      uploadTask.on('state_changed', function(snapshot){
				  var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				  vm.progress3 = prog
				}, function (error) {
				  // Handle unsuccessful uploads
				  this.$q.notify({
	          message: `An error occur`,
	          type: 'negative',
	          color: 'negative',
	          textColor: 'white',
	          icon: 'warning'
	        })
				  console.log('error occur', error)
				}, function () {
				  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		        vm.pagePhotos.titleImageUrl = downloadURL
		        vm.upload4()
				  })
				})
			},
			upload4 () {
				let vm = this
	      let uploadTask = this.storageRef.child(`pagePhotos/${this.event.eventCode}_${this.$refs.upld4.name}`).put(this.uploadedPhoto4)

	      uploadTask.on('state_changed', function(snapshot){
				  var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
				  vm.progress4 = prog
				}, function (error) {
				  // Handle unsuccessful uploads
				  this.$q.notify({
	          message: `An error occur`,
	          type: 'negative',
	          color: 'negative',
	          textColor: 'white',
	          icon: 'warning'
	        })
				  console.log('error occur', error)
				}, function () {
				  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		        vm.pagePhotos.registrationImageUrl = downloadURL
		        vm.event.pagePhotos = vm.pagePhotos
						console.log(vm.event)
						let what = vm.$firebase.database()
						setTimeout(() => {
							vm.$store.dispatch('users/updateEventPhotos', {payload: vm.event, whatvm: what, quasu: vm.$q})
							vm.progress1 = 0
							vm.progress2 = 0
							vm.progress3 = 0
							vm.progress4 = 0
							vm.clearContent()
							vm.$store.state.users.eventPagePhotoModal = false
						}, 3000)
				  })
				})
			}
		}
	}
</script>