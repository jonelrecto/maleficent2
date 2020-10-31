<template>
	<q-page>
		<div>
			<q-toolbar color="grey-5">
			  <q-toolbar-title>
			    Available Batches
			  </q-toolbar-title>

		  	<q-toggle v-model="advanceDateToggle" label="AdvanceDate(Nov 28, 2018)"/>
			</q-toolbar>
		</div>
		<div>
			<!-- <q-btn label="test" @click="test" /> -->
			<q-table
			class="q-ma-md"
	    :data="getAvailableSchedules"
	    :columns="columns"
	    no-data-label="No Available Activity"
	    row-key="name">

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
        {{(props.row.id)}}
      </q-td>
 
      <q-td slot="body-cell-people" slot-scope="props" :props="props">
        {{getPeople(props)}}
      </q-td>


      <q-td slot="body-cell-action" slot-scope="props" :props="props">
        <q-btn label="Select" color="positive" @click="confirmResched(props)"> </q-btn>
      </q-td> 

		</q-table>
		</div>
	</q-page>
</template>
<script>
export default {
	created () {
		this.eventKey = this.$route.params.eventKey
		this.batchKey = this.$route.params.batchKey
		this.batchNumber = this.$route.params.batchNumber
		this.activityID = this.$route.params.activityID
		this.activityType = this.$route.params.activityType
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('attendance', this.$database.ref('attendance'))
		this.$bindAsArray('courseActivities', this.$database.ref('settings/courses'))
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
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
		getOldPhotolikingID () {
			let oldBatch = this.$lodash.filter(this.schedules, s => {
				return s['.key'] === this.batchKey
			})[0]
			let old = this.$lodash.filter(oldBatch.activities, ob => {
				return ob.type === 'photoliking'
			})
			console.log('old', old)
			return old[0]
		},
		parseLastActivities () {
			// console.log('courseActivities', this.courseActivities)
			let finalActivities = new Array()
			for (var i = 0; i < this.courseActivities.length; i++) {
				var actLen = this.courseActivities[i].activities.length
				finalActivities.push(this.courseActivities[i].activities[actLen-1])
			}
			let getUniq = this.$lodash.uniqBy(finalActivities, 'value')
			// console.log('finalActivities', getUniq)
			return getUniq
		},
		getAvailableSchedules () {
			console.log('schedules', this.schedules)
			// console.log('attendance', this.attendance)
			let allAct = new Array()
			this.$lodash.forEach(this.schedules, s => {
				allAct.push(s.activities)
			})
			console.log('allAct', allAct)
			let merge = new Array()
			for (var i = 0; i < allAct.length; i++) {
				for (var j = 0; j < allAct[i].length; j++) {
					let dif = this.$mathMixin.dayDiff(new Date(this.advanceDate), new Date(allAct[i][j].startDate))
					this.$lodash.forEach(this.parseLastActivities, pa => {
						if (pa.value === this.activityType) {
							console.log('found final event')
							if (allAct[i][j].type === this.activityType) {
								merge.push(allAct[i][j])
							}
						} else {
							if (dif > 7 && allAct[i][j].type === this.activityType) {
								console.log('not final event')
								merge.push(allAct[i][j])
							}		
						}
					})
					
				}
			}
			console.log('merge', merge)
			let sorted = this.$lodash.orderBy(merge, function (value) { return new Date(value.startDate)}, 'asc')
			return this.$lodash.uniqBy(sorted, 'id')
		}
	},
	data () {
		return {
			advanceDate: '',
			advanceDateToggle: false,
			contractSigned: [],
			courseActivities: [],
			schedules: [],
			attendance: [],
			availableActivities: [],
			eventKey: '',
			batchKey: '',
			batchNumber: '',
			activityID: '',
			activityType: '',
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
	        name: 'people',
	        required: true,
	        label: 'No. of People',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'action',
	        required: true,
	        label: 'Action',
	        align: 'center',
	        sortable: true
	      }
	    ],
		}
	},
	methods: {
		newReschedTable (eventKey, newActivityID, models) {
			// create resched table
			var reschedTable = {
				newActivityID: newActivityID,
				oldActivityID: this.activityID,
				models: models
			}
			let vm = this
			console.log('reschedTable', reschedTable)
			this.$database.ref(`rescheduled`).child(this.getBatchKey(eventKey, newActivityID)['.key']).set(reschedTable)
				.then(() => {
					let reschedNewBatchKey = this.getBatchKey(eventKey, newActivityID)['.key']
					let reschedActID = newActivityID
					let reschedActType = this.activityType
					vm.$q.notify({
            message: `Successfully Rescheduled`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
					this.$router.push(`/SMSList/${reschedNewBatchKey}/${reschedActID}/${reschedActType}`)
				})
				.catch(err => {
					console.log('err', err)
				})
			// this.$router.push('/reschedule')
		},
		addInNewAttendance (newBatchKey, newActivityID, models, modelKey) {
			// add new attendance in new batch resched
			this.$database.ref(`attendance/${newBatchKey}/${newActivityID}/models`).child(modelKey).set(models[modelKey])
				.then(() => {
					console.log('added new model in attendance')
				})
				.catch(err => {
					console.log('error in adding new attendance', err)
				})
		},
		removeAttendanceAbsent (modelKey) {
			// remove models in attendance in old batch
			console.log('remove batchkey', this.batchKey)
			console.log('remove activityID', this.activityID)
			console.log('modelkey', modelKey)
			this.$database.ref(`attendance/${this.batchKey}/${this.activityID}/models/`).child(modelKey).remove()
				.then(() => {
					console.log('rescheduled status done')
				})
				.catch(err => {
					console.log('an error occur in removeAttendanceAbsent', err)
				})
		},
		confirmResched (p) {
			this.$q.dialog({
				  title: 'Confirm',
				  message: `Do you want to Rescheduled ${this.activityID} to ${p.row.id} ?`,
				  ok: 'Ok',
				  cancel: 'Cancel'
				}).then(() => {
					console.log('p', p)
					let att = this.$lodash.filter(this.attendance, a => {
						return a['.key'] === this.batchKey
					})[0]
					let models = att[this.activityID].models
					let modelKeys = this.$lodash.keys(att[this.activityID].models)
					console.log('models', models)
					console.log('modelKeys', modelKeys)
					for (var i = 0; i < modelKeys.length; i++) {
						// update model account
						let resched = {
							batchKey: this.getBatchKey(p.row.eventKey, p.row.id)['.key'], // new batchkey
							newActivityID: p.row.id, // new activity to replace
							oldActivityID: this.activityID
						}
						console.log('resched', resched)
						// if photoshoot resched also photoliking
						// if (this.activityType === 'photoshoot') {
							// let photolikingResched = {
							// 	batchKey: this.getBatchKey(p.row.eventKey, p.row.id)['.key'],
							// 	newActivityID: this.getNewPhotolikingID(this.getBatchKey(p.row.eventKey, p.row.id)['.key']),
							// 	oldActivityID: this.getOldPhotolikingID
							// }
							// console.log('this.getOldPhotolikingID', this.getOldPhotolikingID)
							// console.log('photolikingResched', photolikingResched)
							// console.log('query', `contractSigned/${modelKeys[i]}/rescheduledActivity`)
							// this.$database.ref(`contractSigned/${modelKeys[i]}/rescheduledActivity`).push(photolikingResched)
							// 	.then(() => {
							// 		this.addInNewAttendance(resched.batchKey, photolikingResched.newActivityID, models, modelKeys[i])
							// 	})
							// 	.catch(err => {
							// 		console.log('an error found in confirm', err)
							// 	})
							// set photoliking attendance in database
						// }
						this.$database.ref(`contractSigned/${modelKeys[i]}/rescheduledActivity`).push(resched)
							.then(() => {
								console.log('rescheduled', modelKeys[i])
							})
							.catch(err => {
								console.log('an error found in confirm', err)
							})
						this.removeAttendanceAbsent(modelKeys[i])
						this.addInNewAttendance(resched.batchKey, p.row.id, models, modelKeys[i])
					}
					this.newReschedTable(p.row.eventKey, p.row.id, models)

				}).catch(() => {})
		},
		getNewPhotolikingID (batchKey) {
			let batch = this.$lodash.filter(this.schedules, s => {
				return s['.key'] === batchKey
			})[0]
			return this.$lodash.filter(batch.activities, ba => {
				return ba.type === 'photoliking'
			})
		},
		getPeople (p) {
			try {
				// console.log('p', p)
				// console.log('attendance', this.attendance)
				let activityID = p.row.id
				for (var i = 0; i < this.attendance.length; i++) {
					let mappedAttendance = this.$lodash.map(this.attendance[i], (value, key) => {
						// console.log('value', value)
						// console.log('key', key)
						var map = {
							['.key']: key,
							value
						}
						return map
					})
					// console.log('key', mappedAttendance)
					let filterModels = this.$lodash.filter(mappedAttendance, ma => {
						return ma['.key'] === activityID
					})[0]
					// console.log('filterModels', filterModels)
					if (filterModels) {
						let people = Object.values(filterModels.value.models)
						console.log('models', people.length)
						return people.length
					}
				}
				return 0
			} catch (err) {
				return 0
			}
			
			// return 0
		},
		getEventName (p) {
			let eventKey = p.row.eventKey
			let event = this.$lodash.filter(this.$store.state.startUp.events, e => {
				return e['.key'] === eventKey
			})[0]
			return event.eventName
		},
		getDate (p) {
			// console.log('p', p)
			return this.$moment(p.row.startDate).format('ll')
		},
		getBatchKey (eventKey, actID) {
			let filterSched = this.$lodash.filter(this.schedules, s => {
				return s.eventKey === eventKey
			})
			for (var i = 0; i < filterSched.length; i++) {
				for (var j = 0; j < filterSched[i].activities.length; j++) {
					if (filterSched[i].activities[j].id === actID) {
						return filterSched[i]
					}
				}
			}
		},
		test () {
			console.log('this.getPhotolikingID()', this.getPhotolikingID())
		}
	}
}
</script>