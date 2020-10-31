<template>
	<div>
		<q-toolbar color="faded">
      <q-toolbar-title>
				Contract Signing
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
		</q-toolbar>
		<div class="q-pa-md">
			<q-table
					selection="multiple"
        	:selected.sync="selected"
          :dense="dense"
			    :data="getShowUps"
          :loading="tableLoading"
			    :columns="columns"
          :filter="filter"
          :pagination.sync="pagination"
			    row-key=".key"
			  >
			  	<!-- events selection -->
	        <template slot="top-left" slot-scope="props" class="noprint">
	        	<!-- <p class="caption">Select Event</p> -->
	<!--         	   <q-btn class="noprint" icon-right="print" color="secondary" label="print" @click="printPdf()"></q-btn>
	        	        <q-btn
          flat round dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen" class="noprint"
        /> -->
	          <q-select
	          	filter
		          color="secondary"
		          v-model="filter"
		          :options="eventOpt"
		          hide-underline
		          class="noprint"
		        /> 
	        </template>

	        <template slot="top-right" slot-scope="props" class="noprint">
							        <!-- search -->
						<q-search
							inverted
	            color="dark"
	            v-model="filter"
	            class="col-10 q-ma-sm noprint"
							style="width: 180px;"
							  :after="[
								{
									icon: 'close',
									content: true,
									handler () {
										filter = ''
										// do something...
									}
								}
							]"
	          />
					<!-- button for selected -->
					<div class="noprint">
				<q-btn :label="'View Selected('+getSelectedRowCount+')'" color="primary" class="noprint q-mr-md q-ma-sm float-right cardsButtonsDesktop" @click="showModal"/>
        <q-btn :label="'View Selected('+getSelectedRowCount+')'" color="primary" class="noprint q-mr-md q-ma-sm float-right cardsButtonsMobile" size=""  @click="showModal"/>  </div>
	        </template>
	        <!-- batch -->
	          <q-td slot="body-cell-batch" slot-scope="props" :props="props">
	            <p>{{getBatch(props.row)}}</p>
	          </q-td>
	        <!-- action button -->
          <q-td slot="body-cell-actions" slot-scope="props" :props="props">
            <q-btn color="secondary" icon="edit" @click="viewInfo(props.row)" label="Signed" class="noprint"/>
            <!-- <q-btn color='negative' icon="delete" @click="" /> -->
          </q-td>
        </q-table>
		</div>
		<!-- signed modal -->
		<q-modal v-model="signedModal" :content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearModal">
      <q-modal-layout>
        <q-toolbar slot="header" color="faded">
		    	<q-toolbar-title>
						Confirm Contract Sign
					</q-toolbar-title>
           <q-btn
              flat
              round
              dense
              @click="signedModal = false"
              icon="close"
            />
		    </q-toolbar>
		    <!-- content -->
		    <div class="container cardsButtonsDesktop q-pa-sm">
		    	<div class="row">
		    		<div class="col-6-md col-6">
		      <div class="q-ma-md" :style='"border-radius:15px; width: 300px;height:215px;background-position: center;background-image: url("+model.photo+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>
		      		<div class="q-ma-md" :style='"border-radius:15px; width: 300px;height:215px;background-position: center;background-image: url("+model.photo2+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>
		    		</div> 		
		      <div class="col-6-md col-6">
		    	<q-input readonly type="text" class="q-ma-md" v-model="model.accountNumber" stack-label="Account Number"/>
		    	<q-input readonly type="text" class="q-ma-md" v-model="model.eventName" stack-label="Event"/>	
		    	<q-input readonly type="text" class="q-ma-md" v-model="model.lastName" stack-label="Last Name"/>
			    <q-input readonly type="text" class="q-ma-md" v-model="model.firstName" stack-label="First Name"/>
			     <q-input readonly type="text" class="q-ma-md" v-model="model.age" stack-label="Age"/>	
			    <q-input readonly type="text" class="q-ma-md" v-model="model.gender" stack-label="Gender"/>	
			    <q-input readonly type="text" class="q-ma-md" v-model="model.mobileNumber" stack-label="Mobile Number"/>	
			    <q-input readonly type="text" class="q-ma-md" v-model="model.email" stack-label="FB Link"/>	
		    	</div>
		    </div>
		  </div>
		    <div class="container flex-center q-ma-sm cardsButtonsMobile">
		    		<div class="col-6-md col-6">
		    			<q-carousel class="full-width">
							  <q-carousel-slide>
							       <div class="" :style='"border-radius:15px; width: 320px;height:225px;background-position: center;background-image: url("+model.photo+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>
							  </q-carousel-slide>
							  <q-carousel-slide>
							    		<div class="" :style='"border-radius:15px; width: 320px;height:225px;background-position: center;background-image: url("+model.photo2+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>
							  </q-carousel-slide>
							</q-carousel>
		    		</div> 		
		      <div class="col-6-md col-6">
		    	<q-input readonly type="text" class="q-ma-md" v-model="model.accountNumber" stack-label="Account Number"/>
		    	<q-input readonly type="text" class="q-ma-md" v-model="model.eventName" stack-label="Event"/>	
		    	<q-input readonly type="text" class="q-ma-md" v-model="model.lastName" stack-label="Last Name"/>
			    <q-input readonly type="text" class="q-ma-md" v-model="model.firstName" stack-label="First Name"/>
			    <q-input readonly type="text" class="q-ma-md" v-model="model.age" stack-label="Age"/>	
			    <q-input readonly type="text" class="q-ma-md" v-model="model.gender" stack-label="Gender"/>	
			    <q-input readonly type="text" class="q-ma-md" v-model="model.mobileNumber" stack-label="Mobile Number"/>	
			    <q-input readonly type="text" class="q-ma-md" v-model="model.email" stack-label="FB Link"/>	
		    	</div>
		    </div>
		    <div slot="footer">
		    	<q-btn color="secondary" class="full-width" @click="markAsSigned">Signed</q-btn>
		    </div>
        <q-inner-loading :visible="signedLoading">
          <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
        </q-inner-loading>
      </q-modal-layout>
    </q-modal>

		  <q-modal v-model="attendanceModal" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="attendanceModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark">
            <q-toolbar-title>
              For Contract Signing
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm('+getSelectedRowCount+')'" class="q-pa-sm" @click="setContractSigned"/> -->
          </q-toolbar>
          <q-scroll-area style="width: 100%; height: 85vh;">
          					<q-list link dense v-for="s in this.selected" :key="s['.key']">
								<q-item>
									<q-item-side icon="label" color="faded"/>
									<q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
									<q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="UnSelect(s)"/></q-item-side>
								</q-item>
					    	</q-list>
          </q-scroll-area>
					<div slot="footer">
		          <q-btn color="primary" icon="border_color" size="lg" :label="'Contract Signed('+getSelectedRowCount+')'" class="full-width q-pa-sm" @click="setContractSigned"/>
		      </div>
        </q-modal-layout>
      </q-modal>
	</div>
</template>
<style>
.cardsButtonsMobile{
    display: none;
}
.cardsButtonsDesktop{
    display: block;
}
@media print{
   .noprint{
       display:none;
   }
  html, body {
    height:100%; 
    margin: 0 !important; 
    padding: 0 !important;
  } 
}
@media (max-width: 960px){
.qCardMobile{
    width: 90vw;
}
.modelCards{
    width:auto;
    height:600px;
    border-radius:15px;
}
.cardsButtonsMobile{
    display: block;
}
.cardsButtonsDesktop{
    display: none;
}
}
</style>

<script>
import axios from 'axios'

let sri = require('simple-random-id')
	export default {
		mounted () {
			this.$bindAsArray('events', this.$database.ref('events'))
			this.$bindAsArray('models', this.$database.ref('showUpModels'))
			this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
			this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))
		},
		created () {
			this.filter = this.$route.params.id
		},
		computed: {
			// signedModal: {
			// 	get () {
			// 		return this.$store.state.model.signedModal
			// 	},
			// 	set (v) {
			// 		this.$store.state.model.signedModal = v
			// 	}
			// },
			eventOpt () {
				let opt = this.$lodash.map(this.events, e => {
					return { label: e.eventName, value: e.eventName}
				})
				opt.push({label: 'All', value: ''})
				return opt
			},
			filterModels () {
				if (this.selectEvent == 'all') {
					return this.models
				}
				else {
					let filtered = this.$lodash.filter(this.models, m => {
						return m.eventKey == this.selectEvent
					})
					console.log('fil', filtered)
					return filtered
				}
			},
			getShowUps () {
				let showups = this.$lodash.orderBy(this.models,'dateAdded','desc');
				return showups
			},
			getSelectedRowCount () {
        console.log('selectedL',this.selected.length)
        console.log('selectedL',this.selected)
        return this.selected.length
      },
		},
		data () {
			return {
				attendanceModal: false,
				events: [],
				models: [],
				model: {},
				schedules: [],
				selected: [],
				signedModal: false,
				signedLoading: false,
				filter: '',
				tableLoading: false,
				dense: true,
				selectEvent: 'all',
				// eventopt: [
				// 	{ label: 'test', value: 'test'},
				// 	{ label: 'test', value: 'test'},
				// ],
				columns: [
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
	          name: 'eventName',
	          required: true,
	          label: 'Event Name',
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
	          label: 'Batch Number',
	          align: 'left',
	          sortable: true
	        },
	        {
	          name: 'actions',
	          required: true,
	          label: 'Actions',
	          align: 'center',
	          field: 'name',
	          sortable: false
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
			clearModal () {
				this.signedModal = false
				this.model = {}
			},
			viewInfo (props) {
				this.model = props
				let accntid = this.UsernameGenerator()
				let pass = sri(5)
				let checked = this.UsernameChecker(accntid)
				this.model.accountNumber = checked
				this.model.password = pass
				this.signedModal = true
			},
			markAsSigned () {
				this.$q.dialog({
			    title: 'Save',
			    message: `Do you want to confirm?`,
			    ok: 'Yes',
			    cancel: 'No'
			  }).then(() => {
			      // please clear the activities array
			      var i = this.$lodash.findIndex(this.schedules, s => {
			      	return s['.key'] == this.model.batchKey
			      })
			      let modelSchedule = {...this.schedules[i]}
			      let paymentDueDate = []
			      for (var i = 0; i < modelSchedule.activities.length; i++) {
			      	if (modelSchedule.activities[i].type === 'payment' || modelSchedule.activities[i].type === 'payments') {
			      		modelSchedule.activities[i].paidStatus = false
 			      		paymentDueDate.push(modelSchedule.activities[i])
			      	}
						}
						let ratings = {
			      	photoshoot: 0,
			      	runway: 0,
			      	commercial: 0
			      }
						this.model.paymentDueDate = paymentDueDate
						this.model.ratings = ratings
			      this.model.regFee = modelSchedule.discount
						// this.$store.dispatch('model/markModelContract', this.model)
						this.markModelContract(this.model)
			      this.posting(this.model.mobileNumber, this.model.accountNumber, this.model.password,this.model.firstName)
			    }).catch(() => {})
			},
			getBatch (props) {
				try{
					let index = this.$lodash.findIndex(this.schedules, s => {
						return s['.key'] === props.batchKey
					})
					return this.schedules[index].batchNumber
				} catch {}
			},
			markModelContract (e) {
				let select = e
        let key = select['.key']
				let self = this
				delete select.__index
				select.dateSigned = new Date().toString()
				delete select['.key']
        console.log('model selected', select)
        this.$database.ref(`contractSigned`).child(key).set(select)
					.then(() => {
						console.log('status updated')
						self.$database.ref('showUpModels').child(key).remove()
							.then(() => {
								this.$bindAsArray('models', this.$database.ref('showUpModels'))
								self.$forceUpdate()
							})
							.catch(() => {
								console.log('err on remove')
							})
					})
					.catch((err) => {
						console.log(err)
					})
			},
			setContractSigned () {
				this.$q.dialog({
			    title: 'Save',
			    message: `Do you want to confirm?`,
			    ok: 'Yes',
			    cancel: 'No'
			  }).then(() => {
					for( var x = 0; x < this.selected.length; x++){
						let model = this.selected[x]
						let accntid = this.UsernameGenerator()
						let pass = sri(5)
						let checked = this.UsernameChecker(accntid)
						model.accountNumber = checked
						model.password = pass
						delete model.__index
			      // please clear the activities array
			      var i = this.$lodash.findIndex(this.schedules, s => {
			      	return s['.key'] == model.batchKey
			      })
			      let modelSchedule = {...this.schedules[i]}
			      let paymentDueDate = []
			      for (var i = 0; i < modelSchedule.activities.length; i++) {
			      	if (modelSchedule.activities[i].type === 'payment' || modelSchedule.activities[i].type === 'payments') {
			      		modelSchedule.activities[i].paidStatus = false
 			      		paymentDueDate.push(modelSchedule.activities[i])
			      	}
						}
						let ratings = {
			      	photoshoot: 0,
			      	runway: 0,
			      	commercial: 0
			      }
						model.paymentDueDate = paymentDueDate
						model.ratings = ratings
			      model.regFee = modelSchedule.discount
						// this.$store.dispatch('model/markModelContract', this.model)
						this.markModelContract(model)
						this.posting(model.mobileNumber, model.accountNumber, model.password,model.firstName)
					}
					this.attendanceModal = false
					this.selected = []
			    }).catch(() => {})
			},
			posting (n, a, p,fn) {
      const SMS = {
        mobile_number: '0' + n
      }
      console.log('sms', SMS)
      let name = fn
      let message = `Hi `+fn+`, Your account number is ${a} with a temporary password of ${p}.` +`Use these login details to access your model account. Thank you. -Maleficent Models Academy`
      var data = 'mobile_number=' + SMS.mobile_number + '&' + `message=${message}`
      console.log(data)
      axios.post('https://maleficent-sms.000webhostapp.com/contractsign.php', data)
        .then(response => {
          console.log('response', response)
          this.signedModal = false
        })
        .catch((error) => {
          console.log(error.response)
          this.signedModal = false
        })
         this.signedModal = false
		},
		showModal () {
      this.attendanceModal = true
		},
		UnSelect(e) {
        let un = e
        let update = this.$lodash.filter(this.selected, no =>{
          if (no['.key'] !== un['.key']) {
            return no
          }
        })
        this.selected = update
    },
    UsernameGenerator () {
    	let year = this.$moment().format('YYYY')
    	let uniq = sri(2)
    	let id = ''
    	id = this.$lodash.uniqueId().toString()
    	let new1 = ''
    	if(id.length > 4){
    		new1 = id.slice(-4)
    	} else {
    		let zero = '0000'
    		new1 = zero + id
    		new1 = new1.slice(-4)
    	}
    	let username = 'M-'+year+new1+'-'+uniq
    	console.log('username',username)
    	// let exist = 'M-20180005-U6'
    	// for(var x=0; x < this.contractsigned; x++){
    	// 	if(this.contractsigned.accountNumber === exist){
    	// 		console.log('username',username)
    	// 	} else {
    	// 		console.log('exist',exist)
    	// 	}
    	// }
    	return username
    },
  	UsernameChecker (e){
  		try {
  			  let username = e
		  		for (var x=0; x<this.contractsigned.length; x++){
		  			if(username === this.contractsigned[x].accountNumber){
		  				let newID = this.UsernameGenerator()
		  				return newID
		  			} else {
		  				return username
		  			}
  			}
  		} catch (err) {
  			console.log(err)
  		}
  	},
  	 printPdf () {
      window.print()
    },
		// end of methods
		}
	}
</script>
