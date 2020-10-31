<template>
	<q-page>
		<q-toolbar color="grey-5">
		  <q-toolbar-title>
		    Reschedule
		  </q-toolbar-title>
		  <!-- <q-btn label="test" @click="test" /> -->
		  <q-toggle v-model="advanceDateToggle" label="AdvanceDate(Nov 28, 2018)"/>
		</q-toolbar>
		<!-- <q-btn label="test" @click="test"/> -->
		<q-table
	    title="Reschedule Models"
	    :data="getReschedModels"
	    :columns="columns"
	    no-data-label="No Reschedule yet"
	    row-key="name">

	  	<!-- batch start date -->
      <q-td slot="body-cell-date" slot-scope="props" :props="props">
        {{ getDate(props) }}
      </q-td>
 
      <q-td slot="body-cell-event" slot-scope="props" :props="props">
        {{ getEventName(props) }}
      </q-td>
      
      <q-td slot="body-cell-batch" slot-scope="props" :props="props">
          {{ props.row.batch }}
      </q-td>

      <q-td slot="body-cell-actType" slot-scope="props" :props="props">
        {{$lodash.capitalize($store.getters['startUp/get3rdAfterUnderline'](props.row.id))}}
      </q-td>

      <q-td slot="body-cell-absent" slot-scope="props" :props="props">
        {{getAbsents(props)}} <br/>
      	<q-btn size="xs" label="View Models" color="info" @click="viewModels(props)" />
      </q-td>

      <q-td slot="body-cell-action" slot-scope="props" :props="props">
        <q-btn label="Reschedule" color="secondary" @click="reschedModels(props)"> </q-btn>
      </q-td>

      <q-td slot="body-cell-notif" slot-scope="props" :props="props">
        <q-btn icon="mail" label="SMS" color="positive" > </q-btn>
      </q-td>

		</q-table>

		<!-- model modal -->
		<q-modal v-model="modelModal" :content-css="{minWidth: '40vw', minHeight: '80vh'}">
		  <q-modal-layout>
		    <q-toolbar slot="header">
		      <q-btn
		        flat
		        round
		        dense
		        v-close-overlay
		        icon="keyboard_arrow_left"
		      />
		      <q-toolbar-title>
		        Models
		      </q-toolbar-title>


		<!-- <q-btn label="test" @click="test"/> -->
		    </q-toolbar>

		    <div class="" id="printTest">
		      <q-list>
					  <q-item v-for="(model, i) in models" :key="i">
					    <q-item-side>
					    	{{i+1}}
					    </q-item-side>
					    <q-item-main>{{model.lastName + ', ' + model.firstName}}</q-item-main>
					  </q-item>
					</q-list>
		    </div>

		  <!--   <q-toolbar slot="footer">
		      <q-toolbar-title>
		        Footer
		      </q-toolbar-title>
		    </q-toolbar> -->

		    
		  </q-modal-layout>
		</q-modal>
	</q-page>
</template>
<script>
import axios from 'axios'
import JsPDF from 'jsPDF'

export default {
	mounted () {
		this.$bindAsArray('attendance', this.$database.ref('attendance'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
	},
	watch: {
		advanceDateToggle () {
			console.log('advanceDate', this.advanceDateToggle)
			if (this.advanceDateToggle) {
				this.advanceDate = '2018-11-28'
			} else {
				this.advanceDate = ''
			}
		}
	},
	computed: {
		getReschedModels () {
			// console.log('attendance', this.attendance)
			// console.log('attendance', this.schedules)
			let outDatedActivities = new Array()
			let activities = this.$lodash.forEach(this.attendance, a => {
				let batchKey = a['.key']
				let batchActivitiesID = Object.keys(a)
				let batch = this.$lodash.filter(this.schedules, s => {
					return s['.key'] === batchKey
				})[0]
				for (var i = 0; i < batchActivitiesID.length; i++) {
					for (var j = 0; j < batch.activities.length; j++) {
						if (batchActivitiesID[i] === batch.activities[j].id && batchActivitiesID[i] !== '.key') {
							// console.log('act start date', batch.activities[j].startDate)
							// console.log('batchActivitiesID[i]', batchActivitiesID[i])
							let dif = this.$mathMixin.dayDiff(new Date(this.advanceDate), new Date(batch.activities[j].startDate))
							if (dif < 0) {
								if (a[batchActivitiesID[i]].models) {
									batch.activities[j].absents = a[batchActivitiesID[i]].models
									batch.activities[j].batchKey = a['.key']
									outDatedActivities.push(batch.activities[j])	
								}
							}
						}
					}
				}
				// console.log('batch key', batch)
				// console.log('key', batchActivitiesID)
			})
			console.log('outdated', outDatedActivities)
			return outDatedActivities
			// console.log('act')
			// this.$lodash.forEach(activities[0], a => {
			// 	// console.log('a',key)
			// })
			// return []
		}
	},
	data () {
		return {
			advanceDate: '',
			advanceDateToggle: false,
			modelModal: false,
			models: [],
			rescheduled: [],
			attendance: [],
			schedules: [],
			columns: [
	      {
	        name: 'date',
	        required: true,
	        label: 'Date',
	        align: 'left',
	        field: 'startDate',
	        sortable: true
	      },
	      {
	        name: 'event',
	        required: true,
	        label: 'Event',
	        align: 'left',
	        sortable: true
	      },
	      {
	        name: 'batch',
	        required: true,
	        label: 'Batch',
	        align: 'left',
	        sortable: true
	      },
	      {
	        name: 'actType',
	        required: true,
	        label: 'Activity Type',
	        align: 'left',
	        sortable: true
	      },
	      {
	        name: 'absent',
	        required: true,
	        label: 'No. of Absent',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'action',
	        required: true,
	        label: 'Action',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'notif',
	        required: true,
	        label: 'Notification',
	        align: 'center',
	        sortable: true
	      }
	    ],
		}
	},
	methods: {
		// toggleDate () {
		// 	console.log('advanceDate', this.advanceDate)
		// },
		viewModels (p) {
			let models = p.row.absents
			console.log('p', models)
			let mapModels = this.$lodash.map(models, (value, key) => {
				value['.key'] = key
				return value
			})
			this.models = mapModels
			this.modelModal = !this.modelModal
			console.log('value', mapModels)
		},
		reschedModels (p) {
			let eventKey = p.row.eventKey
			let batchKey = p.row.batchKey
			let batchNumber = p.row.batch
			let activityID = p.row.id
			let activityType = p.row.type
			console.log('url', eventKey, batchKey, batchNumber, activityID)
			this.$router.push(`reschedModels/${eventKey}/${batchKey}/${batchNumber}/${activityID}/${activityType}`)
		},
		getAbsents (p) {
			try {
				let absents = p.row.absents
				let toArrayAbsents = Object.values(absents)
				console.log('toArrayAbsents', toArrayAbsents)
				return toArrayAbsents.length	
			} catch {
				return 0
			}
		},
		getEventName (p) {
			let eventKey = p.row.eventKey
			let event = this.$lodash.filter(this.$store.state.startUp.events, e => {
				return e['.key'] === eventKey
			})[0]
			return event.eventName
		},
		getDate (p) {
			return this.$moment(p.row.startDate).format('ll')
		},
		test () {
			console.log('advanceDate', this.advanceDateToggle)
		}
	}
}
</script>
