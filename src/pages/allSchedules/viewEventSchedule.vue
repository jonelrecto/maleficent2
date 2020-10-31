<template>
	<q-page class="q-pa-md">
		<!-- <q-btn label="test" @click="test" /> -->
		<div>
			<p class="q-title">View Mode: </p>
			<q-btn-toggle class="q-mx-md" rounded size="sm"
					v-model="viewMode"
					toggle-color="primary"
					:options="[
						{label: 'Batch', value: 'batchMode'},
						{label: 'Calendar', value: 'calendarMode'},
						{label: 'Agenda', value: 'agendaMode'}
					]"
				/>
		</div>
		<div class="row q-my-md">
			<div class="col-2">
				<q-list inset-separator highlight>
				  <q-list-header>Seasons</q-list-header>
				  <q-item  v-for="(season, i) in getSeasons" :key="i" @click.native="selectedSeason = season">
			  		<q-item-main>{{season.seasonName}}</q-item-main>
				    <q-item-side right>
				      <q-item-tile v-if="season.status === 'standby'" icon="power_settings_new" color="negative" />
				      <q-item-tile v-if="season.status === 'open'" icon="present_to_all" color="blue" />
				      <q-item-tile v-if="season.status === 'finished'" icon="done" color="green" />
				    </q-item-side>	
				  </q-item>
				</q-list>	
			</div>
			<div v-if="viewMode === 'batchMode'" class="col q-ml-md">
				<q-table
			    :title="getSeasonName"
			    :data="customBatches"
			    :columns="customColumn"
			    row-key="batchNumber"
			  >
				  <q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row)" class="cursor-pointer">
		        <q-td v-for="(col,i) in props.cols" :key="col.name" :props="props">
		          <p v-if="col.name !== 'batchNumber'">{{$moment(col.value).format('ll')}}</p>
		          <p v-else-if="col.name === 'batchNumber'">{{i+1}}</p>
		        </q-td>
		      </q-tr>
				</q-table>
			</div>
			<div v-if="viewMode === 'calendarMode'"  style="height: 500px; width: 1000px">
				<calendar-view
	    		:key="Date.now()"
					:show-date="showDate"
					:events="seasonEventSchedules"
					:show-event-times="showEventTimes"
					:timeFormatOptions="{ hour: 'numeric', minute: 'numeric', hour12: true}"
					:startingDayOfWeek="startingDayOfWeek"
					@show-date-change="setShowDate"
					@click-event="clickEvent"
					@drop-on-date="dropOnDate"
					class="theme-default holiday-us-traditional q-ml-md"
				>
				</calendar-view>
			</div>
			<div v-if="viewMode === 'agendaMode'">
				<calendar-agenda
					class="q-ma-md"
					:start-date="showDate"
					:event-array="agendaSeasonSchedules"
					:allow-editing="false"
				/>
			</div>
		</div>
	</q-page>
</template>
<script>
import { CalendarView } from 'vue-simple-calendar'
import { CalendarAgenda } from 'quasar-calendar'

export default {
	created () {
		this.eventKey = this.$route.params.eventKey
		this.loadSelectSeason()
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey))
	},
	components: {
		CalendarView,
		CalendarAgenda
	},
	computed: {
		agendaSeasonSchedules () {
			try {
				let activities = [...this.seasonEventSchedules]
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
							color: 'faded'
						}
					}
				})
				let agendaActivities = this.$lodash.compact(mapAct)
				// console.log('agendaActivities', agendaActivities)
				return agendaActivities
			} catch {
				return []
			}
		},
		seasonEventSchedules () {
			try {
				let allAct = new Array()
				let scheds = [...this.seasonBatches]
				this.$lodash.forEach(scheds, sc => {
					this.$lodash.forEach(sc.activities, act => {
						act.startDate = new Date(act.startDate)
						act.endDate = new Date(act.endDate)
						allAct.push(act)
					})
				})
			return allAct
			} catch {
				return []	
			}
		},
		getSeasonName () {
			try {
				return this.selectedSeason.seasonName
			} catch {
				return ''
			}
		},
		customBatches () {
			try {
				let custom = new Array()
				let activities = [...this.seasonBatches[0].activities]
				// var numOfPayment = 0
				// var numOfWorkshop = 0
				console.log('selectedSeason', activities)
				this.$lodash.forEach(this.seasonBatches, sb => {
					let custom2 = []
					let numOfPayment = 0
					let numOfWorkshop = 0
					this.$lodash.forEach(sb.activities, act => {
						
						let keys = new Array()
						if (act.dueDate) {
			  			let toReturnStart = {
				  			[`${this.$lodash.capitalize(act.type)} Start`]: act.startDate
				  		}
				  		let toReturnEnd = {
				  			[`${this.$lodash.capitalize(act.type)} End`]: act.endDate	
				  		}
				  		custom2.push(toReturnStart)
				  		custom2.push(toReturnEnd)
			  		} else {
			  			if (act.type === 'payment') {
			  				++numOfPayment
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)} ${numOfPayment}`]: act.startDate,
					  		}
					  		custom2.push(toReturn)
			  			} else if (act.type === 'workshop') {
			  				++numOfWorkshop
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`]: act.startDate
					  		}
					  		custom2.push(toReturn)
			  			} else {
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)}`]: act.startDate
					  		}
					  		custom2.push(toReturn)
			  			}
			  		}
					})
					for (var i = 0; i < custom2.length; i++) {
						let key = this.$lodash.keys(custom2[i])[0]
						let value = custom2[i][key]
						console.log('value', value)
						custom2[key] = key
						custom2[key] = value
					}
					custom2.splice(0, custom2.length)
					console.log('cust2', custom2)
					custom.push({...custom2})
				})
				console.log('custom batches',  custom)
				return custom
			} catch {
				return []
			}
			
		},
		customColumn () {
			try {
				let activities = this.seasonBatches[0].activities
				let custom = new Array()
		  	var numOfPayment = 0
				var numOfWorkshop = 0
		  	this.$lodash.forEach(activities, act => {
		  		// console.log('act', act)
		  		if (act.dueDate) {
		  			let toReturnStart = {
			  			name: this.$lodash.capitalize(act.type) + 'Start',
			  			required: true,
			  			label: this.$lodash.capitalize(act.type) + ' Start',
			  			align: 'left',
			  			field: this.$lodash.capitalize(act.type) + ' Start',
			  		}
			  		let toReturnEnd = {
			  			name: this.$lodash.capitalize(act.type) + 'End',
			  			required: true,
			  			label: this.$lodash.capitalize(act.type) + ' End',
			  			align: 'left',
			  			field: this.$lodash.capitalize(act.type) + ' End',
			  		}
			  		custom.push(toReturnStart)
			  		custom.push(toReturnEnd)
		  		} else {
		  			if (act.type === 'payment') {
		  				numOfPayment++
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: `${this.$lodash.capitalize(act.type)} ${numOfPayment}`,
				  			align: 'left',
				  			field: `${this.$lodash.capitalize(act.type)} ${numOfPayment}`,
				  		}
				  		custom.push(toReturn)
		  			} else if (act.type === 'workshop') {
		  				numOfWorkshop++
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: `${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`,
				  			align: 'left',
				  			field: `${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`,
				  		}
				  		custom.push(toReturn)
		  			} else {
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: this.$lodash.capitalize(act.type),
				  			align: 'left',
				  			field: this.$lodash.capitalize(act.type)
				  		}
				  		custom.push(toReturn)
		  			}
		  			
		  		}
		  	})
		  	let batch = {
		  		name: 'batchNumber',
		  		label: 'Batch',
		  		align: 'left',
		  	}
		  	custom.splice(0, 0, batch)
		  	console.log('custom column', custom)
		  	return custom
			} catch {
				return []
			}
			
		},
		seasonBatches () {
			try {
				let batches = this.$lodash.filter(this.schedules, s => {
					return s.eventKey === this.eventKey && s.seasonName === this.selectedSeason.seasonName
				})
				return batches
			} catch {
				return []
			}
		},
		latestSeason () {
			var len = this.getSeasons.length
			return this.getSeasons[len-1]
		},
		getSeasons () {
			try {
				// this.$bindAsArray('events', this.$database.ref('events'))
				// let event = this.$lodash.filter(this.events, e => {
				// 	return e['.key'] === this.eventKey
				// })[0]
				// console.log('event', event)
				// this.$forceUpdate()
				return this.event[0].seasons
			} catch {
				return []
			}
		},
	},
	data () {
		return {

			startingDayOfWeek: 0,
			showEventTimes: true,
			showDate: new Date(),
			schedules: [],
			selectedSeason: {},
			viewMode: 'batchMode',
			events: [],
			event: [],
			eventKey: '',
			columns: [
	      {
	        name: 'desc',
	        required: true,
	        label: 'Dessert (100g serving)',
	        align: 'left',
	        field: 'name',
	        sortable: true,
	        classes: 'my-class',
	        style: 'width: 500px'
	      }
	    ],
	    tableData: [
	      {
	        name: 'Frozen Yogurt',
	        calories: 159,
	        fat: 6.0,
	        carbs: 24,
	        protein: 4.0,
	        sodium: 87,
	        calcium: '14%',
	        iron: '1%'
	      }
	    ]
		}
	},
	methods: {
		dropOnDate (e, d) {

		},
		clickEvent (e) {

		},
		setShowDate (d) {
			this.showDate = d
		},
		getCol (c) {
			console.log('c', c)
		},
		loadSelectSeason () {
			try {
				let events = this.$store.state.startUp.events
				let event = this.$lodash.filter(events, e => {
					return e['.key'] === this.eventKey
				})[0]
				let seasonLen = event.seasons.length
				this.selectedSeason = event.seasons[seasonLen-1]
			} catch {
				this.selectedSeason = {}
			}
			
		},
		test () {
			console.log('seasonBatches', this.seasonBatches)
			
		}
	}
}
</script>