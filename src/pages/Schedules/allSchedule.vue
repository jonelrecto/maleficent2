<template>
	<div>
		<q-toolbar color="faded">
			<q-toolbar-title>
				Schedules
			</q-toolbar-title>
			<q-btn v-if="!isEdit" rounded class="q-mx-md" inverted color="secondary" @click="editMode(true)">Edit Schedules</q-btn>
			<div v-if="isEdit">
				<q-btn rounded class="q-mx-md" inverted color="secondary" @click="saveChanges">Save</q-btn>
				<q-btn rounded class="q-mx-md" inverted color="negative" @click="cancelEdit">Cancel</q-btn>
			</div>
			<q-btn v-if="!isEdit" rounded inverted color="primary" @click="$router.push('/schedules')">New Batch</q-btn>
		</q-toolbar>
		<div class="row">
			<!-- agenda -->
			<!-- <div class="col-3 q-ma-md" style="border: 1px solid black"> -->
		    	<!-- <q-list  highlight inset-separator class="q-ma-md">
		    		<q-list-header>Agendas</q-list-header>
					  <q-item>
					    <q-item-main>
					      <q-item-tile label>sdfa</q-item-tile>
					      <q-item-tile sublabel>asdf</q-item-tile>
					    </q-item-main>
					  </q-item>
					</q-list> -->
					<!-- <calendar-agenda
						:start-date="dateNow"
						:eventArray="getAgendaActivities"
						:eventRef="agendas"
						:allow-editing="true"
					/>
			</div> -->
			<div class="col calendar-parent" style="max-height: 100vw; height: 70vw">
	    	<calendar-view 
					:show-date="showDate"
					:events="getAllActivities"
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
		<!-- activity modal -->
		<q-modal v-model="activityModal" :content-css="{minWidth: '30vw', minHeight: '50vh'}" >
      <q-modal-layout
		    content-class="{'bg-primary': isPrimary}"
		    footer-class="bg-primary some-class"
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
        <q-toolbar>
          <q-toolbar-title>
            Activity Details
          </q-toolbar-title>
          <q-btn flat round dense @click="activityModal=false" icon="close" />
        </q-toolbar>
        <div>
			    <q-select
			    	readonly
        		class="textBox"
			      v-model="activity.activityType"
			      float-label="Activity"
			     :options="activityList"
			    />
			   	<q-datetime
			   		v-if="actComponents.time || actComponents.dueDate"
			    	class="textBox"
			    	:format="isPhotoLikingDateFormat"
			    	:min="isPhotoLikingMinDate"
			    	v-model="activity.time"
			    	:stack-label="isPhotoLikingLabel"
			    	:type="isPhotoLiking"
			    />
			    <q-input
			    	v-if="actComponents.capacity"
			    	class="textBox"
					  v-model="activity.capacity"
					  type="number"
					  stack-label="Capacity"
					 />
			    <q-input
			    	v-if="actComponents.location"
			    	class="textBox"
					  v-model="activity.location"
					  type="textarea"
					  stack-label="Location"
					  rows="7"
					 />
        </div>
        <!-- action -->
        <div slot="footer">
        	<q-btn color="primary" class="full-width" @click="saveActivity">save</q-btn>
        	<!-- <q-btn v-if="isEdit" color="negative" class="full-width" @click="removeActivity">Delete</q-btn> -->
        </div>
      </q-modal-layout>
    </q-modal>
	</div>
</template>
<script>

import { CalendarAgenda, CalendarAgendaEvent, Calendar }from 'quasar-calendar'
import { CalendarView } from 'vue-simple-calendar'
import { LocalStorage } from 'quasar'

// LocalStorage.set(key, value)
// let value = LocalStorage.get.item(key)
// console.log('outside', Vue)
	// window.onbeforeunload = function () {
	// 	return "are you sure?"
	// }	

export default {
	name: 'allSchedules',
	components: {
		CalendarView,
		CalendarAgenda,
		CalendarAgendaEvent,
		Calendar
	},
	created: function  () {
		window.addEventListener('beforeunload', () => {
			if (this.isEdit) {
				this.$q.localStorage.set('editMode', this.isEdit)
				for (var i = 0; i < this.allAct.length; i++) {
					this.allAct[i].startDate = this.allAct[i].startDate.toString()
					this.allAct[i].endDate = this.allAct[i].endDate.toString()
				}
				this.$q.localStorage.set('allActivities', this.allAct)
			}
			// const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
		 //  if (answer) {
		 //  	console.log('asdf')
		 //  } else {
		 //  	console.log('false')
		 //  }
		}, false)
	},
	mounted () {
		this.$bindAsArray('allActivities', this.$database.ref('event_schedules'))
		this.$bindAsArray('activities', this.$database.ref('settings/activityList'))
		this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		this.$bindAsArray('events', this.$database.ref('events'))
		this.$bindAsArray('draftEdit', this.$database.ref('draftEdit'))
		this.$store.commit('schedules/updateAllActivities', this.allActivities)
		// console.log('EDIT MODE', this.$q.localStorage.has('editMode'))
		// console.log('ACTI', this.$q.localStorage.get.item('allActivities'))
	},
	computed: {
		getAllActivities () {
			console.log('is recovery',this.$q.localStorage.has('editMode'))
			if (this.$q.localStorage.has('editMode')) {
				console.log('on recovery mode')
				this.isEdit = true
				let act = Object.assign([], this.$q.localStorage.get.item('allActivities'))
				for (var i = 0; i < act.length; i++) {
					act[i].startDate = new Date(act[i].startDate)
					act[i].endDate = new Date(act[i].endDate)
				}
				this.allAct = act
				this.$forceUpdate()
			}
			else {
				console.log('on viewing')
				let act = Object.assign([], this.$store.getters['schedules/getAllActivities'])
				this.allAct = act
			}
			return this.allAct
		},
		getAgendaActivities () {
			return this.$store.getters['schedules/getAgendaActivities']
		},
		activityList () {
			// console.log('activitysList', this.kidsFashionCourse)
			const staticActivity = this.activities
			if (this.isEdit === true) {
				// console.log('is edit')
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
					// if (kf.value === 'payment' || kf.value === 'workshop') {
					// 	kf.visible = true
					// }
					if (kf.visible === true) {
						opt2.push({ label: kf.label, value: kf.value, visible: kf.visible})
					}
					return kf
				})
				let sorted = this.$lodash.orderBy(opt2, [labels => labels.label], ['asc'])
				this.isActComponent
				// console.log('sorted', sorted)
				return sorted
			}
		},
		isPhotoLiking () {
			if (this.activity.activityType === 'photoliking') {
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
			if (this.activity.activityType === 'photoliking') {
				return this.activity.startDate
			}
		},
		isPhotoLikingDateFormat () {
			if (this.activity.activityType === 'photoliking') {
				return 'YYYY-MM-DD'
			}
			else {
				return 'h:mm A'
			}
		},
		isPhotoLikingDueDate () {
			if (this.activity.activityType === 'photoliking') {
				return this.activityTime
			}
			else {
				return this.setActivityTime
			}
		},
		isActComponent () {
			if (this.activity.activityType != '') {
				let event = this.$lodash.filter(this.events, e => {
					return e['.key'] === this.activity.eventKey
				})
				let course = this.$lodash.filter(this.courses, c => {
					return c['.key'] === event[0].course
				})
				let index = this.$lodash.findIndex(course[0].activities, kf => {
					return kf.value === this.activity.activityType
				})
				this.actComponents.time = course[0].activities[index].time
				this.actComponents.location = course[0].activities[index].location
				this.actComponents.capacity = course[0].activities[index].capacity
				this.actComponents.dueDate = course[0].activities[index].dueDate
			}
		}
	},
	data: () => {
		return {
			allAct: [],
			isEdit: false,
			activityModal: false,
			activity: {
				scheduleKey: '',
				eventKey: '',
				seasonName: '',
				batchNumber: 0,
				colorCode: '',
				activityType: '',
				endDate: '',
				time: '',
				location: '',
				capacity: '',
				startDate: '',
				title: ''
			},
			actComponents: {
				time: false,
				location: false,
				capacity: false,
				dueDate: false,
			},
			dateNow: new Date('2018-08-08'),
			agendas: 'myAgendas',
			events: [],
			draftEdit: [],
			allActivities: [],
			activities: [],
			courses: [],
			dateFormat: 'h:m A',
			startingDayOfWeek: 0,
			enableDragDrop: true,
			showEventTimes: true,
			showDate: new Date(),
			someEventObject: [
	  		{
			    id: 1,
			    summary: 'Test event',
			    description: 'Some extra info goes here',
			    location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
			    start: {
			      dateTime: '2018-08-08T14:00:00', // ISO 8601 formatted
			    },
			    end: {
			      dateTime: '2018-08-08T16:30:00',
			    },
			    color: 'positive',
			    attendees: [
			      {
			        id: 5,
			        email: 'somebody@somewhere.com',
			        displayName: 'John Q. Public',
			        organizer: false,
			        self: false,
			        resource: false
			      }
			    ]			
				},
				{
			    id: 7,
			    summary: 'Test event',
			    description: 'Some extra info goes here',
			    location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
			    start: {
			      dateTime: '2018-08-17T18:00:00', // ISO 8601 formatted
			    },
			    end: {
			      dateTime: '2018-08-20T20:30:00',
			    },
			    color: 'positive',
			    attendees: [
			      {
			        id: 5,
			        email: 'somebody@somewhere.com',
			        displayName: 'John Q. Public',
			        organizer: false,
			        self: false,
			        resource: false
			      }
			    ]  			
				},
				{
			    id: 10,
			    summary: 'Test all-day event',
			    description: 'Some extra info goes here',
			    start: {
			      date: '2018-08-16' // A date variable indicates an all-day event
			    },
			    end: {
			      date: '2018-08-19'
			    }
			  }
  		]
		}
	},
	methods: {
		setShowDate (d) {
			this.showDate = d
		},
		editMode (s) {
			this.isEdit = s
			// this.$q.localStorage.set('editMode', this.isEdit)
			// this.$q.localStorage.set('allActivities', this.$store.getters['schedules/getAllActivities'])
			let act = Object.assign([], this.$store.getters['schedules/getAllActivities'])
			this.allAct = act
			// let allAct = Object.assign([], this.getAllActivities)
			
			// for (var i = 0; i < allAct.length; i++) {
			// 	allAct[i].endDate = allAct[i].endDate.toString()
			// 	allAct[i].startDate = allAct[i].startDate.toString()
			// }
			// console.log('ga', allAct)
			// this.$database.ref('draftEdit').push(allAct)
			// 	.then(() => {
			// 		console.log('push activities')
			// 	})
			// 	.catch((err) => {
			// 		console.log(err)
			// 	})
			// this.getAllActivities
		},
 		cancelEdit () {
			this.isEdit = false
			this.$bindAsArray('allActivities', this.$database.ref('event_schedules'))
			this.$store.commit('schedules/updateAllActivities', this.allActivities)
			let act = Object.assign([], this.$store.getters['schedules/getAllActivities'])
			this.allAct = act
			// this.$q.localStorage.remove('editMode')
			// this.$q.localStorage.remove('allActivities')
			this.$q.localStorage.clear()
			console.log('allaAct', this.allAct)
			this.$forceUpdate()
		},
		saveChanges () {
			console.log('all act', this.allAct)
			console.log('event_schedules', this.allActivities)
			let oldActivities = Object.assign([], this.allActivities)
			let newActivities = Object.assign([], this.allAct)
			for (var i = 0; i < newActivities.length; i++) {
				var batchNum = newActivities[i].batchNumber
				var scheduleID = newActivities[i].scheduleID
				var scheduleKey = newActivities[i].scheduleKey
				var index = this.$lodash.findIndex(oldActivities, oa => {
					return oa['.key'] === scheduleKey
				})
				var activityIndex = this.$lodash.findIndex(oldActivities[index].activities, oaa => {
					if (oaa.id) {
						return oaa.id === scheduleID	
					}
					else {
						return oaa.scheduleID === scheduleID		
					}
				})
				newActivities[i].startDate = newActivities[i].startDate.toString()
				newActivities[i].endDate = newActivities[i].endDate.toString()
				oldActivities[index].activities[activityIndex] = newActivities[i]
				console.log('activityindex', activityIndex)
				console.log('newact', newActivities[i])
				console.log('to update', oldActivities[index])
			}
			console.log('oldActivities', oldActivities)
			this.$store.dispatch('schedules/saveChanges', oldActivities)
			// for (var j = 0; j < oldActivities.length; j++) {

			// }
			// this.$bindAsArray('allActivities', this.$database.ref('event_schedules'))
			// this.$store.commit('schedules/updateAllActivities', oldActivities)
			// this.allAct = this.$store.getters['schedules/getAllActivities']
			this.cancelEdit
		},
		clickDate (date) {
			this.test
		},
		clickEvent (event) {
			let expiredDate = this.$mathMixin.dayDiff(this.showDate, event.startDate)
			let act = event.originalEvent
			if (this.isEdit && expiredDate >= 1) {
				this.activity.classes = act.classes
				this.activity.capacity = act.capacity
				this.activity.endDate = act.endDate
				this.activity.eventKey = act.eventKey
				this.activity.amount = act.amount
				this.activity.batchNumber = act.batchNumber
				this.activity.location = act.location
				this.activity.scheduleKey = act.scheduleKey
				this.activity.startDate = act.startDate
				this.activity.title = act.title
				this.activity.activityType = act.type
				this.activity.time = act.startDate
				this.activityModal = true
			}
			// console.log('act', act)
			// console.log('activity', this.activity)
		},
		dropOnDate (event, date) {
			let expiredDate = this.$mathMixin.dayDiff(this.showDate, event.startDate)
			console.log('event dragged', expiredDate)
			if (this.isEdit && expiredDate >= 1) {
				let eventActivity = event.originalEvent
				let actToUpdate = [...this.allAct]
				const eLength = this.$mathMixin.dayDiff(event.startDate, date)
				let eLength2 = this.$mathMixin.dayDiff(this.showDate, date)
				if (eLength2 >= 1){
					let newStartDate = this.$mathMixin.addDays(event.startDate, eLength)
					let newEndDate = this.$mathMixin.addDays(event.endDate, eLength)
					
					console.log('new s', newStartDate)
					console.log('new e', newEndDate)
					console.log('allActivities', this.allAct)
					console.log('this event act', eventActivity)
					let index = this.$lodash.findIndex(actToUpdate, a => {
						return a.scheduleID === eventActivity.scheduleID && a.batchNumber === eventActivity.batchNumber
					})
					console.log('all act', index)
					actToUpdate[index].startDate = newStartDate
					actToUpdate[index].endDate = newEndDate
					// console.log('greater')
					// this.$store.dispatch('schedules/dropDateUpdate', {payload: eventActivity, startDate: newStartDate, endDate: newEndDate})
				}
			}
		},
		setActivityTime () {
			if (this.activity.time === '') {
				console.log('start', this.activity.startDate)
				return this.activity.startDate
			}
			else {
				const dateTime = new Date(this.activity.time)
				var hours = dateTime.getHours()
				var minutes = dateTime.getMinutes()
				let activityStartDate = new Date(this.activity.startDate)
				activityStartDate.setHours(hours)
				activityStartDate.setMinutes(minutes)
				console.log('end', activityStartDate)
				return activityStartDate.toString()
			}
		},
		saveActivity () {
			console.log('act', this.activity)
			let activity = this.$lodash.filter(this.allActivities, act => {
				return act['.key'] === this.activity.scheduleKey
			})
			let activityType = this.$lodash.filter(activity[0].activities, a => {
				return a.type === this.activity.activityType
			})
			
			activityType[0].capacity = this.activity.capacity
			if (this.activity.activityType === 'photoliking') {
				activityType[0].endDate = this.activity.startDate
				activityType[0].endDate = this.activity.time
			}
			else {
				activityType[0].startDate = this.activity.time
				activityType[0].endDate = this.activity.time
			}
			activityType[0].location = this.activity.location
			this.$store.dispatch('schedules/updateActivity', {payload: activityType[0], fireb: this.$database, _: this.$lodash, quasu: this.$q})
			this.activityModal = false
		}
	},
	deactivated () {
	},
	beforeDestroy: function () {
	},
	destroyed () {
	}
}
</script>
<style >
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
