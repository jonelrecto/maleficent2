<template>
	<q-page>
		<!-- data table -->
		<div class="q-ma-md">
			<q-table
				title="In-House Models"
		    :data="inHouseModels"
        :loading="tableLoading"
		    :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
		    row-key="code"
		  >
				<!-- search -->
	      <template slot="top-right" slot-scope="props">
	        <q-search
	          color="secondary"
	          v-model="filter"
	          class="col-10"
	        />
	      </template>
		  	<!-- click row -->
		  	<q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row)" class="cursor-pointer">
	        <q-td v-for="col in props.cols" :key="col.name" :props="props">
	          {{ col.value }}
	          <p v-if="col.name === 'batch'">{{getBatchNumber(props)}}</p>
	          <!-- <div v-if="col.name === 'actions'">
	          	<q-btn label="Copy To InHouse" rounded color="positive" size="sm" icon="file_copy" @click="" />
	          </div> -->
	        </q-td>
	      </q-tr>

      </q-table>
		</div>

		<!-- sticky button -->
<!-- 		<q-page-sticky position="bottom-right" :offset="[60, 18]">
		  <q-btn
		    round
		    size="lg"
		    color="primary"
		    @click=""
		    icon="event"
		  />
		</q-page-sticky> -->


		<!-- modal -->
		<q-modal  v-model="viewModelModal" :content-css="{minWidth: '80vh', minHeight: '95vh'}" @hide="isEdit = false">
		  <q-modal-layout>
		    <q-toolbar slot="header" color="faded">
		      <q-toolbar-title>
		      	Account Number: {{model.accountNumber}}
		      	 <span slot="subtitle">
				      Date Signed: {{$moment(model.dateSigned).format('ll')}}
				    </span>
		      </q-toolbar-title>
		      <q-btn v-if="!isEdit" rounded color="secondary" size="sm" label="Edit" icon="edit" @click="isEdit = true" class="q-mx-sm"/>
		      <q-btn v-if="!isEdit && !isAlreadyInhouse" label="Copy To InHouse" class="q-mr-xl" rounded color="positive" size="sm" icon="file_copy" @click="copyToInhouse()" />
		      		      <q-btn
		        flat
		        round
		        dense
		        v-close-overlay
		        icon="close"
		        class="float-right"
		      />
		    </q-toolbar>

		    <div v-if="isEdit" class="row" slot="footer">
	      	<q-btn class="full-width col" color="positive" label="Save" icon="save" @click="saveChange()"/>
	      	<q-btn class="full-width col" color="negative" label="Cancel" icon="cancel" @click="isEdit = false"/>
	      </div>

		    <div class="q-ma-md">	    	
		    	<div>
			    	<div class="flex flex-center col-md col q-pa-sm">
					  		<q-carousel class="text-white" style="border-radius:15px;"  color="white"  infinite autoplay>
              <q-carousel-slide :style='"background-position: center;background-image: url("+getSelectedGallery+");background-repeat: no-repeat;background-size: cover;"' style="width: 400px; height: 280px;" v-if="getSelectedGallery !== []">
              </q-carousel-slide>
            </q-carousel>
		    		</div>
		    	</div>

		    	<q-tabs color="dark">
					  <!-- Tabs - notice slot="title" -->
					  <q-tab default slot="title" name="tab-1" label="Personal Information" />
					  <q-tab slot="title" name="tab-4" label="Ratings" />
					  <q-tab slot="title" name="tab-2" label="Setcard Details" />
					  <q-tab slot="title" name="tab-3"  label="Portfolio Gallery"/>

					  <!-- Targets -->
					  <q-tab-pane name="tab-1">
					  			   <q-chip class="q-body-1 q-mb-sm q-pa-sm" color="info">{{model.eventName}} - {{model.seasonName}} - Batch {{getModelBatch}}</q-chip>
				    	<div class="row q-ma-md">

				    		<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.lastName" stack-label="Last Name" />

					      <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.firstName" stack-label="First Name" />

								<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.middleInitial" stack-label="Middle Name" />
				    	</div>

				      <div class="row q-ma-md">
				      	<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.age" stack-label="Age" />

								<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.gender" stack-label="Gender" />	
				      </div>
							
							<q-input :readonly="!isEdit" class="q-mx-md" type="textarea" v-model="model.address" stack-label="Address"  :max-height="100" rows="5" />

							<div class="row q-my-md">
								<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.telNumber" stack-label="Telephone" />
								<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.email" stack-label="Facebook Email" />
							</div>
							<div class="row">
								<q-input :readonly="!isEdit" class="col-5 q-mx-md" v-model="model.mobileNumber" stack-label="Mobile Number" />
							</div>

							<div>
								<q-input :readonly="!isEdit" class="q-ma-md" type="textarea" v-model="model.pastModelExp"  :max-height="100" rows="5" stack-label="Past Modeling Experience"/>
							</div>
					  </q-tab-pane>


					  <q-tab-pane name="tab-2">
					  	<!-- portfolio data -->
					  		<div class="row">
				        <q-field
				          icon="accessibility_new"
				          label="Vital Statistics"
				          label-width="12"
				          class="q-ma-sm"
				        >
				    		<q-input :readonly="!isEdit" class="col q-mx-md" type="number" v-model="model.chest" stack-label="Chest" />

					      <q-input :readonly="!isEdit" class="col q-mx-md" type="number" v-model="model.waist" stack-label="Waist" />

								<q-input :readonly="!isEdit" class="col q-mx-md" type="number" v-model="model.hips" stack-label="Hips" />
							</q-field>
							<q-field
				          icon="multiline_chart"
				          label="Other Measurements"
				          label-width="12"
				          class="q-ma-sm"
				        >
				    		<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.height" stack-label="Height" />

					      <q-input :readonly="!isEdit" class="col q-mx-md" type="number" v-model="model.shoeSize" stack-label="Shoe Size" />

								<q-select float-label="Shirt Size" :options="shirtSize" class="col q-mx-md" value="" v-model="model.shirtSize" :readonly="!isEdit"/>
							</q-field>
				    	</div>
				    		<q-field
				          icon="multiline_chart"
				          label="Other Details"
				          label-width="12"
				          class="q-ma-sm"
				        >
				    		<div class="row">
				    		<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.complexion" stack-label="Complexion" />	
				      	<q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.fbLink" stack-label="Facebook Link" />
				      </div>
				    </q-field>
					  </q-tab-pane>

							<!-- activities attended -->
					  <q-tab-pane name="tab-3">
					  	<div class="row">
					  							    <q-table
				          grid
				          hide-header
				          :rows-per-page-options="[4]"
				          :columns="galleryColumns"
				          :data="getPhotoGallery"
				           :pagination.sync="Modelpagination"
				          :filter="filter"
				          :selection="selectionGallery"
				          :selected.sync="selectedGallery"
				          row-key="name"
				          class="col-12 q-pa-xs"
				        >

				          <div
				            slot="item"
				            slot-scope="props"
				            class="q-pa-xs col-xs-3  transition-generic"
				            :style="props.selected ? 'transform: scale(0.90);': ''"
				          >
				          <q-card class="transition-generic cursor-pointer"
				          :class="props.selected ? 'bg-dark shadow-12' : ''"
				           style="border-radius:10px;"
				          @click.native="props.selected = !props.selected" >
				          <q-card-media overlay-position="bottom"  :style='"background-position: center;background-image: url("+props.row.photo+");background-repeat: no-repeat;background-size: cover;"' style="min-width: 100px; min-height: 150px; max-height: 100px;">
				          	<q-btn size="sm" icon="close" round color="red" class="q-ma-sm float-right" v-if="editGallery" @click="deleteGalleryPhoto(props.row)"/>
				        </q-card-media>
				            </q-card>
				          </div>
				           <div slot="bottom" slot-scope="props" class="row flex-center fit">
				        <q-btn
				          round dense icon="chevron_left" color="dark" class=""
				          :disable="props.isFirstPage"
				          @click="props.prevPage"
				        />
				        <q-btn size="sm" rounded color="black" outline label="edit portfolio gallery" class="q-ma-sm float-right" @click="editGallery = !editGallery"/>
				        <q-btn
				          round dense icon="chevron_right" color="dark"
				          :disable="props.isLastPage"
				          @click="props.nextPage"
				        />
				        
				      </div>
        </q-table>
					  		<div class="col-12 q-pa-sm">
					  	<q-field
				          icon="photo"
				          label="Upload Portfolio\s"
				          label-width="12"
				          class="q-ma-sm"
				        >
				          <q-uploader
				            class="col-12 q-pa-sm"
				            :url="photoGallery"
				            name="modelPortfolio"
				            hide-upload-progress
				            float-label="Model Portfolio"
				            hide-upload-button
				            auto-expand
				            @add="(photoAdded)"
				            @remove="(photoRemoved)"
				            ref="upld"
				            extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'"
				          />
				          <q-btn label="Upload" @click="uploadGallery" rounded color="teal" class="full-width" :loading="loading"></q-btn>
						    </q-field>
						  </div>
					  	</div>
					  </q-tab-pane>

					  <q-tab-pane name="tab-4">
							<div class="layout-padding">
								<p class="q-title">Commercial</p>
								<q-rating
									size="50px"
								  :readonly="!isEdit"
								  v-model="model.ratings.commercial"
								  :max="5"
								/>
								<p class="q-title">Photoshoot</p>
								<q-rating
									size="50px"
								  :readonly="!isEdit"
								  v-model="model.ratings.photoshoot"
								  :max="5"
								/>
								<p class="q-title">Runway</p>
								<q-rating
									size="50px"
								  :readonly="!isEdit"
								  v-model="model.ratings.runway"
								  :max="5"
								/>
							</div>
					  </q-tab-pane>

					</q-tabs>

		    </div>
		  </q-modal-layout>
		</q-modal>
	</q-page>
</template>
<script>
let sri = require('simple-random-id')
export default {
	name: 'InhouseModels',
	mounted () {
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('paymentRecords', this.$database.ref('payment_transactions'))
		this.$bindAsArray('attendance', this.$database.ref('attendance'))
		this.$bindAsArray('inHouseModels', this.$database.ref('inhouseModels'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.storageRef = this.$firebase.storage().ref()
	},
	computed: {
		 getModelInfo () {
      try {
            let modelList = this.$lodash.filter(this.contractsigned, c => {
            return c.accountNumber === model.accountNumber
          })
          // console.log('model Info', modelList[0])
          return modelList[0]
      } catch (err) {
        return []
      }
    },
     getSelectedGallery() {
      try {
          if(this.selectedGallery === []) {
            return 'assets/gallerydefault.png'
          } else {
            return this.selectedGallery[0].photo
          }
      } catch (err) {
        return 'assets/gallerydefault.png'
      }
    },
		modelActivityAttended () {
			let actAttendance = new Array ()
			this.$lodash.map(this.attendance, a => {
				this.$lodash.map(a, (value, key, obj) => {
					if (key !== '.key') {
						var toPush = {
							['.key']: key,
							models: a[key].present
						}
						actAttendance.push(toPush)
					}
				})
			})
			// just change the models to presnt for the actual attendance
			// console.log('actAttendance', actAttendance)

			let modelKey = this.model['.key']
			let actAttended = new Array()
			for (var i = 0; i < actAttendance.length; i++) {
				let presentKeys = this.$lodash.keys(actAttendance[i].models)
				// console.log('present', presentKeys)
				for (var j = 0; j < presentKeys.length; j++) {
					// console.log('present key', presentKeys[j])
					if (modelKey === presentKeys[j]) {
						actAttended.push(actAttendance[i])	
					}
				}
			}
			let map = this.$lodash.map(actAttended, e=> {
					e.startDate = this.getActSchedule(e['.key']).startDate
					return e
			})
      let sorted = this.$lodash.orderBy(map,function(value) {return new Date(value.startDate)},'asc')
      // console.log('sorted',sorted)
      return sorted
		},
		isAlreadyInhouse () {
			var i = this.$lodash.findIndex(this.inHouseModels, im => {
				return im['.key'] === this.model['.key']
			})
			if (i <= -1) {
				return false
			} else {
				return true
			}
		},
		getAttendancePresents () {
			let att = this.attendance
			let presentModels = new Array()
			for (var i = 0; i < att.length; i++) {
				let keys = this.$lodash.keys(att[i])
				// console.log('keys', keys)
				for (var j = 0; j < keys.length; j++) {
					presentModels.push(att[i][keys[j]].present)
				}
			}
			return this.$lodash.compact(presentModels)
		},
		getModelBatch () {
			try {
				let batch = this.$lodash.filter(this.schedules, s => {
					return s['.key'] === this.model.batchKey
				})[0]
				return batch.batchNumber
			} catch(err) {
				return ''
			}	
		},
		getPhotoGallery () {
      try {
        let model = this.model
        console.log('model',this.selectedModel)
        let gallery = this.$lodash.filter(this.inHouseModels, e=>{
          return e['.key'] === model['.key']
        })

        let photos = []
        this.$lodash.forEach(gallery[0].photoGallery, s=> {
          photos.push(s)
        })
        console.log('s',gallery)
        return photos

      } catch (err) {
        return []
      }
    },
	},
	data () {
		return {
			editGallery: false,
			selectedGallery: [],
       selectionGallery: 'single',
			   galleryColumns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'photo',
          required: true,
          label: 'photo',
          align: 'left',
          field: 'photo',
        }
      ],
      	Modelpagination: {
          sortBy: null, // String, column "name" property value
          descending: false,
          page: 1,
          rowsPerPage: 4 // current rows per page being displayed
        },
			showUpload: false,
			 uploadedPhoto: null,
			 photoGallery: '',
			url: 'http://1.1.1.195/upload.php',
			storageRef: null,
			schedules: [],
			inHouseModels: [],
			attendance: [],
			paymentRecords: [],
			isEdit: false,
			model: {
				ratings: {
					commercial: 0,
					photoshoot: 0,
					runway: 0
				}
				},
				shirtSize: [
				{
          label: 'Extra Small (XS)',
          value: 'XS'
        },
        {
          label: 'Small (S)',
          value: 'S'
        },
        {
          label: 'Meduim (M)',
          value: 'M'
        },
        {
          label: 'Large (L)',
          value: 'L'
        },
         {
          label: 'Extra Large (XL)',
          value: 'XL'
        },
      ],
			viewModelModal: false,
			schedules: [],
			contractSigned: [],
			filter: '',
			 loading: false,
			tableLoading: false,
			columns: [
				{
          name: 'accntNumber',
          required: true,
          label: 'Account Number',
          align: 'left',
          field: 'accountNumber',
          sortable: true
        },
        {
          name: 'lastName',
          required: true,
          label: 'Last Name',
          align: 'left',
          field: 'lastName',
          sortable: true
        },
        {
          name: 'firstName',
          required: true,
          label: 'First Name',
          align: 'left',
          field: 'firstName',
          sortable: true
        },
        {
          name: 'event',
          required: true,
          label: 'Event',
          align: 'left',
          field: 'eventName',
          sortable: true
        },
        {
          name: 'season',
          required: true,
          label: 'Season',
          align: 'left',
          field: 'seasonName',
          sortable: true
        },
        {
          name: 'batch',
          required: true,
          label: 'Batch',
          align: 'left',
          sortable: true
        },
        {
          name: 'gender',
          required: true,
          label: 'Gender',
          align: 'left',
          field: 'gender',
          sortable: true
        },
        {
          name: 'fbEmail',
          required: true,
          label: 'Facebook Email',
          align: 'left',
          field: 'email',
          sortable: true
        }
      ],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
		}
	},
	methods: {
		 photoAdded (p) {
      this.uploadedPhoto = p
    },
     photoRemove () {
      this.uploadedPhoto = null
    },
    uploadGallery() {
    	if(this.$refs.upld.files.length === 0) {
    		vm.$q.notify({
                message: `No Photo Uploaded`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'negative'
              })
    	} else {
    	this.loading = true
    	let random = sri(9)
    	 console.log('upload na',random)
    	 console.log(this.model['.key'])
    	 let key = this.model['.key']
    	 this.uploadedPhoto = this.$refs.upld.files[0]
    	  let vm = this
      let uploadTask = this.storageRef.child(`portfolio/${this.model.lastName}${random}__${this.$refs.upld.name}`).put(this.uploadedPhoto)
      uploadTask.on('state_changed', function (snapshot) {
        // var prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // vm.progress1 = prog
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
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          vm.photoGallery = downloadURL
          let push = {
          	name: sri(5),
          	photo: vm.photoGallery
          }
          vm.$database.ref('inhouseModels/'+key+'/photoGallery').push(push)
          .then(()=>{
          	   vm.$q.notify({
                message: `Portfolio Added`,
                type: 'positive',
                color: 'positive',
                textColor: 'white',
                icon: 'info'
              })
          	  vm.$refs.upld.clear()
          	  vm.$refs.upld.reset()
          	  vm.loading = false
          })
          .catch((err)=> {
          	console.log(err)
          	vm.$q.notify({
                message: `Portfolio Not Added`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'warning'
              })
          	  vm.$refs.upld.clear()
          	  vm.$refs.upld.reset()
          	  vm.loading = false
          })
        })
    	})
    }
    },
    deleteGalleryPhoto (name) {
    	console.log(name)
    	let key = this.model['.key']
    	console.log(key)
    	console.log(this.model.photoGallery)
    	let filter = this.$lodash.findKey(this.model.photoGallery,['name',name.name]);
    	console.log(filter)
    	this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to delete this photo?',
			  ok: 'Delete',
			  cancel: 'Cancel'
			}).then(() => {
				this.$database.ref('inhouseModels/'+key+'/photoGallery').child(filter).remove()
						.then(() => {
							this.$q.notify({
								message: 'Picture Deleted',
								type: 'positive'
							})
							this.editGallery = false
						})						
						.catch(err => {
							this.$q.notify({
								message: `An error found, ${err}`,
								type: 'negative'
							})
							this.editGallery = false
						})
			})
    },
		rowClick (p) {
			// console.log('model', p)
			this.model = p
			console.log('p',this.model)
			this.viewModelModal = !this.viewModelModal
			this.selectedGallery = [this.getPhotoGallery[0]]
		},
		getBatchNumber (p) {
			// console.log('p', p)
			try {
				let batchKey = p.row.batchKey
				let batch = this.$lodash.filter(this.schedules, s => {
					return s['.key'] === batchKey
				})[0]
				// console.log('batch', batch)
				return batch.batchNumber
			} catch (err) {
				return ''
			}
		},
		saveChange () {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to save change?',
			  ok: 'Save',
			  cancel: 'Cancel'
			}).then(() => {
				console.log('edit',this.model)
				  let modelToSave = {...this.model}
					var key = modelToSave['.key']
					console.log(key)
					delete modelToSave['.key']
					this.$database.ref('inhouseModels').child(key).update(modelToSave)
						.then(() => {
							this.$q.notify({
								message: 'Model Successfully change',
								type: 'positive'
							})
							this.isEdit = false
						})
						.catch(err => {
							this.$q.notify({
								message: `An error found, ${err}`,
								type: 'negative'
							})
							 this.isEdit = false
						})
				})
				.catch(() => {})
		},
		copyToInhouse () {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to copy in Inhouse models?',
			  ok: 'Save',
			  cancel: 'Cancel'
			}).then(() => {
				var toInhouse = {...this.model}
				var key = toInhouse['.key']
				delete toInhouse['.key']
				this.$database.ref('inHouseModels').child(key).set(toInhouse)
					.then(() => {
						this.$q.notify({
							message: 'Model Successfully copy to inhouse',
							type: 'positive'
						})
					})
					.catch(err => {
						this.$q.notify({
							message: 'An error occur' + err,
							type: 'negative'
						})
					})
				})
				.catch(() => {})
		},
		getActSchedule (actID) {
			// console.log('modelActivityAttended', this.modelActivityAttended)
			// var testVar = 'TS(1)_batch(1)_General Rehersal'
			for (var i = 0; i < this.schedules.length; i++) {
				for (var j = 0; j < this.schedules[i].activities.length; j++) {
					if (this.schedules[i].activities[j].id === actID) {
						return this.schedules[i].activities[j]
					}
				}
			}
		},
		test () {
			console.log(this.$refs.upld)
			console.log(this.$refs.upld.files.length)
		},
		getModelsPaymentTransactions (k) {
      try {
      	let model = k
        let payments = this.$lodash.filter(this.paymentRecords, p=> {
          return p.modelKey === model['.key']
        })
        console.log('modelpayments',payments)
        return payments       
      } catch (err) {
        console.log('error',err)
        return []
      }
    },
    removeDone (file) {
      this.events.push(`remove:done ${file.name}`)
    },
     filtered (files) {
      this.events.push(`${files.length} files didn't pass the filter`)
    },
    reset () {
      this.$refs.upld.reset()
    },
     makeUploadTaskWithTimestamp (file) {
      const originalName = file.name
      const newFilename = `${Date.now()}.${file.name}`
      const metadata = {
        customMetadata: {
          originalName
        }
      }
      return this.storageRef.child(newFilename).put(file, metadata)
    },
    getLoading(){
    	this.$q.loading.show()
    }
    //end of methods
	}
}
</script>
