<template>

	<q-page>
		<!-- <q-toolbar color="tertiary">
      <q-toolbar-title>
        All Schedules
      </q-toolbar-title>
		</q-toolbar> -->
		<!--<div>
			 <calendar
				:start-date="startDate"
			  :event-array="scheduleActivities"
			  :sunday-first-day-of-week="true"
			  :allow-editing="false"
				>
			</calendar>
		<div> -->
			<!-- <q-btn label="test2" @click="test" /> -->
		<q-tabs color="faded" class="full-width text-white row shadow-2">
        <q-route-tab
        	default
			    label="All Schedules"
			    to="/allEventSchedules"
			    exact
			    slot="title"
			  />
			  <div v-for="(event, i) in events" :key="i" slot="title">
			  	<q-route-tab
			    :label="event.eventName"
			    :to="{name: 'viewEventSched', params: { eventKey: event['.key'] }}"
			  	>
			 	 	</q-route-tab>
			  </div>
      </q-tabs>
		<router-view :key="$route.fullPath"></router-view>
	</q-page>
</template>
<script>
import { Calendar } from 'quasar-calendar'
import { colors } from 'quasar'

const { setBrand } = colors


// colors.setBrand('saladyellow', '#C5B513')

window.quasarConfig = {
  brand: {
    saladyellow: '#00aab7',
    // ...
  }
}
export default{
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('events', this.$database.ref('events'))
	},
	components: {
		Calendar
	},
	computed: {
		scheduleActivities () {
			console.log('schedules', this.schedules)
			console.log('schedules', this.events)
			// seasons na naka launch lng
			// lagyang nlng ng toggle pag gusto lahat ng schedule makikita
			let activities = this.getAllActivities
			let mapAct = this.$lodash.map(activities, act => {
					return {
						id: act.id,
						summary: act.id,
						description: act.details ? act.details : '',
						location: act.location ? act.location : '',
						start: {
							dateTime: new Date(act.startDate).toISOString()
						},
						end: {
							dateTime: new Date(act.endDate).toISOString()
						},
						color: 'positive'
					}
			})
			console.log('mapped', this.$lodash.compact(mapAct))
			return this.$lodash.compact(mapAct)
		},
		getAllActivities () {
			let scheds = this.schedules
			let allAct = new Array()
			for (var i = 0; i < scheds.length; i++) {
				for (var j = 0; j < scheds[i].activities.length; j++) {
					allAct.push(scheds[i].activities[j])
				}
			}
			return allAct
		}
	},
	data () {
		return {
			events: [],
			schedules: [],
			startDate: new Date(),
			someEventObject: [
			  {
			    id: 1,
			    summary: 'Test event',
			    description: 'Some extra info goes here',
			    location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
			    start: {
			      dateTime: '2018-10-16T14:00:00' // ISO 8601 formatted
			    },
			    end: {
			      dateTime: '2018-10-16T15:00:00'
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
			    id: 2,
			    summary: 'Test all-day event',
			    description: 'Some extra info goes here',
			    start: {
			      date: '2018-11-16' // A date variable indicates an all-day event
			    },
			    end: {
			      date: '2018-11-19'
			    }
			  },
			    {
			      id: 3,
			      summary: 'Some other test event',
			      description: 'Some extra info goes here',
			      start: {
			        dateTime: '2018-11-17T10:00:00+0500', // timezone embedded in dateTime
			      },
			      end: {
			        dateTime: '2018-11-17T12:30:00+0500',
			      },
			    },
			]
		}
	},
	methods: {
		test () {
			console.log('events', this.events)
		}
	}
}
</script>
<style lang="styl">
  @import '~variables'
</style>