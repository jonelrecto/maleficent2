<template>
	<div class="row inline justify-center">
		<!-- <q-btn label="test" @click="test" /> -->
		<!-- orientation --> 
		<q-card class="col-md-3 q-ma-sm">
			<q-card-title>
				<p class="q-title text-weight-bold">Orientation</p>
			</q-card-title>
			<q-card-main>

				<q-field
					orientation="vertical"
					label-width="2"
					icon="access time"  
				>
					<q-datetime format="h:mm A" v-model="orientation.time" type="time" stack-label="Time"/>	
				</q-field>

			</q-card-main>
			<q-card-separator inset />
			<q-card-main>
				<q-field
					icon="mdi-city"
				>	
					<div  v-if="selectOrientationLocation === 'new location'" class="q-my-md flex row" >
						<q-input class="col-md-8" v-model="newOrientNameLocation" float-label="Name" />
						<div class="q-mt-md">
							<q-btn-group rounded>
								<q-btn size="sm" color="positive" label="Save" @click="saveOrientLocation()"/>
								<q-btn size="sm" color="negative" label="Cancel" @click="selectOrientationLocation = ''"/>
							</q-btn-group>	
						</div>
					</div>
					<q-select
						v-else
						separator
						@input="onChangeOrientLocation"
						v-model="selectOrientationLocation"
						float-label="Select Location"
						filter
						:options="locationTemplateOpt"
					/>
					<q-input
						:readonly="selectOrientationLocation === ''"
						v-model="orientation.location"
						type="textarea"
						float-label="Location"	
						:max-height="50"
						rows="4"
					/>
					<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
					<q-input
						:readonly="selectOrientationLocation === ''"
						v-model="orientation.details"
						type="textarea"
						float-label="Details (optional)"
						:max-height="50"
						rows="4"
					/>
				</q-field>
			</q-card-main>
		</q-card>


		<!-- payment -->
    	<q-card inline class="col-md-3" height="200px" >
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Payment</p>
	      </q-card-title>
	      <q-card-main >
	        <q-field orientation="vertical"  icon="attach_money" class="q-my-md" label="Payment Amount" :error="isSameTotal" error-label="Please check Total Amount">
						<p class="caption"><b>Season Rate:</b> P {{ totalAmount }}</p>
						<div>
							<div class="row wrap justify-center">
								<div v-for="(n,i) in numberOfPayments" :key="n" class="col-xs-12 col-sm-6 col-md-6">
									<q-input class="q-mx-md" prefix="P " :stack-label="`Payment ${i+1}`" type="number" v-model="paymentsAmount[i]" />
								</div>
							</div>
							
						</div>

						<q-item-separator />

						<div class="row">
							<p v-if="missingAmount < 0" class="col-md-12 text-weight-bold " >Missing Amount: {{ Math.abs(missingAmount) | currency}}</p>
							<p v-if="missingAmount > 0" class="col-md-12 text-weight-bold " >Exceed Amount: {{ Math.abs(missingAmount) | currency}}</p>
							<span class="text-weight-bold" >Total: {{ getTotal | currency}}</span>
						</div>
						
					</q-field>
	      </q-card-main>
	    </q-card>

    <!-- photoshoot -->
			<q-card v-if="hasPhotoshoot" inline class="col-md-3 q-ma-sm">
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Photoshoot</p>
	      </q-card-title>
	      <q-card-main>
	        <q-field
	        	orientation="vertical"
	        	label-width="2"
		        icon="access time"
		      >
		      	<div>
		      		<q-datetime 
				      	format="h:mm A" 
				      	v-model="photoshoot.time" 
				      	type="time" 
				      	stack-label="Time"
			      	/>
		      	</div>
		      </q-field>

	      </q-card-main>
	      <q-card-separator inset />
	      <q-card-main>
	        <q-field
		        icon="mdi-city"
		      >	
		      	<div  v-if="selectPhotoshootLocation === 'new location'" class="q-my-md flex row" >
		      		<q-input class="col-md-8" v-model="newPhotoshootNameLocation" float-label="Name" />
		      		<div class="q-mt-md">
		      			<q-btn-group rounded>
								  <q-btn size="sm" color="positive" label="Save" @click="savePhotoshootLocation()"/>
								  <q-btn size="sm" color="negative" label="Cancel" @click="selectPhotoshootLocation = ''"/>
								</q-btn-group>	
		      		</div>
		      	</div>
						<q-select
							v-else
							@input="onChangePhotoLocation"
				      v-model="selectPhotoshootLocation"
				      float-label="Select Location"
				      filter
				      :options="locationTemplateOpt"
				    />
		      	<q-input
		      		:readonly="selectPhotoshootLocation === ''"
						  v-model="photoshoot.location"
						  type="textarea"
						  float-label="Location"	
						  :max-height="80"
						  rows="5"
						/>
						
		      	<q-input
		      		:readonly="selectPhotoshootLocation === ''"
						  v-model="photoshoot.details"
						  type="textarea"
						  float-label="Details (optional)"
						  :max-height="80"
						  rows="5"
						/>
		      </q-field>
	      </q-card-main>
	    </q-card>




    <!-- workshop -->
		<q-card v-if="hasWorkshops" inline class="col-md-12 q-ma-sm" style="width: 950px">
			<q-card-title>
				<p class="q-title text-weight-bold">Workshops</p>
			</q-card-title>
			<q-card-main>
				<div class="row inline flex">
					<div class="col-md-3" v-for="(workshop, i) in numberOfWorkshops" :key="i" >
						<div class="q-ma-md">
							<q-field :label="'Workshop ' + (i+1)" label-width="3" orientation="vertical">
									

								<q-datetime format="h:mm A" stack-label="Time" v-model="workshops.time[i]" type="time" />

								<q-item-separator/>
								<div  v-if="selectWorkshopLocation[i] === 'new location'" class="q-my-md flex row" >
									<q-input class="col-md-8" v-model="newWorkshopNameLocation[i]" float-label="Name" />
									<div class="q-mt-md">
										<q-btn-group rounded>
											<q-btn size="sm" color="positive" label="Save" @click="saveWorkshopLocation(i)"/>
											<q-btn size="sm" color="negative" label="Cancel" @click="clearWorkshopSelectLocation(i)"/>
										</q-btn-group>	
									</div>
								</div>
								
								<q-select
									v-else
									@input="onChangeWorkshopLocation(i)"
									v-model="selectWorkshopLocation[i]"
									float-label="Select Location"
									filter
									:options="locationTemplateOpt"
								/>

								<q-input
									:readonly="selectWorkshopLocation[i] === ''"
									v-model="workshops.location[i]"
									type="textarea"
									float-label="Location"
									:max-height="50"
									rows="4"
								/>
								<q-input
									:readonly="selectWorkshopLocation[i] === ''"
									v-model="workshops.details[i]"
									type="textarea"
									float-label="Description (optional)"
									:max-height="50"
									rows="4"
								/>
							</q-field>
						</div>
					</div>
					
				</div>
				
			</q-card-main>
		</q-card>


    <!-- other activity -->
		<div v-for="(act, i) in getOtherActivity" :key="i">
			<q-card inline class="q-ma-sm" style="width: 350px" v-if="act.actType === 'detailed'">

	      <q-card-title>
	      	<p class="q-title text-weight-bold">{{act.label}}</p>
	      </q-card-title>
	      <q-card-main >
						<q-datetime 
							stack-label="Time" 
							format="h:mm A" 
							v-model="otherActivities.time[i]" 
							type="time"
							:error="isOtherActivityTimeIsEmpty[i]"
						/>	
	        <q-field
		       icon="mdi-city"
		      >	
		      	<div  v-if="selectOtherActivityLocation[i] === 'new location'" class="q-my-md flex row" >
		      		<q-input class="col-md-8" v-model="newOtherActivityLocation[i]" float-label="Name" />
		      		<div class="q-mt-md">
		      			<q-btn-group rounded>
								  <q-btn size="sm" color="positive" label="Save" @click="saveOtherActivityLocation(i)"/>
								  <q-btn size="sm" color="negative" label="Cancel" @click="clearOtherActivitySelectLocation(i)"/>
								</q-btn-group>	
		      		</div>
		      	</div>
						<q-select
							v-else
							separator
							@input="onChangeOtherActivityLocation(i)"
				      v-model="selectOtherActivityLocation[i]"
				      float-label="Select Location"
				      filter
				      :options="locationTemplateOpt"
				    />
		      	<q-input
		      		:readonly="selectOtherActivityLocation === ''"
						  v-model="otherActivities.location[i]"
						  type="textarea"
						  float-label="Location"	
						  :max-height="80"
						  rows="5"
						/>
		      	<q-input
		      		:readonly="selectOtherActivityLocation[i] === ''"
						  v-model="otherActivities.details[i]"
						  type="textarea"
						  float-label="Details (optional)"
						  :max-height="80"
						  rows="5"
						/>
		      </q-field>
	      </q-card-main>
	      
	    </q-card>
		</div>


		<!-- final event -->
		<div>
			<q-card inline class="q-ma-sm" style="width: 350px">
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Final Event</p>
	      </q-card-title>
	      <q-card-main>
	        

					<q-field
						orientation="vertical"
						label-width="2"
						icon="access time"
					>
						<q-datetime format="h:mm A" v-model="finalEvent.time" type="time"  stack-label="Time" />
					</q-field>

	      </q-card-main>
	      <q-card-separator inset />
	      <q-card-main>
	        <q-field
		        icon="mdi-city"
		      >	
		      	<div  v-if="selectFinalEventLocation === 'new location'" class="q-my-md flex row" >
		      		<q-input class="col-md-8" v-model="newFinalEventLocation" float-label="Name" />
		      		<div class="q-mt-md">
		      			<q-btn-group rounded>
								  <q-btn size="sm" color="positive" label="Save" @click="saveFinalEventLocation()"/>
								  <q-btn size="sm" color="negative" label="Cancel" @click="selectFinalEventLocation = ''"/>
								</q-btn-group>	
		      		</div>
		      	</div>
						<q-select
							v-else
							separator
							@input="onChangeFinalEventLocation"
				      v-model="selectFinalEventLocation"
				      float-label="Select Location"
				      filter
				      :options="locationTemplateOpt"
				    />
		      	<q-input
		      		:readonly="selectFinalEventLocation === ''"
						  v-model="finalEvent.location"
						  type="textarea"
						  float-label="Location"
						  :max-height="80"
						  rows="5"
						/>
				
		      	<q-input
		      		:readonly="selectFinalEventLocation === ''"
						  v-model="finalEvent.details"
						  type="textarea"
						  float-label="Details (optional)"
						  :max-height="80"
						  rows="5"
						/>
		      </q-field>
	      </q-card-main>
	    </q-card>
		</div>
	</div>
</template>

<script>
import { date } from 'quasar'
import { required, between } from 'vuelidate/lib/validators'
const { getJsDateFromExcel } = require('excel-date-to-js')

const isStartDateIsEmpty = (value, vm) => {
	for (var i = 0; i < value.length; i++) {
		if (value[i] === '' || typeof value[i] === 'undefined')
			return true
	}
	return false
}

	export default {
		props: {
			
			eventName: {
				type: String,
				default: ''
			},
			eventCode: {
				type: String,
				default: ''
			}
		},
		validations () {
			return {
				otherActivities: {
					time: {
						required,
						isStartDateIsEmpty
					}
				}
			}
		},

		created () {
			this.eventKey = this.$route.params.id
			this.setPaymentsAmount()
			// this.setPaymentsToNull()
			// 	// console.log(this.workshops.startDate[0])
			if (this.hasWorkshops) {
				// console.log('set to nulls')
				if (typeof this.workshops.time[0] === 'undefined') {
					this.setWorkshopsToNull()
				}
			}

			// if (typeof this.otherActivities.time[0] === 'undefined') {
			// 	this.setOtherActivitiesToNull()
			// }
				
			// if (this.isRestoreAsDraft) {
			// 	if (this.seasonStart !== this.tempSeasonDraft.seasonStart && this.seasonEnd !== this.tempSeasonDraft.seasonEnd) {
			// 		this.onChangeStartDateOrEndDate()
			// 	}
			// 	if (this.totalAmount !== this.tempSeasonDraft.totalAmount) {
			// 		// console.log('not the same')
			// 		this.setPaymentsAmount()
			// 	}
			// 	// console.log('restore draft')
			// 	return
			// }
			this.commitStoreStates()
			
			// this.generatePaymentsDate()
			// if (this.hasPhotoshoot || this.photoshoot.startDate === '') {
			// 	this.generatePhotoshootActivity()	
			// }
			// if (this.hasPhotoliking || this.photoliking.startDate === '') {	
			// 	this.generatePhotolikingActivity()
			// }

			
			// this.generateAutomatedSched()
			
			// this.$bindAsArray('course', this.$database.ref('settings/courses').orderByKey().equalTo(this.courseKey))
		
		},
		mounted () {
			this.$bindAsArray('course', this.$database.ref('settings/courses').orderByKey().equalTo(this.courseKey), null, () => {
				console.log(this.course, 'course')
				this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey), null, () => {
					this.$bindAsArray('locationTemplates', this.$database.ref('locationTemplates'), null, () => {
						if (typeof this.otherActivities.time[0] === 'undefined') {
							this.setOtherActivitiesToNull()
						}
					})
				})

				
			})
		},
		computed: {
			importLoadingState: {
				get () {
					return this.$store.state.schedules.importLoadingState
				},
				set (v) {
					this.$store.state.schedules.importLoadingState = v
				}
			},
			getEventCode () {
				return this.event ? this.event[0].eventCode : []
			},
			seasonInfo () {
				return this.$store.state.schedules.seasonInfo[0]
			},
			courseKey () {
				return this.seasonInfo.course										
			},
			totalAmount () {
				return this.seasonInfo.totalAmount
			},
			numberOfPayments () {
				return this.seasonInfo.numberOfPayment
			},
			numberOfWorkshops () {															
				return this.seasonInfo.numberOfWorkshops
			},
			tempSeasonDraft () {								
				return this.$store.state.schedules.tempSeasonDraft
			},
			photolikingOpt () {
				// let  = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'photoshoot' || a.value === 'photoshoots'})[0]
				// console.log('photoshootDayOfWeek', photoshootDayOfWeek)
				if (this.getPhotolikingActivity.datePick === false) {
					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, this.getPhotolikingActivity.dayOfWeek)
					// console.log('dates', dates)
					var count = 0
					for (var i = 0; i < dates.length; i++) {
						var dif = date.getDateDiff(dates[i], this.payments.startDate[1])
						// console.log('dif payment', dif, this.payments.startDate[index-1])
						if (dif <= 0) {
							count++
						}
					}
					let filterDates = this.$lodash.dropRight(this.$lodash.drop(dates, count))
					// console.log('filterdates', filterDates)
					return this.$lodash.map(filterDates, d => {
						return { label: this.$store.getters['schedules/formatDate'](d), value: d}
					})
				} else {
					return []
				}
			},
			photoshootOpt () {
				let photoshootDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'photoshoot' || a.value === 'photoshoots'})[0]
				// console.log('photoshootDayOfWeek', photoshootDayOfWeek)
				if (photoshootDayOfWeek.datePick === false) {
					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, photoshootDayOfWeek.dayOfWeek)
					// console.log('dates', dates)
					var count = 0
					for (var i = 0; i < dates.length; i++) {
						var dif = date.getDateDiff(dates[i], this.payments.startDate[0])
						// console.log('dif payment', dif, this.payments.startDate[index-1])
						if (dif <= 0) {
							count++
						}
					}
					let filterDates = this.$lodash.dropRight(this.$lodash.drop(dates, count))
					// console.log('filterdates', filterDates)
					return this.$lodash.map(filterDates, d => {
						return { label: this.$store.getters['schedules/formatDate'](d), value: d}
					})
				} else {
					return []
				}
			},
			// numberOfWorkshops: {
			// 	get () {
			// 		return this.$store.state.schedules.numberOfWorkshops
			// 	},
			// 	set (v) {
			// 		this.$store.state.schedules.numberOfWorkshops = v
			// 	}
			// },
			finalEvent: {
				get () {
					return this.$store.state.schedules.finalEvent
				},
				set (v) {
					this.$store.state.schedules.finalEvent = v
				}
			},
			otherActivities: {
				get () {
					return this.$store.state.schedules.otherActivities
				},
				set (v) {
					this.$store.state.schedules.otherActivities = v
				}
			},
			workshops: {
				get () {
					return this.$store.state.schedules.workshops
				},
				set (v) {
					this.$store.state.schedules.workshops = v
				}
			},
			photoliking: {
				get () {
					return this.$store.state.schedules.photoliking
				},
				set (v) {
					this.$store.state.schedules.photoliking = v
				}
			},
			photoshoot: {
				get () {
					return this.$store.state.schedules.photoshoot
				},
				set (v) {
					this.$store.state.schedules.photoshoot = v
				}
			},
			payments: {
				get () {
					return this.$store.state.schedules.payments
				},
				set (v) {
					this.$store.state.schedules.payments = v
				}
			},
			paymentsAmount: {
				get () {
					return this.$store.state.schedules.paymentsAmount
				},
				set (v) {
					this.$store.state.schedules.paymentsAmount = v
				}
			},
			selectOrientationLocation: {
				get () {
					return this.$store.state.schedules.selectOrientationLocation
				},
				set (v) {
					this.$store.state.schedules.selectOrientationLocation = v
				}
			},
			selectPhotoshootLocation: {
				get () {
					return this.$store.state.schedules.selectPhotoshootLocation
				},
				set (v) {
					this.$store.state.schedules.selectPhotoshootLocation = v
				}
			},
			selectWorkshopLocation: {
				get () {
					return this.$store.state.schedules.selectWorkshopLocation
				},
				set (v) {
					this.$store.state.schedules.selectWorkshopLocation = v
				}
			},
			selectOtherActivityLocation: {
				get () {
					return this.$store.state.schedules.selectOtherActivityLocation
				},
				set (v) {
					this.$store.state.schedules.selectOtherActivityLocation = v
				}
			},
			selectFinalEventLocation: {
				get () {
					return this.$store.state.schedules.selectFinalEventLocation
				},
				set (v) {
					this.$store.state.schedules.selectFinalEventLocation = v
				}
			},
			photolikingPickDateChecked: {
				get () {
					return this.$store.state.schedules.photolikingPickDateChecked 
				}, 
				set (v) {
					this.$store.state.schedules.photolikingPickDateChecked = v
				}
			},
			photoshootPickDateChecked: {
				get () {
					return this.$store.state.schedules.photoshootPickDateChecked
				},
				set (v) {
					this.$store.state.schedules.photoshootPickDateChecked = v
				}
			},
			paymentsPickDateChecked: {
				get () {
					return this.$store.state.schedules.paymentsPickDateChecked
				},
				set (v) {
					this.$store.state.schedules.paymentsPickDateChecked = v
				}
			},
			workshopPickDateChecked: {
				get () {
					return this.$store.state.schedules.workshopPickDateChecked
				},
				set (v) {
					this.$store.state.schedules.workshopPickDateChecked = v
				}
			},
			otherActivitiesPickDateChecked: {
				get () {
					return this.$store.state.schedules.otherActivitiesPickDateChecked
				},
				set (v) {
					this.$store.state.schedules.otherActivitiesPickDateChecked = v
				}
			},
			orientation: {
				get () {
					return this.$store.state.schedules.orientation
				},
				set (v) {
					this.$store.state.schedules.orientation = v
				}
			},
			plottedActivities: {
				get () {
					return this.$store.state.schedules.plottedActivities
				},
				set (val) {
					this.$store.state.schedules.plottedActivities = val
				}
			},
			hasWorkshops () {
				if (this.getWorkshopActivity) {
					return true
				} else {
					return false
				}
			},
			hasPhotoliking () {
				if (this.getPhotolikingActivity) {
					return true
				} else {
					return false
				}
			},
			hasPhotoshoot () {
				if (this.getPhotoshootActivity) {
					return true
				} else {
					return false
				}
			},
			paymentsMaxDate () {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 14})
			},
			photolikindMaxEndDate () {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 7})
			},
			photolikingMinEndDate () {
				return date.addToDate(new Date(this.photoliking.startDate), {days: 1})
			},
			photolikingMinDate () {
				return date.addToDate(new Date(this.payments.startDate[1]), {days: 1})
			},
			photolikingMaxDate () {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 7})
			},
			photoshootMinDate () {
				return date.addToDate(new Date(this.payments.startDate[0]), {days: 1})
			},
			photoshootMaxDate () {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 14})
			},
			workshopsMaxDate () {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 7})
			},
			locationTemplateOpt () {
				var mapLoc = []
				// console.log(this.locationTemplates, 'opt')
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
			getEvent () {
				var i = this.$lodash.findIndex(this.$store.state.startUp.events, e => {
					return e['.key'] === this.eventKey
 				})
				return this.$store.state.startUp.events[i]
			},
			getOtherActivity () {
				try {
					console.log(this.getCourse.activities, 'this.getCourse.activities')
					let course = this.$store.getters['startUp/getPlainValue'](this.getCourse)
					return this.$lodash.remove(course.activities, function(o) {
						return o.value != 'payments' && o.value != 'orientation' && o.value != 'photoshoots' && o.value != 'photoshoot' && o.value != 'photoliking' && o.value != 'workshop' && o.value != 'workshops' && o.value != 'final event'
					})	
				} catch (err) {
					return {}
				}
				
			},
			getWorkshopActivity () {
				try {
					return this.$lodash.filter(this.getCourse.activities, a => {
						return a.value === 'workshops' || a.value === 'workshop'
					})[0]
				} catch (err) {
					return {}
				} 
				
			},
			getPhotolikingActivity () {
				return this.$lodash.filter(this.getCourse.activities, a => {
					return a.value === 'photoliking'
				})[0]
			},
			getPhotoshootActivity () {
				try { 
					return this.$lodash.filter(this.getCourse.activities, a => {
						return a.value === 'photoshoot' || a.value === 'photoshoots'
					})[0]
				} catch (err) {
					return {}
				}
				
			},
			getTotal () {
				try {
	        let amount = parseFloat(this.$lodash.sum(this.paymentsAmount))
	        // let isNan = parseFloat(amount) || 0
	        return amount
	        // return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	      } catch (err){ return 0 }
			},
			isSameTotal () {
				let totalAmount = this.$store.getters['startUp/removeComma'](this.totalAmount)
				let seasonTotal = parseFloat(totalAmount)
				let total = parseFloat(this.getTotal)
				// console.log('same total', parseInt(this.totalAmount))
				// console.log('total', total)
				if (seasonTotal !== total) {
					this.isPaymentError = true
					return true
				} else {
					this.isPaymentError = false
					return false
				}
			},
			missingAmount () {
				let totalAmount = this.$store.getters['startUp/removeComma'](this.totalAmount)
				var seasonTotal = parseInt(totalAmount)
				var total = parseInt(this.getTotal)
				
				console.log(total, 'total')
				
				console.log(seasonTotal, 'totalAmount')
				// console.log(this.getTotal - seasonTotal, 'gettotal')
				return total - seasonTotal
			},
			getCourse () {
				// return this.$lodash.filter(this.courses, c => {
				// 	return c['.key'] === this.courseKey
				// })[0]
				return this.course[0]
			}
		},
		data () {
			// event: `${this.getEvent.eventCode}`
			return {
				event: [],
				eventKey: '',
				locationTemplates: [],
				isPhotoshootStartDateEmpty: false,
				isPhotolikingStartDateEmpty: false,
				isPaymentsStartDateEmpty: [],
				isOtherActivityTimeIsEmpty: [],
				isOtherActivityEndDateIsEmpty: [],
				isOtherActivityStartDateIsEmpty: [],
				isWorkshopStartDateIsEmpty: [],
				isOtherActivityStartDateIsEmpty: [],
	      newFinalEventLocation: '',
	      newOtherActivityLocation: [],
	      newWorkshopNameLocation: [],
	      newPhotoshootNameLocation: '',
	      newOrientNameLocation: '',
				course: [],
				isPaymentError: false,
				mon: new Array(),
				tue: new Array(),
				wed: new Array(),
				thu: new Array(),
				fri: new Array(),
				sat: new Array(),
				sun: new Array()
			}
		},
		methods: {
			onChangePhotoshootStartDate () {
				let dif = date.getDateDiff(new Date(this.photoshoot.startDate), new Date(this.photoliking.startDate), 'days')
				// console.log(dif)
				if (dif >= 0) {
					this.photoliking.startDate = ''
					this.photoliking.endDate = ''
				}
			},
			onChangePaymentDate (i) {
				// console.log(i)
				for (var n = i; n < this.numberOfPayments; n++) {
					let payment1 = this.payments.startDate[i]
					let payment2 = this.payments.startDate[n+1] ? this.payments.startDate[n+1] : ''
					// console.log(payment2)
					let dif = date.getDateDiff(new Date(payment1), new Date(payment2), 'days')
					// console.log(dif, 'dif')
					if (dif >= 0) {
						this.payments.startDate[n+1] = ''
					}
					// console.log(this.payments)
				}
				let dif2 = date.getDateDiff(new Date(this.payments.startDate[0]), new Date(this.photoshoot.startDate), 'days')
				// console.log(dif2)
				if (dif2 >= 0) {
					this.photoshoot.startDate = ''
				}
				let dif3 = date.getDateDiff(new Date(this.payments.startDate[1]), new Date(this.photoliking.startDate), 'days')
				if (dif3 >= 0) {
					this.photoliking.startDate = ''
					this.photoliking.endDate = ''
				}
				// console.log(this.photoshoot)
			},
			isStartDateIsEmpty: async function () {
				let promise = new Promise(resolve => {
					// payments
					for (var i = 0; i < this.numberOfPayments; i++) {
						if (this.payments.startDate[i] === '' || typeof this.payments.startDate[i] === 'undefined') {
							this.isPaymentsStartDateEmpty[i] = true
						} else {
							this.isPaymentsStartDateEmpty[i] = false
						}
					}
					// photoshoot
					// if (this.photoshoot.startDate)
					console.log(this.$v.photoshoot.startDate.required)
					if (this.$v.photoshoot.startDate.required === false) {
						this.photoshootStartDateIsEmpty = true
					}
					// workshop
					for (var i = 0; i < this.numberOfWorkshops; i++) {
						if (this.workshops.startDate[i] === '' || typeof this.workshops.startDate[i] === 'undefined') {
							this.isWorkshopStartDateIsEmpty[i] = true
						} else {
							this.isWorkshopStartDateIsEmpty[i] = false
						}
					}
					// other actiivty startdate
					let oa = this.otherActivities
					for (var i = 0; i < this.getOtherActivity.length; i++) {
						if (oa.startDate[i] === '' || typeof oa.startDate[i] === 'undefined') {
							this.isOtherActivityStartDateIsEmpty[i] = true
						} else {
							this.isOtherActivityStartDateIsEmpty[i] = false
						}
					}
					// other activity time
					for (var i = 0; i < this.getOtherActivity.length; i++) {
						if (this.getOtherActivity[i].actType != 'date range') {
							if (oa.time[i] === '' || typeof oa.time[i] === 'undefined') {
								this.isOtherActivityTimeIsEmpty[i] = true
							} else {
								this.isOtherActivityTimeIsEmpty[i] = false
							}	
						}
					}
				})
				let result = await promise
				return result
			},
			onChangeFirstWorkshopDate (index) {

				let datesStartDate = this.workshops.startDate[index] ? this.workshops.startDate[index] : this.photoshoot.startDate

					// console.log(datesStartDate, 'datesStartDate')
				let dates = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: datesStartDate, seasonEnd: this.seasonEnd, daysofweek: this.getWorkshopActivity.dayOfWeek})
				// console.log(dates, 'dates')
				let d = new Date()
				d.setHours(8, 0, 0 ,0)
				if (this.numberOfWorkshops > 1) {
					for (var i = index+1; i < this.numberOfWorkshops; i++) {
						if (typeof this.$lodash.head(dates) !== 'undefined') {
							// console.log(i, 'i')
							let getHead = this.$lodash.head(dates)
							this.workshops.startDate[i] = getHead
							
							// console.log(getHead, 'getHeffad')
							dates = this.$lodash.drop(dates)
							// console.log(dates, 'dates')
						}
					}
				}
				this.workshops.time[index] = d
				this.workshopPickDateChecked[index] = false
				for (var n = index; n < this.numberOfWorkshops; n++) {
					let workshop1 = this.workshops.startDate[index]
					let workshop2 = this.workshops.startDate[n+1] ? this.workshops.startDate[n+1] : ''
					// console.log(workshop2)
					let dif = date.getDateDiff(new Date(workshop1), new Date(workshop2), 'days')
					// console.log(dif, 'dif')
					if (dif >= 0) {
						this.workshops.startDate[n+1] = ''
					}
					// console.log(this.payments)
				}


				// if (index < 1) {
				// 	console.log(index, 'index')
				// 	// let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, this.getWorkshopActivity.dayOfWeek)
				// 	let datesStartDate = this.workshops.startDate[0] ? this.workshops.startDate[0] : this.photoshoot.startDate

				// 	let dates = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: datesStartDate, seasonEnd: this.seasonEnd, daysofweek: this.getWorkshopActivity.dayOfWeek})
				// 	console.log(dates, 'dates')

				// 	if (this.numberOfWorkshops > 1) {
				// 		for (var i = 0; i < this.numberOfWorkshops; i++) {
				// 			if (typeof dates[i] !== 'undefined') {
				// 				this.workshops.startDate[i+1] = dates[i]	
				// 			}				
				// 		}	
				// 	}
					// console.log(this.workshops, 'workshops')				
				// }
			},
			getOtherActivityDatesUsed (act, index) {
				if (act.datePick !== false && act.actType !== 'date range')  {
					// console.log('index', index)
					var startDates = []
					var activityStartDatesArr = this.otherActivities.startDate
					// console.log('activityStartDatesArr', activityStartDatesArr)
					for (var i = 0; i < this.otherActivities.startDate.length; i++) {
						if (i !== index) {
							// console.log('index', index)
							startDates.push(activityStartDatesArr[i])
						}
					}
					// console.log('getOtherActivityDatesUsed startDates', startDates)
					return startDates
				} else {
				 	return []
				}
				// return this.otherActivities.startDate
			},
			onChangeStartDateOrEndDate () {
				this.orientation.startDate = this.seasonStart
				this.orientation.endDate = this.seasonStart
				this.finalEvent.startDate = this.seasonEnd
				this.finalEvent.endDate = this.seasonEnd
				this.generatePaymentsDate()
				this.photoshoot.startDate = ''
				this.photoshoot.endDate = ''
				this.generatePhotoshootActivity()
				this.photoliking.startDate = ''
				this.photoliking.endDate = ''
				this.generatePhotolikingActivity()
				if (this.hasWorkshops) {
					for (var i = 0; i < this.numberOfWorkshops; i++) {
						this.workshopPickDateChecked[i] = false
						this.workshops.startDate[i] = ''
						this.workshops.actType[i] = this.getWorkshopActivity.actType
					}
				}
				for (var i = 0; i < this.getOtherActivity.length; i++) {
					this.otherActivitiesPickDateChecked[i] = false
					this.otherActivities.startDate[i] = ''
					this.otherActivities.endDate[i] = ''
					this.otherActivities.time[i] = ''
				}
				this.finalEvent.startDate = this.seasonEnd
			},
			commitStoreStates () {
				this.$store.commit('schedules/commitActivityComponentState', {seasonStart: this.seasonStart, seasonEnd: this.seasonEnd, eventKey: this.eventKey, eventCode: this.eventCode, seasonNumber: this.seasonNumber, classes: this.classes})
			},
			isOtherActivityDateEndNull (act, i) {
				if (act.actType === 'date range' && this.otherActivities.startDate[i] === '') {
					return true
				}
				return false
			},
			otherActivityMaxStartDate (act, i) {
				if (act.actType === 'date range') {
					return date.subtractFromDate(new Date(this.seasonEnd), {days: 6})
				} else {
					return date.subtractFromDate(new Date(this.seasonEnd), {days: 6})
				}
			},
			otherActivityMinStartDate (act, i) {
				if (act.actType === 'date range') {
					// return date.addToDate(new Date(this.payments.startDate[1]), {days: 1})
					return date.addToDate(new Date(this.payments.startDate[1]), {days: 1})
				} else {
					return date.addToDate(new Date(this.payments.startDate[1]), {days: 1})
				}
			},
			otherActivityMinEndDate (act, i) {
				if (act.actType === 'date range') {
					return date.addToDate(new Date(this.otherActivities.startDate[i]), {days: 1})
				} 
			},
			otherActivityMaxEndDate (act, i) {
				if (act.actType === 'date range') {
					return date.subtractFromDate(new Date(this.seasonEnd), {days: 1})
				} 
			},
			paymentsOpt (index) {
				if (index >= 1) {
					let paymentDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'payments'})[0]
					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, paymentDayOfWeek.dayOfWeek)

					// console.log('dates', dates)
					// console.log('dates', this.payments.startDate)
					var count = 0
					var dLength = dates.length
					// console.log('index', index)
					for (var i = 0; i < dLength; i++) {
						var dif = date.getDateDiff(dates[i], this.payments.startDate[index-1])
						// console.log('dif payment', dif, this.payments.startDate[index-1])
						if (dif <= 0) {
							count++
						}
					}
					let filterDates = this.$lodash.drop(dates, count)
					// console.log('filterDates', filterDates)

					return this.$lodash.map(filterDates, d => {
						return { label: this.$store.getters['schedules/formatDate'](d), value: d }
					})
				} else {
					let paymentDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'payments'})[0]
					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, paymentDayOfWeek.dayOfWeek)
					// console.log('dates', dates)
					return this.$lodash.map(dates, d => {
						return { label: this.$store.getters['schedules/formatDate'](d), value: d}
					})
				}
			},
			workshopOpt (index) {
				// try {
					function formatDate (date, moment) {
						var dt = moment(new Date(date))
						return dt.format('ddd MMMM DD, YYYY')
					}
					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, this.getWorkshopActivity.dayOfWeek)
					if (index >= 1) {
						var count = 0
						var dLength = dates.length
						for (var i = 0; i < dLength; i++) {
							var dif = date.getDateDiff(dates[i], this.workshops.startDate[index-1])
							if (dif <= 0) {
								// console.log('dif', dif)
								count++
							}
						}
						var filterDates = this.$lodash.drop(dates, count)
						let mapDates = this.$lodash.map(filterDates, d => {
							return { label: formatDate(d, this.$moment), value: d }
						})
						return mapDates
					} else {
						var count = 0
						var dLength = dates.length
						let photoshootStartDate = this.photoshoot.startDate ? this.photoshoot.startDate : this.payments.startDate[0]
						for (var i = 0; i < dLength; i++) {
							var dif = date.getDateDiff(dates[i], photoshootStartDate)
							if (dif <= 0) {
								count++
							}
						}
						var filterDates = this.$lodash.drop(dates, count)
						// console.log('filsterdates', filterDates)
						var merge = this.$lodash.union(this.payments.startDate, [this.photoshoot.startDate], [this.photoliking.startDate])
						// console.log('merge', merge)
						var tempDates = filterDates
						for (var i = 0; i < filterDates.length; i++) {
							for (var j = 0; j < merge.length; j++) {
								if (date.isSameDate(new Date(filterDates[i]), new Date(merge[j]))) {
									tempDates.splice(i, 1)
								}
							}
						}

						let mapDates = this.$lodash.map(tempDates, d => {
							return { label: formatDate(d, this.$moment), value: d }
						})

						// console.log(mapDates, 'mapDates')
						return mapDates
					}
				// } catch {}
			
			},
			saveFinalEventLocation () {
				this.$store.dispatch('schedules/saveNewLocation', {name: this.newFinalEventLocation, location: this.finalEvent.location, details: this.finalEvent.details})
					.then(snapshot => {
						this.selectFinalEventLocation = snapshot
						this.newFinalEventLocation = ''
					})
					.catch(() => {})
			},
			saveOtherActivityLocation (i) {
				this.$store.dispatch('schedules/saveNewLocation', {name: this.newOtherActivityLocation[i], location: this.otherActivities.location[i], details: this.otherActivities.details[i]})
					.then(snapshot => {
						this.selectOtherActivityLocation[i] = snapshot
						this.newOtherActivityLocation[i] = ''
						this.$forceUpdate()
					})
					.catch(() => {})
			},
			otherActivityOpt (act, index) {
				// console.log('act', act)
				function formatDate (date, moment) {
					var dt = moment(new Date(date))
					return dt.format('ddd MMMM DD, YYYY')
				}
				if (act.datePick === false && act.actType === 'date range')  {

					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, act.dayOfWeek)
					var count = 0
					for (var i = 0; i < dates.length; i++) {
						// var dif = date.getDateDiff(new Date(dates[i]), date.subtractFromDate(this.seasonEnd, {days: act.duration}))
						var dif = date.getDateDiff(new Date(dates[i]), this.payments.startDate[2])
						if (dif < 0) {
							count++
						}
						// console.log('dif', dif)
					}
					// console.log('dates', dates)
					var filterDates = this.$lodash.drop(dates, count)
					var merge = this.$lodash.union(this.payments.startDate, [this.photoshoot.startDate], [this.photoliking.startDate], this.workshops.startDate)
					// console.log('merge', merge)
					var filterDates = this.$lodash.drop(dates, count)
					var tempDates = filterDates
					for (var i = 0; i < filterDates.length; i++) {
						for (var j = 0; j < merge.length; j++) {
							if (date.isSameDate(new Date(filterDates[i]), new Date(merge[j]))) {
								tempDates.splice(i, 1)
							}
						}
					}
					let mapDates = this.$lodash.map(tempDates, d => {
						return { label: formatDate(d, this.$moment), value: d }
					})
					return mapDates
				} else {
					let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, act.dayOfWeek)
					var count = 0
					var minDateForOtherActivity = this.payments.startDate[2] ? this.payments.startDate[2] : this.photoliking.startDate
					for (var i = 0; i < dates.length; i++) {
						var dif = date.getDateDiff(new Date(dates[i]), minDateForOtherActivity)
						if (dif < 0) {
							count++
						}
					}
					// console.log('payments', this.payments.startDate)
					// console.log('payments', [this.photoshoot.startDate])
					var merge = this.$lodash.union(this.payments.startDate, [this.photoshoot.startDate], [this.photoliking.startDate], this.workshops.startDate, this.getOtherActivityDatesUsed(act, index))
					// console.log('merge', merge)
					var filterDates = this.$lodash.drop(dates, count)
					var tempDates = filterDates
					for (var i = 0; i < filterDates.length; i++) {
						for (var j = 0; j < merge.length; j++) {
							if (date.isSameDate(new Date(filterDates[i]), new Date(merge[j]))) {
								tempDates.splice(i, 1)
							}
						}
					}
					// console.log('tempDates', tempDates)
					let mapDates = this.$lodash.map(tempDates, d => {
						return { label: formatDate(d, this.$moment), value: d }
					})
					return mapDates
				}
				
			},
			saveWorkshopLocation (i) {
				this.$store.dispatch('schedules/saveNewLocation', {name: this.newWorkshopNameLocation[i], location: this.workshops.location[i], details: this.workshops.details[i]})
					.then(snapshot => {
						this.selectWorkshopLocation[i] = snapshot
						this.newWorkshopNameLocation[i] = ''
						this.$forceUpdate()
					})
					.catch(() => {})
			},
			savePhotoshootLocation () {
				this.$store.dispatch('schedules/saveNewLocation', {name: this.newPhotoshootNameLocation, location: this.photoshoot.location, details: this.photoshoot.details})
					.then(snapshot => {
						this.selectPhotoshootLocation = snapshot
						this.newPhotoshootNameLocation = ''
					})
					.catch(() => {})
			},
			saveOrientLocation () {
				// console.log('orientation', this.orientation, this.newOrientNameLocation)
				this.$store.dispatch('schedules/saveNewLocation', {name: this.newOrientNameLocation, location: this.orientation.location, details: this.orientation.details})
					.then(snapshot => {
						this.selectOrientationLocation = snapshot
						this.newOrientNameLocation = ''
					})
					.catch(() => {})
			},
			paymentDateFormat (date) {
				var dt = this.$moment(new Date(date))
				return dt.format('ddd MMM DD, YYYY')
			},
			setPaymentsAmount () {
				// try {
					if (this.numberOfPayments % 2 === 0) {
						let totalAmount = this.$store.getters['startUp/removeComma'](this.totalAmount)
						let eachPayment = parseFloat(totalAmount) / parseInt(this.numberOfPayments)
						this.paymentsAmount = new Array(this.numberOfPayments)
						console.log(this.paymentsAmount, 'payments amount')
						for (var i = 0; i < this.paymentsAmount.length; i++) {
							this.paymentsAmount[i] = eachPayment
						}
					} else {
						let totalAmount = this.$store.getters['startUp/removeComma'](this.totalAmount)
						let firstPayment = parseFloat(totalAmount) * 0.20
						let otherPayment = (parseFloat(totalAmount) - firstPayment) / (parseInt(this.numberOfPayments) - 1)
						
						this.paymentsAmount = new Array(this.numberOfPayments)
						this.paymentsAmount[0] = firstPayment
						for (var i = 1; i < this.paymentsAmount.length; i++) {
							this.paymentsAmount[i] = otherPayment
						}
						
						console.log(this.paymentsAmount, 'payments amount')
						
					}
				// } catch {}

			},
			generatePaymentsDate () {
				let paymentDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'payments'})[0]
				// console.log('payments', paymentDayOfWeek)
				let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, paymentDayOfWeek.dayOfWeek)
				// this.payments.startDate = new Array()
				// console.log('dates', dates)	
				var paymentStart = 1
				this.payments.startDate[0] = dates[0]
				if (typeof this.payments.startDate[1] !== 'undefined') { 
					this.payments.startDate[1] = dates[2] 
					paymentStart++
				}
				
				for (var i = paymentStart; i < this.numberOfPayments; i++) {
					if (typeof dates[i+1] !== 'undefined') {
						this.payments.startDate[i] = dates[i+1]
						this.payments.endDate[i] = dates[i+1]
					} else {
						return
					}
				}
				// this.payments.startDate = testArr
				// console.log('test', dates[6])
			},
			generateOtherActivitiesDate () {
				for (var i = 0; i < this.getActivities.length; i++) {
					if (this.getActivities[i].actType === 'detailed' && this.getActivities[i].datePick === false) {
						let dates = this.getDatesOfWeek(this.seasonStart, this.getActivities[i].dayOfWeek)
						this.otherActivities.startDate[i] = dates[i]
						this.otherActivities.endDate[i] = dates[i]
					} else if (this.getActivities[i].actType === 'date range' && this.getActivities[i].datePick === false) {
						let dates = this.getDatesOfWeek(this.seasonStart, this.getActivities[i].dayOfWeek)
						this.otherActivities.startDate[i] = dates[i]
						this.otherActivities.endDate[i] = this.$mathMixin.addDays(new Date(dates[i]), this.getActivities[i].duration).toString()
					}
				}
			},
			generatePhotoshootActivity () {
				try {
					// console.log('course', this.getPhotoshootActivity)
					if (this.getPhotoshootActivity.datePick === false) {
						var dataSeasonStart = this.payments.startDate[0] ? this.payments.startDate[0] : this.seasonStart
						// console.log('dataSeasonStart', dataSeasonStart)
						let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, this.getPhotoshootActivity.dayOfWeek)
						// console.log('dates', dates)
						for (var i = 0; i < dates.length; i++) {
							var dif = date.getDateDiff(new Date(dates[i]), this.photoshootMinDate)
							// console.log('dif', dif, this.photoshootMinDate)
							if (dif >= 0) {
								this.photoshoot.startDate = dates[i]
								break
							}

						}
					}
				} catch {}
			},
			generatePhotolikingActivity () {
				try {
					if (this.getPhotolikingActivity.datePick === false) {
						var dataSeasonStart = this.payments.startDate[1] ? this.payments.startDate[1] : this.photoshoot.startDate
						// console.log('dataSeasonStart', dataSeasonStart)
						let dates = this.getDatesOfWeek(dataSeasonStart, this.seasonEnd, this.getPhotolikingActivity.dayOfWeek)

						// console.log('dates', dates)
						// filter first the date before using it
						for (var i = 0; i < dates.length; i++) {
							var dif = date.getDateDiff(new Date(dates[i]), this.photolikingMinDate)
							// console.log('dif', dif, this.photoshootMinDate)
							if (dif >= 0) {
								this.photoliking.startDate = dates[i]
								this.photoliking.endDate = date.addToDate(new Date(dates[i]), { days: this.getPhotolikingActivity.duration })
								break
							}
						}
						this.photoliking.startDate = dates[0]
					}
				} catch  {() => {}}
			},
			setPaymentsToNull () {
				for (var i = 0; i < this.numberOfPayments; i++ ) {
					this.paymentsPickDateChecked[i] = false
				}
			},
			setWorkshopsToNull () {
				// console.log('workshops', this.workshops)
				let d = new Date()
				d.setHours(8, 0, 0 ,0)
				for (var i = 0; i < this.numberOfWorkshops; i++) {
					this.workshopPickDateChecked[i] = false
					this.workshops.startDate[i] = ''
					this.workshops.actType[i] = this.getWorkshopActivity.actType
					this.workshops.time[i] = d
					this.selectWorkshopLocation[i] = ''
					this.workshops.location[i] = ''
					this.workshops.details[i] = ''
					this.isWorkshopStartDateIsEmpty[i] = false
				}
			},
			setOtherActivitiesToNull () {
				console.log(this.getOtherActivity, 'this.getOtherActivity')
				for (var i = 0; i < this.getOtherActivity.length; i++) {
					this.otherActivitiesPickDateChecked[i] = false
					this.otherActivities.startDate[i] = ''
					this.otherActivities.endDate[i] = ''
					this.otherActivities.time[i] = 'Sat Jan 12 2019 08:00:00'
					this.otherActivities.actType[i] = this.getOtherActivity[i].actType
					this.selectOtherActivityLocation[i] = ''
					this.newOtherActivityLocation[i] = ''
					this.otherActivities.location[i] = ''
					this.otherActivities.details[i] = ''
					this.isOtherActivityStartDateIsEmpty[i] = false
					this.isOtherActivityTimeIsEmpty[i] = false
				}
			},
			generateAutomatedSched () {

			},
			getLocation (key) {
				return this.$lodash.filter(this.locationTemplates, t => {
					return t['.key'] === key
				})[0]
			},
			onChangeOrientLocation (newVal) {
				try {
					this.orientation.location = this.getLocation(newVal).location
					this.orientation.details = this.getLocation(newVal).details
				} catch {}
			},
			onChangePhotoLocation (newVal) {
				try {
					this.photoshoot.location = this.getLocation(newVal).location
					this.photoshoot.details = this.getLocation(newVal).details
				} catch {}
			},
			onChangePhotolikingStartDate (newVal) {
				// console.log('new val', newVal)
				var endDate = date.addToDate(new Date(newVal), {days: this.getPhotolikingActivity.duration})
				var dif = date.getDateDiff(new Date(this.photolikingMaxDate), endDate)
				// console.log('dif', dif)
				if (dif <= 0) {
					var duration = this.getPhotolikingActivity.duration + dif
					this.photoliking.endDate = date.addToDate(new Date(newVal), {days: duration})
				} else {
					this.photoliking.endDate = date.addToDate(new Date(newVal), {days: this.getPhotolikingActivity.duration})
				}
				// console.log('photoliking', this.photoliking.endDate)
				this.$forceUpdate()
			},
			onChangeWorkshopLocation (index) {
				try {
					for (var i = index; i < this.numberOfWorkshops; i++) {
						this.selectWorkshopLocation[i] = this.selectWorkshopLocation[index]
						this.workshops.location[i] = this.getLocation(this.selectWorkshopLocation[index]).location
						this.workshops.details[i] = this.getLocation(this.selectWorkshopLocation[index]).details
					}
					this.workshops.location[index] = this.getLocation(this.selectWorkshopLocation[index]).location
					this.workshops.details[index] = this.getLocation(this.selectWorkshopLocation[index]).details
				} catch {}
			},
			onChangeOtherActivityLocation (i) {
				try {
					this.otherActivities.location[i] = this.getLocation(this.selectOtherActivityLocation[i]).location
					this.otherActivities.details[i] = this.getLocation(this.selectOtherActivityLocation[i]).details
				} catch {}
			},
			onChangeOtherActivityDateRange (act, i) {
				if (act.actType === 'date range') {
					// console.log('act', act, i)
					// console.log('otherActivities', this.otherActivities)
					var endDate = date.addToDate(new Date(this.otherActivities.startDate[i]), {days: act.duration})
					var dif = date.getDateDiff(new Date(this.otherActivityMaxEndDate(act, i)), endDate)
					if (dif <= 0) {
						var duration = act.duration + dif
						this.otherActivities.endDate[i] = date.addToDate(new Date(this.otherActivities.startDate[i]), {days: duration})
					} else {
						this.otherActivities.endDate[i] = date.addToDate(new Date(this.otherActivities.startDate[i]), {days: act.duration})
					}	
				}
			},
			onChangeFinalEventLocation (newVal) {
				try {
					this.finalEvent.location = this.getLocation(newVal).location
					this.finalEvent.details = this.getLocation(newVal).details
				} catch {}
			},
			paymentsMinDate (i) {
				if (i > 0) {
					return date.addToDate(new Date(this.payments.startDate[i-1]), {days: 1})
				} else {
					return date.addToDate(new Date(this.seasonStart), {days: 1})
				}
			},
			workshopsMinDate (i) {
				if (i > 0) {
					return date.addToDate(new Date(this.workshops.startDate[i-1]), {days: 1})
				} else {
					return date.addToDate(new Date(this.payments.startDate[1]), {days: 1})
				}
			},
			isFirstWorkshopIsNull (i) {
				if (i > 0 && this.workshops.startDate[i-1] === null) {
					return true
				} else {
					return false
				}
			},
			clearOtherActivitySelectLocation (i) {
				this.selectOtherActivityLocation[i] = ''
				this.$forceUpdate()
			},
			clearWorkshopSelectLocation (i) {
				this.selectWorkshopLocation[i] = ''
				this.$forceUpdate()
			},
			removeTime (date) {
				let newDate = new Date(date)
				newDate.setHours(0, 0, 0, 0)
				return newDate
			},
			setTime (date, time) {
				var getHours = new Date(time).getHours()
				var getMin = new Date(time).getMinutes()
				let newDate = new Date(date)
				newDate.setHours(getHours, getMin, 0, 0)
				return newDate
			},
			orientationToPreview () {
				this.orientation.startDate = this.setTime(this.orientation.startDate, this.orientation.time)
				this.orientation.endDate = this.setTime(this.orientation.startDate, this.orientation.time)
				this.orientation.title = 'Batch(1)_Orientation'
				this.orientation.locationID = this.selectOrientationLocation
				// console.log('orientation', this.orientation)
				this.plottedActivities.push(this.orientation)
			},
			paymentsToPreview () {
				// console.log('getOtherActivity', this.payments)
				// console.log('getOtherActivity', this.paymentsAmount)				
				for (var i = 0; i < this.numberOfPayments; i++) {
					let payments = {
						startDate: this.removeTime(this.payments.startDate[i]),
						endDate: this.removeTime(this.payments.startDate[i]),
						time: '',
						location: '',
						details: '',
						eventKey: this.eventKey,
						id: `${this.eventCode}(${this.seasonNumber})_batch(1)_payment(${i+1})`,
						title: `Batch(1)_Payment(${i+1})`,
						type: 'payments',
						actType: 'detailed',
						classes: this.classes,
						amount: this.paymentsAmount[i]
					}
					this.plottedActivities.push(payments)
				}
			},
			photoshootToPreview () {
				if (this.hasPhotoshoot) {
					this.photoshoot.startDate = this.setTime(this.photoshoot.startDate, this.photoshoot.time)
					this.photoshoot.endDate = this.setTime(this.photoshoot.startDate, this.photoshoot.time)
					this.photoshoot.id = `${this.eventCode}(${this.seasonNumber})_batch(1)_${this.getPhotoshootActivity.value}`
					this.photoshoot.title = `Batch(1)_${this.getPhotoshootActivity.label}`
					this.photoshoot.locationID = this.selectPhotoshootLocation
					this.plottedActivities.push(this.photoshoot)
				}
			},
			photolikingToPreview () {
				if (this.hasPhotoliking) {
					// console.log('photoliking', this.photoliking)
					this.photoliking.startDate = this.removeTime(this.photoliking.startDate)
					this.photoliking.endDate = this.removeTime(this.photoliking.endDate)
					this.photoliking.id = `${this.eventCode}(${this.seasonNumber})_batch(1)_${this.getPhotolikingActivity.value}`
					this.photoliking.title = `Batch(1)_${this.getPhotolikingActivity.label}`
					this.plottedActivities.push(this.photoliking)	
				}
			},
			workshopsToPreview () {
				if (this.hasWorkshops) {
					for (var i = 0; i < this.numberOfWorkshops; i++) {
						let workshops = {
							startDate: this.setTime(this.workshops.startDate[i], this.workshops.time[i]),
							endDate: this.setTime(this.workshops.startDate[i], this.workshops.time[i]),
							time: this.workshops.time[i],
							location: this.workshops.location[i],
							details: this.workshops.details[i],
							eventKey: this.eventKey,
							id: `${this.eventCode}(${this.seasonNumber})_batch(1)_${this.getWorkshopActivity.value}(${i+1})`,
							title: `Batch(1)_Workshop(${i+1})`,
							type: 'workshops',
							actType: this.getWorkshopActivity.actType,
							locationID: this.selectWorkshopLocation[i],
							classes: this.classes
						}
						this.plottedActivities.push(workshops)
					}
				}
			},
			otherActivitiesToPreview () {
				for (var i = 0; i < this.getOtherActivity.length; i++) {
					if (this.getOtherActivity[i].actType === 'detailed') {
						let otherActivity = {
							startDate: this.setTime(this.otherActivities.startDate[i], this.otherActivities.time[i]),
							endDate: this.setTime(this.otherActivities.startDate[i], this.otherActivities.time[i]),
							time: this.otherActivities.time[i],
							location: this.otherActivities.location[i],
							details: this.otherActivities.details[i],
							eventKey: this.eventKey,
							id: `${this.eventCode}(${this.seasonNumber})_batch(1)_${this.getOtherActivity[i].value}`,
							title: `Batch(1)_${this.getOtherActivity[i].label}`,
							type: this.getOtherActivity[i].value,
							actType: this.getOtherActivity[i].actType,
							locationID: this.selectOtherActivityLocation[i],
							classes: this.classes
						}
						this.plottedActivities.push(otherActivity)
					} else {
						let otherActivity = {
							startDate: this.removeTime(this.otherActivities.startDate[i]),
							endDate: this.removeTime(this.otherActivities.endDate[i]),
							time: this.otherActivities.time[i],
							location: this.otherActivities.location[i],
							details: this.otherActivities.details[i],
							eventKey: this.eventKey,
							id: `${this.eventCode}(${this.seasonNumber})_batch(1)_${this.getOtherActivity[i].value}`,
							title: `Batch(1)_${this.getOtherActivity[i].label}`,
							type: this.getOtherActivity[i].value,
							actType: this.getOtherActivity[i].actType,
							locationID: this.selectOtherActivityLocation[i],
							classes: this.classes
						}
						this.plottedActivities.push(otherActivity)
					}
				}
			},
			finalEventToPreview () {
				this.finalEvent.startDate = this.setTime(this.finalEvent.startDate, this.finalEvent.time)
				this.finalEvent.endDate = this.setTime(this.finalEvent.startDate, this.finalEvent.time)
				this.finalEvent.title = 'Batch(1)_Final Event'
				this.finalEvent.locationID = this.selectFinalEventLocation
				// console.log('finalEvent', this.finalEvent)
				this.plottedActivities.push(this.finalEvent)
			},
			toPreview: async function () {
				this.$v.$touch()
				this.isStartDateIsEmpty()
				let paymentsStartDateIsEmpty = this.$lodash.some(this.isPaymentsStartDateEmpty, Boolean)
				let photoshootStartDateIsEmpty = this.hasPhotoshoot ? !this.$v.photoshoot.startDate.required : false
				let photolikingStartDateIsEmpty = this.hasPhotoliking ? !this.$v.photoliking.startDate.required : false
				let photolikingEndDateIsEmpty = this.hasPhotoliking ? !this.$v.photoliking.endDate.required : false
				let workshopsStartDateIsEmpty = this.hasWorkshops ? this.$lodash.some(this.isWorkshopStartDateIsEmpty, Boolean) : false
				let otherActivityStartDateIsEmpty = this.$lodash.some(this.isOtherActivityStartDateIsEmpty, Boolean)
				let otherActivityTimeIsEmpty = this.$lodash.some(this.isOtherActivityTimeIsEmpty, Boolean)

				// console.log(this.photoshoot, 'photoshoot', photoshootStartDateIsEmpty)
				// console.log(this.$v, 'v')


				let promise = new Promise(resolve => {
					if (paymentsStartDateIsEmpty || photoshootStartDateIsEmpty || photolikingStartDateIsEmpty || photolikingEndDateIsEmpty || workshopsStartDateIsEmpty || otherActivityStartDateIsEmpty || otherActivityTimeIsEmpty) {
						this.$q.notify('Please review fields')
						resolve(false)
					} else {
						console.log(this.$v, 'v')
						this.plottedActivities = []
						this.orientationToPreview()
						this.paymentsToPreview()
						this.photoshootToPreview()
						this.photolikingToPreview()
						this.workshopsToPreview()
						this.otherActivitiesToPreview()
						this.finalEventToPreview()
						resolve(true)
						// console.log('plotted', this.plottedActivities)	
					}
				})
				this.$forceUpdate()
				let result = await promise
				return result
			},
			getDatesOfWeek (seasonStart, seasonEnd, daysofweek) {	
				// getting the days start here
				function daysInMonth(month,year) {
			    return new Date(year, month, 0).getDate()
				}

				var mon = new Array()
				var tue = new Array()
				var wed = new Array()
				var thu = new Array()
				var fri = new Array()
				var sat = new Array()
				var sun = new Array()
				var ctr = 1

				let startDate = new Date(seasonStart)

				do {
					// console.log('startDate', startDate)
					var getTot = daysInMonth(startDate.getMonth(),startDate.getFullYear())


					// console.log('getTot', getTot)
					for (var i = 0; i < getTot ; i++) {
				    var newDate = new Date(startDate.getFullYear(), startDate.getMonth(), i)
				    // console.log(newDate, 'newDate')
				    switch (newDate.getDay()) {
				    	case 0:
				    		var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)

								// console.log('convertToDate', convertToDate)
					    	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
					    	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		sun.push(convertToDate.toString())
						  	}
						    break
						  case 1:
						    var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)
					    	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
					    	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		mon.push(convertToDate.toString())
						  	}
						    break
						  case 2:
						    var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)
					    	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
					    	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		tue.push(convertToDate.toString())
						  	}
						    break
						  case 3:
						    var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)
					    	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
					    	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)

					    	// console.log('dif in wed', dif2, convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		wed.push(convertToDate.toString())
						  	}
						    break
						  case 4:
						    var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)
					    	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
					    	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		thu.push(convertToDate.toString())
						  	}
						    break
						  case 5:
						    var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)
					    	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
					    	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		fri.push(convertToDate.toString())
						  	}
						    break
						  case 6:
						    var tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
						    var convertToDate = new Date(tempDate)
					    	convertToDate.setDate(i)
						  	var dif = this.$mathMixin.dayDiff(new Date(seasonStart), convertToDate)
						  	var dif2 = this.$mathMixin.dayDiff(new Date(seasonEnd), convertToDate)
						  	if (dif > 0 && dif2 < 0) {
						  		sat.push(convertToDate.toString())	
						  	}
								break
							default:
								console.log('an error occur')
								break
				    }
					}

					// console.log(startDate, 'startDate')
					// let tempDate = this.$store.getters['startUp/getPlainValue'](startDate)
					// let momentDate = this.$moment(tempDate)

					startDate.setDate(1)
					startDate.setMonth(startDate.getMonth()+1)

					// var tempStartDate = this.$moment(startDate)
					// let firstMonth = tempStartDate.clone().add(1, 'month').startOf('month')
					// console.log(startDate, 'startDate')
					// startDate = new Date(firstMonth)
					

					ctr++
				} while (ctr <= 5)

				// console.log('mon', mon)
				// console.log('tue', tue)
				// console.log('wed', wed)
				// console.log('thu', thu)
				// console.log('fri', fri)
				// console.log('sat', sat)
				// console.log('sun', sun)

				// console.log('what is new start date', this.seasonStart)
				// var daysOfWeek = 'monday'
				switch (daysofweek) {
		    	case 'monday':
				    return mon
				  case 'tuesday':
				    return tue
				  case 'wednesday':
				  	return wed
				  case 'thursday':
				    return thu
				  case 'friday':
				    return fri
				  case 'saturday':
				    return sat
				  case 'sunday':
				   	return sun 
					default:
						console.log('an error occur in returning value')
						break
		    }
			},
			saveImportSeason () {
				this.$q.dialog({
					title: 'Confirm Save',
					message: 'Do you want to save ?',
					ok: 'Yes',
					cancel: 'Cancel'
				}).then(() => {
					this.importLoadingState = true
					this.finalizeSeason()
				}).catch(() => {})
			},
			clearFields () {
				this.$store.state.schedules.seasonTemplate = {}
				this.$store.state.schedules.seasonInfo = {}
			},
			finalizeSeason () {
				// this.$v.
				console.log(this.$v)
				let seasonTemplate = this.$store.state.schedules.seasonTemplate
				let seasonInfo = this.$store.state.schedules.seasonInfo[0]
				let otherActivities = this.$store.getters['startUp/getPlainValue'](this.getOtherActivity)
				console.log(otherActivities, 'otherActivities')
				// console.log(this.eventName, 'event code')
				
				// console.log(seasonTemplate, 'seasonTemplate')
			

				// let numberOfBatches = this.$lodash.maxBy(seasonTemplate, b => {
				// 	if (b.Batch) {
				// 		let tes = this.$store.getters['startUp/extractNumber'](b.Batch)
				// 		return tes[0]
				// 	}
				// })
				// let lastBatchNumber = this.$store.getters['startUp/extractNumber'](numberOfBatches.Batch)
			
				// console.log(firstBatchTemplate.Orientation, 'firstBatchTemplate')

			
				let batches = []
				let courseActivities = this.$store.getters['startUp/getPlainValue'](this.getCourse.activities)
				console.log(seasonTemplate, 'seasonTemplate')

				for (var x = 0; x < seasonTemplate.length; x++) {
					let template = seasonTemplate[x]
					let batch = {
						activities: []
					}
					let activities = []
					for (var i = 0; i < courseActivities.length; i++) {
						if (courseActivities[i].value === 'payments' || courseActivities[i].value === 'payment') {
							for (var j = 0; j < seasonInfo.numberOfPayment; j++) {
								let activity = {
									amount: this.paymentsAmount[j],
									actType: courseActivities[i].actType,
									classes: seasonInfo.colorCode,
									details: '',
									endDate: template[`Payment ${j+1}`],
									eventKey: this.eventKey,
									id: `${this.getEventCode}(${seasonInfo.seasonNumber})_batch(${x+1})_payment(${j+1})`,
									location: '',
									locationID: '',
									startDate: template[`Payment ${j+1}`],
									time: '',
									title: `Batch(${x+1})_Payment(${j+1})`,
									type: 'payments',
								}
								activities.push(activity)
								
							}
						} else if (courseActivities[i].value === 'workshop' || courseActivities[i].value === 'workshops') {
							for (var j = 0; j < seasonInfo.numberOfWorkshops; j++) {
								let activity = {
									actType: courseActivities[i].actType,
									classes: seasonInfo.colorCode,
									details: this[`${courseActivities[i].value}`].details ? this[`${courseActivities[i].value}`].details[j] : '',
									endDate: template[`Workshop ${j+1}`],
									eventKey: this.eventKey,
									id: `${this.getEventCode}(${seasonInfo.seasonNumber})_batch(${x+1})_workshop(${j+1})`,
									location: this[`${courseActivities[i].value}`].location ? this[`${courseActivities[i].value}`].location[j] : '',
									locationID: this[`select${courseActivities[i].label}Location`] ? this[`select${courseActivities[i].label}Location`][j] : '',
									startDate: template[`Workshop ${j+1}`],
									time: this[`${courseActivities[i].value}`].time[j].toString(),
									title: `Batch(${x+1})_Workshop(${j+1})`,
									type: 'workshops',
								}
								activities.push(activity)
							
							}
						} else {
							if (this.isOtherActivity(courseActivities[i].value)) {
								
								// for (var k = 0; k < otherActivities.length; k++) {
									
									if (courseActivities[i].actType === 'detailed') {
										// console.log(otherActivities[k], 'act type')
										// console.log(courseActivities[i].actType, 'act type')
										let activity = {
											actType: courseActivities[i].actType,
											classes: seasonInfo.colorCode,
											details: this.getOtherActivityDetails(courseActivities[i].value),
											endDate: template[`${courseActivities[i].label}`],
											eventKey: this.eventKey,
											id: `${this.getEventCode}(${seasonInfo.seasonNumber})_batch(${x+1})_${courseActivities[i].value}`,
											location: this.getOtherActivityLocation(courseActivities[i].value),
											locationID: this.getOtherActivityLocationID(courseActivities[i].value),
											startDate: template[`${courseActivities[i].label}`],
											time: this.getOtherActivityTime(courseActivities[i].value),
											title: `Batch(${x+1})_${courseActivities[i].label}`,
											type: courseActivities[i].value,
										}
										activities.push(activity)
										// console.log(activity, 'template')
										// console.log(template, 'template aray in others 2')
										// console.log(template[`${courseActivities[i].label}`], 'template in others 1')
										// console.log(courseActivities[i].label, 'act in others 1')
									} else {
										let activity = {
											actType: courseActivities[i].actType,
											classes: seasonInfo.colorCode,
											details: '',
											endDate: template[`${courseActivities[i].label} End`],
											eventKey: this.eventKey,
											id: `${this.getEventCode}(${seasonInfo.seasonNumber})_batch(${x+1})_${courseActivities[i].value}`,
											location: '',
											locationID: '',
											startDate: template[`${courseActivities[i].label} Start`],
											time: '',
											title: `Batch(${x+1})_${courseActivities[i].label}`,
											type: courseActivities[i].value,
										}
										activities.push(activity)
										// console.log(activity, 'activty')
										// console.log(template, 'template aray in others 2')
										// console.log(`template[${courseActivities[i].label} End]`, 'template in others 2')
										// console.log(courseActivities[i].label, 'act in others 2')
									}
								// }
							} else {
								if (courseActivities[i].actType === 'detailed') {	
									let activity = {
										actType: courseActivities[i].actType,
										classes: seasonInfo.colorCode,
										details: this[`${this.$lodash.camelCase(courseActivities[i].value)}`] ? this[`${this.$lodash.camelCase(courseActivities[i].value)}`].details : '',
										endDate: template[`${courseActivities[i].label}`],
										eventKey: this.eventKey,
										id: `${this.getEventCode}(${seasonInfo.seasonNumber})_batch(${x+1})_${courseActivities[i].value}`,
										location: this[`${this.$lodash.camelCase(courseActivities[i].value)}`] ? this[`${this.$lodash.camelCase(courseActivities[i].value)}`].location : '',
										locationID: this[`select${this.$store.getters['startUp/removeWhiteSpace'](courseActivities[i].label)}Location`] ? this[`select${this.$store.getters['startUp/removeWhiteSpace'](courseActivities[i].label)}Location`] : '',
										startDate: template[`${courseActivities[i].label}`],
										time: this[`${this.$lodash.camelCase(courseActivities[i].value)}`] ? this[`${this.$lodash.camelCase(courseActivities[i].value)}`].time : '',
										title: `Batch(${x+1})_${courseActivities[i].label}`,
										type: courseActivities[i].value,
									}
									
									activities.push(activity)
								} else {
									let activity = {
										actType: courseActivities[i].actType,
										classes: seasonInfo.colorCode,
										details: '',
										endDate: template[`${courseActivities[i].label} End`],
										eventKey: this.eventKey,
										id: `${this.getEventCode}(${seasonInfo.seasonNumber})_batch(${x+1})_${courseActivities[i].value}`,
										location: '',
										locationID: '',
										startDate: template[`${courseActivities[i].label} Start`],
										time: '',
										title: `Batch(${x+1})_${courseActivities[i].label}`,
										type: courseActivities[i].value,
									}
									activities.push(activity)
								}
							}
						}
					}
				console.log(activities, 'activities')
					batch.activities = activities
					batch.batchNumber = x+1
					batch.batchStart = this.getBatchStart(x, seasonTemplate)
					batch.colorCode = seasonInfo.colorCode
					batch.course = seasonInfo.course
					batch.dateCreated = new Date().toString()
					batch.discount = seasonInfo.discount
					batch.eventCode = this.getEventCode
					batch.eventKey = this.eventKey
					batch.eventName = this.event[0].eventName
					batch.installment = seasonInfo.installmentAmount
					batch.numberOfPayments = seasonInfo.numberOfPayment
					batch.numberOfWorkshops = seasonInfo.numberOfWorkshops
					batch.seasonEnd = this.getSeasonEnd(seasonTemplate.length, seasonTemplate)
					batch.seasonName = `${this.getEventCode}_${seasonInfo.seasonNumber}`
					batch.seasonNumber = seasonInfo.seasonNumber
					batch.seasonStart = this.getSeasonStart(seasonTemplate)
					batch.status = 'standby'
					batch.ticketCount = seasonInfo.ticketCount
					batch.ticketPrice = seasonInfo.ticketPrice
					batch.totalAmount = seasonInfo.totalAmount
					console.log(batch, 'batch')
					batches.push(batch)
				}
				
				let season = {
					colorCode: seasonInfo.colorCode,
					course: seasonInfo.course,
					discount: seasonInfo.discount,
					eventKey: this.eventKey,
					eventName: this.event[0].eventName,
					numberOfPayments: seasonInfo.numberOfPayment,
					numberOfWorkshops: seasonInfo.numberOfWorkshops,
					seasonName: `${this.getEventCode}_${seasonInfo.seasonNumber}`,
					seasonEnd: this.getSeasonEnd(seasonTemplate.length, seasonTemplate),
					seasonStart: this.getSeasonStart(seasonTemplate),
					seasonNumber: seasonInfo.seasonNumber,
					status: 'standby',
					ticketCount: seasonInfo.ticketCount,
					ticketPrice: seasonInfo.ticketPrice,
					totalAmount: seasonInfo.totalAmount
				}
				console.log(batches, 'batches')
				console.log(seasonTemplate[0], 'seasonTemplate final')
				this.$store.dispatch('schedules/generateSeason', {batches: batches, season: season, event: this.event[0]})
					.then(res => {
						if (res) {
							console.log(res, 'done saving routing page to batch list')
							this.clearFields()
							this.importLoadingState = false
							this.$store.state.schedules.uploadNewSeasonBatchesModal = false
							this.$router.push(`/eventseason/${res.eventKey}/${res.seasonNumber}/seasonBatches`)
							
						} else {
							this.importLoadingState = false
						}
					})
					.catch(err => {
						this.importLoadingState = false
						console.log('an error occur', err)
					})
				
			},
			getOtherActivityDetails (actName) {
				let i = this.$lodash.findIndex(this.getOtherActivity, a => {
					return a.value === actName
				})
				if (i != -1) {
					return this.otherActivities.details[i]
				}
				return ''
			},
			getOtherActivityLocation (actName) {
				let i = this.$lodash.findIndex(this.getOtherActivity, a => {
					return a.value === actName
				})
				if (i != -1) {
					return this.otherActivities.location[i]
				}
				return ''
				
			},
			getOtherActivityLocationID (actName) {
				let i = this.$lodash.findIndex(this.getOtherActivity, a => {
					return a.value === actName
				})
				if (i != -1) {
					return this.selectOtherActivityLocation[i] ? this.selectOtherActivityLocation[i] : ''
				}
				return ''
				
			},
			getOtherActivityTime (actName) {
				let i = this.$lodash.findIndex(this.getOtherActivity, a => {
					return a.value === actName
				})
				if (i != -1) {
					return this.otherActivities.time[i]
				}
				return ''
				
			},
			isOtherActivity (actValue) {
				return actValue != 'payments' && actValue != 'payment' && actValue != 'orientation' && actValue != 'photoshoots' && actValue != 'photoshoot' && actValue != 'photoliking' && actValue != 'workshop' && actValue != 'workshops' && actValue != 'final event'
			},
			getBatchStart (batchNumber, template) {
				let batch = template[batchNumber]
				return batch.Orientation
				// return ''
			},
			getSeasonStart (template) {
				let temp = this.$store.getters['startUp/getPlainValue'](template)
				let firstBatch = this.$lodash.head(temp)
				return firstBatch.Orientation
			},
			getSeasonEnd (lastBatchNumber, template) {
				// console.log(template, 'template')
				let lastBatch = template[lastBatchNumber-1]
				// console.log(lastBatch, 'lastbatch')
				return lastBatch['Final Event']
			},
			test () {
				// this.$bindAsArray('course2', this.$database.ref('settings/courses').orderByKey().equalTo(this.courseKey), null, () => {
					
				// 	console.log(this.getOtherActivity, 'getOtherActivity')
				// })
				// let lastBatch = this.$lodash.tail(this.$store.state.schedules.seasonTemplate)
				// console.log(this.$store.state.schedules.seasonTemplate, 'lastbatch')

				
				this.setPaymentsAmount()
				
			},
		} // end of methods
	}
</script>
<style>
span.total {
  position: absolute;
  right: 500px;
  width: 200px;
} 
</style>