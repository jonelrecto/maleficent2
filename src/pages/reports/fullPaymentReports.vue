<template>
	<q-page>
		<q-tabs  v-model="selectedTab" color="tertiary" animated align="justify" class="row">
		  

		  <!-- Tabs - notice slot="title" -->
		  <q-tab default slot="title" name="allEvents" label="All Events" />

		  <div v-for="event in events" :key="event['.key']" slot="title">
		  	<q-tab :name="event['.key']" :label="event.eventName" />
			</div>
			<!-- targets -->
		  <q-tab-pane name="allEvents">
		  	<all-events></all-events>
			</q-tab-pane>
			<q-tab-pane :name="selectedTab">
			  	<by-events v-if="selectedTab !== 'allEvents'" :eventKey="selectedTab" :eventName="getEventName"> </by-events>
			</q-tab-pane>
		</q-tabs>
	</q-page>
</template>
<script>
import AllEvents from './fullPaymentReports/fullPaymentReportsAllEvents'
import ByEvents from './fullPaymentReports/fullPaymentReportsByEvent'

export default {
	components: {
		AllEvents,
		ByEvents
	},
	watch: {
		selectedTab () {
			// if (this.selectedTab === 'allEvents') {
			// 	this.selectedTab = ''
			// }
		}
	},
	mounted () {
		this.$bindAsArray('events', this.$database.ref('events'))
	},
	computed: {
		getEventName () {
			try {
				let event = this.$lodash.find(this.events, e => {
					return e['.key'] === this.selectedTab
				})
				return event.eventName
			} catch {
				return ''
			}
		}
	},
	data () {
		return {
			selectedTab: '',
			events: []
		}
	}
}
</script>