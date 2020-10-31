<template>
	<q-page>
		<!-- <q-btn label="test"  @click="test" /> -->
		<div>
			<p class="q-title q-ma-md">View Mode: </p>
			<q-btn-toggle class="q-mx-md" rounded size="sm"
					v-model="viewMode"
					toggle-color="primary"
					:options="[
						{label: 'Calendar', value: 'calendarMode'},
						{label: 'Agenda', value: 'agendaMode'}
					]"
				/>
		</div>
		<div v-if="viewMode === 'calendarMode'" style="height: 700px">
			<calendar-view
    		:key="Date.now()"
				:show-date="showDate"
				:events="allEventSchedules"
				:show-event-times="showEventTimes"
				:timeFormatOptions="{ hour: 'numeric', minute: 'numeric', hour12: true}"
				:startingDayOfWeek="startingDayOfWeek"
				@show-date-change="setShowDate"
				@click-event="clickEvent"
				@drop-on-date="dropOnDate"
				class="theme-default holiday-us-traditional q-ma-md"
			/>
		</div>
		<div v-if="viewMode === 'agendaMode'">
			<calendar-agenda
				class="q-ma-md"
				:start-date="showDate"
				:event-array="agendaEventSchedules"
				:allow-editing="false"
			/>
		</div>
		<q-modal v-model="activityModal" :content-css="{minWidth: '80px', minHeight: '50px'}" >
      <q-modal-layout>
        <q-toolbar>
          <q-toolbar-title>
            <!-- Activity Details -->
						{{activity.originalEvent.title}}
          </q-toolbar-title>
          <q-btn flat rounded dense icon="edit" label="edit"/>
          <q-btn flat round dense @click="activityModal = false" icon="close" />
        </q-toolbar>
        <div>
			    <q-input
			    	readonly
			    	class="q-ma-md"
					  v-model="activity.originalEvent.type"
					  type="text"
					  stack-label="Activity"
			    />
			    <q-datetime
			    	readonly
			    	class="q-ma-md"
			    	v-if="activity.originalEvent.startDate"
			    	format="MMM-DD-YYYY"
			    	v-model="activity.originalEvent.startDate"
			    	stack-label="Date"
			    	type="date"
			    />
			    <q-input
			    	readonly
			    	class="q-ma-md"
			    	prefix="P"
			    	v-if="activity.originalEvent.type === 'payment'"
					  v-model="activity.originalEvent.amount"
					  type="number"
					  stack-label="Amount"
			    />
			    <q-datetime
			    	readonly
			   		v-if="activity.originalEvent.time"
			    	class="q-ma-md"
			    	format="h:mm A"
			    	v-model="activity.originalEvent.time"
			    	stack-label="Time"
			    	type="time"
			    />
			   	<q-datetime
			   		readyonly
			   		v-if="activity.originalEvent.dueDate"
			    	class="q-ma-md"
			    	format="MMM-DD-YYYY"
			    	:min="$mathMixin.addDays(new Date(activity.originalEvent.startDate), 1)"
			    	v-model="activity.originalEvent.dueDate"
			    	stack-label="Due Date"
			    	type="date"
			    />
					 <q-input
			    	class="q-ma-md"
			    	readonly
			    	v-if="(activity.originalEvent.location === '' || activity.originalEvent.location )&& !activity.originalEvent.dueDate && !activity.originalEvent.amount"
					  v-model="activity.originalEvent.location"
					  type="textarea"
					  stack-label="Location"
					  rows="7"
					 >
					 	<!-- <q-autocomplete
							:min-characters="0"
							@search="searchLocation"
							:debounce="700"
							@selected="selected"
						/> -->
					 </q-input>
			    <q-input
			    	readonly
			    	v-if="(activity.originalEvent.details === '' || activity.originalEvent.details )&& !activity.originalEvent.dueDate && !activity.originalEvent.amount"
			    	class="q-ma-md"
					  v-model="activity.originalEvent.details"
					  type="textarea"
					  stack-label="Details"
					  rows="7"
					 >
					 	<!-- <q-autocomplete
							:min-characters="0"
							@search="searchDetails"
							:debounce="700"
							@selected="selected"
						/> -->
			    </q-input>
        </div>
        <!-- action -->
        <!-- <div slot="footer"> -->
        	<!-- <q-btn color="primary" class="full-width" @click="saveActivity">OK</q-btn> -->
        	<!-- <q-btn color="negative" class="full-width" @click="removeActivity">Delete</q-btn> -->
        <!-- </div> -->
      </q-modal-layout>
    </q-modal>
	</q-page>
</template>
<script>
import { CalendarView } from 'vue-simple-calendar'
import { CalendarAgenda } from 'quasar-calendar'

export default {
	components: {
		CalendarView,
		CalendarAgenda
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
	},
	computed: {
		agendaEventSchedules () {
			try {
				let activities = this.allEventSchedules
				// console.log('activities', activities)
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
				return agendaActivities
			} catch {
				return []	
			}
		},
		allEventSchedules () {
			try {
				let allAct = new Array()
				let scheds = [...this.schedules]
				this.$lodash.forEach(scheds, sc => {
					this.$lodash.forEach(sc.activities, act => {
						act.startDate = new Date(act.startDate)
						act.endDate = new Date(act.endDate)
						act.title = act.id
						allAct.push(act)
					})
				})
				console.log('allAct', allAct)
				return allAct
			} catch {
				return []
			}
		}
	},
	data () {
		return {
			activity: {
		    originalEvent: {}
		  },
			activityModal: false,
			schedules: [],
			viewMode: 'calendarMode',
			showEventTimes: true,
			showDate: new Date(),
			startingDayOfWeek: 0,
		}
	},
	methods: {
		setShowDate (d) {
			this.showDate = d
		},
		clickEvent (e) {
			this.activity.originalEvent = e.originalEvent
			this.activityModal = true
		},
		dropOnDate (e, d) {
		},
		test () {
			console.log('schedules', this.schedules)
			let activities = this.allEventSchedules
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
						color: act.classes
					}
				}
			})
			let agendaActivities = this.$lodash.compact(mapAct)
			console.log('agendaActivities', agendaActivities)
		}
	}
}
</script>