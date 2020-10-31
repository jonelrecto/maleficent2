<template>
	<q-page class="q-pa-md">
		<q-btn label="test" @click="zzTestingButton" />
<!-- <!- --> 
		<div class="row q-my-md">
			<div class="col-2">
				<q-list inset-separator highlight>
				  <q-list-header>Seasons</q-list-header>
				  <q-item  v-for="(season, i) in getSeasons" :key="i" @click.native="selectedSeason = season">
			  		<q-item-main>{{season.seasonName}}</q-item-main>
				    <q-item-side right>
				      <q-item-tile v-if="season.status === 'standby'" icon="build" color="warning" />
				      <q-item-tile v-if="season.status === 'open'" icon="sync" color="blue" />
				      <q-item-tile v-if="season.status === 'finished'" icon="done" color="green" />
				    </q-item-side>	
				  </q-item>
				</q-list>	
			</div>
			<div class="col q-ml-md">
			<q-table
			    :title="selectedSeason.seasonName"
			    :data="getRecords"
			    :columns="Modelcolumns"
			    :filter="filter"
			    row-key="batchNumber"
			  >

			  <template slot="top-left" class="">
				<q-field
					:label="selectedSeason.seasonName"
					>
				<q-btn-group outline class="q-mx-md">
					<q-btn outline size="sm" label="Due" @click="showDue"/>
					<q-btn outline size="sm" label="Verified" @click="showVerified"/>
				</q-btn-group>
				</q-field>
				<q-btn-group outline class="q-mx-md">
					<q-btn outline size="sm" label="Fully Paid"  @click="showFull"/>
					<q-btn outline size="sm" label="PassDue" @click="showPassDue"/>
					<q-btn outline size="sm" label="OverDue" @click="showOverDue"/>
					<q-btn outline size="sm" label="Unsettled Payments" @click="showUnsetlled"/>
				</q-btn-group>
			  </template>
			 <template slot="top-right" class="">
        <q-search hide-underline inverted v-model="filter" class="bg-dark" style="width: 180px;" @input="test"/>
      </template>
			      <q-td slot="body-cell-firstName" slot-scope="props" :props="props">
          {{props.row.firstName}}
          </q-td>
          	<q-td slot="body-cell-payments" slot-scope="props" :props="props">
          		<q-btn-dropdown label="Payment Records" size="sm">
          		<q-list highlight link dense v-for="(pay,i) in getModelsPaymentTransactions(props.row['.key'])" :key="i">
						  <q-item>
						    <q-item-main class="">₱ {{pay.transaction_amount}} - {{pay.title.slice(-10)}} - {{$moment(pay.create_time).format('ll')}}</q-item-main>
						  </q-item>
						</q-list>
					</q-btn-dropdown>
          	</q-td>
			<q-td slot="body-cell-verification" slot-scope="props" :props="props">
				<q-btn size="sm" v-if="hidePaymentVerificationBtn" :disabled="verified_full" label="Payment Verification" color="teal" icon="money" @click.native="showPaymentVerification(props.row)"></q-btn>
				<q-btn size="sm" class="q-mx-sm" v-if="passoverdue" label="Pass Due Payment" color="orange" icon="money" @click.native="rescheduleActivities(props.row)"></q-btn>		
			</q-td>
				</q-table>
			</div>
		</div>
		    <!-- confirmActivityAttendance -->
      <q-modal v-model="paymentVerificationModal" :content-css="{minWidth: '35vw', minHeight: '40vh'}" v-if="paymentVerificationModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              Payment Verification - <span class="q-caption">{{paymentID}}</span>
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
		  <div class="q-pa-lg">
			  <div v-if="termSelection">
			  <q-field
				icon="money"
				label="Payment Terms"
				>
			<q-btn-group push>
				<q-btn push label="Full Payment" @click="clickFull" />
				<q-btn push label="Installment" @click="clickInstallment" />
			</q-btn-group>
			  </q-field>
			  </div>
			<q-input :readonly="passoverdue" v-model="transactionAmount" type="number" class="q-ma-sm q-my-lg" stack-label="Transaction Amount" />
		  	<q-input v-model="bdoBranch" class="q-ma-sm q-my-lg" stack-label="BDO Branch" />

		  <q-btn size="md" class="full-width" label="Save Payment Details" color="teal" @click="savePaymentDetails"></q-btn>
		  
		  </div>
        </q-modal-layout>
      </q-modal>
	</q-page>
</template>
<script>
import { CalendarView } from 'vue-simple-calendar'
import { CalendarAgenda } from 'quasar-calendar'
import { date } from 'quasar'

export default {
	created () {
		this.eventKey = this.$route.params.eventKey
		this.$bindAsArray('findEvent', this.$database.ref('events'),null, () => {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'),null, () => {
		this.loadSelectSeason() })
		})
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey))
	  	this.$bindAsArray('payment_transactions', this.$database.ref('payment_transactions'))
	   	this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))	},
	components: {
		CalendarView,
		CalendarAgenda
	},
	computed: {
		getAllTransactions () {
			try {
				let payments = this.payment_transactions
				console.log('payment_transactions', payments)
				let group = this.$lodash.groupBy(payments,'modelKey')
				let keys = this.$lodash.keys(group)
				console.log('keys',keys)
				let withpay = []
				let list = this.contractsigned
				for(var x=0; x<keys.length; x++) {
					for(var y=0;y<list.length;y++) {
						if(keys[x] === list[y]['.key']) {
							withpay.push(list[y])
						}
					}
				}
				let sort = this.$lodash.filter(withpay, ee=> {
					return ee.seasonName === this.selectedSeason.seasonName
				})
				console.log('*SortedPayment',sort)
				return sort
			} catch (err) {
				console.log('err',err)
				return []
			}
		},
		agendaSeasonSchedules () {
			try {
				let activities = [...this.seasonEventSchedules]
				console.log('activities', activities)
				let mapAct = this.$lodash.map(activities, act => {
					if (act.type !== 'payment') {
						return {
							id: act.id,
							summary: act.title,
							description: act.details ? act.details : '',
							location: act.location ? act.location : '',
							start: {
								dateTime: new Date(act.startDate).toISOString()
							},
							end: {
								dateTime: new Date(act.endDate).toISOString()
							},
							color: 'faded'
						}
					}
				})
				let agendaActivities = this.$lodash.compact(mapAct)
				// console.log('agendaActivities', agendaActivities)
				return agendaActivities
			} catch(error) {
				return []
			}
		},
		seasonEventSchedules () {
			try {
				let allAct = new Array()
				let scheds = [...this.seasonBatches]
				this.$lodash.forEach(scheds, sc => {
					this.$lodash.forEach(sc.activities, act => {
						act.startDate = new Date(act.startDate)
						act.endDate = new Date(act.endDate)
						allAct.push(act)
					})
				})
			return allAct
			} catch {
				return []	
			}
		},
		getSeasonName () {
			try {
				return this.selectedSeason.seasonName
			} catch(error) {
				return ''
			}
		},
		customBatches () {
			try {
				let custom = new Array()
				let activities = [...this.seasonBatches[0].activities]
				// var numOfPayment = 0
				// var numOfWorkshop = 0
				console.log('selectedSeason', activities)
				this.$lodash.forEach(this.seasonBatches, sb => {
					let custom2 = []
					let numOfPayment = 0
					let numOfWorkshop = 0
					this.$lodash.forEach(sb.activities, act => {
						
						let keys = new Array()
						if (act.dueDate) {
			  			let toReturnStart = {
				  			[`${this.$lodash.capitalize(act.type)} Start`]: act.startDate
				  		}
				  		let toReturnEnd = {
				  			[`${this.$lodash.capitalize(act.type)} End`]: act.endDate	
				  		}
				  		custom2.push(toReturnStart)
				  		custom2.push(toReturnEnd)
			  		} else {
			  			if (act.type === 'payment') {
			  				++numOfPayment
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)} ${numOfPayment}`]: act.startDate,
					  		}
					  		custom2.push(toReturn)
			  			} else if (act.type === 'workshop') {
			  				++numOfWorkshop
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`]: act.startDate
					  		}
					  		custom2.push(toReturn)
			  			} else {
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)}`]: act.startDate
					  		}
					  		custom2.push(toReturn)
			  			}
			  		}
					})
					for (var i = 0; i < custom2.length; i++) {
						let key = this.$lodash.keys(custom2[i])[0]
						let value = custom2[i][key]
						console.log('value', value)
						custom2[key] = key
						custom2[key] = value
					}
					custom2.splice(0, custom2.length)
					console.log('cust2', custom2)
					custom.push({...custom2})
				})
				console.log('custom batches',  custom)
				return custom
			} catch(error) {
				return []
			}
			
		},
		customColumn () {
			try {
				let activities = this.seasonBatches[0].activities
				let custom = new Array()
		  	var numOfPayment = 0
				var numOfWorkshop = 0
		  	this.$lodash.forEach(activities, act => {
		  		// console.log('act', act)
		  		if (act.dueDate) {
		  			let toReturnStart = {
			  			name: this.$lodash.capitalize(act.type) + 'Start',
			  			required: true,
			  			label: this.$lodash.capitalize(act.type) + ' Start',
			  			align: 'left',
			  			field: this.$lodash.capitalize(act.type) + ' Start',
			  		}
			  		let toReturnEnd = {
			  			name: this.$lodash.capitalize(act.type) + 'End',
			  			required: true,
			  			label: this.$lodash.capitalize(act.type) + ' End',
			  			align: 'left',
			  			field: this.$lodash.capitalize(act.type) + ' End',
			  		}
			  		custom.push(toReturnStart)
			  		custom.push(toReturnEnd)
		  		} else {
		  			if (act.type === 'payment') {
		  				numOfPayment++
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: `${this.$lodash.capitalize(act.type)} ${numOfPayment}`,
				  			align: 'left',
				  			field: `${this.$lodash.capitalize(act.type)} ${numOfPayment}`,
				  		}
				  		custom.push(toReturn)
		  			} else if (act.type === 'workshop') {
		  				numOfWorkshop++
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: `${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`,
				  			align: 'left',
				  			field: `${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`,
				  		}
				  		custom.push(toReturn)
		  			} else {
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: this.$lodash.capitalize(act.type),
				  			align: 'left',
				  			field: this.$lodash.capitalize(act.type)
				  		}
				  		custom.push(toReturn)
		  			}
		  			
		  		}
		  	})
		  	let batch = {
		  		name: 'batchNumber',
		  		label: 'Batch',
		  		align: 'left',
		  	}
		  	custom.splice(0, 0, batch)
		  	console.log('custom column', custom)
		  	return custom
			} catch(error) {
				return []
			}
			
		},
		seasonBatches () {
			try {
				let batches = this.$lodash.filter(this.schedules, s => {
					return s.eventKey === this.eventKey && s.seasonName === this.selectedSeason.seasonName
				})
				return batches
			} catch(error) {
				return []
			}
		},
		latestSeason () {
			var len = this.getSeasons.length
			return this.getSeasons[len-1]
		},
		getSeasons () {
			try {
				// this.$bindAsArray('events', this.$database.ref('events'))
				// let event = this.$lodash.filter(this.events, e => {
				// 	return e['.key'] === this.eventKey
				// })[0]
				// console.log('event', event)
				// this.$forceUpdate()
				return this.event[0].seasons
			} catch(error) {
				return []
			}
		},
		getLastPaymentDueDate () {
				//getallpaymentsduedates
				let _batches = this.seasonBatches
				let allpayments = []
				let out = []
				for(var x = 0;x<_batches.length;x++){
					let _get = this.$lodash.filter(_batches[x].activities, q=> {
						if(q.type === "payments" || q.type === "payment"){
							allpayments.push(q)
						} else {
							out.push(q)
						}
					})
				}
				console.log("allpayments",allpayments)
				

				let dateToday = new Date() //sample date *2019, 0, 25
				console.log("dateToday",dateToday)
				let duepayments = []
				let notyet = []
				for(var y = 0; y < allpayments.length; y++) {
					let startDate = new Date(allpayments[y].startDate)
          			let diff = date.getDateDiff(startDate, dateToday)
					console.log(""+y,startDate + diff)
					if(diff <= 0){
						duepayments.push(allpayments[y])
					} else {
						notyet.push(allpayments[y])
					}
				}
				console.log("duepayments",duepayments)
				
				let lastduedate = this.$lodash.findLast(duepayments, w=>{
					return w
				})

				console.log("lastduedate",lastduedate)
				return lastduedate
				//getallpaymentsduedates
		},
		getModelswithUnpaidDuethisWeek () {
				//Due this week
				let lastduedate = this.getLastPaymentDueDate
				console.log("lastduedate",lastduedate)
				//get date and difference both withdate today. if diff is -3 or 4
				let _today = new Date()
				console.log("lastduedate",lastduedate.startDate)
				console.log("_today",_today)
				let diff = date.getDateDiff (lastduedate.startDate,_today)
				console.log("diff",diff)
				//check if today is activity date after the due payment
				let _cs = this.$lodash.filter(this.contractsigned, e=>{
					return e.eventKey === this.eventKey && e.seasonName === this.selectedSeason.seasonName
				})

				let _models = _cs
				let _sorted = []
				let _sortout = []
				for(var z=0; z<_models.length; z++){
					if(_models[z].balance === 0){

					} else {					
						let getter = this.$lodash.filter(_models[z].paymentDueDate, qw=> {
							if(qw.startDate === lastduedate.startDate && qw.paidStatus === false && diff < 4 && diff > -3){
								_models[z].toPayAmount = lastduedate.amount
								_models[z].toPayId = qw.id
								_models[z].toPayTitle = qw.title
								_sorted.push(_models[z])
							} else {
								_sortout.push(_models[z])
							}
						})
					}
				}

				console.log("_sorted",_sorted)
				return _sorted
		},
		getModelswithPaidDuethisWeek () {
				let lastduedate = this.getLastPaymentDueDate
				console.log("lastduedate",lastduedate)
				//get date and difference both withdate today. if diff is -3 or 4
				let _today = new Date() //2019, 0, 25
				console.log("lastduedate",lastduedate.startDate)
				console.log("_today",_today)
				let diff = date.getDateDiff (lastduedate.startDate,_today)
				console.log("diff",diff)
				//check if today is activity date after the due payment
				let _cs = this.$lodash.filter(this.contractsigned, e=>{
					return e.eventKey === this.eventKey && e.seasonName === this.selectedSeason.seasonName
				})

				let _models = _cs
				let _sorted = []
				let _sortout = []
				for(var z=0; z<_models.length; z++){
					if(_models[z].balance === 0){
						let getterq = this.$lodash.filter(_models[z].paymentDueDate, we=> {

						if(we.startDate === lastduedate.startDate && diff < 4 && diff > -3){
								//_models[z].toPay = lastduedate.amount
								_sorted.push(_models[z])
							} else {
								_sortout.push(_models[z])
							}
						})
					} else {					
						let getter = this.$lodash.filter(_models[z].paymentDueDate, qw=> {
							if(qw.startDate === lastduedate.startDate && qw.paidStatus === true && diff < 4 && diff > -3){
								//_models[z].toPay = lastduedate.amount
								_sorted.push(_models[z])
							} else {
								_sortout.push(_models[z])
							}
						})
					}
				}

				console.log("_sorted",_sorted)
				return _sorted
		},
		getFullPaidModels () {
			try {
				let _models = this.contractsigned
				let getFull = this.$lodash.filter(_models, vb=> {
					return vb.balance === 0 && vb.seasonName === this.selectedSeason.seasonName
				})
				console.log('getFullPaidModels',getFull)
				return getFull
			} catch (err) {
				return []
			}
		},
		getPassDueModels () {
			try{
				let dateToday = new Date();
				let passdue = []
				let out = []
				let _models = this.contractsigned;
				for (var x=0;x<_models.length;x++){
					let counter = 0;
					if(_models[x].balance !== 0) {
						let get = this.$lodash.filter(_models[x].paymentDueDate, y=> {						
							if(y.paidStatus === false){
								let checkDate = y.startDate
								let diff = date.getDateDiff(checkDate, dateToday)
								if(diff < -3){
									counter = counter + 1
								}
							}
							
							_models[x].passDueCounter = counter
							
						})
					}
					// console.log('counter'+[x],_models[x].passDueCounter)
				}
				let push = this.$lodash.filter(_models, c=>{
					if(c.passDueCounter === 1 && c.seasonName === this.selectedSeason.seasonName){
						passdue.push(c)
					} else {
						out.push(c)
					}
				})
					console.log('passDuePaymentModels',passdue)
					return passdue
			} catch (err) {
				console.log('error',err)
				return []
			}
		},
		getOverDueModels () {
			try{
				let dateToday = new Date();
				let passdue = []
				let out = []
				let _models = this.contractsigned;
				for (var x=0;x<_models.length;x++){
					let counter = 0;
					if(_models[x].balance !== 0) {
						let get = this.$lodash.filter(_models[x].paymentDueDate, y=> {						
							if(y.paidStatus === false){
								let checkDate = y.startDate
								let diff = date.getDateDiff(checkDate, dateToday)
								if(diff < -3){
									counter = counter + 1
								}
							}
							
							_models[x].passDueCounter = counter
							
						})
					}
					// console.log('counter'+[x],_models[x].passDueCounter)
				}
				let push = this.$lodash.filter(_models, c=>{
					if(c.passDueCounter > 1 && c.seasonName === this.selectedSeason.seasonName){
						passdue.push(c)
					} else {
						out.push(c)
					}
				})
					console.log('overDueModels',passdue)
					return passdue
			} catch (err) {
				console.log('error',err)
				return []
			}
		},
		getUnsettledPayments () {
			try {
				let unsettle = this.$lodash.filter(this.contractsigned, o=>{
					return o.balance !== 0 && o.seasonName === this.selectedSeason.seasonName
				})

				console.log('getUnsettledPayments',unsettle)
				for(var x = 0; x<unsettle.length; x++) {
					let dues = this.$lodash.filter(unsettle[x].paymentDueDate, due=>{
						return due.paidStatus === false
					})
					unsettle[x].toPayId = dues[0].id
					unsettle[x].toPayAmount = dues[0].amount
				}
				console.log('unsettled',unsettle)
				return unsettle
			} catch (err) {
				console.log('err',err)
				return []
			}
		},
		getRecords() {
			try {
				if(this.showRecords === 'due'){
					this.verified_full = false //disabled
					this.passoverdue = false
					this.hidePaymentVerificationBtn = true
					return this.getModelswithUnpaidDuethisWeek
				} else if (this.showRecords === 'over') {
					this.verified_full = true
					this.passoverdue = true
					this.hidePaymentVerificationBtn = false
					return this.getOverDueModels

				} else if (this.showRecords === 'pass') {
					this.verified_full = true
					this.passoverdue = true
					this.hidePaymentVerificationBtn = false
					return this.getPassDueModels

				} else if (this.showRecords === 'full') {
					this.verified_full = true
					this.passoverdue = false
					this.hidePaymentVerificationBtn = false
					return this.getFullPaidModels
					
				} else if (this.showRecords === 'verified') {
					this.passoverdue = false
					this.hidePaymentVerificationBtn = false
					return this.getModelswithPaidDuethisWeek	
				} else {
					this.verified_full = false //disabled
					this.passoverdue = false
					this.hidePaymentVerificationBtn = true
					return this.getUnsettledPayments
				}
			} catch (er) {
				return []
			}

		}

	},
	data () {
		return {
			filter: '',
		  contractsigned: [],
		  verified_full: false,
		  payment_transactions: [],
			startingDayOfWeek: 0,
			showEventTimes: true,
			showDate: new Date(),
			schedules: [],
			selectedSeason: {},
			viewMode: 'batchMode',
			events: [],
			event: [],
			active: true,
			eventKey: '',
			showRecords: 'due',
			passoverdue: false,
			paymentVerificationModal: false,
			transactionAmount: 0,
			bdoBranch: '',
			payTerms: '',
			paymentID: '',
			termSelection: false,
			hidePaymentVerificationBtn: true,
			modelAccount: {},
			columns: [
	      {
	        name: 'desc',
	        required: true,
	        label: 'Dessert (100g serving)',
	        align: 'left',
	        field: 'name',
	        sortable: true,
	        classes: 'my-class',
	        style: 'width: 500px'
	      }
	    ],
	    	        Modelcolumns: [
                {
                name: 'firstName',
                required: true,
                label: 'First Name',
                align: 'left',
                sortable: true,
                field: 'firstName'
                }, 
                {
                name: 'lastName',
                required: true,
                label: 'Last Name',
                align: 'left',
                sortable: true,
                field: 'lastName'
                },
                {
                name: 'balance',
                required: true,
                label: 'Remaining Balance',
                align: 'left',
                sortable: true,
                field: 'balance'
                },                     
                {
                name: 'payments',
                required: true,
                label: 'Payment Records',
                align: 'left',
                sortable: true
                },
				{
                name: 'verification',
                required: true,
                label: 'Payment Verification',
                align: 'left',
                sortable: true
                }
        ],
	    tableData: [
	      {
	        name: 'Frozen Yogurt',
	        calories: 159,
	        fat: 6.0,
	        carbs: 24,
	        protein: 4.0,
	        sodium: 87,
	        calcium: '14%',
	        iron: '1%'
	      }
	    ]
		}
	},
	methods: {
		dropOnDate (e, d) {

		},
		clickEvent (e) {

		},
		setShowDate (d) {
			this.showDate = d
		},
		getCol (c) {
			console.log('c', c)
		},
		loadSelectSeason () {
			try {
				let events = this.findEvent
				console.log("_events",events)
				let event = this.$lodash.filter(events, e => {
					return e['.key'] === this.eventKey
				})[0]
				let seasonLen = event.seasons.length
				this.selectedSeason = event.seasons[seasonLen-1]
			} catch {
				this.selectedSeason = {}
			}
			
		},
		test () {
			console.log('seasonBatches', this.seasonBatches)
			
		},
		getModelsPaymentTransactions (k) {
		try {
			let payments = this.$lodash.filter(this.payment_transactions, p=> {
			return p.modelKey === k
			})
			console.log('modelpayments',payments)
			return payments       
		} catch (err) {
			console.log('error',err)
			return []
		}
		},
		showDue (){
			this.showRecords = 'due'
		},
		showVerified (){
			this.showRecords = 'verified'
		},
		showFull () {
			this.showRecords = 'full'
		},
		showOverDue () {
			this.showRecords = 'over'
		},
		showPassDue () {
			this.showRecords = 'pass'
		},
		showUnsetlled () {
			this.showRecords = 'unsetlled'
		},
		showPaymentVerification (data) {
			this.paymentVerificationModal = true
			this.paymentID = data.toPayId
			this.modelAccount = data
			
			if(typeof data.paymentTerms === 'undefined') {
				this.termSelection = true
				this.transactionAmount = 0
				// this.paymentDetails.transactionAmount = 0
			} else {
				this.termSelection = false
				this.transactionAmount = data.toPayAmount
				// this.paymentDetails.transactionAmount = data.toPayAmount
			}
		},
		clickFull () {
			this.payTerms = 'full'
			let model = this.modelAccount
			let total = model.balance
			let discount = model.regFee
			let toPay = total - discount
			console.log('modelClickFull',toPay)
			this.transactionAmount = toPay

		},
		clickInstallment () {
			this.payTerms = 'installment'
			let model = this.modelAccount
			console.log('modelClickInstallment',model.toPayAmount)
			this.transactionAmount = model.toPayAmount
		},
		savePaymentDetails () {
			let _models = this.modelAccount
			let term = this.payTerms
			let dueId = _models.toPayId
			let paymentDetails = {}
			paymentDetails.transaction_amount = this.transactionAmount
			paymentDetails.id = _models.toPayId
			paymentDetails.bdoBranch = this.bdoBranch
			paymentDetails.create_time = new Date().toString()
			paymentDetails.payTerms = this.payTerms
			paymentDetails.batchKey = _models.batchKey
			paymentDetails.eventKey = _models.eventKey
			paymentDetails.seasonName = _models.seasonName
			paymentDetails.title = _models.toPayTitle
			paymentDetails.transaction_currency = 'PHP'
			paymentDetails.modelKey = _models['.key']
			console.log('paymentDetails_999',paymentDetails)
			console.log('paymentDetails_999',term)
				//get activites to put on attendance
				let index = this.$lodash.filter(_models.activitiesAttended, act => {
					if(act.type !== 'orientation'){
						return act
					}
				})
			if(this.bdoBranch === '' || this.transactionAmount === 0){
				this.$q.notify({
					message: `Payment not Approved!`,
					type: 'negative',
					color: 'negative',
					textColor: 'white',
					icon: 'negative'
				})
			} else {
				if(term === 'full'){
					var remaining = parseInt(_models.balance)
					var paidAmount = parseInt(paymentDetails.transaction_amount)
					var reg = parseInt(_models.regFee)
					var newBalanceFull = remaining - (paidAmount + reg)
					this.$database.ref('contractSigned/' + _models['.key'] + '/paymentTerms').set('full')

					this.$database.ref('payment_transactions').push(paymentDetails)
						.then(() => {
							this.$database.ref('contractSigned/' + _models['.key'] + '/balance').set(newBalanceFull)
							.then(() => {

								let model = {...this.modelAccount}
								let key = model['.key']
								delete model['.key']
								for (var x = 0; x < index.length; x++) {
								// console.log('pushloop', this.getActivityIndex[x].id)
								// this.$database.ref('attendance/' + this.getActivityIndex[x].id + '/models/').push(model)
								let id = index[x].id
								let batch = model.batchKey
								setTimeout(() => {
									this.$database.ref('attendance/' + batch + '/' + id + '/models/').child(key).set(model)
								}, 1000)
								}
								// this.showPaymentVerified = true
								this.$q.notify({
								message: `Payment Verified`,
								type: 'positive',
								color: 'positive',
								textColor: 'white',
								icon: 'positive'
								})
								this.paymentVerificationModal = false
							})
					  })
				} else if ( term === 'passdue'){
					var remaining = parseInt(_models.balance)
					var paidAmount = parseInt(paymentDetails.transaction_amount)
					let newBalanceDue = remaining - paidAmount
					let d1 = _models.firstBasis
					let d2 = _models.lastBasis
					let resched = _models.rescheduleActivities
					let dueTrue = this.getDuesBetween(d1,d2,_models)
					console.log('dueTrue',dueTrue)
					//set payment terms
					this.$database.ref('contractSigned/' + _models['.key'] + '/paymentTerms').set('installment')
					// console.log('setInstallment')
					.then(() => {
						//push transaction
						this.$database.ref('payment_transactions').push(paymentDetails)
						// console.log('pushTransaction')
						.then(() => {
							//set new balance
							this.$database.ref('contractSigned/' + _models['.key'] + '/balance').set(newBalanceDue)
							// console.log('setNewBalance')
							.then(() => {
								//set paidStatus in duepayment
								for(var x=0;x<dueTrue.length;x++){
									let index = x
									setTimeout(() => {
										this.$database.ref('contractSigned/' + _models['.key'] + '/paymentDueDate/' + index + '/paidStatus').set(true)
									}, 1000)
								}
								let datetoday = new Date().toString()
								let passDue = {
									modelKey: _models['.key'],
									paymentDate: datetoday,
									forReschedule:  resched
								}
								console.log('passDue',passDue)
								this.$database.ref('passDueReschedule').push(passDue)
								.then(() => {
									this.$q.notify({
										message: `Payment Verified`,
										type: 'positive',
										color: 'positive',
										textColor: 'white',
										icon: 'positive'
									})
									this.paymentVerificationModal = false
								})
							})
						})
					})

				} else {
					var remaining = parseInt(_models.balance)
					var paidAmount = parseInt(paymentDetails.transaction_amount)
					let newBalanceInstall = remaining - paidAmount
					
					//set payment terms
					this.$database.ref('contractSigned/' + _models['.key'] + '/paymentTerms').set('installment')
					// console.log('setInstallment')
					.then(() => {

						//push transaction
						this.$database.ref('payment_transactions').push(paymentDetails)
						// console.log('pushTransaction')
						.then(() => {

							//set new balance
							this.$database.ref('contractSigned/' + _models['.key'] + '/balance').set(newBalanceInstall)
							// console.log('setNewBalance')
							.then(() => {

								//set paidStatus in duepayment
								let index = this.getDueDateIndex(dueId,_models)
								this.$database.ref('contractSigned/' + _models['.key'] + '/paymentDueDate/' + index + '/paidStatus').set(true)
								// console.log("paidStatusSet")
								.then(() => {

									//push model to activities attendance
									let model = {...this.modelAccount}
									let key = model['.key']
									delete model['.key']
									
									//get date for duepayment
									console.log('installment s1',this.getDuePaymentDate(dueId,_models).startDate)
									let d1 = this.getDuePaymentDate(dueId,_models)

									//get date for next duepayment
									console.log('installment s2',this.getNextPayment(dueId,_models).startDate)
									let d2 = this.getNextPayment(dueId,_models)

									//get activities with dates in between of duepayment and next duepayment
									//if no next due payment push all next activities
									if(typeof d2 === 'undefined'){
										console.log('installment s3 - END GAME',this.getActivitiesAfterAllPayment(d1,_models))
										let push = this.getActivitiesAfterAllPayment(d1,_models)
										for (var x = 0; x < push.length; x++) {
											let id = push[x].id
											let batch = model.batchKey
											console.log("push id",id)
											setTimeout(() => {
												this.$database.ref('attendance/' + batch + '/' + id + '/models/').child(key).set(model)
											}, 1000)
										}
										this.$q.notify({
											message: `Payment Verified`,
											type: 'positive',
											color: 'positive',
											textColor: 'white',
											icon: 'positive'
										})
									} else {
										console.log('installment s3 - BETWEEN',this.getActivitiesBetween(d1,d2,_models))
										let push = this.getActivitiesBetween(d1,d2,_models)
										for (var x = 0; x < push.length; x++) {
											let id = push[x].id
											let batch = model.batchKey
											console.log("push id",id)
											setTimeout(() => {
												this.$database.ref('attendance/' + batch + '/' + id + '/models/').child(key).set(model)
											}, 1000)
										}
										this.$q.notify({
											message: `Payment Verified`,
											type: 'positive',
											color: 'positive',
											textColor: 'white',
											icon: 'positive'
										})		
										this.paymentVerificationModal = false
									}
								})
							})
						})
					})	
				}

			}

		},
		getDueDateIndex(paydueid,model){
			let index = this.$lodash.findIndex(model.paymentDueDate,ty=>{
				return ty.id === paydueid
			})
			return index
		},
		getDuePaymentDate(paydueid,model){
			let date = this.$lodash.filter(model.paymentDueDate, er=>{
				return er.id === paydueid
			})
			return date[0]
		},
		getNextPayment(paydueid,model){
			let index = this.$lodash.findIndex(model.paymentDueDate,ty=>{
				return ty.id === paydueid
			})
			let next = index + 1
			let date = this.$lodash.nth(model.paymentDueDate, next)
			return date
		},
		// getSampleUndefined(paydueid,model){
		// 	let index = this.$lodash.findIndex(model.paymentDueDate,ty=>{
		// 		return ty.id === paydueid
		// 	})
		// 	let next = index + 3
		// 	let date = this.$lodash.nth(model.paymentDueDate, next)
		// 	return date
		// },
		getActivitiesBetween(d1,d2,model){
			let dateFrom = new Date(d1.startDate)
			let dateTo = new Date(d2.startDate)
			let pushDates = []
			let activities = this.$lodash.filter(model.activitiesAttended, yu=>{
				// **strictly** (i,.e. exclusive range)
				let dateTarget = new Date(yu.startDate)
				// console.log(dateTarget)
				if (date.isBetweenDates(dateTarget, dateFrom, dateTo)) {
				// Do something with dateTarget
					pushDates.push(yu)
				} 
			})
			return pushDates
		},
		getActivitiesAfterAllPayment(date,model){
			let dateBasis = new Date(date.startDate)
			// console.log(dateBasis)
			// console.log(model.activitiesAttended)
			let activities = this.$lodash.filter(model.activitiesAttended, ui=> {
				let checkDate = new Date(ui.startDate)
				if(dateBasis < checkDate){
					return ui
				}
			})
			return activities
		},
		rescheduleActivities (model) {
			//model data at modal
			let checkmodel = model
			let status = this.showRecords
			let dateToday = new Date()
			console.log('status',this.showRecords)
			//get 1st not paid
			let dues = this.$lodash.filter(model.paymentDueDate, fb=>{
				let startDate = new Date(fb.startDate)
				if(startDate < dateToday){
					return fb.paidStatus === false
				}
			})
			let firstbasis = dues[0].startDate
			console.log('1stduedate',dues[0])
			let resched = this.getActivitiesBetweenReschedule(firstbasis,dateToday,checkmodel)
			console.log('reschedule activities',resched)

			let lastduedate = this.$lodash.findLast(dues, w=>{
				return w
			})
			console.log('lastduedate',lastduedate)

			let totalAmount = this.$lodash.sumBy(dues, ss=>{
				return ss.amount
			})

			console.log(lastduedate)
			console.log(totalAmount)

			checkmodel.rescheduleActivities = resched
			checkmodel.toPayId = lastduedate.id
			checkmodel.toPayTitle = lastduedate.title
			checkmodel.toPayAmount = totalAmount
			checkmodel.firstBasis = dues[0]
			checkmodel.lastBasis = lastduedate
			this.payTerms = 'passdue'
			this.termSelection = false
			this.modelAccount = checkmodel
			this.transactionAmount = totalAmount
			this.paymentVerificationModal = true
			this.paymentID = lastduedate.id
			console.log(this.payTerms)
			console.log(checkmodel)
			
			//get model reschedule activities
			//how to know if schedule can be resched.
		},
		getActivitiesBetweenReschedule(d1,d2,model){
			let dateFrom = new Date(d1)
			let dateTo = new Date(d2)
			let pushDates = []
			let activities = this.$lodash.filter(model.activitiesAttended, yu=>{
				// **strictly** (i.e. exclusive range)
				let dateTarget = new Date(yu.startDate)
				// console.log(dateTarget)
				if (date.isBetweenDates(dateTarget, dateFrom, dateTo)) {
				// Do something with dateTarget
					pushDates.push(yu)
				} 
			})
			return pushDates
		},
		getDuesBetween(d1,d2,model){
			let dateFrom = new Date(d1.startDate)
			let dateTo = new Date(d2.startDate)
			let pushDates = []
			let activities = this.$lodash.filter(model.paymentDueDate, yu=>{
				// **strictly** (i.e. exclusive range)
				let dateTarget = new Date(yu.startDate)
				// console.log(dateTarget)
				if (dateTarget >= dateFrom || dateTarget <=dateTo) {
				// Do something with dateTarget
					pushDates.push(yu)
				} 
			})
			return pushDates
		},
		zzTestingButton () {

		}
	}
}
</script>