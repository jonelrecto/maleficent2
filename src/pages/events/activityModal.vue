<template>
	<div class="docs-input row justify-center">
		<div class="col">
			<q-btn label="test" @click="test" />
			<q-field class="q-my-md" label="Orientation" orientation="vertical" :label-width="3">
				<p>{{$moment(orientation.startDate).format('ll')}}</p>
				<q-datetime format="h:mm A" v-if="getOrientation.time" v-model="orientation.time" stack-label="Time" type="time"/>
			  	<q-input v-if="getOrientation.location" float-label="Location" type="textarea" :max-height="100" rows="7" v-model="orientation.location" >
					<q-autocomplete
					:min-characters="0"
					@search="searchLocation"
					:debounce="700"
					@selected="selected"
					/>
  				</q-input>

			  	<q-input float-label="Details" type="textarea" :max-height="50" rows="5" v-model="orientation.details">
  					<q-autocomplete
					:min-characters="0"
					@search="searchDetails"
					:debounce="700"
					@selected="selected"
					/>
			  	</q-input>

			</q-field>

			<q-item-separator />
			<q-field class="q-my-md" label="Payment Amount" :error="isSameTotal" error-label="Please check Total Amount">
				<p class="caption">Season Rate: {{totalAmount}}</p>
				<div v-for="(n,index) in getNumberOfPayments" :key="n">
					<q-input class="q-my-md" prefix="P " :stack-label="`Payment ${index+1}`" type="number" v-model="payments.amount[index]" />
				</div>
				<q-item-separator />
				<span class="caption text-weight-bold">Total {{ getTotal | currency}}</span>
			</q-field>

			<q-item-separator />
			<q-field class="q-my-md" label="Photoshoot" orientation="vertical" :label-width="3">
				<p>{{$moment(photoshoot.startDate).format('ll')}}</p>
				<q-datetime format="h:mm A" v-if="getPhotoshoot.time" v-model="photoshoot.time" stack-label="Time" type="time"/>
			  	<q-input v-if="getPhotoshoot.location" float-label="Location" :max-height="100" rows="7" type="textarea" v-model="photoshoot.location" >
					<q-autocomplete
					:min-characters="0"
					@search="searchLocation"
					:debounce="700"
					@selected="selected"
					/>
				</q-input>
			  	<q-input float-label="Details" :max-height="50" rows="5" type="textarea" v-model="photoshoot.details" >
					<q-autocomplete
					:min-characters="0"
					@search="searchDetails"
					:debounce="700"
					@selected="selected"
					/>
				</q-input>
			</q-field>

			<q-item-separator />
			
			<q-field class="q-my-md" label="Photoliking" orientation="vertical" :label-width="3">
				<p>{{$moment(photoliking.startDate).format('ll')}}</p>
			  <q-datetime :min="photoliking.startDate" :max="new Date(seasonEnd)" format="MMM-DD-YYYY" v-model="photoliking.dueDate" stack-label="Due Date" />
			</q-field>
			<!-- workshops -->
			<q-item-separator />

			<!-- old workshop -->
			<q-field v-if="isHasWorkshop" class="q-my-md" label="Workshops" :error="isWorkshopError" error-label="Please check your date and time">
				<div class="q-my-md" v-for="(ws, i) in numberOfWorkshops" :key="i">
					<div class="row">
						<div class="col">
							<span class="caption q-my-md">Workshop {{i+1}}</span>
							<p>Possible Dates: <br/>
								<q-btn-group v-for="(upcoming,j) in upcomingSundays2" :key="j" >
								  <q-btn v-if="alreadySelectedSunday(upcoming)" size="sm" @click="isHasEmptyWorkshops, selectUpcomingDate(i, upcoming)">
								  	{{$moment(upcoming).format('ll')}}
									</q-btn>
								</q-btn-group>
							</p>
							<q-datetime :min="workshopMinDate(ws)" :max="new Date(seasonEnd)" format="MMM-DD-YYYY" v-model="workshops.startDate[i]" stack-label="Date" type="date" :key="Date.now()" />
							<q-datetime format="h:mm A" v-model="workshops.time[i]" stack-label="Time" type="time"/>
						  	<q-input v-if="getWorkshop.location" float-label="Location" :max-height="100" rows="7" type="textarea" v-model="workshops.location[i]" >
  								<q-autocomplete
								:min-characters="0"
								@search="searchLocation"
								:debounce="700"
								@selected="selected"
							/>
						  	</q-input>
						  	<q-input v-if="getWorkshop.details" float-label="Details" type="textarea" :max-height="50" rows="5" v-model="workshops.details[i]" >
								<q-autocomplete
								:min-characters="0"
								@search="searchDetails"
								:debounce="700"
								@selected="selected"
								/>
							</q-input>
						</div>
						<div class="col-2">
							<q-btn :disable="disableAddWorkshop(i)" v-if="hasNewWorkshop(i)" class="q-ma-md" round size="sm" icon="add" @click="numberOfWorkshops++, isHasEmptyWorkshops()"/>
							<q-btn v-if="i >= 1" class="q-ma-md" round size="sm" icon="remove" @click="removeWorkshop(i)"/>
						</div>
						<q-item-separator />
					</div>
				</div>
			</q-field>

			<!-- <q-field v-if="isHasWorkshop" class="q-my-md" orientation="vertical" :error="isWorkshopError" error-label="Please check the details">
				<div class="q-my-md" v-for="(ws, i) in numOfWorkshops" :key="i">
					<div class="row">
						<div class="col">
							<span class="caption q-my-md">Workshop {{i+1}}</span>
							<p>{{$moment(workshops2.startDate[i]).format('ll')}}</p>
							<q-datetime format="h:mm A" v-model="workshops2.time[i]" stack-label="Time" type="time"/>
						  <q-input v-if="getWorkshop.location" float-label="Location" :max-height="100" rows="7" type="textarea" v-model="workshops2.location[i]">
  							<q-autocomplete
									:min-characters="0"
				          @search="searchLocation"
				          :debounce="700"
				          @selected="selected"
				        />
						  </q-input>
						  <q-input v-if="getWorkshop.details" float-label="Details" type="textarea" :max-height="50" rows="5" v-model="workshops2.details[i]" >
								<q-autocomplete
									:min-characters="0"
				          @search="searchDetails"
				          :debounce="700"
				          @selected="selected"
				        />
							</q-input>
						</div>
						<q-item-separator />
					</div>
				</div>
			</q-field> -->



			<!-- old -->
			<!-- v for here for other activities-->
			<div v-for="(activity,i) in otherActivities" :key="i">
				<q-item-separator />
				<q-field class="text-black" :label="setActivityLabel(activity)" orientation="vertical" :label-width="3" :error="isOtherActivityError" error-label="Please check date and time">
					<q-datetime :min="otherActivityMinDate(activity, i)" format="MMM-DD-YYYY" :max="new Date(seasonEnd)" v-model="otherActivity.startDate[i]" stack-label="Date" type="date"/>
					<q-datetime format="h:mm A" v-if="activity.time" v-model="otherActivity.time[i]" stack-label="Time" type="time"/>
				  <q-input v-if="activity.location" float-label="Location" :max-height="100"
  rows="7" type="textarea" v-model="otherActivity.location[i]" >
						<q-autocomplete
							:min-characters="0"
		          @search="searchLocation"
		          :debounce="700"
		          @selected="selected"
		        />
					</q-input>
				  <q-input v-if="activity.details" float-label="Details" :max-height="50"
  rows="5" type="textarea" v-model="otherActivity.details[i]" >
						<q-autocomplete
							:min-characters="0"
		          @search="searchDetails"
		          :debounce="700"
		          @selected="selected"
		        />
					</q-input>
				  <q-datetime v-if="activity.dueDate" :min="$mathMixin.addDays(new Date(otherActivity.startDate[i]), 1).toString()" format="MMM-DD-YYYY" v-model="otherActivity.dueDate[i]" stack-label="Due Date" />
				</q-field>
			</div>

			<!-- new -->
			<!-- v for here for other activities-->
			<!-- <div v-for="(activity,i) in otherActivities" :key="i">
				<q-item-separator />
				<q-field class="text-black" :label="setActivityLabel(activity)" orientation="vertical" :label-width="3" :error="isOtherActivityError" error-label="Please check date and time">
					<p>{{$moment(otherActivity2.startDate[i]).format('ll')}}</p>
					<q-datetime format="h:mm A" v-if="activity.time" v-model="otherActivity2.time[i]" stack-label="Time" type="time"/>
				  <q-input v-if="activity.location" float-label="Location" :max-height="100" rows="7" type="textarea" v-model="otherActivity2.location[i]" >
						<q-autocomplete
							:min-characters="0"
		          @search="searchLocation"
		          :debounce="700"
		          @selected="selected"
		        />
					</q-input>
				  <q-input v-if="activity.details" float-label="Details" :max-height="50" rows="5" type="textarea" v-model="otherActivity2.details[i]" >
						<q-autocomplete
							:min-characters="0"
		          @search="searchDetails"
		          :debounce="700"
		          @selected="selected"
		        />
					</q-input>
				  <q-datetime v-if="activity.dueDate" :min="$mathMixin.addDays(new Date(otherActivity.startDate[i]), 1).toString()" format="MMM-DD-YYYY" v-model="otherActivity2.dueDate[i]" stack-label="Due Date" />
				</q-field>
			</div> -->


			<!-- final event -->
			<q-item-separator />
			<q-field class="q-my-md" :label="getFinalActivity.label" orientation="vertical" :label-width="3">
				<p>{{$moment(finalActivity.startDate).format('ll')}}</p>
				<q-datetime v-if="getFinalActivity.time" format="h:mm A" v-model="finalActivity.time" stack-label="Time" type="time"/>
			  <q-input v-if="getFinalActivity.location" float-label="Location" :max-height="100"
  rows="7" type="textarea" v-model="finalActivity.location" >
  				<q-autocomplete
						:min-characters="0"
	          @search="searchLocation"
	          :debounce="700"
	          @selected="selected"
	        />
  			</q-input>
			  <q-input v-if="getFinalActivity.details" :max-height="50" rows="5" float-label="Details" type="textarea" v-model="finalActivity.details" >
					<q-autocomplete
						:min-characters="0"
	          @search="searchDetails"
	          :debounce="700"
	          @selected="selected"
	        />
				</q-input>
			  <q-datetime v-if="getFinalActivity.dueDate" v-model="finalActivity.dueDate" stack-label="Due Date" />
			</q-field>
			<q-btn color="secondary" @click="saveSeasonActivities()" icon="navigate_next" label="Confirm Activities" />
		</div>
	</div>
</template>
<script>
import { filter } from 'quasar'
import eventSeasonActivities from './eventSeasonActivities'
import { required, sameAs } from 'vuelidate/lib/validators'

	export default {
		components: {
			'event-season-activities': eventSeasonActivities
		},
		props: {
			season: Object
		},
		validations () {
			return {
				totalAmount: {
					sameAsPassword: sameAs(this.getTotal.toString())
				}
			}
		},
		created () {
			this.eventKey = this.$route.params.id
			this.setPaymentsAmount()
			// this.isHasEmptyWorkshops()
			// this.generateWorkshops()
			// this.generateOtherActivities()
		},
		watch: {
			getTotal: {
				handler () {
					this.isPaymentError = this.isSameTotal
				},
				deep: true
			},
			workshops2: {
				handler () {
					console.log('working watch')
					// this.isWorkshopError = this.isHasEmptyWorkshops()
					this.isHasEmptyWorkshops()
				},
				deep: true
			},
			otherActivity2: {
				handler () {
					this.isHasOtherActivityEmpty()
					// this.isOtherActivityError = this.isHasOtherActivityEmpty
				},
				deep: true
			}
		},
		computed: {
			get3rdPayment () {
				try {
					let paymentToDays = this.$store.getters['users/convertToDays']({dateType: this.getPaymentCourseActivity.dayAfter.dateType, dateNumber: this.getPaymentCourseActivity.dayAfter.dateNumber})
					let paymentSched = new Array()
					for (var i = 0; i < this.numOfPayments; i++) {
						if (i === 0) {
							var pay = {
								amount: this.payments.amount[i],
								classes: this.colorCode,
								startDate: this.$mathMixin.addDays(new Date(this.seasonStart), 3),
								endDate: this.$mathMixin.addDays(new Date(this.seasonStart), 3),
								eventKey: this.eventKey,
								id: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
								title: `Batch(${this.getBatchNumber})_payment(${i+1})`,
								// title: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
								type: 'payment'
							}

						} else {
							var pay = {
								amount: this.payments.amount[i],
								classes: this.colorCode,
								startDate: this.$mathMixin.addDays(new Date(this.paymentSched[i-1].startDate), paymentToDays),
								endDate: this.$mathMixin.addDays(new Date(this.paymentSched[i-1].startDate), paymentToDays),
								eventKey: this.eventKey,
								id: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
								title: `Batch(${this.getBatchNumber})_payment(${i+1})`,
								// title: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
								type: 'payment'
							}
							console.log('pay ni act', pay)
						}
						pay.startDate = pay.endDate
						pay.startDate.setHours(0,0,0,0)
						pay.endDate.setHours(0,0,0,0)
						paymentSched.push(pay)
					}
					console.log('paymentSched', paymentSched)
					return paymentSched[2]
				} catch {
					return {}
				}
			},
			isSameTotal () {
				let seasonTotal = parseFloat(this.totalAmount)
				let total = parseFloat(this.getTotal)
				if (seasonTotal !== total) {
					this.isPaymentError = true
					return true
				} else {
					this.isPaymentError = false
					return false
				}
			},
			isHasWorkshop () {
				try {
					for (var i = 0; i < this.course.activities.length; i++) {
						if (this.course.activities[i].value === 'workshop') {
							return true
						}
					}
					return false
				} catch {
					return true
				}
			},
			upcomingSundays2 () {
			try {
					// console.log('batches in sunday', this.generatedBatchActivities.activities)
					// let lastPaymentDate = this.$store.getters['users/getLastOf3Payment'](this.generatedBatchActivities.activities)
					// let lastPaymentDate2 = this.$store.getters['startUp/getPlainValue'](lastPaymentDate)
					let lastPaymentDate = this.paymentSched[this.paymentSched.length-1]
					let lastPaymentDate2 = this.$store.getters['startUp/getPlainValue'](lastPaymentDate)
					console.log('in sunday', lastPaymentDate2)
					return this.$store.getters['startUp/getUpcomingSundays2'](new Date(lastPaymentDate2.startDate))
				} catch {
					return []
				}
			},
			upcomingSundays () {
				try {
					return this.$store.getters['startUp/getUpcomingSundays']
				} catch {
					return []
				}
			},
			parseDetails () {
				return this.$store.getters['startUp/parseDetails']
			},
			parseLocations () {
				return this.$store.getters['startUp/parseLocations2']
			},
			course () {
				var i = this.$lodash.findIndex(this.$store.state.startUp.courses, c => {
					return c['.key'] === this.courseKey
 				})
				return this.$store.state.startUp.courses[i]
			},
			courseKey () {
				return this.$store.state.users.courseKey
			},
			numOfPayments () {
				return this.$store.state.users.numOfPayments
			},
			numOfWorkshops () {
				return this.$store.state.users.numOfWorkshops
			},
			seasonStart () {
				return this.$store.state.users.seasonStart
			},
			seasonEnd () {
				return this.$store.state.users.seasonEnd
			},
			totalAmount () {
				console.log('totalAmount', this.$store.state.users.totalAmount)
				let toFloat = parseFloat(this.$store.state.users.totalAmount)
				console.log('tofloat', toFloat)
				return this.$store.state.users.totalAmount
			},
			colorCode () {
				return this.$store.state.users.colorCode
			},
			event () {
				var i = this.$lodash.findIndex(this.$store.state.startUp.events, e => {
					return e['.key'] === this.eventKey
 				})
				return this.$store.state.startUp.events[i]
			},
			getLatestSeason () {
				try {
	        if (this.event.seasons.length != 0) {
	          return ++this.event.seasons.length
	        } else {
	          return 1
	        }
				} catch {
					return 1
				}
			},
			getBatchNumber () {
				try {
					let eventSched = this.$lodash.filter(this.$store.state.startUp.schedules, s=> {
						return s.eventKey === this.eventKey
					})
					if (eventSched.length != 0) {
						return ++eventSched.length
					} else {
						return 1
					}
				} catch {
					return 1
				}
			},
			getOrientation () {
				try {
					var i = this.$lodash.findIndex(this.course.activities, c => {
						return c.value === 'orientation'
					})
					return this.course.activities[i]
				} catch (err) {
					return []
				}
			},
			getNumberOfPayments () {
				return this.numOfPayments
			},
			getPhotoshoot () {
				try {
					var i = this.$lodash.findIndex(this.course.activities, c => {
						return c.value === 'photoshoot'
					})
					return this.course.activities[i]
				} catch (err) {
					return []
				}
			},
			getPhotoliking () {
				try {
					var i = this.$lodash.findIndex(this.course.activities, c => {
						return c.value === 'photoliking'
					})
					return this.course.activities[i]
				} catch (err) {
					return []
				}
			},
			getPaymentCourseActivity () {
				try {
					var i = this.$lodash.findIndex(this.course.activities, ca => {
						return ca.value === 'payment'
					})
					return this.course.activities[i]
				} catch {
					return {}
				}
			},
			getPhotoshootCourseActivity () {
				var i = this.$lodash.findIndex(this.course.activities, ca => {
					return ca.value === 'photoshoot'
				})
				return this.course.activities[i]
			},
			getPhotolikingCourseActivity () {
				var i = this.$lodash.findIndex(this.course.activities, ca => {
					return ca.value === 'photoliking'
				})
				return this.course.activities[i]
			},
			getWorkshop () {
				try {
					var i = this.$lodash.findIndex(this.course.activities, c => {
						return c.value === 'workshop'
					})
					return this.course.activities[i]
				} catch (err) {
					return []
				}
			},
			otherActivities () {
				try {
					let otherActivities = []
					let activities = [...this.course.activities]
					for (var i = 0; i < activities.length; i++) {
						if (activities[i].value !== 'orientation' && activities[i].value !== 'payment' && activities[i].value !== 'photoshoot' && activities[i].value !== 'photoliking' && activities[i].value !== 'workshop' && activities[i].value !== this.getFinalActivity.value) {
							otherActivities.push(activities[i])
						}
					}
					// console.log('other', otherActivities)
					for (var j = 0; j < otherActivities.length; j++) {
						this.otherActivity.value.push(otherActivities[j].value)
						this.otherActivity.label.push(otherActivities[j].label)
					}
					console.log('ote', otherActivities)
					this.otherActivities2 = otherActivities
					return otherActivities
				} catch (err) {
					return {}
				}
			},
			getFinalActivity () {
				try {
					let finalAct = this.course.activities[this.course.activities.length-1]
					return finalAct
				} catch (err) {
					return {}
				}
			},
			getTotal () {
				try {
	        let amount = parseFloat(this.$lodash.sum(this.payments.amount))
	        // let isNan = parseFloat(amount) || 0
	        return amount
	        // return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	      } catch (err){ return 0 }
			},
			getPaymentLastIndex () {
				try {
					console.log('pay', this.paymentSched)
					return this.$store.getters['startUp/getPlainValue'](this.paymentSched[this.paymentSched.length-1].startDate)
				} catch {
					return ''
				}
			},
		},
		data () {
			return {
				isOtherActivityError: true,
				isWorkshopError: false,
				isPaymentError: false,
				model: '',
				eventKey: '',
				paymentSched: [],
				orientation: {
					startDate: '',
					endDate: '',
					eventKey: '',
					id: '',
					title: '',
					type: '',
					classes: '',
					time: 'Wed Oct 18 2017 08:00:00',
					location: '',
					details: '',
					dueDate: '',
				},
				photoshoot: {
					startDate: '',
					endDate: '',
					eventKey: '',
					id: '',
					title: '',
					type: '',
					classes: '',
					time: 'Wed Oct 18 2017 08:00:00',
					location: '',
					details: '',
					dueDate: '',
				},
				photoliking: {
					startDate: '',
					endDate: '',
					eventKey: '',
					id: '',
					title: '',
					type: '',
					classes: '',
					time: '',
					location: '',
					details: '',
					dueDate: ''
				},
				payments: {
					startDate: [],
					endDate: [],
					eventKey: [],
					id: [],
					title: '',
					type: [],
					classes: [],
					amount: [],
				},
				numberOfWorkshops: 1,
				workshops: {
					startDate: [],
					endDate: [],
					eventKey: [],
					id: [],
					title: [],
					type: [],
					classes: [],
					date: [],
					time: [],
					location: [],
					details: [],
					dueDate: []
				},
				workshops2: {
					startDate: [],
					endDate: [],
					eventKey: [],
					id: [],
					title: [],
					type: [],
					classes: [],
					time: [],
					location: [],
					details: [],
					dueDate: []
				},
				otherActivities2: [],
				otherActivity: {
					startDate: [],
					endDate: [],
					eventKey: [],
					id: [],
					title: [],
					type: [],
					classes: [],
					label: [],
					value: [],
					time: [],
					location: [],
					details: [],
					dueDate: []
				},
				otherActivity2: {
					startDate: [],
					endDate: [],
					eventKey: [],
					id: [],
					title: [],
					type: [],
					classes: [],
					label: [],
					value: [],
					time: [],
					location: [],
					details: [],
					dueDate: []
				},
				finalActivity: {
					startDate: '',
					endDate: '',
					eventKey: '',
					id: '',
					title: '',
					type: '',
					classes: '',
					time: 'Wed Oct 18 2017 08:00:00',
					location: '',
					details: '',
					dueDate: ''
				}
			}
		},
		methods: {
			isHasOtherActivityEmpty () {
				for (var i = 0; i < this.otherActivities.length; i++) {
					if (typeof this.otherActivity2.time[i] === 'undefined') {
						this.isOtherActivityError = true
						return true
					}
				}
				this.isOtherActivityError = false
				return false
			},
			isHasEmptyWorkshops () {
				for (var i = 0; i < this.numOfWorkshops; i++) {
					if (typeof this.workshops2.time[i] === 'undefined') {
						this.isWorkshopError = true
						console.log('found empty in workshop')
						return true
					}
				}
				console.log('not empty found in workshop')
				this.isWorkshopError = false
				return false
			},
			alreadySelectedSunday (s) {
				// try{

					// s.setHours(0,0,0,0)
					let dif = this.$mathMixin.dayDiff(this.orientation.startDate, new Date(s))
					let dif2 = this.$mathMixin.dayDiff(this.photoshoot.startDate, new Date(s))
					var payLen = this.numOfPayments
					// let lastPaymentDate = this.$store.getters['startUp/getPlainValue'](this.paymentSched[this.paymentSched.length-1])
					// let diffPayment = this.$mathMixin.dayDiff(lastPaymentDate.startDate, new Date(s))

					// console.log('payLen', diffPayment)
					// console.log('last pay', this.getPaymentLastIndex)
					let dif3 = this.$mathMixin.dayDiff(new Date(this.getPaymentLastIndex), new Date(s))
					if (dif <= 0) {
						return false
					} else if (dif2 <= 0) {
						return false
					} else if (dif3 <= 0) {
						return false
					}
					else {
						for (var i = 0; i < this.workshops.startDate.length; i++) {
							let dif4 = this.$mathMixin.dayDiff(new Date(this.workshops.startDate[i]), new Date(s))
							if (dif4 <= 0) {
								return false
							}
						}
					}
					return true
				// } catch	{
				// 	return true
				// }

			},
			hasNewWorkshop (i) {
				// console.log('in', i)
				if (this.numberOfWorkshops >= 1 && (i !== 0 || this.numberOfWorkshops != 2)) {
					return true
				} else {
					return false
				}
			},
			disableAddWorkshop (i) {
				var len = this.workshops.startDate.length
				if (typeof this.workshops.startDate[i] === 'undefined') {
					return true
				} else {
					return false
				}
			},
			selectUpcomingDate (ws, sun) {
				// console.log('ws', ws)
				// console.log('sun', sun)
				this.workshops.startDate[ws] = sun
				this.$forceUpdate()
				// console.log('wo', this.workshops)
			},
			selected (item) {
				console.log('item selected', item)
				// this.orientation.location = item.value
			},
			searchDetails (terms, done) {
				setTimeout(() => {
	        done(filter(terms, {field: 'value', list: this.parseDetails}))
	      }, 1000)
			},
			searchLocation (terms, done) {
				setTimeout(() => {
	        done(filter(terms, {field: 'value', list: this.parseLocations}))
	      }, 1000)
			},
			removeWorkshop (i) {
				try {
					console.log('remove i ', i)
					console.log('remove w', this.workshops.startDate[i])
					if (typeof this.workshops.startDate[i] !== 'undefined') {
						this.workshops.startDate.splice(i, 1)
					}
					if (typeof this.workshops.location[i] !== 'undefined') {
						this.workshops.location.splice(i, 1)
					}
					if (typeof this.workshops.details[i] !== 'undefined') {
						this.workshops.details.splice(i, 1)
					}
				} catch {}
				this.numberOfWorkshops--
			},
			workshopMinDate (w) {
				try {
					if (w >= 2) {
						return this.$mathMixin.addDays(new Date(this.workshops.startDate[this.workshops.startDate.length-2]), 1).toString()
					} else {
						return this.$mathMixin.addDays(new Date(this.getPaymentLastIndex), 4).toString()
					}
				} catch {
					return this.$mathMixin.addDays(new Date(this.getPaymentLastIndex), 4).toString()
				}
			},
			otherActivityMinDate (a, i) {
				try {
					if (i <= 0) {
						if (this.workshops.startDate.length <= 0) {
							return this.$mathMixin.addDays(new Date(this.getPaymentLastIndex), 1).toString()
						} else {
							return this.$mathMixin.addDays(new Date(this.workshops.startDate[this.workshops.startDate.length-1]), 1).toString()
						}
					} else {
						return this.$mathMixin.addDays(new Date(this.otherActivity.startDate[i-1]), 1).toString()
					}

				} catch {
					return this.$mathMixin.addDays(new Date(this.getPaymentLastIndex), 1).toString()
				}
			},
			setActivityLabel (activity) {
				// console.log('act', activity)
				// this.otherActivity.value.push(activity.value)
				// this.otherActivity.label.push(activity.label)
				return activity.label
			},
			setPaymentsAmount () {
				try {
					console.log('payments', this.numOfPayments)
					console.log('totalAmount', this.totalAmount)
					if (this.numOfPayments % 2 === 0) {
						let eachPayment = parseFloat(this.totalAmount.replace(/,/g, '')) / parseInt(this.numOfPayments)
						console.log('each', parseInt(this.totalAmount))
						console.log('each', parseInt(this.numOfPayments))
						console.log('each', eachPayment)
						this.payments.amount = new Array(this.numOfPayments)
						for (var i = 0; i < this.payments.amount.length; i++) {
							this.payments.amount[i] = eachPayment
						}
					} else {
						let firstPayment = parseFloat(this.totalAmount.replace(/,/g, '')) * 0.20
						let otherPayment = (parseFloat(this.totalAmount.replace(/,/g, '')) - firstPayment) / (parseInt(this.numOfPayments) - 1)
						console.log('each', parseInt(this.totalAmount))
						console.log('each', parseInt(this.numOfPayments))
						console.log('first Payment', firstPayment)
						console.log('first Payment', otherPayment)
						this.payments.amount = new Array(this.numOfPayments)
						this.payments.amount[0] = firstPayment
						for (var i = 1; i < this.payments.amount.length; i++) {
							this.payments.amount[i] = otherPayment
						}
					}
					console.log('it ends here')
					this.generateSchedule()
				} catch {}

			},
			generateSchedule () {
				console.log('seasonstart', this.seasonStart)
				console.log('seasonend', this.seasonEnd)
				//orientation`
				this.orientation.startDate = new Date(this.seasonStart)
				this.orientation.startDate.setHours(0,0,0,0)
				this.orientation.endDate = new Date(this.seasonStart)
				this.orientation.classes	 =  this.colorCode
				this.orientation.eventKey = this.eventKey
				this.orientation.id = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_orientation`
				this.orientation.title = `Batch(${this.getBatchNumber})_orientation`
				// this.orientation.title = `${this.event.eventCode}(${this.getLatestSeason})batch(${this.getBatchNumber})_orientation`
				this.orientation.type = 'orientation'
				console.log('orientation', this.orientation)
				// payment
				let paymentToDays = this.$store.getters['users/convertToDays']({dateType: this.getPaymentCourseActivity.dayAfter.dateType, dateNumber: this.getPaymentCourseActivity.dayAfter.dateNumber})
				for (var i = 0; i < this.numOfPayments; i++) {
					if (i === 0) {
						var pay = {
							amount: this.payments.amount[i],
							classes: this.colorCode,
							startDate: this.$mathMixin.addDays(new Date(this.seasonStart), 3),
							endDate: this.$mathMixin.addDays(new Date(this.seasonStart), 3),
							eventKey: this.eventKey,
							id: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
							title: `Batch(${this.getBatchNumber})_payment(${i+1})`,
							// title: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
							type: 'payment'
						}

					} else {
						var pay = {
							amount: this.payments.amount[i],
							classes: this.colorCode,
							startDate: this.$mathMixin.addDays(new Date(this.paymentSched[i-1].startDate), paymentToDays),
							endDate: this.$mathMixin.addDays(new Date(this.paymentSched[i-1].startDate), paymentToDays),
							eventKey: this.eventKey,
							id: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
							title: `Batch(${this.getBatchNumber})_payment(${i+1})`,
							// title: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_payment(${i+1})`,
							type: 'payment'
						}
						console.log('pay ni act', pay)
					}
					pay.startDate = pay.endDate
					pay.startDate.setHours(0,0,0,0)
					pay.endDate.setHours(0,0,0,0)
					this.paymentSched.push(pay)
				}
				console.log('payment sched', this.paymentSched)
				// photoshoot
				let photoshootToDays = this.$store.getters['users/convertToDays']({dateType: this.getPhotoshootCourseActivity.dayAfter.dateType, dateNumber: this.getPhotoshootCourseActivity.dayAfter.dateNumber})
				this.photoshoot.startDate = this.$mathMixin.addDays(new Date(this.paymentSched[0].startDate), photoshootToDays)
				this.photoshoot.endDate = this.$mathMixin.addDays(new Date(this.paymentSched[0].startDate), photoshootToDays)
				this.photoshoot.eventKey = this.eventKey
				this.photoshoot.id = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_photoshoot`
				this.photoshoot.title = `Batch(${this.getBatchNumber})_photoshoot`
				// this.photoshoot.title = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_photoshoot`
				this.photoshoot.type = 'photoshoot'
				this.photoshoot.classes = this.colorCode
				// photoliking
				let photolikingToDays = this.$store.getters['users/convertToDays']({dateType: this.getPhotolikingCourseActivity.dayAfter.dateType, dateNumber: this.getPhotolikingCourseActivity.dayAfter.dateNumber})
				this.photoliking.startDate = this.$mathMixin.addDays(new Date(this.paymentSched[1].startDate), photolikingToDays)
				this.photoliking.endDate = this.$mathMixin.addDays(new Date(this.paymentSched[1].startDate), 14)
				this.photoliking.eventKey = this.eventKey
				this.photoliking.id = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_photoliking`
				this.photoliking.title = `Batch(${this.getBatchNumber})_photoliking`
				// this.photoliking.title = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_photoliking`
				this.photoliking.type = 'photoliking'
				this.photoliking.classes = this.colorCode
				this.photoliking.dueDate = this.photoliking.endDate
				this.photoliking.startDate.setHours(0,0,0,0)
				this.photoliking.endDate.setHours(0,0,0,0)
				// final activity
				this.finalActivity.startDate = new Date(this.seasonEnd)
				this.finalActivity.endDate = new Date(this.seasonEnd)
				this.finalActivity.classes	 =  this.colorCode
				this.finalActivity.eventKey = this.eventKey
				this.finalActivity.id = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_${this.getFinalActivity.value}`
				this.finalActivity.title = `Batch(${this.getBatchNumber})_${this.getFinalActivity.value}`
				// this.finalActivity.title = `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_${this.getFinalActivity.value}`
				this.finalActivity.type = this.getFinalActivity.value
				this.finalActivity.startDate.setHours(0,0,0,0)
				console.log('done generating sched', this)
			},
			concatActivities () {
				var getOrientHours = new Date(this.orientation.time).getHours()
				var getOrientMin = new Date(this.orientation.time).getMinutes()
				this.orientation.startDate.setHours(getOrientHours, getOrientMin,0,0)
				this.orientation.endDate.setHours(getOrientHours, getOrientMin,0,0)
				var getPhotoHours = new Date(this.photoshoot.time).getHours()
				var getPhotoMin = new Date(this.photoshoot.time).getMinutes()
				this.photoshoot.startDate.setHours(getPhotoHours, getPhotoMin,0,0)
				this.photoshoot.endDate.setHours(getPhotoHours, getPhotoMin,0,0)
				var getFinalHours = new Date(this.finalActivity.time).getHours()
				var getFinalMin = new Date(this.finalActivity.time).getMinutes()
				this.finalActivity.startDate.setHours(getFinalHours, getFinalMin,0,0)
				this.finalActivity.endDate.setHours(getFinalHours, getFinalMin,0,0)

				// other activities
				console.log('other acts2', this.otherActivity)
					let otherSched = []
					for (var k = 0; k < this.otherActivities2.length; k++) {
					let other = {
						startDate: new Date(this.otherActivity.startDate[k]),
						endDate: typeof this.otherActivity.dueDate[k] !== 'undefined' ? new Date(this.otherActivity.dueDate[k]) : new Date(this.otherActivity.startDate[k]),
						eventKey: this.eventKey,
						id: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_${this.otherActivity.label[k]}`,
						title: `Batch(${this.getBatchNumber})_${this.otherActivity.label[k]}`,
						// title: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_${this.otherActivity.label[k]}`,
						classes: this.colorCode,
						time: this.otherActivity.time[k] ? this.otherActivity.time[k] : '',
						location: this.otherActivity.location[k] ? this.otherActivity.location[k] : '',
						details: this.otherActivity.details[k] ? this.otherActivity.details[k] : '',
						dueDate: this.otherActivity.dueDate[k] ? this.otherActivity.dueDate[k] :'',
						type: this.otherActivity.label[k]
					}
					console.log('time', other.time)
					other.startDate.setHours(0,0,0,0)
					if (typeof other.time !== 'undefined' && other.time !== '') {
						var getOtherhours = new Date(other.time).getHours()
						var getOtherMin = new Date(other.time).getMinutes()
						other.startDate.setHours(getOtherhours, getOtherMin)
						other.endDate.setHours(getOtherhours, getOtherMin)
					} else {
						other.endDate.setHours(0,0,0,0)
					}
					otherSched.push(other)
				}
				console.log('other', otherSched)

				// workshops
				console.log('is has workshop', this.isHasWorkshop)
				if (this.isHasWorkshop) {
					let workshopSched = []
					for (var j = 0; j < this.numberOfWorkshops; j++) {
						var works = {
							startDate: new Date(this.workshops.startDate[j]),
							time: new Date(this.workshops.time[j]),
							eventKey: this.eventKey,
							id: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_workshop(${j+1})`,
							title: `Batch(${this.getBatchNumber})_workshop(${j+1})`,
							// title: `${this.event.eventCode}(${this.getLatestSeason})_batch(${this.getBatchNumber})_workshop(${j+1})`,
							classes: this.colorCode,
							dueDate: '',
							location: this.workshops.location[j] ? this.workshops.location : '',
							details: this.workshops.details[j] ? this.workshops.details[j] : '',
							type: 'workshop'
						}
						works.startDate.setHours(0,0,0,0)
						works.endDate = works.startDate
						var getWorkHours = new Date(works.time).getHours()
						var getWorkMin = new Date(works.time).getMinutes()
						works.endDate.setHours(getWorkHours, getWorkMin)
						workshopSched.push(works)
						console.log('wokseche', workshopSched)
					}
					let conArray = Array.prototype.concat(this.orientation, this.paymentSched, this.photoshoot, this.photoliking, workshopSched, otherSched, this.finalActivity)
					console.log('concat', conArray)
					this.$store.state.users.newSeasonActivities = conArray
				} else {
					let conArray = Array.prototype.concat(this.orientation, this.paymentSched, this.photoshoot, this.photoliking, otherSched, this.finalActivity)
					console.log('concat', conArray)
					this.$store.state.users.newSeasonActivities = conArray
				}
			},
			saveSeasonActivities () {
				this.$forceUpdate()
				let test = this.isHasEmptyWorkshops
				console.log('test', this.isHasEmptyWorkshops)
				console.log('season isSameTotal', this.isSameTotal)
				console.log('season isWorkshopError', this.isHasEmptyWorkshops)
				console.log('season isOtherActivityError', this.isHasOtherActivityEmpty)
				// if (this.isSameTotal || this.isWorkshopError || this.isOtherActivityError) {
				if (this.isSameTotal) {
					// console.log('season isSameTotal', this.isPaymentError)
					// console.log('season isWorkshopError', this.isWorkshopError)
					// console.log('season isOtherActivityError', this.isOtherActivityError)
					this.$q.notify('Please check fields')

				} else {
					console.log('season props', this.season)


					this.$q.dialog({
		        title: 'Confirm Activities',
		        message: `Confirm activities?`,
		        ok: 'Yes',
		        cancel: 'No'
		      }).then(() => {
				   		this.$store.state.users.newSeason = this.season
							this.$store.state.users.isNewSeasonActivities = true
		      		this.concatActivities()
		      		this.$router.push(`/eventseason/${this.$route.params.id}/${this.$store.state.users.newSeason.seasonNumber}/seasonBatches`)
		        }).catch(() => {})
				}
			},
			generateWorkshops () {
				// console.log('payments', this.payments)
				let payment3 = new Date(this.get3rdPayment.startDate) // payment 3
				// console.log('payment3', payment3)
	 			let sundays = this.$store.getters['startUp/getUpcomingWeekEnds']({startDate: new Date(this.seasonStart), weekEnd: 'sundays'})
	 			let filterSun = new Array()
	 			this.$lodash.forEach(sundays, s => {
	 				let dif = this.$mathMixin.dayDiff(new Date(this.seasonStart), new Date(s))
	 				if (dif > 37) {
	 					filterSun.push(s)
	 				}
	 			})
				// console.log('numberOfWorkshops', this.$store.state.users.numberOfWorkshops)
	 			for (var i = 0; i < this.numberOfWorkshops; i++) {
	 				this.workshops.startDate[i] = new Date(filterSun[i])
	 				this.workshops.endDate[i] = new Date(filterSun[i])
	 				// this.workshops2.startDate[i].setHours(0,0,0,0)
					// this.workshops2.endDate[i].setHours(0,0,0,0)
	 			}
				// console.log('workshops2', this.workshops2)
			},
			generateOtherActivities () {
				// console.log('final event', this.seasonEnd)
				// console.log('otherActivities', this.otherActivities2)
				let sundays = this.$store.getters['startUp/getUpcomingWeekEnds2']({startDate: new Date(this.seasonEnd), weekEnd: 'sundays'})
				// console.log('sundays', sundays)
	 			let filterSun = new Array()
	 			for (var i = 0; i < sundays.length; i++) {
	 				let dif = this.$mathMixin.dayDiff(new Date(this.seasonEnd),  new Date(sundays[i]),)
	 				console.log('dif', dif)
	 				if (dif === 0) {
	 					i = sundays.length
	 					break
	 				}
		 			filterSun.push(sundays[i])
	 			}
	 			function reverseArr(input) {
				    var ret = new Array;
				    for(var i = input.length-1; i >= 0; i--) {
				        ret.push(input[i]);
				    }
				    return ret;
				}
	 			let takeRight = this.$lodash.takeRight(filterSun, this.otherActivities.length)
	 			// console.log('takeRight', takeRight)
	 			for (var j = 0; j < this.otherActivities.length; j++) {
	 				this.otherActivity2.startDate[j] = takeRight[j]
	 			}
	 			// console.log('otherActivity2', this.otherActivity2)
			},
			test () {
				// "2018-12-11 T16:00:00.000Z"
				console.log('otherActivities', this.otherActivities)
				console.log('payments', this.payments)
				console.log('upcomingSundays2', this.upcomingSundays2)
				console.log('finalevent', this.finalActivity)
				let availableDates = new Array()
				this.$lodash.forEach(this.upcomingSundays2, us => {
					let dif = this.$mathMixin.dayDiff(new Date(us), this.finalActivity.startDate)
					console.log('dif', dif)
					if (dif > 0) {
						availableDates.push(us)
					}
				})

				let droppedDates = this.$lodash.dropRight(availableDates, this.otherActivities.length)
				console.log('droppedDates', droppedDates)
			}
			// end of methods
		}
	}
</script>
