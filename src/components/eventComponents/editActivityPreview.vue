<template>
	<div class="row flex justify-center">
		<!-- activity list -->
			<div v-if="activityListDrawer" style="width: 168px" class="q-mr-md">
				<transition
				  appear
				  enter-active-class="animated slideInLeft"
				  leave-active-class="animated slideOutLeft"
				>
				
					<q-list highlight >
					  <p class="q-title q-ma-md" >Activities</p>
					  <q-item v-for="(act, i) in plottedActivities" :key="i" >
					  		<q-item-main>
					  			<div  @click="locateActivity(act)">
						      <q-item-tile label> {{act.title}}</q-item-tile>
						      <div v-if="act.actType === 'detailed'">
						      	<q-item-tile sublabel class="q-caption">{{$moment(act.startDate).format('ll')}}
							      {{act.time ? `- ${$moment(act.time).format('LT')}` : ''}}</q-item-tile>
							      <q-item-tile sublabel v-if="act.type === 'payments'"><b>Amount: P{{act.amount}}</b></q-item-tile>
						      </div>
						      <div v-else>
						      	<q-item-tile sublabel class="q-caption"><b>Start Date: </b> {{$moment(act.startDate).format('ll')}}</q-item-tile>
							      <q-item-tile sublabel class="q-caption"><b>End Date: </b> {{$moment(act.endDate).format('ll')}}</q-item-tile>
						      </div>
						      </div>
						    </q-item-main>
					  </q-item>
					</q-list>

				</transition>
			</div>
			<!-- calendar -->
	  <div class="col">
			<q-btn size="sm" flat icon="calendar view day" @click="activityListDrawer = !activityListDrawer"></q-btn>
			<!-- <q-btn size="sm" flat label="test" @click="test" /> -->
			<div class="a">
 				<q-toggle v-model="allScheduleChecked" @input="onChangeAllSchedules" label="All Schedules" />
 				<q-toggle v-model="viewBatchesChecked" @input="onChangeViewBatches" label="View Batches" />
			</div>
			
			<calendar-view
				:show-date="showDate"
				:events="localPlottedActivities"
				:show-event-times="showEventTimes"
				:enableDragDrop="enableDragDrop"
				:timeFormatOptions="{ hour: 'numeric', minute: 'numeric', hour12: true}"
				:startingDayOfWeek="startingDayOfWeek"
				@show-date-change="setShowDate"
				@click-date="clickDate"
				@click-event="clickEvent"
				@drop-on-date="dropOnDate"
				class="calendar theme-default holiday-us-traditional q-ma-md"
			/>
		</div>

		<!-- modal -->
		<q-modal minimized v-model="activityModal" :content-css="{minWidth: '60px', minHeight: '85vh'}">
	    <q-modal-layout>

		    <q-toolbar slot="header">
		      <q-btn flat round dense v-close-overlay icon="keyboard_arrow_left" />
		      <q-toolbar-title>
		        {{selectedActivity.title}}
		      </q-toolbar-title>
		    </q-toolbar>

		    <div slot="footer">
		      <p>Footer</p>
		    </div>

		    <div class="layout-padding">
		      <q-field
	        	label-width="2"
		        icon="date_range"
		      >
		      	<div>
		      		<div class="row">
		      			<div class="col">
		      				<q-select
					      		v-model="selectedActivity.startDate"
					      		stack-label="Select Date"
					      		filter 
					      		:options="otherActivityOpt" 
				      		/>
				      		<!-- 
				      			:min="otherActivityMinStartDate(act, i)"
				      			:max="otherActivityMaxStartDate(act, i)" -->
				      		<q-datetime 
					      		stack-label="Date" 
					      		format="ddd MMM D, YYYY" 
					      		v-model="selectedActivity.startDate"
					      		type="date" 
				      		/>
		      			</div>
		      				
	      					<!-- @input="otherActivities.startDate[i] = ''" -->
		      			<q-checkbox
					        v-model="modelcheck"
					        checked-icon="calendar_today"
					        unchecked-icon="calendar_today"
					        class="col-1 q-mt-md"
					      />
		      		</div>

		      		<q-datetime 
			      		stack-label="Time" 
			      		format="h:mm A" 
			      		v-model="selectedActivity.time" 
			      		type="time"
		      		/>	
		      	</div>
		      	
		      	<!-- insert here -->
		      </q-field>
		      <q-item-separator/>
		      <q-field
		        icon="description"
		      >	
		      	<!-- <div class="q-my-md flex row" >
		      		<q-input class="col-md-8" v-model="model" float-label="Name" />
		      		<div class="q-mt-md">
		      			<q-btn-group rounded>
								  <q-btn size="sm" color="positive" label="Save" @click=""/>
								  <q-btn size="sm" color="negative" label="Cancel" @click=""/>
								</q-btn-group>	
		      		</div>
		      	</div> -->

							<!-- @input="onChangeOtherActivityLocation(i)" -->
						<q-select
							separator
				      v-model="selectedActivity.location"
				      float-label="Select Location"
				      filter
				      :options="locationTemplateOpt"
				    />
		      	<q-input
						  v-model="model"
						  type="textarea"
						  float-label="Location"	
						  :max-height="80"
						  rows="5"
						/>
						<!-- 
		      		:readonly="selectOrientationLocation[i] === ''" -->
		      	<q-input
						  v-model="model"
						  type="textarea"
						  float-label="Details (optional)"
						  :max-height="80"
						  rows="5"
						/>
		      </q-field>
		    </div>
		  </q-modal-layout>
	  </q-modal>
	</div>
</template>
<script>
import { date } from 'quasar'
import { CalendarView } from 'vue-simple-calendar'
require("vue-simple-calendar/static/css/default.css")
require("vue-simple-calendar/static/css/holidays-us.css")

export default {
	components: {
		CalendarView
	},
	props: {
		course: {
			type: String,
			default: ''
		},
		discount: {
			type: Number,
			default: 0
		},
		eventKey: {
			type: String,
			default: ''
		},
		eventCode: {
			type: String,
			default: ''
		},
		eventName: {
			type: String,
			default: ''
		},
		numberOfPayments: {
			type: Number,
			default: 0
		},
		numberOfWorkshops: {
			type: Number,
			default: 0
		},
		seasonNumber: {
			type: Number,
			default: 0
		},
		ticketCount: {
			type: Number,
			default: 0
		},
		ticketPrice: {
			type: Number,
			default: 0
		},
		totalAmount: {
			type: Number,
			default: 0
		},
		seasonDraftKey: {
			type: String,
			default: ''
		},
		editBatchKey: {
			type: String,
			default: ''
		},
		batchNumber: {
			type: Number,
			default: 1
		}
	},
	created () {
		this.localPlottedActivities = this.plottedActivities
		// console.log(this.plottedActivities, 'plottedActivities')
		this.setLocalPlottedAsOriginalActivity()
		// this.setShowDate(this.localPlottedActivities[0].startDate)
	},
	watch: {
		allScheduleChecked () {
			// if (this.allScheduleChecked) {
			// 	this.enableDragDrop = false
			// } else {
			// 	this.enableDragDrop = true
			// }
		}
	},
	computed: {
		seasonBatches () {
			// try {
				let batches = this.$lodash.filter(this.eventSchedules, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === this.seasonNumber
				})
				return batches
			// } catch {
			// 	return []
			// }
		},
		getFinalEventActivity () {
			return this.$store.state.schedules.finalEvent
		},
		getOrientationActivity () {
			return this.$store.state.schedules.orientation
		},
		plottedActivities: {
			get () {
				return this.$store.state.schedules.plottedActivities	
			},
			set (v) {
				this.$store.state.schedules.plottedActivities = v	
			}
			
		},
		otherActivityOpt () {
			return []
		},
		locationTemplateOpt () {
			return []
		}
	},
	firebase () {
		return {
			eventSchedules: this.$database.ref('event_schedules'),
			batchToEdit: this.$database.ref('event_schedules').orderByKey().equalTo(this.editBatchKey)
		}
	},
	data () {
		return {
			localPlottedActivities: [],
			viewBatchesChecked: false,
			allScheduleChecked: false,
			selectedActivity: {
				actType: '',
				classes: '',
				details: '',
				endDate: '',
				eventKey: '',
				id: '',
				location: '',
				startDate: '',
				time: '',
				title: '',
				type: ''
			},
			modelcheck: false,
			model: '',
			activityModal: false,
			activityListDrawer: false,
			events: [
				{
					startDate: new Date('Sat Jan 12 2019 08:00:00'),
					endDate: new Date('Sat Jan 12 2019 08:00:00'),
					id: 'test',
					title: 'testing',
					classes: 'salad yellow'
				}
			],
			checked: false,
			showDate: new Date(),
			showEventTimes: true,
			enableDragDrop: true,
			startingDayOfWeek: 0,
		}
	},
	methods: {
		onChangeViewBatches: async function () {
			let promise = new Promise(resolve => {
				if (this.viewBatchesChecked) {
					if (this.allScheduleChecked) {
						this.allScheduleChecked = false
						this.onChangeAllSchedules()
					}
					// console.log('viewBatchesChecked', this.viewBatchesChecked)
					let tempAct = this.$store.getters['startUp/getPlainValue'](this.localPlottedActivities)

					let tempSeasonBatches = this.$store.getters['startUp/getPlainValue'](this.seasonBatches)
					let allActivities = []

					this.$lodash.remove(tempSeasonBatches, b => {
						return b['.key'] === this.editBatchKey
					})

					// console.log('seasonBatches', tempSeasonBatches)
					// console.log('editBatchKey', this.editBatchKey)
					this.$lodash.forEach(tempSeasonBatches, b => {
						const tempActivities = this.$store.getters['startUp/getPlainValue'](b.activities)
						allActivities.push(tempActivities)
					})

					allActivities.push(tempAct)
					const mergeActivities = [...new Set([].concat(...allActivities))]

					let mapActivities = this.$lodash.map(mergeActivities, a => {
						// if (!a.originalActivity) {
							var batch = this.$store.getters['startUp/get2ndAfterUnderline'](a.id)
							var batchNumber = this.$store.getters['startUp/extractNumber'](batch)
							// console.log(batchNumber, 'batchNumber')
							a.title = `Batch(${batchNumber})_${this.$store.getters['startUp/get3rdAfterUnderline'](a.id)}`
							a.startDate = new Date(a.startDate)
							a.endDate = new Date(a.endDate)
						// }
						return a
					})
					// console.log('mapActivities', mapActivities)

					this.localPlottedActivities = mapActivities
				} else {
					let tempAct = this.$store.getters['startUp/getPlainValue'](this.localPlottedActivities)
					console.log('tempAct', tempAct)
					let toReplacement = []
					for (var i = 0; i < tempAct.length; i++) {
						if (tempAct[i].originalActivity) {
							tempAct[i].startDate = new Date(tempAct[i].startDate)
							tempAct[i].endDate = new Date(tempAct[i].endDate)
							// console.log('original activity', tempAct[i])
							toReplacement.push(tempAct[i])
						}
					}
					console.log('toReplacement', toReplacement)

					this.localPlottedActivities = []
					this.localPlottedActivities = toReplacement
					console.log('this.localPlottedActivities', this.localPlottedActivities)
				}
				resolve('done')
			})
			let result = await promise
		},
		setLocalPlottedAsOriginalActivity () {
			for (var i = 0; i < this.localPlottedActivities.length; i++) {
				if (i !== 0) {
					this.localPlottedActivities[i].beforeDate = this.localPlottedActivities[i-1].startDate
				}
				if (i !== this.localPlottedActivities.length) {
					// this.localPlottedActivities[i].afterDate = this.localPlottedActivities[i+1].startDate
				}
				this.localPlottedActivities[i].index = i
				this.localPlottedActivities[i].originalActivity = true

			}
			// console.log('this.localPlottedActivities', this.localPlottedActivities)
		},
		setShowDate (d) {
			this.showDate = d
		},
		locateActivity (act) {
			this.setShowDate(act.startDate)
		},
		onChangeAllSchedules: async function (newVal) {
			let promise = new Promise(resolve => {
				// console.log('eventSchedules', this.eventSchedules)
				if (this.allScheduleChecked) {
					if (this.allScheduleChecked) {
						this.viewBatchesChecked = false
						this.onChangeViewBatches()
					}
					let allActivities = []
					// const tempPlotted = [...this.plottedActivities]

					// console.log('plottedActivities', this.plottedActivities)
					const tempPlotted = this.$store.getters['startUp/getPlainValue'](this.localPlottedActivities)

					// console.log('tempPlotted', tempPlotted)
					const eventSchedules = this.$store.getters['startUp/getPlainValue'](this.eventSchedules)
					this.$lodash.remove(eventSchedules, b => {
						return b['.key'] === this.editBatchKey && b.batchNumber === this.batchNumber
					})
					console.log('eventSchedules', eventSchedules)
					for (var i = 0; i < eventSchedules.length; i++) {
						allActivities.push(eventSchedules[i].activities)
					}
					for (var i = 0; i < tempPlotted.length; i++) {
						tempPlotted[i].startDate = new Date(tempPlotted[i].startDate)
						tempPlotted[i].endDate = new Date(tempPlotted[i].endDate)
						// tempPlotted[i].originalActivity = true
					}
					allActivities.push(tempPlotted)

					const merge = [...new Set([].concat(...allActivities))];
					// console.log('merge', merge)
					let mapActivities = this.$lodash.map(merge, a => {
						if (!a.originalActivity) {
							a.title = a.id
							a.startDate = new Date(a.startDate)
							a.endDate = new Date(a.endDate)
						}
						return a
					})
					// console.log('allActivities', allActivities)
					// console.log('original plottedActivities', this.plottedActivities)
					this.localPlottedActivities = mapActivities
					// console.log('mergedActivities', mergedActivities)
				} else {
					// console.log('local plotted', this.localPlottedActivities)
					let tempAct = this.$store.getters['startUp/getPlainValue'](this.localPlottedActivities)
					let toReplacement = []
					for (var i = 0; i < tempAct.length; i++) {
						if (tempAct[i].originalActivity) {
							tempAct[i].startDate = new Date(tempAct[i].startDate)
							tempAct[i].endDate = new Date(tempAct[i].endDate)
							// console.log('original activity', tempAct[i])
							toReplacement.push(tempAct[i])
						}
					}
					this.localPlottedActivities = []
					this.localPlottedActivities = toReplacement
					console.log('this.localPlottedActivities', this.localPlottedActivities)
				}
				resolve("done")
			})
			var result = await promise
		},
		convertToStringDates (act) {
			this.$lodash.forEach(act, a => {
				a.startDate = a.startDate.toString()
				a.endDate = a.endDate.toString()
				a.time = a.time.toString()
			})
			return act
		},
		saveNewSeasonBatchActivity () {
			this.$q.dialog({
		    title: 'Confirmation',
		    message: `Do you want to save ?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
		  		if (this.isNewBatch) {
		  			this.saveNewBatch()
		  		} else {
		  			this.saveNewSeason()
		  		}
		    }).catch(() => {})
			
		},
		saveEdiBatchActivity () {
			return new Promise(resolve => {
				this.$q.dialog({
					title: 'Confirmation',
					message: `Do you want to save ?`,
					ok: 'Yes',
					cancel: 'No'
				}).then(() => {
						// let batchToUpdate = this.$lodash.find(this.eventSchedules, b => {
						// 	return b['.key'] === this.editBatchKey && b.batchNumber === this.batchNumber
						// })
						let batchToUpdate = this.batchToEdit[0]

						// console.log('batchToEdit', this.batchToEdit)

						const activities = [...this.localPlottedActivities]

						// console.log('activities', activities)
						batchToUpdate.activities =  this.convertToStringDates(activities)
						batchToUpdate.batchStart = batchToUpdate.activities[0].startDate

						// console.log('batchToUpdate', batchToUpdate)
						this.$store.dispatch('schedules/updateEditBatch', batchToUpdate)
							.then(() => {
								// clear datas and close modal
								this.plottedActivities = []
								this.$store.state.schedules.editBatchModal = false
								resolve(true)
							})
							.catch(err => {
								console.log(err, 'error on saving batch')
								resolve(false)
							})
					}).catch(() => {})
			})
			


			
		},
		removeOriginalActivityField () {
			this.$lodash.forEach(this.localPlottedActivities, a => {
				delete a.originalActivity
				return a
			})
		},
		removeSeasonDraft: async function () {
			// console.log('draft key in component', this.seasonDraftKey)
			await this.$store.dispatch('schedules/removeSeasonDraftAfterSave', this.seasonDraftKey)
		},
		saveNewBatch () {
			// console.log('newBatchObject', this.newBatchObject)
			var newBatch = this.$store.getters['startUp/getPlainValue'](this.newBatchObject)
			let activities = [...this.localPlottedActivities]

			newBatch.activities =  this.convertToStringDates(activities)
			delete newBatch['.key']
			newBatch.batchNumber++
			newBatch.batchStart = newBatch.activities[0].startDate
			newBatch.dateCreated = new Date().toString()

			console.log('newBatch', newBatch)
			this.$store.dispatch('schedules/saveNewBatch', newBatch)
				.then(() => {
					// clear datas and close modal
					this.plottedActivities = []
					this.$store.state.users.newBatchModal = false
				})
				.catch(err => {})
		},
		saveNewSeason () {
			// console.log('event schedules', this.eventSchedules)
  		this.removeOriginalActivityField()
			let activities = [...this.localPlottedActivities]
			let newSeason = {
				activities: this.convertToStringDates(activities),
				batchNumber: 1,
				batchStart: this.getOrientationActivity.startDate.toString(),
				colorCode: this.getOrientationActivity.classes,
				course: this.course, 
				dateCreated: new Date().toString(),
				discount: this.discount,
				eventKey: this.eventKey,
				eventCode: this.eventCode,
				eventName: this.eventName,
				numberOfPayments: this.numberOfPayments,
				numberOfWorkshops: this.numberOfWorkshops,
				seasonEnd: this.getFinalEventActivity.startDate.toString(),
				seasonName: `${this.eventCode}_Season${this.seasonNumber}`,
				seasonNumber: this.seasonNumber,
				seasonStart: this.getOrientationActivity.startDate.toString(),
				status: 'standby',
				ticketCount: this.ticketCount,
				ticketPrice: this.ticketPrice,
				totalAmount: this.totalAmount
			}
			console.log('newSeason', newSeason)
			this.$store.dispatch('schedules/saveNewSeasonBatchActivity', newSeason)
				.then(() => {
					// console.log('saved')
					// clear data after save
					// remove seasonDraft
					// console.log('waiting to remove draft')
					if (this.seasonDraftKey !== '') {
						this.removeSeasonDraft()
					}
					this.$router.push(`/eventseason/${this.$route.params.id}/${newSeason.seasonNumber}/seasonBatches`)
				})
				.catch(err => {
					console.log('err')
				})
		},
		test () {
			// this.localPlottedActivities = this.plottedActivities
			// console.log('eventSchedules', this.eventSchedules)
			// console.log('batchNumber', this.batchNumber)
			
			// this.selectedActivity.actType = act.actType
			// this.selectedActivity.classes = act.classes
			// this.selectedActivity.details = act.details
			// this.selectedActivity.endDate = act.endDate
			// this.selectedActivity.eventKey = act.eventKey
			// this.selectedActivity.id = act.id
			// this.selectedActivity.location = act.location
			// this.selectedActivity.startDate = act.startDate
			// this.selectedActivity.time = act.time
			// this.selectedActivity.title = act.title
			// this.selectedActivity.type = act.type


		},
		clickDate (e) {
		},
		clickEvent (e) {
		},
		setTime (date, time) {
			var getHours = new Date(time).getHours()
			var getMin = new Date(time).getMinutes()
			let newDate = new Date(date)
			newDate.setHours(getHours, getMin, 0, 0)
			return newDate
		},
		removeTime (date) {
			let newDate = new Date(date)
			newDate.setHours(0, 0, 0, 0)
			return newDate
		},
		dropOnDate (e, d) {
			// console.log('d', d)
			let act = e.originalEvent
			
			if (true) {
			// console.log('e', e)
				if (e.originalEvent.originalActivity) {
					var getOrientationActivity = this.$lodash.find(this.localPlottedActivities, a => {
						return a.type === 'orientation'
					})
					var getFinalEventActivity = this.$lodash.find(this.localPlottedActivities, a => {
						return a.type === 'final event'
					})

					var seasonStartDif = date.getDateDiff(d, getOrientationActivity.startDate)
					var seasonEndDif = date.getDateDiff(d, getFinalEventActivity.startDate)
					// console.log('getFinalEventActivity', getFinalEventActivity)
					// console.log('e', e)
					if (act.type != 'orientation' && act.type != 'final event' && seasonStartDif > 0 && seasonEndDif < 0) {

							if (act.actType === 'detailed') {
								if (act.type === 'payments') {
									act.startDate = this.removeTime(d)
									act.endDate = this.removeTime(d)	
								} else {
									act.startDate = this.setTime(d, act.time)
									act.endDate = this.setTime(d, act.time)
								}
							} else {

								var dif = date.getDateDiff(act.startDate, act.endDate)
								// console.log('dif', Math.abs(dif))
								act.startDate = d
								act.endDate = date.addToDate(d, {days: Math.abs(dif)})
								// console.log('act', act)
							}
						// this.$forceUpdate()	
					}
				}
			} else {
				var seasonStartDif = date.getDateDiff(d, this.getOrientationActivity.startDate)
				var seasonEndDif = date.getDateDiff(d, this.getFinalEventActivity.startDate)
					if (e.originalEvent.originalActivity) {
						if (act.type != 'orientation' && act.type != 'final event' && seasonStartDif > 0 && seasonEndDif < 0) {

							if (act.actType === 'detailed') {
								if (act.type === 'payments') {
									act.startDate = this.removeTime(d)
									act.endDate = this.removeTime(d)	
								} else {
									act.startDate = this.setTime(d, act.time)
									act.endDate = this.setTime(d, act.time)
								}
							} else {

								var dif = date.getDateDiff(act.startDate, act.endDate)
								// console.log('dif', Math.abs(dif))
								act.startDate = d
								act.endDate = date.addToDate(d, {days: Math.abs(dif)})
								// console.log('act', act)
							}
						// this.$forceUpdate()	
					}
				}
			}
		}
	}, // end of methods
	destroyed () {
		console.log('destryoed')
		this.locateActivity = []
		this.plottedActivities = []
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
div.a {
	position: absolute;
	top: 130px;
  right: 50px;
}
</style>