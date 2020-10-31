<template>
	<q-page>
		<!-- data table -->
		<div class="q-ma-md">
			<q-table
				title="Contract Signed Models"
		    :data="contractSigned"
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
			    	<div class="flex flex-center col-md col">
			    		<div class="q-ma-md" :style='"border-radius:15px; width: 320px;height:225px;background-position: center;background-image: url("+model.photo+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>

			    		<div v-if="model.photo2" class="" :style='"border-radius:15px; width: 320px;height:225px;background-position: center;background-image: url("+model.photo2+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>
		    		</div>
		    	</div>

		    	<q-tabs color="dark">
					  <!-- Tabs - notice slot="title" -->
					  <q-tab default slot="title" name="tab-1" label="Personal Information" />
					  <q-tab slot="title" name="tab-4" label="Ratings" />
					  <q-tab slot="title" :disable="isEdit" name="tab-2" label="Payment Dues" />
					  <q-tab slot="title" :disable="isEdit" name="tab-3" label="Activities Attended" />

					  <!-- Targets -->
					  <q-tab-pane name="tab-1">
					  			   <q-chip class="q-body-1 q-mb-sm q-pa-sm" color="info">{{model.eventName}} - {{model.seasonName}} - Batch {{getModelBatch}} <q-btn v-if="!isEdit" color="dark" rounded icon="edit" size="xs" label="Change Event" class="q-ml-md"/></q-chip>
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
					  	<span class="q-title">Payment Type: {{$lodash.capitalize(model.paymentTerms)}}</span>
					  	  <div class="q-ma-md" v-for="(payment, i) in getModelsPaymentTransactions(model)" :key="i">
						      <q-collapsible popup>
						      	<template slot="header">
						      		 <q-item-side>
						      		 	<q-icon name="payment" size="24px" />
						      		 </q-item-side>
									    <q-item-main :label="`Payment ${i+1}`" :sublabel="`Due Date: ${$moment(payment.create_time).format('ll')}`"/>
									    <q-item-side right>
									      <q-icon v-if="isPaid(payment)" name="done" color="positive" size="24px" />
									      <q-icon v-if="isPaymentOverDue(payment)" name="highlight_off" color="negative" size="24px" />
									    </q-item-side>
									  </template>
									  <!-- content here -->
									  <div class="row">
									  	<div class="col">
									  		<p>Date Paid: {{$moment(payment.create_time).format('ll')}}</p>
									  		<p>Payment ID: {{payment.id}}</p>
								 		  	<p>Payment Status: {{payment.state}} </p>
										  	<p>Amount Paid: P {{payment.transaction_amount}}</p>	 
									  	</div>
									  	<div class="col">
										  	<p>Payment Method: {{$lodash.capitalize(payment.payer.payment_method)}} </p>
										  	<p>Payer Info: </p>
										  	<p style="text-indent: 30pt">Full Name: {{$lodash.capitalize(payment.payer.payer_info.first_name)}} {{$lodash.capitalize(payment.payer.payer_info.last_name)}}</p>
										  	<p style="text-indent: 30pt">Email: {{payment.payer.payer_info.email}}</p>
									  	</div>
									  </div>
						      </q-collapsible>
						    </div>
					  </q-tab-pane>

							<!-- activities attended -->
					  <q-tab-pane name="tab-3">
					  	<div class="">
					  		<q-list highlight>
								  <q-list-header >Activities Attended</q-list-header>
								  <q-item tag="label" v-for="(act, i) in modelActivityAttended" :key="i">
								  	<q-item-side inverted icon="event_available" color="info" text-color="black" />
									  <q-item-main>
									    <q-item-tile label>{{act['.key']}}</q-item-tile>
									    <q-item-tile sublabel>{{$moment(getActSchedule(act['.key']).startDate).format('ll')}}</q-item-tile>
									  </q-item-main>
									</q-item>
								</q-list>
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

export default {
	name: 'ContractSigned',
	mounted () {
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('paymentRecords', this.$database.ref('payment_transactions'))
		this.$bindAsArray('attendance', this.$database.ref('attendance'))
		this.$bindAsArray('inHouseModels', this.$database.ref('inhouseModels'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
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
			} catch {
				return ''
			}	
		}
	},
	data () {
		return {
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
			viewModelModal: false,
			schedules: [],
			contractSigned: [],
			filter: '',
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
		getPaymentInfoEmail (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return payment.payer.payer_info.email
			} catch {
				return ''
			}
		},
		getPaymentInfoFullName (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return `${payment.payer.payer_info.last_name}, ${payment.payer.payer_info.first_name}`
			} catch {
				return ''
			}
		},
		getPaymentInfoMethod (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return payment.payer.payment_method
			} catch {
				return ''
			}
		},
		getPaymentInfoAmount (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return payment.transaction_amount
			} catch {
				return ''
			}
		},
		getPaymentStatus (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return payment.state
			} catch {
				return ''
			}
		},
		getPaymentDatePaid (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return payment.create_time
			} catch {
				return ''
			}
		},
		getPaymentInfoID (p) {
			try {
				let payment = this.$lodash.filter(this.paymentRecords, pr => {
					return pr.modelKey === this.model['.key'] && pr.title === p.id
				})[0]
				return payment.id
			} catch {
				return ''
			}
		},
		isPaymentOverDue (p) {
			let diff = this.$mathMixin.dayDiff(new Date(), new Date(p.startDate))
			if (p.paidStatus) {
				return false
			} else {
				if (diff < 0) {
					return true
				}
			}
		},
		isPaid (p) {
			return p.paidStatus
		},
		rowClick (p) {
			// console.log('model', p)
			this.model = p
			console.log('p',this.model)
			this.viewModelModal = !this.viewModelModal
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
			} catch {
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
				  let modelToSave = {...this.model}
					var key = modelToSave['.key']
					delete modelToSave['.key']
					this.$database.ref('contractSigned').child(key).update(modelToSave)
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
				toInhouse.height = ''
				toInhouse.chest = 0
				toInhouse.waist = 0
				toInhouse.hips = 0
				toInhouse.complexion = ''
				toInhouse.shirtSize = ''
				toInhouse.shoeSize = 0
				toInhouse.fbLink = ''
				delete toInhouse['.key']
				this.$database.ref('inhouseModels').child(key).set(toInhouse)
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
			let testvar = this.test()
			console.log('act sched', testvar)
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
    }
    //end of methods
	}
}
</script>
