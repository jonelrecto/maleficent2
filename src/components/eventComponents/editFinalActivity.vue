<template>
	<div class="flex row justify-center">
		<div>
		  <!-- <q-btn label="test" @click="test" /> -->
			<q-card inline class="q-ma-sm" style="width: 350px;">
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Final Event</p>
	      </q-card-title>
	      <q-card-main>
	        <q-field
	        	orientation="vertical"
	        	label-width="2"
		        icon="date_range"
		      >
		      	<div>
		      		<q-datetime 
		      			:min="getLastOtherActivityDate"
		      		format="ddd MMM D, YYYY" v-model="finalEvent.startDate" type="date" stack-label="Date" />
			      	<q-datetime format="h:mm A" v-model="finalEvent.time" type="time" stack-label="Time"/>	
		      	</div>
		      </q-field>

	      </q-card-main>
	      <q-card-separator inset />
	      <q-card-main>
	        <q-field
		        icon="description"
		      >	
		      	<div v-if="finalEvent.locationID === 'new location'" class="q-my-md flex row" >
		      		<q-input class="col-md-8" v-model="newOrientNameLocation" float-label="Name" />
		      		<div class="q-mt-md">
		      			<q-btn-group rounded>
								  <q-btn size="sm" color="positive" label="Save" @click="saveFinalEventLocation()"/>
								  <q-btn size="sm" color="negative" label="Cancel" @click="cancelNewFinalEventLocation()"/>
								</q-btn-group>
		      		</div>
		      	</div>
						<q-select
							v-else
							separator
							@input="onChangeOrientLocation"
				      v-model="finalEvent.locationID"
				      float-label="Select Location"
				      filter
				      :options="locationTemplateOpt"
				    />
		      	<q-input
		      		:readonly="finalEvent.locationID === ''"
						  v-model="finalEvent.location"
						  type="textarea"
						  float-label="Location"	
						  :max-height="80"
						  rows="5"
						/>
						<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
		      	<q-input
		      		:readonly="finalEvent.locationID === ''"
						  v-model="finalEvent.details"
						  type="textarea"
						  float-label="Details (optional)"
						  :max-height="80"
						  rows="5"
						/>
		      </q-field>
	      </q-card-main>

		    <q-btn class="full-width" label="save" color="positive" @click="saveFinalActivity()"/>
	    </q-card>
		</div>
	</div>
</template>
<script>
import {date} from 'quasar'

export default {
	props: {
		eventKey: {
			type: String,
			default: ''
		},
		seasonNumber: {
			type: Number,
			default: ''
		}
	},
	created () {
		this.tempFinalActivity = this.$store.getters['startUp/getPlainValue'](this.finalEvent)
	},
	firebase () {
		return {
			event: this.$database.ref('event_schedules').orderByChild('eventKey').equalTo(this.eventKey),
			locationTemplates: this.$database.ref('locationTemplates')
		}
	},
	computed: {
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
		finalEvent () {
			return this.$lodash.find(this.event[0].activities, a => {
				return a.type === 'final event'
			})
		},
		getLastOtherActivityDate () {
			let noOfBatches = this.getEventSeasonBatches.length
			let lastBatch = this.getEventSeasonBatches[noOfBatches-1]
			// console.log(lastBatch, 'lastBatch')
			let otherActivities = this.$lodash.filter(lastBatch.activities, o => {
				return o.type != 'payments' && o.type != 'orientation' && o.type != 'photoshoots' && o.type != 'photoshoot' && o.type != 'photoliking' && o.type != 'workshop' && o.type != 'workshops' && o.type != 'final event'
			})
			let noOfOtherActivities = otherActivities.length
			let lastOtherActivity = otherActivities[noOfOtherActivities-1]
			// console.log(lastOtherActivity, 'lastOtherActivity')
			return date.addToDate(lastOtherActivity.startDate, {days: 1})
			// return this.event[0].seasonEnd
		},
		getEventSeasonBatches () {
			return this.$lodash.filter(this.event, e => {
				return e.seasonNumber === this.seasonNumber
			})
		}
	},
	data () {
		return {
			finalStartDate: '',
			tempFinalActivity: {}
		}
	}, // end of data
	methods: {
		getLocation (key) {
			return this.$lodash.filter(this.locationTemplates, t => {
				return t['.key'] === key
			})[0]
		},
		saveFinalEventLocation () {
			console.log(this.finalEvent, 'finalEvent')
		},
		cancelNewFinalEventLocation () {
		},
		onChangeOrientLocation () {
			this.finalEvent.location = this.getLocation(this.finalEvent.locationID).location
			this.finalEvent.details = this.getLocation(this.finalEvent.locationID).details
		},
		saveFinalActivity () {
			// console.log('waiting do be done')
			this.executeUpdate()
			// console.log('done updating')
		},
		executeUpdate: async function () {
			let promise = new Promise(resolve => {
				let finalEvent = this.$store.getters['startUp/getPlainValue'](this.finalEvent)
				finalEvent.startDate = this.$store.getters['schedules/setTime']({date: finalEvent.startDate, time: this.finalEvent.time})
				finalEvent.endDate = this.$store.getters['schedules/setTime']({date: finalEvent.startDate, time: this.finalEvent.time})

				// console.log(finalEvent, 'finalEvent')
				let eventSeasonBatches = this.$store.getters['startUp/getPlainValue'](this.getEventSeasonBatches)
				for (var b of eventSeasonBatches) {
					b.seasonEnd = finalEvent.startDate
					var finalEventIndex = this.$lodash.findIndex(b.activities, a => {
						return a.type === 'final event'
					})
					// b.activities[finalEventIndex] = finalEvent

					b.activities[finalEventIndex].endDate = finalEvent.endDate
					b.activities[finalEventIndex].startDate = finalEvent.startDate
					b.activities[finalEventIndex].time = finalEvent.time
					b.activities[finalEventIndex].locationID = finalEvent.locationID
					b.activities[finalEventIndex].location = finalEvent.location
					b.activities[finalEventIndex].details = finalEvent.details
					// console.log(b, 'b')
					this.$store.dispatch('schedules/updateEditBatch', b)
						.then(result => {
							console.log(result, result)
							this.$store.state.schedules.editBatchModal = false
						})
				}
				// let eventKey = 
				// let seasonNumber = 
				// save event> season > season end
				// event > event key > season > season number > season end
				this.$store.dispatch('schedules/updateEventSeasonEndDate', {eventKey: this.eventKey, seasonNumber: this.seasonNumber, seasonEnd: finalEvent.startDate.toString()})
				// console.log(eventSeasonBatches, 'eventSeasonBatches')
				// resolve('done')
			})

			let result = await promise
			return result
		},
		test () {}
	} // end of methods
}
</script>	