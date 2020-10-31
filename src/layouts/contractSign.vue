<template>
	<div>
		<q-toolbar color="faded">
      <q-toolbar-title>
				Contract Signing
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
		</q-toolbar>
		<div class="layout-padding">
			<q-table
          grid
          :dense="dense"
			    :data="models"
          :loading="tableLoading"
			    :columns="columns"
          :filter="filter"
          :pagination.sync="pagination"
			    row-key="code"
			  >
			  	<!-- events selection -->
	        <template slot="top-left">
	        	<!-- <p class="caption">Select Event</p> -->
	          <q-select
	          	filter
		          color="secondary"
		          v-model="selectEvent"
		          :options="eventOpt"
		          hide-underline
		        />
	        </template>
	        <!-- search -->
	        <template slot="top-right">

	          <q-search
	            color="secondary"
	            v-model="filter"
	            class="col-10"
	          />
	          
	        </template>
	        <!-- batch -->
	          <q-td slot="body-cell-batch" slot-scope="props" :props="props">
	            <p>{{getBatch(props.row)}}</p>
	          </q-td>
	        <!-- action button -->
          <q-td slot="body-cell-actions" slot-scope="props" :props="props">
            <q-btn color="positive" icon="edit" @click="viewInfo(props.row)" label="Signed"/>
            <!-- <q-btn color='negative' icon="delete" @click="" /> -->
          </q-td>
        </q-table>
		</div>
		<!-- signed modal -->
		<q-modal v-model="signedModal" :content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearModal">
      <q-modal-layout
        content-class="{'bg-primary': isPrimary}"
      >
        <q-toolbar slot="header">
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
		    <img :src="model.photo" class="flex-center" style="width: 100px; height: 100px; margin: auto">
		    <q-input readonly type="text" class="q-ma-md" v-model="model.accountNumber" stack-label="Account Number"/>
		    <div class="row q-pa-md">
		    	<q-input readonly type="text" class="col q-mx-md" v-model="model.lastName" stack-label="Last Name"/>
			    <q-input readonly type="text" class="col q-mx-md" v-model="model.firstName" stack-label="First Name"/>
		    </div>
		    <div class="q-px-md">
		    	<q-input readonly type="text" class="q-my-md" v-model="model.eventName" stack-label="Event"/>	
		    	<q-input readonly type="text" class="q-my-md" v-model="model.gender" stack-label="Gender"/>	
		    </div>
		    
		    <div slot="footer">
		    	<q-btn color="positive" class="full-width" @click="markAsSigned">Signed</q-btn>
		    </div>

        <q-inner-loading :visible="signedLoading">
          <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
        </q-inner-loading>
      </q-modal-layout>
    </q-modal>
	</div>
</template>
<script>
import axios from 'axios'

let sri = require('simple-random-id')
	export default {
		mounted () {
			this.$bindAsArray('events', this.$database.ref('events'))
			this.$bindAsArray('models', this.$database.ref('showUpModels'))
			this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		},
		computed: {
			signedModal: {
				get () {
					return this.$store.state.model.signedModal
				},
				set (v) {
					this.$store.state.model.signedModal = v
				}
			},
			eventOpt () {
				let opt = this.$lodash.map(this.events, e => {
					return { label: e.eventName, value: e['.key']}
				})
				opt.push({label: 'All', value: 'all'})
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
		},
		data () {
			return {
				events: [],
				models: [],
				model: {},
				schedules: [],
				// signedModal: false,
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
				let accntid = sri(10)
				let pass = sri(5)
				this.model.accountNumber = accntid
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
			      	if (modelSchedule.activities[i].type === 'payment') {
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
			      console.log('modelSchedule', modelSchedule)
			      this.$store.dispatch('model/markModelContract', this.model)
			      this.posting(this.model.mobileNumber, this.model.accountNumber, this.model.password)
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
			posting (n, a, p) {
      const SMS = {
        mobile_number: '0' + n
      }
      console.log('sms', SMS)
      let message = `Your account is ${a} and password ${p}`
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
    },
		}
	}
</script>
