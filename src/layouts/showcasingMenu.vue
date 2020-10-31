<template>

	<q-page>
		<q-tabs color="faded" class="full-width text-white row shadow-2">
        <q-route-tab
        	default
			    label="Model Selection"
			    to="/showcasingSelection"
			    exact
			    slot="title"
			    class="bg-faded"
			  />
				<q-route-tab
			    label="Client Details"
			    to="/clientDetails"
			    exact
			    slot="title"
			    class="bg-faded"
			  />
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