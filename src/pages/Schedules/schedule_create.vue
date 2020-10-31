<template>
	<div>
		<div class="row">
			<div v-show="$store.state.schedules.isCreateNewBatch" class="col-3">
				<!-- task list -->
				<q-page-sticky :offset="[10, 0]" expand position="bottom-left">

				</q-page-sticky>
				<!-- list of schedules -->
	    	<q-list  highlight inset-separator class="q-ma-md">
	    		<q-list-header>Scheduled</q-list-header>
				  <q-item v-for="activity in $store.state.schedules.activities" :key="activity.eventKey">
				    <q-item-main>
				      <q-item-tile label>{{activity.title}}</q-item-tile>
				      <q-item-tile v-if="activity.type === 'photoliking'" sublabel>{{$moment(activity.startDate).format('l')}} to {{$moment(activity.endDate).format('l')}}</q-item-tile>
				      <q-item-tile v-if="activity.type !== 'photoliking'" sublabel>{{$moment(activity.startDate).format('llll')}}</q-item-tile>
				    </q-item-main>
				  </q-item>
				</q-list>
				<div v-for="task in taskList2" :key="task.value">
			  	<q-chip floating color="red">122</q-chip>
			    <q-chip v-if="task.visible" icon="check" color="primary">{{task.label}}{{getRemainingAmount(task)}}</q-chip>
			  </div>
			</div>
			<div class="col">
				<!-- calendar -->
		    <div class="calendar-parent q-ml-md" style="max-height: 100vw; height: 70vw">
		    	<calendar-view 
						:show-date="showDate"
						:events="activitiesToggle"
						:show-event-times="showEventTimes"
						:enableDragDrop="enableDragDrop"
						:startingDayOfWeek="startingDayOfWeek"
						@show-date-change="setShowDate"
						@click-date="clickDate"
						@click-event="clickEvent"
						@drop-on-date="dropOnDate"
						class="theme-default holiday-us-traditional q-mr-md"
					/>
		    </div>	
			</div>
		</div>
  	<!-- new batch modal -->
		<q-modal v-model="newBatchModal" :content-css="{minWidth: '50vw', minHeight: '45vh'}" @hide="clearBatchModal">
      <q-modal-layout
		    header-style="min-height: 100px"
		    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
		    footer-class="bg-primary some-class"
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
        <q-toolbar>
          <q-toolbar-title>
            Batch Details
          </q-toolbar-title>
          <q-btn flat round dense @click="$store.commit('schedules/updateNewBatchModal', false)" icon="close" />
        </q-toolbar>
        <div>
        	<q-select
        		class="textBox"
			      v-model="selectedEvent"
			      float-label="Events"
			     :options="eventOpt"
			    />
			    <q-input readonly type="text" class="textBox" v-model="getSeason" stack-label="Season" />
			    <q-input readonly min="1" type="number" class="textBox" v-model="batchNumber" stack-label="Batch Number" />
			    <q-select
			    	:readonly="isColorCode"
        		class="textBox"
			      v-model="eventColor"
			      float-label="Color Code"
			     :options="colorOpt"
			    />
			    <!-- eventCode -->
        </div>
        <!-- action -->
        <div slot="footer">
        	<q-btn color="primary" class="full-width" @click="saveBatch">OK</q-btn>
        </div>
      </q-modal-layout>
    </q-modal>
    <!-- new activity modal -->
    <q-modal v-model="newActivityModal" :content-css="{minWidth: '30vw', minHeight: '50vh'}" @hide="clearActivityModal">
      <q-modal-layout
		    content-class="{'bg-primary': isPrimary}"
		    footer-class="bg-primary some-class"
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
        <q-toolbar>
          <q-toolbar-title>
            Activity Details
          </q-toolbar-title>
          <q-btn flat round dense @click="newActivityModal=false" icon="close" />
        </q-toolbar>
        <div>
        	<!-- <q-select
        		class="textBox"
			      v-model="activityType"
			      float-label="Activity"
			     :options="activityOpt"
			    /> -->
			    <q-select
        		class="textBox"
			      v-model="activityType"
			      float-label="Activity"
			     :options="activityList2"
			    />
			    <q-input
			   		v-if="activityType === 'payment'"
			    	class="textBox"
			    	prefix="P"
					  v-model="paymentAmount"
					  type="number"
					  stack-label="Amount"
			    />
			   	<q-datetime
			   		v-if="actComponents.time || actComponents.dueDate"
			    	class="textBox"
			    	:format="isPhotoLikingDateFormat"
			    	:min="isPhotoLikingMinDate"
			    	v-model="activityTime"
			    	:stack-label="isPhotoLikingLabel"
			    	:type="isPhotoLiking"
			    />
			    <q-input
			    	v-if="actComponents.capacity"
			    	class="textBox"
					  v-model="activityCapacity"
					  type="number"
					  stack-label="Capacity"
					 />
			    <q-input
			    	v-if="actComponents.location"
			    	class="textBox"
					  v-model="activityLocation"
					  type="textarea"
					  stack-label="Location"
					  rows="7"
					 />
        </div>
        <!-- action -->
        <div slot="footer">
        	<q-btn color="primary" class="full-width" @click="saveActivity">OK</q-btn>
        	<q-btn v-if="isEdit" color="negative" class="full-width" @click="removeActivity">Delete</q-btn>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>
<script>
// import calendar
import { CalendarView } from 'vue-simple-calendar'

	export default {
		components: {
			CalendarView
		},
		computed: {
			event () {
				return this.$store.state.schedules.event
			},
			activitiesToggle () {
				try {
					if (this.$store.state.schedules.isViewAllSched) {
						return this.$store.getters['schedules/getSeeAllSchedules']
					}
					else {
						return this.$store.state.schedules.activities
					}
				}catch (err) {}
			},
			activities () {
				try {
					return this.$store.state.schedules.activities
				}catch (err) {}
			},
			batchNumber () {
				try {
					let batch = this.$lodash.filter(this.allActivities, ae => {
						return ae.eventKey === this.selectedEvent
					})
					let num = this.$store.getters['schedules/isEventBatchExist'](batch)
					if (!isFinite(num)) {
						this.eventColor = ''
						return 1
					}
					else {
						console.log('batch', batch[0])
						this.eventColor = batch[0].colorCode
						return ++num
					}
				}
				catch (err) {}
			},
			isColorCode () {
				// typeof this.colorCode !== 'undefined' || 
				if(this.eventColor === ''){
				  return false
				}
				else {
					return true
				}
			},
			colorOpt () {
				if (this.batchNumber <= 1) {
					for (var i = 0; i < this.$store.state.schedules.allActivities.length; i++) {
						for (var j = 0; j < this.$store.state.schedules.colorOpt.length; j++) {
							if (this.$store.state.schedules.allActivities[i].colorCode === this.$store.state.schedules.colorOpt[j].value) {
								this.$store.state.schedules.colorOpt[j].visible = false
							}
							else {
								this.$store.state.schedules.colorOpt[j].visible = true
							}
						}
					}
					
				}
				else {
					for (var k = 0; k < this.$store.state.schedules.colorOpt.length; k++) {
						this.$store.state.schedules.colorOpt[k].visible = true
					}
				}
				let filter = this.$lodash.filter(this.$store.getters['schedules/getColorOpt'], c => {
					return c.visible === true
				})
				// console.log('colors', state.colorOpt)
				return filter
			},
			eventOpt () {
				let events = []
				try {
					for (var i = 0; i < this.events.length; i++) {
						var season = this.events[i].seasons
						if (season) {
							if (season[0].status === 'standby') {
								events.push(this.events[i])
							}
						}
					}
				}catch (err) {}
				let opt = this.$lodash.map(events, e => {
			  	return {
			  		label: e.eventName,
						value: e['.key'],
						seasons: e.seasons
			  	}
				})
				return opt
			},
			activityList2 () {
				// console.log('activitysList', this.kidsFashionCourse)
				const staticActivity = this.kidsFashionCourse
				if (this.isEdit === true) {
					console.log('is edit')
					let options = []
					let opt = this.$lodash.map(staticActivity, kf => {
						options.push({ label: kf.label, value: kf.value, visible: true})
						return kf
					})
					// console.log('static', options)
					this.isActComponent
					return options
				}
				else {
					let opt2 = []
					let opt = this.$lodash.map(staticActivity, kf => {
						if (kf.value === 'workshop') {
							kf.visible = true
						}
						if (kf.visible === true) {
							opt2.push({ label: kf.label, value: kf.value, visible: kf.visible})
						}
						return kf
					})
					let sorted = this.$lodash.orderBy(opt2, [labels => labels.label], ['asc'])

					this.isActComponent
					console.log('sorted', sorted)
					return sorted
				}
			},
			isActComponent () {
				if (this.activityType != '') {
					let index = this.$lodash.findIndex(this.kidsFashionCourse, kf => {
						return kf.value === this.activityType
					})
					this.actComponents.time = this.kidsFashionCourse[index].time
					this.actComponents.location = this.kidsFashionCourse[index].location
					this.actComponents.capacity = this.kidsFashionCourse[index].capacity
					this.actComponents.dueDate = this.kidsFashionCourse[index].dueDate
				}
			},
			activityOpt () {
				if (this.$store.state.schedules.activities.length === 0) {
					this.activityList = []
					this.activityList = [
				  	{ label: 'Orientation', value: 'orientation', hidden: true},
				  	{ label: 'Payment', value: 'payment'},
				  	{ label: 'Photoshoot', value: 'photoshoot'},
				  	{ label: 'PhotoLiking', value: 'photoliking'},
				  	{ label: 'Workshop', value: 'workshop'},
				  	{ label: 'General Rehersal', value: 'generalRehersal'},
				  	{ label: 'Final Rehersal', value: 'finalRehersal'}
				  ]
				  return this.activityList
				}
				else if (this.isEdit) {
					let activity = [
				  	{ label: 'Orientation', value: 'orientation', hidden: true},
				  	{ label: 'Payment', value: 'payment'},
				  	{ label: 'Photoshoot', value: 'photoshoot'},
				  	{ label: 'PhotoLiking', value: 'photoliking'},
				  	{ label: 'Workshop', value: 'workshop'},
				  	{ label: 'General Rehersal', value: 'generalRehersal'},
				  	{ label: 'Final Rehersal', value: 'finalRehersal'}
				  ]
					return activity
				}
				else {
					return this.activityList
				}
			},
			taskList2 () {
				return this.$store.getters['schedules/taskList2']
			},
			taskList () {
				return this.$store.state.schedules.taskList2
			},
			getSeason () {
				try {
					let seasonObject = this.$lodash.filter(this.events, e => {
						return e['.key'] === this.selectedEvent
					})
					var sLength = seasonObject[0].seasons.length
					let season = seasonObject[0].seasons[sLength-1].seasonName
					return season
				}
				catch (err) {}
			},
			newBatchModal: {
				get () {
					return this.$store.state.schedules.newBatchModal
				},
				set (val) {
					this.$store.commit('schedules/updateNewBatchModal', val)	
				}
			},
			isLocation () {
				if (this.activityType === 'payment' || this.activityType === 'photoliking') {
					return false
				} else {
					return true
				}
			},
			isCapacity () {
				if (this.activityType === 'workshop') {
					return true
				}
				else {
					return false
				}
			},
			setActivityTime () {
				if (this.activityTime === '') {
					return this.activityDate
				}
				else {
					const dateTime = new Date(this.activityTime)
					var hours = dateTime.getHours()
					var minutes = dateTime.getMinutes()
					let activityStartDate = new Date(this.activityDate)
					activityStartDate.setHours(hours)
					activityStartDate.setMinutes(minutes)
					return activityStartDate
				}
			},
			isPhotoLiking () {
				if (this.activityType === 'photoliking') {
					return 'date'
				}
				else {
					return 'time'
				}
			},
			isPhotoLikingLabel () {
				if (this.activityType === 'photoliking') {
					return 'PhotoLiking Due Date'
				}
				else {
					return 'Time'
				}
			},
			isPhotoLikingMinDate () {
				if (this.activityType === 'photoliking') {
					return this.activityDate
				}
			},
			isPhotoLikingDateFormat () {
				if (this.activityType === 'photoliking') {
					return 'YYYY-MM-DD'
				}
				else {
					return 'h:mm A'
				}
			},
			isPhotoLikingDueDate () {
				if (this.activityType === 'photoliking') {
					return this.activityTime
				}
				else {
					return this.setActivityTime
				}
			},
			paymentCount () {
				let payments = this.$lodash.filter(this.activities, a => {
					return a.type === 'payment'
				})
				if (payments.length === 0) {
					return 1
				}
				else {
					return payments.length
				}
			},
			workshopCount () {
				let workshops = this.$lodash.filter(this.activities, a => {
					return a.type === 'workshop'
				})
				console.log('workshops', workshops)
				return workshops.length
			},
			getTotal () {
				// console.log('a', state.activities)
				let total = 0
				for (var i = 0; i < this.$store.state.schedules.activities.length; i++) {
					if (this.$store.state.schedules.activities[i].type === 'payment') {
						total += this.$store.state.schedules.activities[i].amount
					}
				}
				console.log('t', total)

					return this.amountRemaining - total

				// return this.$store.getters['schedules/getTotalPayments']
			}
		},
		mounted () {
			this.$bindAsArray('events', this.$database.ref('events'))
			this.$bindAsArray('allActivities', this.$database.ref('event_schedules'))
			this.$bindAsArray('courses', this.$database.ref('settings/courses'))
			// this.$bindAsArray('kidFashion', this.$database.ref('settings/activityList/kidsFashionCourse'))
			// this.$bindAsArray('basicCourse', this.$database.ref('settings/activityList/basicCourse'))
			// this.$bindAsArray('fullCourse', this.$database.ref('settings/activityList/fullCourse'))
			this.$store.commit('schedules/updateEvents', this.events)
			this.$store.commit('schedules/updateAllActivities', this.allActivities)
		},
		data () {
			return {
				amountRemaining: 0,
				paymentAmount: 0,
				kidsFashionCourse: [],
				kidFashion: [],
				basicCourse: [],
				fullCourse: [],
				courses: [],
				task: [],
				actComponents: {
					time: false,
					location: false,
					capacity: false,
					dueDate: false,
				},
				allActivities: [],
				activityList: [
			  	{ label: 'Orientation', value: 'orientation'},
			  	{ label: 'Payment', value: 'payment'},
			  	{ label: 'Photoshoot', value: 'photoshoot'},
			  	{ label: 'PhotoLiking', value: 'photoliking'},
			  	{ label: 'Workshop', value: 'workshop'},
			  	{ label: 'General Rehersal', value: 'generalRehersal'},
			  	{ label: 'Final Rehersal', value: 'finalRehersal'}
			  ],
				newActivityModal: false,
				isEdit: false,
				editIndex: -1,
				events: [],
				// event: {},
				selectedEvent: '',
				eventSeason: '',
				batch: 1,
				eventColor: '',
				activityType: '',
				activityDate: '',
				activityTime: '',
				activityCapacity: '',
				activityLocation: '',
				// activities: [],
				// calendar configuration
				dateFormat: 'h:m A',
				startingDayOfWeek: 0,
				enableDragDrop: true,
				showEventTimes: true,
				showDate: new Date()
			}
		},
		watch: {
			activities () {
				this.getTotalPayments
			}
		},
		methods: {
			getRemainingAmount (t) {
				if (t.label === 'Payment') {
					return '- Remaining Amount: P' + this.amountRemaining.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
				}
			},
			isPhotoLikingSubLabel (activity) {
				return true
			},
			clearBatchModal () {
				this.selectedEvent = ''
				// this.eventColor = ''
				// this.batch = 1
			},
			clearActivityModal () {
				this.activityType = ''
				this.activityTime = ''
				this.activityCapacity = ''
				this.activityLocation = ''
				// this.actComponents.time = false
				// this.actComponents.location = false
				// this.actComponents.capacity = false
				// this.actComponents.dueDate = false
				this.paymentAmount = 0
				this.isEdit = false
			},
			saveBatch () {
				let index = this.$lodash.filter(this.events, e => {
					return e['.key'] === this.selectedEvent
				})
				console.log(index)
				index[0].eventColor = this.eventColor
				// // this.event = index[0]
				// console.log('event type', index[0].eventType)
				// if (index[0].eventType === 'kidsFashion') {
				// 	this.kidsFashionCourse = this.kidFashion
				// }
				// else if (index[0].eventType === 'basicCourse') {
				// 	this.kidsFashionCourse = this.basicCourse
				// }
				// else {
				// 		this.kidsFashionCourse = this.fullCourse
				// }
				let courseIndex = this.$lodash.findIndex(this.courses, c => {
					return c['.key'] === index[0].course
				})
				let activities = this.courses[courseIndex].activities
				
				this.kidsFashionCourse = activities
				let allTask = {...activities} // Object.assign({}, activities)
				this.task = activities
				this.amountRemaining = index[0].seasons[0].totalAmount
				this.$store.state.schedules.amountRemaining = index[0].seasons[0].totalAmount
				console.log('list', this.kidsFashionCourse)
				// this.$store.state.schedules.taskList2 = task
				// this.$store.getters['schedules/taskList2']
				this.$store.commit('schedules/updateTaskList2', this.task)
				this.$store.commit('schedules/updateEvent', index[0])
				this.$store.commit('schedules/updateEventSeason', this.getSeason)
				this.$store.commit('schedules/updateBatchNumber', this.batchNumber)
				this.$store.commit('schedules/updateIsCreateNewBatch', true)
				this.$store.commit('schedules/updateNewBatchModal', false)
				this.$store.getters['schedules/includeSchedule'](this.$lodash)
			},
			saveActivity () {
				let bN = this.$store.state.schedules.batchNumber
				if (this.isEdit) {
					console.log('type', this.activityType)
					console.log('fix', this.activities)
					if (this.activities[this.editIndex].type === this.activityType) {
						console.log('same lng no changes')
						//existing activity
						this.activities[this.editIndex].type = this.activityType
						this.activities[this.editIndex].startDate = this.setActivityTime
						if (this.activityType === 'photoliking') {
							this.activities[this.editIndex].endDate = this.isPhotoLikingDueDate
						}
						else {
							this.activities[this.editIndex].endDate = this.setActivityTime
						}
						this.activities[this.editIndex].title = `${this.event.eventCode}${bN}_${this.activityType}`
						this.activities[this.editIndex].capacity = this.activityCapacity
						this.activities[this.editIndex].location = this.activityLocation
						this.activities[this.editIndex].id = this.event.eventCode + bN + this.activityType
						if (this.activityType === 'payment' || this.activityType === 'workshop') {
							if (this.activityType === 'payment') {
								this.amountRemaining += this.activities[this.editIndex].amount
								this.activities[this.editIndex].amount = this.paymentAmount
								this.amountRemaining -= this.activities[this.editIndex].amount
								this.$store.state.schedules.amountRemaining = this.amountRemaining
								this.activities[this.editIndex].title = `${this.event.eventCode}${bN}_${this.activityType}_${this.paymentCount}`
								this.activities[this.editIndex].id = `${this.event.eventCode}${this.activityType}_${this.paymentCount}`
							}
							else {
								this.activities[this.editIndex].title = `${this.event.eventCode}${bN}_${this.activityType}_${this.workshopCount}`
								this.activities[this.editIndex].id = `${this.event.eventCode}${this.activityType}_${this.workshopCount}`	
							}
						}
						this.getRemainingAmount
					}
					else {
						console.log('mag kaiba check kung existing pag meron replace then delete ung current')
						// then check din kung mag true ung visible pag nag palit
						// 1st find the same activity type in activities
						let getIndex = this.$lodash.findIndex(this.activities, a => {
							return a.type === this.activityType
						})
						
						console.log('getindex', getIndex)
						let activity2 = {
							eventkey: this.event['.key'],
							type: this.activityType,
							startDate: this.setActivityTime,
							endDate: this.isPhotoLikingDueDate,
							title: `${this.event.eventCode}${bN}_${this.activityType}`,
							capacity: this.activityCapacity,
							location: this.activityLocation,
							id: this.event.eventCode + this.activityType,
							classes: this.$store.state.schedules.event.eventColor
						}
						if (this.activityType === 'payment' || this.activityType === 'workshop') {
							if (this.activityType === 'payment') {
								activity2.amount = this.paymentAmount
								this.amountRemaining -= this.payments
								this.$store.state.schedules.amountRemaining = this.amountRemaining
								activity2.title = `${this.event.eventCode}${bN}_${this.activityType}_${this.paymentCount}`
								activity2.id = `${this.event.eventCode}${this.activityType}_${this.paymentCount}`	
							}
							else {
								activity2.title = `${this.event.eventCode}${bN}_${this.activityType}_${this.workshopCount}`
								activity2.id = `${this.event.eventCode}${this.activityType}_${this.workshopCount}`	
							}
						}
						if (getIndex >= 0) {
							// replacing the existing if it has in the event
							const currentType = this.activities[this.editIndex].type
							this.activities.splice(this.editIndex, 1)
							let index2 = this.$lodash.findIndex(this.activities, a => {
								return a.type === this.activityType
							})
							this.activities.splice(index2, 1)
							
							this.$store.commit('schedules/addNewActivity', activity2)
							console.log('type', this.activityType)
							console.log('currenttype', currentType)
							let index = this.$lodash.findIndex(this.kidsFashionCourse, k => {
								return k.value === currentType
							})
							if (index >= 0) {
								this.kidsFashionCourse[index].visible = true
							}
						}
						else {
							// changing the current
							console.log('less than 0')
							this.activities.splice(this.editIndex, 1)
							this.$store.commit('schedules/addNewActivity', activity2)
						}
						
						// this.$store.commit('schedules/addNewActivity', activity)
					}
				}
				// for new activity
				else {
					console.log('batch number', this.$store.state.schedules.batchNumber)
					let bN = this.$store.state.schedules.batchNumber
					let activity = {
						eventkey: this.event['.key'],
						type: this.activityType,
						startDate: this.setActivityTime,
						endDate: this.isPhotoLikingDueDate,
						title: `${this.event.eventCode}${bN}_${this.activityType}`,
						capacity: this.activityCapacity,
						location: this.activityLocation,
						id: this.event.eventCode + this.activityType,
						classes: this.$store.state.schedules.event.eventColor
					}
					// this.activities.push(activity)
					this.$store.commit('schedules/addNewActivity', activity)
					// if payment and workshop mag increment for the number of payments and workshop
					if (this.activityType === 'payment' || this.activityType === 'workshop') {
						if (this.activityType === 'payment') {
							activity.amount = this.paymentAmount
							this.amountRemaining -= this.paymentAmount
							this.$store.state.schedules.amountRemaining = this.amountRemaining
							console.log('store amount', this.$store.state.schedules.amountRemaining)
							activity.title = `${this.event.eventCode}${bN}_${this.activityType}_${this.paymentCount}`
							activity.id = `${this.event.eventCode}${this.activityType}_${this.paymentCount}`	
						}
						else {
							activity.title = `${this.event.eventCode}${bN}_${this.activityType}_${this.workshopCount}`
							activity.id = `${this.event.eventCode}${this.activityType}_${this.workshopCount}`	
						}
						let index = this.$lodash.findIndex(this.kidsFashionCourse, k => {
							return k.value === activity.type
						})
						if (index >= 0) {
							this.kidsFashionCourse[index].visible = true
						}
					}
					else {
						// let index = this.$lodash.findIndex(this.activityList, a => {
						// 	return a.value === activity.type
						// })
						// if (index >= 0) {
						// 	this.activityList.splice(index, 1)
						// }
						// removing the activity in selection box
						let index = this.$lodash.findIndex(this.kidsFashionCourse, k => {
							return k.value === activity.type
						})
						// console.log('index', index)
						// console.log('kids', this.kidsFashionCourse)\
						console.log('activity type', this.activityType)
						if (index >= 0) {
							this.kidsFashionCourse[index].visible = false
						}
					}
				}
				this.getRemainingAmount('payments')
				this.newActivityModal = false
				this.$store.getters['schedules/getSeeAllSchedules']
			},
			removeActivity () {
				// this.activities.splice(this.editIndex, 1)
				let type = this.$store.state.schedules.activities[this.editIndex].type
				console.log('type', type)
				let index = this.$lodash.findIndex(this.kidsFashionCourse, kf => {
					return kf.value === type
				})
				console.log('index', index)
				this.kidsFashionCourse[index].visible = true
				if (type === 'orientation') {
					this.activityList.push({ label: 'Orientation', value: 'orientation'})
				} else if (type === 'photoshoot') {
					this.activityList.push({ label: 'Photoshoot', value: 'photoshoot'})
				} else if (type === 'photoliking') {
					this.activityList.push({ label: 'PhotoLiking', value: 'photoliking'})
				} else if (type === 'generalRehersal') {
					this.activityList.push({ label: 'General Rehersal', value: 'generalRehersal'})
				} else {
					this.activityList.push({ label: 'Final Rehersal', value: 'finalRehersal'})
				}
				console.log('remove act', this.$store.state.schedules.activities[this.editIndex])
				if (type === 'payment') {
					this.amountRemaining += this.$store.state.schedules.activities[this.editIndex].amount
					this.$store.state.schedules.amountRemaining = this.amountRemaining
				}
				this.$store.commit('schedules/removeActivity', this.editIndex)
				this.$store.commit('schedules/updateTaskList', type)
				this.newActivityModal = false
			},
			// calendar events
			thisMonth(d, h, m) {
				const t = new Date()
				return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
			},
			setShowDate (d) {
				this.showDate = d
			},
			clickDate (date) {
				if (this.$store.state.schedules.isCreateNewBatch) {
					let dateToday = new Date()
					const eLength = this.$mathMixin.dayDiff(dateToday, date)
					console.log('elen', eLength)
					if (eLength >=	 1) {
						this.activityDate = date
						this.newActivityModal = true
					}
				} else {
					this.$q.notify({
		        message: `Please add new batch`,
		        type: 'warning',
		        color: 'warning',
		        textColor: 'white',
		        position: 'bottom-left',
		        icon: 'info',
		        timeout: 2000
		      })
				}
			},
			clickEvent (d) {
				console.log('date', d)
				let batchKey = d.originalEvent.batchKey
				if (!batchKey) {
					this.isEdit = true
					this.selectedEvent = d
					this.activityType = d.originalEvent.type
					this.activityTime = d.originalEvent.startDate
					this.activityDate = d.originalEvent.startDate
					this.activityCapactiy = d.originalEvent.capacity
					this.activityLocation = d.originalEvent.location
					this.paymentAmount = d.originalEvent.amount
					this.editIndex = this.$lodash.findIndex(this.activities, a => {
						return a.id === d.id
					})
					let index = this.$lodash.findIndex(this.kidsFashionCourse, kf => {
						return kf.value === this.activityType
					})
					this.actComponents.time = this.kidsFashionCourse[index].time
					this.actComponents.location = this.kidsFashionCourse[index].location
					this.actComponents.capacity = this.kidsFashionCourse[index].capacity
					this.actComponents.dueDate = this.kidsFashionCourse[index].dueDate
					console.log('components', this.actComponents)
					this.newActivityModal = true
				}
			},
			dropOnDate (event, date) {
				const eLength = this.$mathMixin.dayDiff(event.startDate, date)
				let eLength2 = this.$mathMixin.dayDiff(this.showDate, date)
				console.log('elength2', eLength2)
					console.log('elength', eLength)
				if (eLength2 >= 1) {
					event.originalEvent.startDate = this.$mathMixin.addDays(event.startDate, eLength)
					event.originalEvent.endDate = this.$mathMixin.addDays(event.endDate, eLength)
					console.log('this', this.events)
				}
			}
		},
		beforeRouteLeave (to, from , next) {
			console.log('activities', this.activities)
			if (this.activities === null || this.activities.length === 0) {
				console.log('no changes')
				next()
			}
			else{
				console.log('has changes')
				const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
			  if (answer) {
			  	this.$store.commit('schedules/clearActivities')
		      this.$store.commit('schedules/restoreTaskList')
		      this.$store.commit('schedules/updateIsCreateNewBatch', false)
			    next()
			  } else {
			  	console.log('false')
			    next(false)
			  }
			}
		  
		}
	}
</script>
<style>
.textBox {
	margin: 30px;
}
.calendar-parent {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: hidden;
	max-height: 80vh;
	background-color: white;
}
</style>