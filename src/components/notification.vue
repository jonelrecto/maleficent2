<template>
	<div>
		<div>
			<!-- <q-btn label="test" @click="test" /> -->
			<q-list separator link>
				<q-list-header>Upcoming Activity</q-list-header>
	      <q-item v-for="(upcome,i) in getUpcomingEvent" :key="i">
	      	<q-item-side icon="local_activitys" />
	      	<q-item-main>
			      <q-item-tile label>{{upcome.id}}</q-item-tile>
			      <q-item-tile sublabel lines="2">
			        {{$moment(upcome.startDate).format('ll')}} {{$moment(upcome.time).format('LTS')}}
			      </q-item-tile>
			    </q-item-main>
			  </q-item>
	    </q-list>
		</div>
		<div>
			<q-list separator link>
				<q-list-header>Registrants</q-list-header>
	      <q-item>
	      	<q-item-side icon="how_to_reg" />
			    <q-item-main>
			    	You have {{numOfRegistrantInDay.numReg}} New Registrants
			    </q-item-main>
			  </q-item>
	    </q-list>
		</div>
		<div>
			<q-list separator link>
				<q-list-header>New Signed</q-list-header>
	      <q-item>
	      	<q-item-side icon="local_activitys" />
			    <q-item-main>
			    	You have {{numOfSignedInDay.numSigned}} New Signed Models
			    </q-item-main>
			  </q-item>
	    </q-list>
		</div>
		<div v-if="upcomingSeasonEnd.length !== 0">
			<q-list separator link>
				<q-list-header>Upcoming Season End</q-list-header>
	      <q-item v-for="(seasonEnd,i) in upcomingSeasonEnd" :key="i">
	      	<q-item-side icon="event_availability" />
			    <q-item-main>
			    	{{seasonEnd.seasonName}}
			    </q-item-main>
			  </q-item>
	    </q-list>
		</div>
		<div v-if="isAboutToStart.length !== 0">
			<q-list separator link>
				<q-list-header>Season to Start</q-list-header>
	      <q-item v-for="(aboutStart,i) in isAboutToStart" :key="i">
	      	<q-item-side icon="warning" color="warning"/>
			    <q-item-main>
			    	{{aboutStart.seasonName}}
			    </q-item-main>
			    <q-item-tile sublabel lines="2">
		        {{$moment(aboutStart.seasonStart).format('ll')}}
		      </q-item-tile>
			  </q-item>
	    </q-list>
		</div>
		<div v-if="getReschedModels.length !== 0">
			<q-list separator link>
				<q-list-header>Rescheduled Pending</q-list-header>
	      <q-item v-for="(resched,i) in getReschedModels" :key="i">
	      	<q-item-side icon="assignment_late" color="red"/>
			    <q-item-main>
			    	<q-item-tile label>{{resched.id}}</q-item-tile>

			    	<q-item-tile sublabel>
			        Absent: {{$lodash.keys(resched.absents).length}}
			      </q-item-tile>
			    </q-item-main>
			  </q-item>
	    </q-list>
		</div>
		<div v-if="missingDetails.length !== 0">
			<q-list separator link>
				<q-list-header>Missing Details</q-list-header>
	      <q-item v-for="(missing,i) in missingDetails" :key="i">
	      	<q-item-side icon="assignment_returned" color="red"/>
			    <q-item-main>
			    	<q-item-tile label>{{missing.id}}</q-item-tile>
			    	<q-item-tile sublabel>
			        {{$moment(missing.seasonStart).format('ll')}}
			      </q-item-tile>
			    </q-item-main>
			  </q-item>
	    </q-list>
		</div>
	</div>
</template>
<script>
export default {
	mounted () {
		let user2 = this.$q.localStorage.get.item('user')
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('users', this.$database.ref('users'))
		this.$bindAsArray('events', this.$database.ref('events'))
		this.$bindAsArray('registrants', this.$database.ref('models'))
		this.$bindAsArray('signed', this.$database.ref('contractSigned'))
		this.$bindAsArray('userLoggedIn', this.$database.ref(`users`).orderByKey().equalTo(user2))
		this.$bindAsArray('attendance', this.$database.ref('attendance'))
	},
	computed: {
		missingDetails () {
			let allSched = new Array()
			let scheds = [...this.schedules]
			this.$lodash.forEach(scheds, s => {
				this.$lodash.forEach(s.activities, act => {
					allSched.push(act)
				})
			})
			// console.log('allSched', allSched)
			let withOutDetails = new Array()
			for (var i = 0; i < allSched.length; i++) {
				if ((allSched[i].location === '' || allSched[i].details === '') && (allSched[i].type !== 'payment' && allSched[i].type !== 'photoliking' && allSched[i].type !== 'orientation')) {
					withOutDetails.push(allSched[i])
				}
			}
			// console.log('withOutDetails', withOutDetails)
			return withOutDetails
		},
		getReschedModels () {
			try {
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
								let dif = this.$mathMixin.dayDiff(new Date(), new Date(batch.activities[j].startDate))
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
				// console.log('outdated', outDatedActivities)
				return outDatedActivities
				// console.log('act')
				// this.$lodash.forEach(activities[0], a => {
				// 	// console.log('a',key)
				// })
				// return []
			} catch  {
				return []
			}
		},
		isAboutToStart () {
			// console.log('getSeasonStandBy', this.getSeasonStandBy)
			let isAboutToStart = this.$lodash.filter(this.getSeasonStandBy, sb => {
				var dif = this.$mathMixin.dayDiff(new Date(), new Date(sb.seasonStart))
				if (dif <= 14) {
					return sb
				}
			})
			// console.log('isAboutToStart', isAboutToStart)
			return isAboutToStart
		},
		getSeasonStandBy () {
			let seasonStandBy = this.$lodash.filter(this.getSeasons, s => {
				return s.status === 'standby'
			})
			return seasonStandBy
		},
		upcomingSeasonEnd () {
			// console.log('seasons', this.getSeasons)
			let upcomingSeasonEnd = new Array()
			this.$lodash.forEach(this.getSeasons, s => {
				let dif = this.$mathMixin.dayDiff(new Date(), new Date(s.seasonEnd))
				// console.log('dif', dif)
				if (dif <= 30) {
					upcomingSeasonEnd.push(s)
				}
			})
			// console.log('upcomingSeasonEnd', upcomingSeasonEnd)
			return upcomingSeasonEnd
		},
		getSeasons () {
			let seasons = new Array()
			this.$lodash.forEach(this.events, e => {
				this.$lodash.forEach(e.seasons, s => {
					seasons.push(s)
				})
			})
			return seasons
		},
		numOfSignedInDay () {
			let modelReg = [...this.signed]
			let numSigned = []
			this.$lodash.forEach(modelReg, mr => {
				let dif = this.$mathMixin.dayDiff(new Date(), new Date(mr.dateSigned))
				// console.log('dif', dif)
				if (dif === 0) {
					numSigned.push(mr)
				}
			})
			let signed = {
				numSigned: numSigned.length,
				seen: false,
			}
			return signed
		},
		numOfRegistrantInDay () {
			let modelReg = [...this.registrants]
			let numReg = []
			this.$lodash.forEach(modelReg, mr => {
				let dif = this.$mathMixin.dayDiff(new Date(), new Date(mr.dateCreated))
				// console.log('dif', dif)
				if (dif === 0) {
					numReg.push(mr)
				}
			})
			let reg = {
				numReg: numReg.length,
				seen: false,
			}
			return reg
		},
		getUpcomingEvent () {
			try {
				return this.userLoggedIn[0].notification.upcomingActivities
			}	catch {
				return []
			}
		}
	},
	data () {
		return {
			attendance: [],
			events: [],
			signed: [],
			registrants: [],
			upcomingOld: [],
			schedules: [],
			users: [],
			userLoggedIn: []
		}
	},
	methods: {
		notifyuser () {
			let allSched = new Array()
			let scheds = this.schedules
			this.$lodash.forEach(scheds, s => {
				this.$lodash.forEach(s.activities, act => {
					allSched.push(act)
				})
			})
			// console.log('all act', allSched)
			let sorted = this.$lodash.orderBy(allSched,function(value) {return new Date(value.startDate)},'asc')
			// console.log('all act', sorted)
			let upcoming5 = new Array()
			for (var i = 0; i < sorted.length; i++) {
				let dif = this.$mathMixin.dayDiff(new Date(), new Date(sorted[i].startDate))
				if (dif >= 0 && sorted[i].type !== 'payment') {
					upcoming5.push(sorted[i])
					if (upcoming5.length === 5) {
						i = sorted.length
					}
				}
			}
			this.$lodash.forEach(upcoming5, up => {
				up.seen = false
			})
			this.$lodash.forEach(this.users, u => {
				let key = u['.key']
				this.$database.ref(`users/${key}/notification`).child('upcomingActivities').set(upcoming5)
					.then(() => {
						// console.log('done')
					})
					.catch(err => {
						console.log('err', err)
					})
			})
			// this.$database.ref('notification').child('upcomingActivities').set(upcoming5)
			// 	.then(() => {
			// 		console.log('done')
			// 	})
			// 	.catch(err => {
			// 		console.log('failed')
			// 	})
		},
		test () {
			// console.log('attendance', this.attendance)
		}
	}
}
</script>
