
<template>
	<div class="q-ma-md">
    <q-stepper color="secondary" ref="stepper" alternative-labels>
		  <q-step default name="first" title="Set Date">
		    <div>
		    	<!-- <q-btn label="test" @click="test" /> -->
			    <q-select
			    	filter
			      v-model="newBatchOrientationDate"
			      float-label="Orientation Date"
			      :error="$v.newBatchOrientationDate.$error"
			      :options="generateNewBatchPossibleDates ? generateNewBatchPossibleDates : []"
			      @input="onChangeNewBatchDate"
			    />
			    	<!-- <q-datetime
			  		disable
			  		:min="getLastBatchOrientation"
			  		:max="getBatchFinalEvent.startDate"
			    	class="q-ma-md"
			    	format="MMM-DD-YYYY"
			    	v-model="newBatchStartDate"
			    	stack-label="Batch Start"
			    	type="date"
			    /> -->
		    </div>
		    <q-stepper-navigation>
		      <q-btn color="secondary" @click="continueToActivity()" label="Continue" />
		    </q-stepper-navigation>
		  </q-step>

		  <q-step name="second" title="Activities">
		  	<activities
		  		ref="activityRef"
		  		:eventKey="eventKey"
		  		:eventCode="eventCode"
		  		:seasonNumber="seasonNumber"
		  		:seasonEnd="seasonEnd"
		  		:lastBatchCourse="lastBatchCourse"
		  		:newBatchOrientationDate="newBatchOrientationDate"
		  	></activities>


		  	<q-stepper-navigation>
		      
		      <q-page-sticky position="bottom-right" :offset="[18, 18]">
					  <q-btn color="secondary" @click="activityConfirmNext()" label="Next" />
					</q-page-sticky>

					 <q-page-sticky position="bottom-left" :offset="[18, 18]">
					 		<q-btn color="secondary" flat @click="$refs.stepper.previous()" label="Back" />
						</q-page-sticky>
		    </q-stepper-navigation>

		  </q-step>

		  <q-step name="third" title="Preview" >
		  	<!-- <calendar-view
					:show-date="showDate"
					:events="[]"
					:show-event-times="showEventTimes"
					:enableDragDrop="enableDragDrop"
					:timeFormatOptions="{ hour: 'numeric', minute: 'numeric', hour12: true}"
					:startingDayOfWeek="startingDayOfWeek"
					@show-date-change="setShowDate"
					@click-date="clickDate"
					@click-event="clickEvent"
					@drop-on-date="dropOnDate"
					class="calendar theme-default holiday-us-traditional"
				/> -->
				<preview
					ref="previewRef"
					:eventKey="eventKey"
					:seasonNumber="seasonNumber"
					:newBatchObject="getLastBatch"
					:isNewBatch=true>
				</preview>

				<q-stepper-navigation>
						      
		      <q-page-sticky position="bottom-right" :offset="[18, 18]">
					  <q-btn color="secondary" @click="finishNewBatch()" label="Finish" />
					</q-page-sticky>

					 <q-page-sticky position="bottom-left" :offset="[18, 18]">
					 		<q-btn color="secondary" flat @click="backToActivity()" label="Back" />
						</q-page-sticky>
		    </q-stepper-navigation>
		  </q-step>
		</q-stepper>
	</div>
</template>
<script>
import {date} from 'quasar'
import { CalendarView } from 'vue-simple-calendar'
import activities from '../../components/eventComponents/activities'
import preview from '../../components/activityPreview'
import { required, between } from 'vuelidate/lib/validators'

require("vue-simple-calendar/static/css/default.css")
require("vue-simple-calendar/static/css/holidays-us.css")

export default {
	props: {
		eventKey: {
			type: String,
			default: ''
		},
		eventCode: {
			type: String,
			default: ''
		},
		seasonNumber: {
			type: Number,
			default: 0,
		},
		seasonEnd: {
			type: String,
			default: ''
		},
		lastBatchCourse: {
			type: String,
			default: ''
		}
	},
	components: {
		CalendarView,
		activities,
		preview
	},
	validations () {
		return {
			newBatchOrientationDate: {
				required
			}
		}
	},
	firebase () {
		return {
			schedules: this.$database.ref('event_schedules').orderByChild('eventKey').equalTo(this.eventKey),
			course: this.$database.ref('settings/courses').orderByKey().equalTo(this.lastBatchCourse),
			locationTemplates: this.$database.ref('locationTemplates'),
		}
	},
	computed: {
		newBatchModal: {
			get () {
				return this.$store.state.users.newBatchModal
			},
			set (v) {
				this.$store.state.users.newBatchModal = v
			}
		},
		locationTemplateOpt () {
			var mapLoc = new Array ()
			mapLoc = this.$lodash.map(this.locationTemplates, t => {
				return { label: t.name,  value: t['.key']}
			})
			mapLoc.push({
        label: 'New Location',
        value: 'new location',
        icon: 'add'
      })
			return mapLoc
		},
		workshopsMaxDate () {
			return date.subtractFromDate(new Date(this.seasonEnd), {days: 7})
		},
		payments: {
			get () {
				return this.$store.state.schedules.payments
			},
			set (v) {
				this.$store.state.schedules.payments = v
			}
		},
		photoshoot: {
			get () {
				return this.$store.state.schedules.photoshoot
			},
			set (v) {
				this.$store.state.schedules.photoshoot = v
			}
		},
		hasWorkshops () {
			return this.$lodash.some(this.lastBatchActivities, {type: 'workshops'})
		},
		hasPhotoliking () {
			return this.$lodash.some(this.lastBatchActivities, {type: 'photoliking'})
		},
		hasPhotoshoot () {
			return this.$lodash.some(this.lastBatchActivities, {type: 'photoshoot' || 'photoshoots'})
		},
		lastBatchWorkshops () {
			if (this.hasWorkshops) {
				return this.$lodash.filter(this.lastBatchActivities, a => {
					return a.type === 'workshop' || a.type  === 'workshops'
				})
			} else {
				return {}
			}
		},
		lastBatchPhotoliking () {
			if (this.hasPhotoliking) {
				return this.$lodash.find(this.lastBatchActivities, a => {
					return a.type === 'photoliking'
				})
			} else {
				return {}
			}
		},
		lastBatchPhotoshoot () {
			if (this.hasPhotoshoot) {
				return this.$lodash.find(this.lastBatchActivities, a => {
					return a.type === 'photoshoot' || a.type  === 'photoshoots'
				})
			} else {
				return {}
			}
		},
		lastBatchPayments () {
			return this.$lodash.filter(this.lastBatchActivities, a => {
				return a.type === 'payments' || a.type  === 'payment'
			})
		},
		lastBatchActivities () {
			return this.getLastBatch.activities
		},
		getLastBatch () {
			let lastBatch = this.$lodash.maxBy(this.getSeasonBatches, b => {
				return b.batchNumber
			})
			// return this.$store.getters['startUp/getPlainValue'](lastBatch)
			return lastBatch
		},
		getSeasonBatches () {
			// try {
				let batches = this.$lodash.filter(this.schedules, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === this.seasonNumber
				})
				// console.log('batches', batches)
				return batches
			// } catch {
			// 	return []
			// }
		},
		getWorkshopActivity () {
			return this.$lodash.filter(this.getCourse.activities, a => {
				return a.value === 'workshops' || a.value === 'workshop'
			})[0]
		},
		getOtherActivities () {
			return this.$lodash.filter(this.getSeasonBatches[0].activities, function(o) {
				return o.type != 'payments' && o.type != 'orientation' && o.type != 'photoshoots' && o.type != 'photoshoot' && o.type != 'photoliking' && o.type != 'workshop' && o.type != 'workshops' && o.type != 'final event'
			})
		},
		getOtherActivitiesDetailed () {
			return this.$lodash.filter(this.getOtherActivities, a => {
				return a.actType === 'detailed'
			})
		},
		generateNewBatchPossibleDates () {
			try {
				// console.log(this.getLastBatch.activities[0], 'this.getLastBatch.activities[0]')
				let lastBatchOrientStartDate = this.getLastBatch ? this.getLastBatch.activities[0] : []
				let lastBatchActivities = this.getLastBatch.activities
				let sun = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: lastBatchOrientStartDate.startDate, seasonEnd: this.seasonEnd, daysofweek: 'sunday'})
				let sat = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: lastBatchOrientStartDate.startDate, seasonEnd: this.seasonEnd, daysofweek: 'saturday'})

				// console.log('sun', sun)
				// console.log('sat', sat)
				let possibleDates = this.$lodash.orderBy(sun.concat(sat), d => { return new Date(d) })

				// console.log('possibleDates', possibleDates)
				// console.log('lastBatchActivities', lastBatchActivities)
				
				var tempDates = this.$lodash.filter(possibleDates, d => {
					
					let dif = date.getDateDiff(new Date(d), new Date(), 'days')
							// let dif2 = date.getDateDiff(date2, new Date(), 'days')
						// console.log('j', dif)
						if (dif > 0) {
							return d
						}
				})
				
				// console.log('tempDates', tempDates)
				for (var i = 0; i < this.getOtherActivitiesDetailed.length; i++) {
					for (var j = 0; j < possibleDates.length; j++) {
						let date1 = new Date(possibleDates[j])
						let date2 = new Date(this.getOtherActivitiesDetailed[i].startDate)
						date1.setHours(0,0,0,0)
						date2.setHours(0,0,0,0)
						if ( date.isSameDate(new Date(date1), new Date(date2)) ) {
							// console.log(date.isSameDate(new Date(possibleDates[j]), new Date(lastBatchActivities[i].startDate)))
							// console.log('i', i)
							// console.log('j', j)
							
							tempDates.splice(j, 1)
						}
					}
				}
			
				
			
				let toReturn = this.$lodash.map(tempDates, d => {
					return { label: this.$store.getters['schedules/formatDate'](d), value: d}
				})
				return toReturn
			} catch (err) {
				return []
			}
			
		},
		getPhotoshootActivity () {
			return this.$lodash.filter(this.getCourse.activities, a => {
				return a.value === 'photoshoot' || a.value === 'photoshoots'
			})[0]
		},
		getPhotolikingActivity () {
			return this.$lodash.filter(this.getCourse.activities, a => {
				return a.value === 'photoliking'
			})[0]
		},
		getCourse () {
			// return this.$lodash.filter(this.courses, c => {
			// 	return c['.key'] === this.courseKey
			// })[0]
			return this.course[0]
		},
		newBatchNumber () {
			return ++this.getLastBatch.batchNumber
		},
		isShowWorkshopActivity () {
			if (this.showWorkshopActivity) {
				this.generateWorkshopActivity()
			}
		}
	},
	data () {
		return {
			newWorkshopNameLocation: [],
			selectWorkshopLocation: [],
			workshopPickDateChecked: [],
			showWorkshopActivity: false,
			newBatchOrientationDate: '',
			showDate: new Date(),
			showEventTimes: true,
			enableDragDrop: true,
			startingDayOfWeek: 0,
			resolve: null,
			reject: null,
			// eventKey: '',
			// eventCode: '',
			// seasonNumber: 1,
			// seasonEnd: '',
			// lastBatchCourse: {}
		}
	},
	methods: {
		closeModal () {
			this.newBatchModal = false
			this.resolve = false
		},
		openModal (eventKey, eventCode, seasonNumber, seasonEnd, lastBatchCourse) {
			// this.eventKey = eventKey
			// this.eventCode = eventCode
			// this.seasonNumber = seasonNumber
			// this.seasonEnd = seasonEnd
			// this.lastBatchCourse = lastBatchCourse
			this.newBatchModal = true
			return new Promise ((resolve, reject) => {
				resolve = this.resolve
				reject = this.reject
			})
		},
		continueToActivity () {
			this.$v.$touch()
			// console.log(this.$v, 'v')
			if	(!this.$v.$error) {

				// console.log(this.$refs.activityRef,)
				this.$refs.stepper.next()
			}
		},
		finishNewBatch () {
			this.$refs.previewRef.saveNewSeasonBatchActivity()
				.then((result) => {
					if (result) {
						this.$refs.stepper.reset()
					}
				})
		},
		backToActivity () {
			this.$refs.stepper.previous()
			this.$store.state.schedules.plottedActivities = []
		},
		activityConfirmNext () {
			// console.log(this.$refs.activityRef, 'activityRef')
			this.$refs.activityRef.isEmptyField()
				.then(res => {
					// console.log(res, 'res')
					if (res) {
						this.$refs.activityRef.proceedToPreview()
						.then(result => {
							if (result) {
								this.$refs.stepper.next()	
							}
						})
					}
					
				})
			
		},
		getLocation (key) {
			return this.$lodash.filter(this.locationTemplates, t => {
				return t['.key'] === key
			})[0]
		},
		onChangeWorkshopLocation (i) {
			try {
				this.lastBatchWorkshops.location[i] = this.getLocation(this.selectWorkshopLocation[i]).location
				this.lastBatchWorkshops.details[i] = this.getLocation(this.selectWorkshopLocation[i]).details
			} catch {}
		},
		clearWorkshopSelectLocation (i) {
			this.selectWorkshopLocation[i] = ''
			this.$forceUpdate()
		},
		saveWorkshopLocation (i) {
			this.$store.dispatch('schedules/saveNewLocation', {name: this.newWorkshopNameLocation[i], location: this.lastBatchWorkshops[i].location, details: this.lastBatchWorkshops[i].details})
				.then(snapshot => {
					this.selectWorkshopLocation[i] = snapshot
					this.newWorkshopNameLocation[i] = ''
					this.$forceUpdate()
				})
				.catch(() => {})
		},
		workshopsMinDate (i) {
			if (i > 0) {
				return date.addToDate(new Date(this.lastBatchWorkshops[i-1].startDate), {days: 1})
			} else {
				var dateData = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoshoot.startDate
				return date.addToDate(new Date(dateData), {days: 1})
			}
		},
		workshopOpt (index) {
			// try {
				function formatDate (date, moment) {
					var dt = moment(new Date(date))
					return dt.format('ddd MMMM DD, YYYY')
				}
				var dataSeasonStart = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoshoot.startDate

				let dates = this.$store.getters['schedules/getDatesOfWeek']({
					seasonStart: dataSeasonStart, 
					seasonEnd: this.seasonEnd, 
					daysofweek: this.getWorkshopActivity.dayOfWeek
				})
				if (index >= 1) {
					var count = 0
					var dLength = dates.length
					for (var i = 0; i < dLength; i++) {
						var dif = date.getDateDiff(dates[i], this.lastBatchWorkshops[index-1].startDate)
						if (dif <= 0) {
							// console.log('dif', dif)
							count++
						}
					}
					var filterDates = this.$lodash.drop(dates, count)
					let mapDates = this.$lodash.map(filterDates, d => {
						return { label: this.$store.getters['schedules/formatDate'](d), value: d }
					})
					return mapDates
				} else {
					var count = 0
					var dLength = dates.length
					let paymentStartDate = this.lastBatchPayments[2].startDate ? this.lastBatchPayments[2].startDate : this.lastBatchPayments[1].startDate
					for (var i = 0; i < dLength; i++) {
						var dif = date.getDateDiff(dates[i], paymentStartDate)
						if (dif <= 0) {
							count++
						}
					}
					var filterDates = this.$lodash.drop(dates, count)
					// console.log('filsterdates', filterDates)
					var merge = this.$lodash.union(this.lastBatchPhotoshoot.startDate, [this.lastBatchPhotoshoot.startDate], [this.lastBatchPhotoliking.startDate])
					// console.log('merge', merge)
					var tempDates = filterDates
					for (var i = 0; i < filterDates.length; i++) {
						for (var j = 0; j < merge.length; j++) {
							if (date.isSameDate(new Date(filterDates[i]), new Date(merge[j]))) {
								tempDates.splice(i, 1)
							}
						}
					}
					let mapDates = this.$lodash.map(tempDates, d => {
						return { label: formatDate(d, this.$moment), value: d }
					})
					return mapDates
				}
			// } catch {}
		
		},
		isFirstWorkshopIsNull (i) {
			if (i > 0 && this.lastBatchWorkshops[i-1].startDate === null) {
				return true
			} else {
				return false
			}
		},
		isConflictPhotoshootWorkshop () {
			let dif = date.getDateDiff(this.lastBatchPhotoshoot.startDate, this.lastBatchWorkshops[0].startDate) 
			console.log(dif, 'dif')
			if (dif >= 0) {
				this.showWorkshopActivity = true
			} else {
				this.showWorkshopActivity = false
			}
		},
		generateWorkshopActivity () {
			console.log('lastBatchWorkshops', this.lastBatchWorkshops)
			console.log('lastBatchPayments', this.lastBatchPayments)
			// check if conflict with other activity dates like photoshoot and payment 3 or 2
			if (this.isConflictPhotoshootWorkshop === false) {

			} else {
				this.showWorkshopActivity = true
			}
			// check if batch is 4
				// if batch is 4
					// input workshops input dates
				// else
		},
		generatePhotolikingActivity () {
			// try {
				if (this.hasPhotoliking) {
					if (this.getPhotolikingActivity.datePick === false) {
						var dataSeasonStart = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoshoot.startDate
						// console.log('dataSeasonStart', dataSeasonStart)
						let dates = this.$store.getters['schedules/getDatesOfWeek']({
							seasonStart: dataSeasonStart, 
							seasonEnd: this.seasonEnd, 
							daysofweek: this.getPhotoshootActivity.dayOfWeek
						})
						// console.log('dates', dates)
						// console.log('lastBatchPayments', this.lastBatchPayments)
						if (typeof dates[0] !== 'undefined') {
							this.lastBatchPhotoliking.startDate = dates[0]
							this.lastBatchPhotoliking.endDate = date.addToDate(new Date(dates[0]), { days: this.getPhotolikingActivity.duration }).toString()
						} else {
							// unable to add new batch
						}
						// console.log('lastBatchPhotoliking', this.lastBatchPhotoliking)
					}
				}
			// } catch  {() => {}}
		},
		generatePhotoshootActivity () {
			// try {
				// console.log('getPhotoshootActivity', this.getPhotoshootActivity)
				if (this.getPhotoshootActivity.datePick === false) {
					let dates = this.$store.getters['schedules/getDatesOfWeek']({
						seasonStart: this.lastBatchPayments[0].startDate, 
						seasonEnd: this.seasonEnd, 
						daysofweek: this.getPhotoshootActivity.dayOfWeek
					})
					// console.log('dates', dates)
					// for (var i = 0; i < dates.length; i++) {
					// 	var dif = date.getDateDiff(new Date(dates[i]), this.photoshootMinDate)
					// 	// console.log('dif', dif, this.photoshootMinDate)
					// 	if (dif >= 0) {
					// 		this.lastBatchPhotoshoot.startDate = dates[i]
					// 		break
					// 	}
					// }
					this.lastBatchPhotoshoot.startDate = dates[0]
					this.lastBatchPhotoshoot.endDate = dates[0]
					// console.log('lastBatchPayments', this.lastBatchPayments)
					// console.log('photoshoot', this.lastBatchPhotoshoot)
				}
			// } catch {}
		},
		generatePaymentsDate () {
			// console.log('course', this.course)
			let paymentDayOfWeek = this.$lodash.filter(this.course[0].activities, a => { return  a.value === 'payments'})
			let lastBatchOrientStartDate = this.getLastBatch.activities[0]

			// console.log('this.newBatchOrientationDate', this.newBatchOrientationDate)
			// console.log('lastBatchOrientStartDate', lastBatchOrientStartDate)

			let dates = this.$store.getters['schedules/getDatesOfWeek']({
				seasonStart: this.newBatchOrientationDate, 
				seasonEnd: this.seasonEnd, 
				daysofweek: paymentDayOfWeek[0].dayOfWeek
			})
			// console.log('dates', dates)

			// console.log('getLastBatch', this.getLastBatch)
			var paymentStart = 1
			this.lastBatchPayments[0].startDate = dates[0]
			if (typeof this.lastBatchPayments[1].startDate !== 'undefined') {
				this.lastBatchPayments[1].startDate = dates[2]
				paymentStart++
			}

			for (var i = paymentStart; i < this.lastBatchPayments.length; i++) {
				if (typeof dates[i+1] !== 'undefined') {
					// console.log('dates[i+1]', dates[i])
					let toDate = new Date(dates[i+1])
					toDate.setHours(0,0,0,0).toString()
					this.lastBatchPayments[i].startDate = toDate
					this.lastBatchPayments[i].endDate = toDate
				} else {
					return
				}
			}

			// console.log('generate lastBatchPayments', this.lastBatchPayments)
			// this.payments.startDate = testArr
		},
		onChangeNewBatchDate (newVal) {
			// console.log('getSeasonBatches', this.getLastBatch)
			// this.generatePaymentsDate()
		},
		clickDate (e) {
		},
		clickEvent (e) {
		},
		dropOnDate (e, d) {

		},
		setShowDate (d) {
			this.showDate = d
		},
		test () {
			console.log('getLastBatch', this.getLastBatch)
			this.generatePaymentsDate()
			this.generatePhotoshootActivity()
			this.generatePhotolikingActivity()
			this.generateWorkshopActivity()
			this.isConflictPhotoshootWorkshop()

			// console.log(this.showWorkshopActivity, 'showWorkshopActivity')
		}
	}
}
</script>
<style>
.calendar {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	color: #2c3e50;
	height: 500px;
	width: 90vw;
	margin-left: auto;
	margin-right: auto;
}
</style>