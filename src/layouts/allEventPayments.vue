<template>

	<q-page>
		<q-tabs color="faded" class="full-width text-white row shadow-2">
        <q-route-tab
        	default
			    label="All Payments"
			    to="/allEventPayments"
			    exact
			    slot="title"
			    class="bg-dark"
			  />
			  <div v-for="(event, i) in events" :key="i" slot="title">
			  	<q-route-tab
			    :label="event.eventName"
			    :to="{name: 'viewEventPayments', params: { eventKey: event['.key'] }}"
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
		},
		getOpenEventOnly () {
			try {
					console.log('events', this.events)
					let events = this.events
					let open = []
					for(var x=0; x<events.length; x++) {
						let seasonGet = events[x].seasons
						let seasonsOpen =  this.$lodash.filter(seasonGet, s=> {
							if(s.status === 'open'){
								open.push(s)
							}
						})
					}

					let eventOpen = []
						for(var x=0; x<events.length; x++) {
						let ss = events[x]['.key']
						let so =  this.$lodash.filter(open, d=> {
							if(d.eventKey === ss){
								eventOpen.push(events[x])
							}
						})
					}
					console.log('eventOpen',eventOpen)
					return eventOpen
			} catch (err) {
				console.log('err',err)
				return []
			}
		}
		//end of computed
	},
	data () {
		return {
			filter: '',
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
	}
}
</script>
<style lang="styl">
  @import '~variables'
</style>