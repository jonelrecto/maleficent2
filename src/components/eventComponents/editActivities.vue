<template>
	<div class="flex row inline wrap justify-center">
		<!-- orientation -->
		  <q-btn label="test" @click="test" />
		<q-card inline class="col-md-3 q-ma-sm" style="width: 300px;">
			<q-card-title>
				<p class="q-title text-weight-bold">Orientation</p>
			</q-card-title>
			<q-card-main>
				<q-field
					orientation="vertical"
					label-width="2"
					icon="date_range"
				>
					<div>
						<q-datetime disable format="ddd MMM D, YYYY" readonly v-model="lastBatchOrientation.startDate" type="date" stack-label="Date" />
						<q-datetime format="h:mm A" v-model="lastBatchOrientation.time" type="time" stack-label="Time"/>	
					</div>
				</q-field>

			</q-card-main>
			<q-card-separator inset />
			<q-card-main>
				<q-field
					icon="description"
				>	
					<div v-if="lastBatchOrientation.locationID === 'new location'" class="q-my-md flex row" >
						<q-input class="col-md-8" v-model="newOrientNameLocation" float-label="Name" />
						<div class="q-mt-md">
							<q-btn-group rounded>
								<q-btn size="sm" color="positive" label="Save" @click="saveOrientLocation()"/>
								<q-btn size="sm" color="negative" label="Cancel" @click="cancelNewOrientLocation()"/>
							</q-btn-group>	
						</div>
					</div>
					<q-select
						v-else
						separator
						@input="onChangeOrientLocation"
						v-model="lastBatchOrientation.locationID"
						float-label="Select Location"
						filter
						:options="locationTemplateOpt"
					/>
					<q-input
						:readonly="lastBatchOrientation.locationID === ''"
						v-model="lastBatchOrientation.location"
						type="textarea"
						float-label="Location"	
						:max-height="80"
						rows="5"
					/>
					<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
					<q-input
						:readonly="lastBatchOrientation.locationID === ''"
						v-model="lastBatchOrientation.details"
						type="textarea"
						float-label="Details (optional)"
						:max-height="80"
						rows="5"
					/>
				</q-field>
			</q-card-main>
		</q-card>

		<!-- payment -->
		<q-card inline class="col-md-3" height="300px">
			<q-card-title>
				<p class="q-title text-weight-bold">Payment</p>
			</q-card-title>
			<q-card-main>
				<q-field label-width="2" orientation="vertical" icon="attach_money" class="q-my-md" label="Payment Amount" error-label="Please check Total Amount">
					<!-- <p class="caption"><b>Season Rate:</b> P {{ totalAmount }}</p> -->
				<div>
					<div class="q-ma-md row wrap justify-center">
						<div v-for="(n, i) in getLastBatch.numberOfPayments" :key="n" class="row inline flex">
							<div>
									<div>
										<!-- <q-select
											:readonly="!changePaymentActivity"
											@input="onChangePayment"
											v-if="!paymentsPickDateChecked[i]"
											v-model="lastBatchPayments[i].startDate" 
											:stack-label="`Payment ${i+1} Date`" 
											filter 
											:options="paymentsOpt(i)"
										/> -->
										<q-datetime
											disable
											:min="paymentsMinDate(i)"
											:max="paymentsMaxDate"
											format="ddd MMM D, YYYY" 
											stack-label="Date" 
											v-model="lastBatchPayments[i].startDate" 
											type="date" 
										/>
									</div>

									<q-checkbox
										v-if="changePaymentActivity"
										v-model="paymentsPickDateChecked[i]"
										checked-icon="calendar_today"
										unchecked-icon="calendar_today"
									/>
									<q-input 
										readonly 
										hide-underline 
										prefix="P " 
										stack-label="Amount" 
										type="number"
										v-model="lastBatchPayments[i].amount" 
									/>
								</div>

							<!-- :stack-label="`Payment ${i+1} - (${paymentDateFormat(payments.startDate[i])} )`" -->
							<!-- <p class="q-caption">{{ $moment(payments.startDate[index]).format('ll') }}</p> -->
						</div>
					</div>
				</div>

					
					<q-item-separator />
					<!-- <span v-if="missingAmount < 0" class="text-weight-bold " >Missing Amount: {{ Math.abs(missingAmount) | currency}}</span><br/>
					<span class="text-weight-bold" >Total: {{ getTotal | currency}}</span> -->
				</q-field>
			</q-card-main>
		</q-card>

    <!-- photoshoot -->
    
		<q-card v-if="hasPhotoshoot" inline class="col-md-3 q-ma-sm" style="width: 300px">
			<q-card-title>
				<p class="q-title text-weight-bold">Photoshoot
					<!-- <q-checkbox
						v-model="changePaymentActivity"
						label="Edit"
						checked-icon="edit"
						unchecked-icon="edit"
					/> -->
				</p>
			</q-card-title>
			<q-card-main>
				<q-field
					orientation="vertical"
					label-width="2"
					icon="date_range"
				>
					<div class="row">
						<div class="col">
							<!-- <q-select
								v-if="!photoshootPickDateChecked && !getPhotoshootActivity.datePick"
								v-model="lastBatchPhotoshoot.startDate"
								stack-label="Select Date" 
								filter 
								:options="photoshootOpt"
							/> -->
							<q-datetime
								disable
								:min="photoshootMinDate"
								:max="photoshootMaxDate"
								format="ddd MMM D, YYYY" 
								v-model="lastBatchPhotoshoot.startDate" 
								type="date" 
								stack-label="Date" 
							/>
						</div>
						<!-- <q-checkbox
							v-if="!getPhotoshootActivity.datePick"
							@input=""
							v-model="photoshootPickDateChecked"
							checked-icon="calendar_today"
							unchecked-icon="calendar_today"
							class="col-2"
						/> -->
					</div>
						<q-datetime 
							format="h:mm A" 
							v-model="lastBatchPhotoshoot.time" 
							type="time" 
							stack-label="Time"
						/>
				</q-field>

			</q-card-main>
			<q-card-separator inset />
			<q-card-main>
				<q-field
					icon="description"
				>	
					<div  v-if="lastBatchPhotoshoot.locationID === 'new location'" class="q-my-md flex row" >
						<q-input class="col-md-8" v-model="newPhotoshootNameLocation" float-label="Name" />
						<div class="q-mt-md">
							<q-btn-group rounded>
								<q-btn size="sm" color="positive" label="Save" @click="savePhotoshootLocation()"/>
								<q-btn size="sm" color="negative" label="Cancel" @click="cancelNewPhotoshootLocation()"/>
							</q-btn-group>	
						</div>
					</div>
					<q-select
						v-else
						@input="onChangePhotoLocation"
						v-model="lastBatchPhotoshoot.locationID"
						float-label="Select Location"
						filter
						:options="locationTemplateOpt"
					/>
					<q-input
						:readonly="lastBatchPhotoshoot.locationID === ''"
						v-model="lastBatchPhotoshoot.location"
						type="textarea"
						float-label="Location"	
						:max-height="80"
						rows="5"
					/>
					<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
					<q-input
						:readonly="lastBatchPhotoshoot.locationID === ''"
						v-model="lastBatchPhotoshoot.details"
						type="textarea"
						float-label="Details"
						:max-height="80"
						rows="5"
					/>
				</q-field>
			</q-card-main>
		</q-card>

		<!-- photoliking -->

		<q-card v-if="hasPhotoliking" inline class="col-md-3" style="width: 300px">
			<q-card-title>
				<p class="q-title text-weight-bold">Photoliking</p>
			</q-card-title>
			<q-card-main>
				<q-field
					orientation="vertical"
					label-width="2"
					icon="date_range"
				>
					<div class="row">
						<div class="col">
							<!-- <q-select
								v-if="!photolikingPickDateChecked && !getPhotolikingActivity.datePick"
								@input="onChangePhotolikingStartDate"
								v-model="lastBatchPhotoliking.startDate"
								stack-label="Start Date" 
								filter
								:options="photolikingOpt"
							/> -->
							<q-datetime 
								disable
								:min="photolikingMinDate" 
								:max="photolikingMaxDate"
								format="ddd MMM D, YYYY" 
								@input="onChangePhotolikingStartDate"
								v-model="lastBatchPhotoliking.startDate" 
								type="date" 
								stack-label="Start Date" 
							/>
						</div>
						<!-- <q-checkbox
							v-if="!getPhotolikingActivity.datePick"
							@input=""
							v-model="photolikingPickDateChecked"
							checked-icon="calendar_today"
							unchecked-icon="calendar_today"
							class="col-2"
						/> -->
					</div>

					<div>
						<q-datetime 
							:min="photolikingMinEndDate"
							:max="photolikindMaxEndDate"
							format="ddd MMM D, YYYY" 
							v-model="lastBatchPhotoliking.endDate" 
							type="date" 
							stack-label="End Date" 
						/>
					</div>
				</q-field>
			</q-card-main>
		</q-card>


		<!-- workshop -->
		<q-card v-if="hasWorkshops" inline class="col-md-12 q-ma-sm" style="width: 950px">
			<q-card-title>
				<p class="q-title text-weight-bold">Workshops
					<!-- <q-checkbox
						v-if="hasWorkshops"
						v-model="changeWorkshopActivity"
						label="Edit"
						checked-icon="edit"
						unchecked-icon="edit"
					/> -->
				</p>
				
			</q-card-title>
			<q-card-main>
				<div class="row wrap justify-center">
					<div v-for="(workshop, i) in getLastBatch.numberOfWorkshops" :key="i" class="q-ma-md col-md-2">
							<q-field :label="'Workshop ' + (i+1)" label-width="3" orientation="vertical">
								<div class="row" >
									<div class="col">
										<!-- <q-select 
											v-if="!getWorkshopActivity.datePick && !workshopPickDateChecked[i]"
											:disable="isFirstWorkshopIsNull(i)" 
											v-model="lastBatchWorkshops[i].startDate"
											stack-label="Select Date" 
											filter 
											:options="workshopOpt(i)"
										/> -->
										<!-- :disable="isFirstWorkshopIsNull(i)"  -->
										<q-datetime 
											disable
											:min="workshopsMinDate(i)" 
											:max="workshopsMaxDate" 
											format="ddd MMM D, YYYY" 
											stack-label="Date" 
											v-model="lastBatchWorkshops[i].startDate" 
											type="date" 
										/>
									</div>

									<!-- <q-checkbox
										@input="lastBatchWorkshops[i].startDate = ''"
										v-model="workshopPickDateChecked[i]"
										:disable="isFirstWorkshopIsNull(i)" 
										checked-icon="calendar_today"
										unchecked-icon="calendar_today"
										class="col-1 q-mt-md"
									/> -->
								</div>

								<q-datetime format="h:mm A" stack-label="Time" v-model="lastBatchWorkshops[i].time" type="time" />

								<q-item-separator/>
								<div  v-if="lastBatchWorkshops[i].locationID === 'new location'" class="q-my-md flex row" >
									<q-input class="col-md-8" v-model="newWorkshopNameLocation[i]" float-label="Name" />
									<div class="q-mt-md">
										<q-btn-group rounded>
											<q-btn size="sm" color="positive" label="Save" @click="saveWorkshopLocation(i)"/>
											<q-btn size="sm" color="negative" label="Cancel" @click="cancelNewWorkshopSelectLocation(i)"/>
										</q-btn-group>	
									</div>
								</div>
								
								<q-select
									v-else
									@input="onChangeWorkshopLocation(i)"
									v-model="lastBatchWorkshops[i].locationID"
									float-label="Select Location"
									filter
									:options="locationTemplateOpt"
								/>

								<q-input
									:readonly="selectWorkshopLocation[i] === ''"
									v-model="lastBatchWorkshops[i].location"
									type="textarea"
									float-label="Location"
									:max-height="50"
									rows="4"
								/>
								<q-input
									:readonly="selectWorkshopLocation[i] === ''"
									v-model="lastBatchWorkshops[i].details"
									type="textarea"
									float-label="Description"
									:max-height="50"
									rows="4"
								/>
							</q-field>
					</div>
				</div>
				
			</q-card-main>
		</q-card>

     <!-- other activity -->
		<div v-for="(act, i) in getOtherActivity" :key="i">
			<q-card inline class="q-ma-sm" style="width: 350px">

	      <q-card-title>
	      	<p class="q-title text-weight-bold">{{act.label}}</p>
	      </q-card-title>

	      <q-card-main>
	        <q-field
	        	label-width="2"
		        icon="date_range"
		      >
		      	<div v-if="act.actType === 'detailed'">
		      		<div class="row">
		      			<div class="col">
		      				<!-- <q-select 
					      		v-if="act.datePick === false && !otherActivitiesPickDateChecked[i]" 
					      		v-model="lastBatchOtherActivity[i].startDate" 
					      		stack-label="Select Date" 
					      		filter 
					      		:options="otherActivityOpt(act, i)" 
				      		/> -->

				      		<q-datetime 
				      			disable
				      			:min="otherActivityMinStartDate(act, i)"
				      			:max="otherActivityMaxStartDate(act, i)"
					      		stack-label="Date" 
					      		format="ddd MMM D, YYYY" 
					      		v-model="lastBatchOtherActivity[i].startDate" 
					      		type="date" 
				      		/>
		      			</div>
		      			
		      			<!-- <q-checkbox
	      					@input="lastBatchOtherActivity[i].startDate = ''"
					        v-model="otherActivitiesPickDateChecked[i]"
					        checked-icon="calendar_today"
					        unchecked-icon="calendar_today"
					        class="col-1 q-mt-md"
					      /> -->
		      		</div>

		      		<q-datetime 
			      		stack-label="Time" 
			      		format="h:mm A" 
			      		v-model="lastBatchOtherActivity[i].time" 
			      		type="time" 
		      		/>	
		      	</div>
		      	
		      	<div v-else>
		      		<div class="row">
		      			<div class="col">
		      				<!-- <q-select 
					      		v-if="act.datePick === false && !otherActivitiesPickDateChecked[i]"
					      		v-model="lastBatchOtherActivity[i].startDate" 
					      		stack-label="Select Date" 
					      		filter 
					      		:options="otherActivityOpt(act)" 
					      		@input="onChangeOtherActivityDateRange(act, i)"
				      		/> -->

				      		<q-datetime 
				      			disable
					      		:min="otherActivityMinStartDate(act, i)"
					      		:max="otherActivityMaxStartDate(act, i)"
					      		stack-label="Start Date" 
					      		format="ddd MMM D, YYYY"  
					      		@input="onChangeOtherActivityDateRange(act, i)"
					      		v-model="lastBatchOtherActivity[i].startDate" 
					      		type="date" 
				      		/>
		      			</div>
			      		<!-- <q-checkbox
	      					@input="lastBatchOtherActivity[i].startDate = '', lastBatchOtherActivity[i].endDate = ''"
					        v-model="otherActivitiesPickDateChecked[i]"
					        checked-icon="calendar_today"
					        unchecked-icon="calendar_today"
					        class="col-1 q-mt-md"
					      /> -->
		      		</div>
		      		
		      		<q-datetime 
		      			:disable="isOtherActivityDateEndNull(act, i)"
		      			:min="otherActivityMinEndDate(act, i)"
		      			:max="otherActivityMaxEndDate(act, i)"
			      		stack-label="End Date" 
			      		format="ddd MMM D, YYYY" 
			      		v-model="lastBatchOtherActivity[i].endDate" 
			      		type="date" 
		      		/>

		      	</div>
		      </q-field>
	      </q-card-main>
	      <q-card-separator inset />
	      <q-card-main v-if="act.actType === 'detailed'">
	        <q-field
		        icon="description"
		      >	
		      	<div  v-if="getOtherActivities[i].locationID === 'new location'" class="q-my-md flex row" >
		      		<q-input class="col-md-8" v-model="newOtherActivityLocation[i]" float-label="Name" />
		      		<div class="q-mt-md">
		      			<q-btn-group rounded>
								  <q-btn size="sm" color="positive" label="Save" @click="saveOtherActivityLocation(i)"/>
								  <q-btn size="sm" color="negative" label="Cancel" @click="cancelNewOtherActivitySelectLocation(i)"/>
								</q-btn-group>	
		      		</div>
		      	</div>
						<q-select
							v-else
							separator
							@input="onChangeOtherActivityLocation(i)"
				      v-model="lastBatchOtherActivity[i].locationID"
				      float-label="Select Location"
				      filter
				      :options="locationTemplateOpt"
				    />
		      	<q-input
		      		:readonly="getOtherActivities[i].locationID === ''"
						  v-model="lastBatchOtherActivity[i].location"
						  type="textarea"
						  float-label="Location"	
						  :max-height="80"
						  rows="5"
						/>
		      	<q-input
		      		:readonly="getOtherActivities[i].locationID === ''"
						  v-model="getOtherActivities[i].details"
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

export default {
	props: {
		eventKey: {
			type: String,
			default: ''
		},
		eventCode: {
			type: String,
			default: ''
		},
		seasonNumber: {
			type: Number,
			default: 0,
		},
		seasonEnd: {
			type: String,
			default: ''
		},
		lastBatchCourse: {
			type: String,
			default: ''
		},
		newBatchOrientationDate: {
			type: String,
			default: ''
		},
		batchKey: {
			type: String,
			default: ''
		},
		numberOfPayments: {
			type: Number,
			default: 1
		},
		numberOfWorkshops: {
			type: Number,
			default: 1
		}
	},
	created () {
		console.log('test')
		
		let vm = this
		vm = this.generateEventBatches()
		// this.bus.$on('reset', this.reset)
		// this.generateSchedules()
		// this.setTempLastBatchActivities ()
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules').orderByKey().equalTo(this.batchKey), null, () => {
			this.$bindAsArray('course', this.$database.ref('settings/courses').orderByKey().equalTo(this.lastBatchCourse), null, () => {
				this.$bindAsArray('locationTemplates', this.$database.ref('locationTemplates'), null, () => {
					
				})								
			})
		})
	},
	watch: {
		batchKey: {
			handler () {
				// console.log('is change', this.batchKey)
				this.$bindAsArray('schedules', this.$database.ref('event_schedules').orderByKey().equalTo(this.batchKey), null, () =>{ 
					this.$forceUpdate()
				})
				
			},
			deep: true
		}
	},
	computed: {
		isFirstBatch () {
			// console.log(this.schedules, 'schedules')
			if (this.schedules[0].batchNumber === 1) {
				return true
			}
			return false	
		},
		getCourse () {
			// return this.$lodash.filter(this.courses, c => {
			// 	return c['.key'] === this.courseKey
			// })[0]
			return this.course[0]
		},
		plottedActivities: {
			get () {
				return this.$store.state.schedules.plottedActivities
			},
			set (v) {
				this.$store.state.schedules.plottedActivities = v
			}
		},
		getOtherActivity () {
			try {
				let toreturn = this.$lodash.filter(this.getCourse.activities, function(o) {
					return o.value != 'payments' && o.value != 'orientation' && o.value != 'photoshoots' && o.value != 'photoshoot' && o.value != 'photoliking' && o.value != 'workshop' && o.value != 'workshops' && o.value != 'final event'
				})
				console.log(toreturn, 'toret')
				return toreturn
			} catch (err) {
				return [
					{
						label:''
					}
				]
			}
			
		},
		photolikingOpt () {
			// let  = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'photoshoot' || a.value === 'photoshoots'})[0]
			// console.log('photoshootDayOfWeek', photoshootDayOfWeek)
			if (this.getPhotolikingActivity.datePick === false) {
				let dates = this.$store.getters['schedules/getDatesOfWeek']({
					seasonStart: this.lastBatchOrientation.startDate,
					seasonEnd: this.seasonEnd, 
					daysofweek: this.getPhotolikingActivity.dayOfWeek
				})
				// console.log('dates', dates)
				var count = 0
				for (var i = 0; i < dates.length; i++) {
					var dif = date.getDateDiff(dates[i], this.lastBatchPayments[1].startDate)
					// console.log('dif payment', dif, this.payments.startDate[index-1])
					if (dif <= 0) {
						count++
					}
				}
				let filterDates = this.$lodash.dropRight(this.$lodash.drop(dates, count))
				return this.$lodash.map(filterDates, d => {
					d = new Date(d)
					d.setHours(0,0,0,0)
					return { label: this.$store.getters['schedules/formatDate'](d), value: d.toString()}
				})
			} else {
				return []
			}
		},
		photoshootOpt () {
			let photoshootDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'photoshoot' || a.value === 'photoshoots'})[0]
			// console.log('photoshootDayOfWeek', photoshootDayOfWeek)
			if (photoshootDayOfWeek.datePick === false) {
				let dates = this.$store.getters['schedules/getDatesOfWeek']({
					seasonStart: this.lastBatchOrientation.startDate,
					seasonEnd: this.seasonEnd, 
					daysofweek: photoshootDayOfWeek.dayOfWeek
				})
				// console.log('dates', dates)
				var count = 0
				for (var i = 0; i < dates.length; i++) {
					var dif = date.getDateDiff(dates[i], this.lastBatchPayments[0].startDate)
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
		isOnChangeOrientLocation () {
			if (this.lastBatchOrientation.locationID === 'new location') {
				return true
			} else {
				return false
			}
		},
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
		photolikindMaxEndDate () {
			return date.subtractFromDate(new Date(this.seasonEnd), {month: 1})
		},
		photolikingMinEndDate () {
			return date.addToDate(new Date(this.lastBatchPhotoliking.startDate), {days: 1})
		},
		photolikingMinDate () {
			return date.addToDate(new Date(this.lastBatchPayments[1].startDate), {days: 1})
		},
		photolikingMaxDate () {
			return date.subtractFromDate(new Date(this.seasonEnd), {days: 14})
		},
		photoshootMaxDate () {
			return date.subtractFromDate(new Date(this.seasonEnd), {days: 14})
		},
		photoshootMinDate () {
			return date.addToDate(new Date(this.lastBatchPayments[0].startDate), {days: 1})
		},
		paymentsMaxDate () {
			return date.subtractFromDate(new Date(this.seasonEnd), {days: 14})
		},
		workshopsMaxDate () {
			return date.subtractFromDate(new Date(this.seasonEnd), {days: 7})
		},
		hasWorkshops () {
			return this.$lodash.some(this.lastBatchActivities, {type: 'workshops'})
		},
		hasPhotoliking () {
			return this.$lodash.some(this.lastBatchActivities, {type: 'photoliking'})
		},
		hasPhotoshoot () {
			return this.$lodash.some(this.lastBatchActivities, {type: 'photoshoot' || 'photoshoots'})
		},
		lastBatchFinalEvent () {
			return this.$lodash.find(this.lastBatchActivities, a => {
				return a.type === 'final event'
			})
		},
		lastBatchOtherActivity () {
			// if (this.hasWorkshops) {
				let otherActivities = this.$lodash.filter(this.lastBatchActivities, o => {
					return o.type != 'payments' && o.type != 'orientation' && o.type != 'photoshoots' && o.type != 'photoshoot' && o.type != 'photoliking' && o.type != 'workshop' && o.type != 'workshops' && o.type != 'final event'
				})
				for (let o of otherActivities) {
					if (o.actType === 'detailed') {
						o.startDate = this.$store.getters['schedules/removeTime'](o.startDate).toString()
					}
				}
				// console.log(otherActivities, 'otherActivities')
				return otherActivities
			// } else {
			// 	return {}
			// }
		},
		lastBatchWorkshops () {
			if (this.hasWorkshops) {
				let workshops = this.$lodash.filter(this.lastBatchActivities, a => {
					return a.type === 'workshop' || a.type  === 'workshops'
				})
				for(let w of workshops) {
					// let wDates = new Date(w.startDate)
					// wDates.setHours(0, 0, 0, 0)
					w.startDate = this.$store.getters['schedules/removeTime'](w.startDate).toString()
				}
				return workshops
			} else {
				return {}
			}
		},
		lastBatchPhotoliking () {
			if (this.hasPhotoliking) {
				return this.$lodash.find(this.lastBatchActivities, a => {
					return a.type === 'photoliking'
				})
			} else {
				return {}
			}
		},
		lastBatchPhotoshoot () {
			if (this.hasPhotoshoot) {
				return this.$lodash.find(this.lastBatchActivities, a => {
					return a.type === 'photoshoot' || a.type  === 'photoshoots'
				})
			} else {
				return {}
			}
		},
		lastBatchPayments () {
			let temp = this.$lodash.filter(this.lastBatchActivities, a => {
				return a.type === 'payments' || a.type  === 'payment'
			})
			console.log(temp, 'lastbatchpaymetnds')
			if (temp) {
				return temp
			}
			let tempPayments = [
				{
					startDate: ''
				}
			]
			return tempPayments
			// return this.$lodash.filter(this.lastBatchActivities, a => {
			// 	return a.type === 'payments' || a.type  === 'payment'
			// })
			// return temp
		},
		lastBatchOrientation () {
			let temp = this.$lodash.filter(this.lastBatchActivities, a => {
				return a.type === 'orientation'
			})[0]
			if (temp) {
				return temp
			}
			temp = {
				startDate: ''
			}
			console.log(temp, 'temp')
			return temp
		},
		lastBatchActivities () {
			try {
				return this.schedules[0].activities
			} catch (err) {}
			
		},
		getLastBatch () {
			let lastBatch = this.$lodash.maxBy(this.getSeasonBatches, b => {
				return b.batchNumber
			})
			if (lastBatch) {
				return lastBatch
			}
			console.log(lastBatch, 'lastbatch')
			// return this.$store.getters['startUp/getPlainValue'](lastBatch)
			return {
				numberOfPayments: 1
			}
		},
		getSeasonBatches () {
			try {
				let batches = this.$lodash.filter(this.schedules, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === this.seasonNumber
				})
				// console.log('batches', batches)
				return batches
			} catch (err) {
				return []
			}
		},
		getWorkshopActivity () {
			return this.$lodash.filter(this.getCourse.activities, a => {
				return a.value === 'workshops' || a.value === 'workshop'
			})[0]
		},
		getOtherActivities () {
			try {
				let otherAct = this.$lodash.filter(this.getSeasonBatches[0].activities, function(o) {
					return o.type != 'payments' && o.type != 'orientation' && o.type != 'photoshoots' && o.type != 'photoshoot' && o.type != 'photoliking' && o.type != 'workshop' && o.type != 'workshops' && o.type != 'final event'
				})
				console.log(otherAct, 'otheract')
				return otherAct
			} catch (err) {
				return [
					{
						startDate: '',
						endDate: '',
						time: '',
						location: '',
						details: '',
						eventKey: '',
						id: '',
						title: '',
						type: '',
						actType: '',
						classes: ''
					}
				]
			}
			
		},
		getOtherActivitiesDetailed () {
			return this.$lodash.filter(this.getOtherActivities, a => {
				return a.actType === 'detailed'
			})
		},
		generateNewBatchPossibleDates () {
			let lastBatchOrientStartDate = this.getLastBatch.activities[0]
			let lastBatchActivities = this.getLastBatch.activities
			let sun = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: lastBatchOrientStartDate.startDate, seasonEnd: this.seasonEnd, daysofweek: 'sunday'})
			let sat = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: lastBatchOrientStartDate.startDate, seasonEnd: this.seasonEnd, daysofweek: 'saturday'})

			// console.log('sun', sun)
			// console.log('sat', sat)
			let possibleDates = this.$lodash.orderBy(sun.concat(sat), d => { return new Date(d) })

			// console.log('possibleDates', possibleDates)
			// console.log('lastBatchActivities', lastBatchActivities)

			var tempDates = possibleDates
			for (var i = 0; i < this.getOtherActivitiesDetailed.length; i++) {
				for (var j = 0; j < possibleDates.length; j++) {
					let date1 = new Date(possibleDates[j])
					let date2 = new Date(this.getOtherActivitiesDetailed[i].startDate)
					date1.setHours(0,0,0,0)
					date2.setHours(0,0,0,0)
					if ( date.isSameDate(new Date(date1), new Date(date2) ) ) {
						// console.log(date.isSameDate(new Date(possibleDates[j]), new Date(lastBatchActivities[i].startDate)))
						// console.log('i', i)
						// console.log('j', j)
						tempDates.splice(j, 1)
					}
				}
			}

			return this.$lodash.map(tempDates, d => {
				return { label: this.$store.getters['schedules/formatDate'](d), value: d}
			})
		},
		getPhotoshootActivity () {
			return this.$lodash.filter(this.getCourse.activities, a => {
				return a.value === 'photoshoot' || a.value === 'photoshoots'
			})[0]
		},
		getPhotolikingActivity () {
			return this.$lodash.filter(this.getCourse.activities, a => {
				return a.value === 'photoliking'
			})[0]
		},
		getCourse () {
			// return this.$lodash.filter(this.courses, c => {
			// 	return c['.key'] === this.courseKey
			// })[0]
			return this.course[0]
		},
		newBatchNumber () {
			return ++this.getLastBatch.batchNumber
		},
		isChangeWorkshopActivity () {
			if (this.changeWorkshopActivity) {
				this.generateWorkshopActivity()
			}
		}
	},
	data () {
		return {
			orientation: {
				startDate: '',
				endDate: '',
				time: 'Sat Jan 12 2019 08:00:00',
				location: '',
				details: '',
				eventKey: '',
				id: ``,
				title: `Orientation`,
				actType: 'detailed',
				type: 'orientation',
				classes: ''
			},
			paymentsAmount: [],
			payments: [
				{
					startDate: '',
					endDate: '',
					eventKey: '',
					id: '',
					title: '',
					actType: '',
					type: '',
					classes: '',
					amount: ''
				}
			],
			photoshoot: {
				startDate: '',
				endDate: '',
				time: "Sat Jan 12 2019 08:00:00",
				location: '',
				details: '',
				eventKey: '',
				id: ``,
				title: '',
				actType: 'detailed',
				type: 'photoshoot',
				classes: ''
			},
			photoliking: {
				startDate: '',
				endDate: '',
				time: '',
				location: '',
				details: '',
				eventKey: '',
				id: '',
				title: '',
				type: 'photoliking',
				actType: 'date range',
				classes: ''
			},
			workshops: [
				{
					startDate: '',
					endDate: '',
					time: '',
					location: '',
					details: '',
					eventKey: '',
					id: '',
					title: '',
					actType: '',
					type: '',
					classes: ''
				}
			],
			otherActivities: [
				{
					startDate: '',
					endDate: '',
					time: '',
					location: '',
					details: '',
					eventKey: '',
					id: '',
					title: '',
					type: '',
					actType: '',
					classes: ''
				}
			],
			startDate: '',
			locationTemplates: [],
			schedules: [],
			course: [],
			newOtherActivityLocation: [],
			otherActivitiesPickDateChecked: [],
			photolikingPickDateChecked: false,
			photoshootPickDateChecked: false,
			paymentsPickDateChecked: [],
			newPhotoshootNameLocation: '',
			newOrientNameLocation: '',
			newWorkshopNameLocation: [],
			selectPhotoshootLocation: '',
			selectWorkshopLocation: [],
			workshopPickDateChecked: [],
			changePaymentActivity: false,
			changeWorkshopActivity: false,
			showDate: new Date(),
			showEventTimes: true,
			enableDragDrop: true,
			startingDayOfWeek: 0,
			tempLastBatchActivities: {}
		}
	},
	methods: {
		generateEventBatches () {
			this.orientation = this.lastBatchOrientation
			console.log(this.orientation, 'orientation')
			console.log(this.getOtherActivity, 'getOtherActivity')
		},
		onChangeFirstWorkshopDate (index) {
			if (index < 1) {
				console.log(index, 'index')
				// let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, this.getWorkshopActivity.dayOfWeek)
				let datesStartDate = this.workshops.startDate[0] ? this.workshops.startDate[0] : this.photoshoot.startDate

				let dates = this.$store.getters['schedules/getDatesOfWeek']({seasonStart: datesStartDate, seasonEnd: this.seasonEnd, daysofweek: this.getWorkshopActivity.dayOfWeek})
				console.log(dates, 'dates')

				if (this.numberOfWorkshops > 1) {
					for (var i = 0; i < this.numberOfWorkshops; i++) {
						if (typeof dates[i] !== 'undefined') {
							this.workshops.startDate[i+1] = dates[i]	
						}				
					}	
				}
				console.log(this.workshops, 'workshops')				
			}
		},
		reset () {
			console.log('reset')
			this.$bindAsArray('schedules', this.$database.ref('event_schedules').orderByKey().equalTo(this.batchKey))
			this.$forceUpdate()
		},
		proceedToPreview () {
			this.orientationToPreview()
			this.paymentsToPreview()
			this.photoshootToPreview()
			this.photolikingToPreview()
			this.workshopsToPreview()
			this.otherActivitiesToPreview()
			this.finalEventToPreview()
		},
		orientationToPreview () {
			this.lastBatchOrientation.startDate = new Date(this.$store.getters['schedules/setTime']({date: this.lastBatchOrientation.startDate, time: this.lastBatchOrientation.time}))
			this.lastBatchOrientation.endDate = new Date(this.$store.getters['schedules/setTime']({date: this.lastBatchOrientation.startDate, time: this.lastBatchOrientation.time}))
			// console.log('eventCode', this.eventCode)
			// console.log('getLastBatch', this.getLastBatch)

			var eventCode = this.eventCode
			var seasonNumber = this.getLastBatch.seasonNumber
			var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)
			var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
				return a.value === 'orientation'
			})

			// console.log('getCourse', this.getCourse)
			this.lastBatchOrientation.id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}`
			this.lastBatchOrientation.title = `Batch(${batchNumber})_${activityProperty.label}`
			// console.log('lastBatchOrientation', this.lastBatchOrientation)
			this.plottedActivities.push(this.lastBatchOrientation)
		},
		paymentsToPreview () {
				// console.log('getOtherActivity', this.payments)
				// console.log('getOtherActivity', this.paymentsAmount)

			var eventCode = this.eventCode
			var seasonNumber = this.getLastBatch.seasonNumber
			var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)
			var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
				return a.value === 'payments' || a.value === 'payment'
			})

			// console.log('getLastBatch', this.getLastBatch)

			// console.log('lastBatchPayments', this.lastBatchPayments)
			var count = 0
			for (var i = 0; i < this.getLastBatch.numberOfPayments; i++) {
				// console.log('lastBatchPayments', this.lastBatchPayments[i])
				this.lastBatchPayments[i].startDate = this.$store.getters['schedules/removeTime'](this.lastBatchPayments[i].startDate)
				this.lastBatchPayments[i].endDate = this.$store.getters['schedules/removeTime'](this.lastBatchPayments[i].startDate)
				this.lastBatchPayments[i].id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}(${++count})`
				this.lastBatchPayments[i].title = `Batch(${batchNumber})_${activityProperty.label}(${count})`

				this.plottedActivities.push(this.lastBatchPayments[i])
			}
			// console.log('plottedActivities', this.plottedActivities)
		},
		photoshootToPreview () {
			if (this.hasPhotoshoot) {
				var eventCode = this.eventCode
				var seasonNumber = this.getLastBatch.seasonNumber
				var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)
				var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
					return a.value === 'photoshoot' || a.value === 'photoshoots'
				})

				this.lastBatchPhotoshoot.startDate = this.$store.getters['schedules/setTime2']({date:this.lastBatchPhotoshoot.startDate, time: this.lastBatchPhotoshoot.time })

				this.lastBatchPhotoshoot.endDate = this.$store.getters['schedules/setTime2']({date:this.lastBatchPhotoshoot.startDate, time: this.lastBatchPhotoshoot.time })

				this.lastBatchPhotoshoot.id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}`
				this.lastBatchPhotoshoot.title = `Batch(${batchNumber})_${activityProperty.label}`
				this.plottedActivities.push(this.lastBatchPhotoshoot)
				// console.log('plottedActivities', this.plottedActivities)
			}
		},
		photolikingToPreview () {
			if (this.hasPhotoliking) {
				var eventCode = this.eventCode
				var seasonNumber = this.getLastBatch.seasonNumber
				var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)
				var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
					return a.value === 'photoliking'
				})

				this.lastBatchPhotoliking.startDate = this.$store.getters['schedules/removeTime'](this.lastBatchPhotoliking.startDate)
				this.lastBatchPhotoliking.endDate = this.$store.getters['schedules/removeTime'](this.lastBatchPhotoliking.endDate)
				this.lastBatchPhotoliking.id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}`
				this.lastBatchPhotoliking.title = `Batch(${batchNumber})_${activityProperty.label}`
				this.plottedActivities.push(this.lastBatchPhotoliking)	
			}
		},
		workshopsToPreview () {
			function setTime (getDate, getTime) {
				var getHours = new Date(getTime).getHours()
				var getMin = new Date(getTime).getMinutes()
				let toReturnDate = new Date(getDate)
				toReturnDate.setHours(getHours, getMin, 0, 0)
				return toReturnDate

			}

			var tempWorkshops = this.$store.getters['startUp/getPlainValue'](this.lastBatchWorkshops)

			if (this.hasWorkshops) {
				var eventCode = this.eventCode
				var seasonNumber = this.getLastBatch.seasonNumber
				var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)
				var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
					return a.value === 'workshop' || a.value === 'workshops'
				})

				var count = 0
				for (var i = 0; i < this.getLastBatch.numberOfWorkshops; i++) {
					

					tempWorkshops[i].startDate = this.$store.getters['schedules/setTime2']({date: tempWorkshops[i].startDate, time: tempWorkshops[i].time})

					tempWorkshops[i].endDate = setTime(tempWorkshops[i].startDate, tempWorkshops[i].time)

					// tempWorkshops[i].endDate = this.$store.getters['schedules/setTime2']({date: tempWorkshops[i].startDate, time: tempWorkshops[i].time})

					tempWorkshops[i].id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}(${++count})`
					tempWorkshops[i].title = `Batch(${batchNumber})_${activityProperty.label}(${count})`
					this.plottedActivities.push(tempWorkshops[i])	
				}

			}


		},
		otherActivitiesToPreview () {
			var eventCode = this.eventCode
			var seasonNumber = this.getLastBatch.seasonNumber
			var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)

			
			var tempOtherActivities = this.$store.getters['startUp/getPlainValue'](this.lastBatchOtherActivity)
			for (var i = 0; i < this.lastBatchOtherActivity.length; i++) {
				if (tempOtherActivities[i].actType === 'detailed') {
					var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
						return a.value === tempOtherActivities[i].type
					})
				
					tempOtherActivities[i].startDate = this.$store.getters['schedules/setTime2']({date: tempOtherActivities[i].startDate, time: tempOtherActivities[i].time})

					tempOtherActivities[i].endDate = this.$store.getters['schedules/setTime2']({date: tempOtherActivities[i].startDate, time: tempOtherActivities[i].time})

					tempOtherActivities[i].id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}`

					tempOtherActivities[i].title = `Batch(${batchNumber})_${activityProperty.label}`

					this.plottedActivities.push(tempOtherActivities[i])
				} else {

					var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
						return a.value === tempOtherActivities[i].type
					})
				
				
				// console.log('this.getCourse.activities', this.courses)
				// console.log('activityProperty', activityProperty)
				// console.log('lastBatchOtherActivity', tempOtherActivities[i])
					tempOtherActivities[i].startDate = this.$store.getters['schedules/removeTime'](tempOtherActivities[i].startDate)

					tempOtherActivities[i].endDate = this.$store.getters['schedules/removeTime'](tempOtherActivities[i].endDate)

					tempOtherActivities[i].id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}`

					tempOtherActivities[i].title = `Batch(${batchNumber})_${activityProperty.label}`

					this.plottedActivities.push(tempOtherActivities[i])
				}
			}
		},
		finalEventToPreview () {
			var eventCode = this.eventCode
			var seasonNumber = this.getLastBatch.seasonNumber
			var batchNumber = this.$store.getters['startUp/getPlainValue'](this.getLastBatch.batchNumber)
			var activityProperty = this.$lodash.find(this.getCourse.activities, a => {
				return a.value === 'final event'
			})
			this.lastBatchFinalEvent.startDate = new Date(this.lastBatchFinalEvent.startDate)
			this.lastBatchFinalEvent.endDate = new Date(this.lastBatchFinalEvent.endDate)
			this.lastBatchFinalEvent.id = `${eventCode}(${seasonNumber})_batch(${batchNumber})_${activityProperty.value}`
			this.lastBatchFinalEvent.title = `Batch(${batchNumber})_${activityProperty.label}`
			// console.log('lastBatchOrientation', this.lastBatchOrientation)
			this.plottedActivities.push(this.lastBatchFinalEvent)
		},
		cancelNewOtherActivitySelectLocation (i) {
			let tempOtherActivities = this.$lodash.filter(this.tempLastBatchActivities, o => {
					return o.type != 'payments' && o.type != 'orientation' && o.type != 'photoshoots' && o.type != 'photoshoot' && o.type != 'photoliking' && o.type != 'workshop' && o.type != 'workshops' && o.type != 'final event'
				})
			console.log(tempOtherActivities,'tempOtherActivities' )
			this.lastBatchOtherActivity[i].locationID = tempOtherActivities[i].locationID
			console.log(this.lastBatchOtherActivity,'lastBatchOtherActivity' )
			// this.selectOtherActivityLocation[i] = ''
			// this.$forceUpdate()
		},
		saveOtherActivityLocation (i) {
			this.$store.dispatch('schedules/saveNewLocation', {name: this.newOtherActivityLocation[i], location: this.lastBatchOtherActivity[i].location, details: this.lastBatchOtherActivity[i].details})
				.then(snapshot => {
					this.lastBatchOtherActivity[i].locationID = snapshot
					this.newOtherActivityLocation[i] = ''
					this.$forceUpdate()
				})
				.catch(() => {})
		},
		onChangeOtherActivityLocation (i) {
			try {
				this.lastBatchOtherActivity[i].location = this.getLocation(this.lastBatchOtherActivity[i].locationID).location
				this.lastBatchOtherActivity[i].details = this.getLocation(this.lastBatchOtherActivity[i].locationID).details
			} catch {}
		},
		onChangeOtherActivityDateRange (act, i) {
			if (act.actType === 'date range') {
				// console.log('act', act, i)
				// console.log('otherActivities', this.otherActivities)
				var endDate = date.addToDate(new Date(this.lastBatchOtherActivity[i].startDate), {days: act.duration})
				var dif = date.getDateDiff(new Date(this.otherActivityMaxEndDate(act, i)), endDate)
				if (dif <= 0) {
					var duration = act.duration + dif
					this.lastBatchOtherActivity[i].endDate = date.addToDate(new Date(this.lastBatchOtherActivity[i].startDate), {days: duration})
				} else {
					this.lastBatchOtherActivity[i].endDate = date.addToDate(new Date(this.lastBatchOtherActivity[i].startDate), {days: act.duration})
				}	
			}
		},
		otherActivityMaxStartDate (act, i) {
			if (act.actType === 'date range') {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 6})
			} else {
				return date.subtractFromDate(new Date(this.seasonEnd), {days: 6})
			}
		},
		otherActivityMinStartDate (act, i) {
			try {
				if (act.actType === 'date range') {
					// return date.addToDate(new Date(this.payments.startDate[1]), {days: 1})
					return date.addToDate(new Date(this.lastBatchPayments[2].startDate), {days: 1})
				} else {
					return date.addToDate(new Date(this.lastBatchPayments[2].startDate), {days: 1})
				}
			} catch (err) {
				return null
			}
			
		},
		otherActivityMinEndDate (act, i) {
			try {
				if (act.actType === 'date range') {
					return date.addToDate(new Date(this.lastBatchOtherActivity[i].startDate), {days: 1})
				} 
			} catch (err) {
				return null
			}
			
		},
		otherActivityMaxEndDate (act, i) {
			try {
				if (act.actType === 'date range') {
					return date.subtractFromDate(new Date(this.seasonEnd), {days: 1})
				} 
			} catch (err) {

			}
			
		},
		isOtherActivityDateEndNull (act, i) {
			try {
				if (act.actType === 'date range' && this.lastBatchOtherActivity[i].startDate === null) {
					return true
				}
				return false
			} catch (err) {
				return false
			}
			
		},
		getOtherActivityDatesUsed (act, index) {
			if (act.datePick !== false && act.actType !== 'date range')  {
				// console.log('index', index)
				var startDates = []
				var otherActivitiesStartDates = this.$lodash.map(this.lastBatchOtherActivity, o => {
					return o.startDate
				})
				var activityStartDatesArr = otherActivitiesStartDates
				// console.log('activityStartDatesArr', activityStartDatesArr)
				for (var i = 0; i < otherActivitiesStartDates.length; i++) {
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
		onChangePhotolikingStartDate (newVal) {
			// console.log('new val', newVal)
			var endDate = date.addToDate(new Date(newVal), {days: this.getPhotolikingActivity.duration})
			var dif = date.getDateDiff(new Date(this.photolikingMaxDate), endDate)
			// console.log('dif', dif)
			if (dif <= 0) {
				var duration = this.getPhotolikingActivity.duration + dif
				this.lastBatchPhotoliking.endDate = date.addToDate(new Date(newVal), {days: duration})
			} else {
				this.lastBatchPhotoliking.endDate = date.addToDate(new Date(newVal), {days: this.getPhotolikingActivity.duration})
			}
			// console.log('photoliking', this.photoliking.endDate)
			this.$forceUpdate()
		},
		onChangePhotoLocation (newVal) {
			try {
				this.lastBatchPhotoshoot.location = this.getLocation(newVal).location
				this.lastBatchPhotoshoot.details = this.getLocation(newVal).details
			} catch {}
		},
		savePhotoshootLocation () {
			this.$store.dispatch('schedules/saveNewLocation', {name: this.newPhotoshootNameLocation, location: this.lastBatchPhotoshoot.location, details: this.lastBatchPhotoshoot.details})
				.then(snapshot => {
					this.lastBatchPhotoshoot.locationID = snapshot
					this.newPhotoshootNameLocation = ''
				})
				.catch(() => {})
		},
		onChangePayment (newVal) {
			console.log(newVal, 'new val')
		},
		paymentsMinDate (i) {
			if (i > 0) {
				return date.addToDate(new Date(this.lastBatchPayments[i-1].startDate), {days: 1})
			} else {
				return date.addToDate(new Date(this.lastBatchOrientation.startDate), {days: 1})
			}
		},
		paymentsOpt (index) {
			if (index >= 1) {
				let paymentDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'payments' || a.value === 'payment'})[0]
				let dates = this.$store.getters['schedules/getDatesOfWeek']({
					seasonStart: this.lastBatchOrientation.startDate,
					seasonEnd: this.seasonEnd, 
					daysofweek: paymentDayOfWeek.dayOfWeek
				})
				// console.log('dates', dates)
				// console.log('dates', this.payments.startDate)
				var count = 0
				var dLength = dates.length
				// console.log('index', index)
				for (var i = 0; i < dLength; i++) {
					var dif = date.getDateDiff(dates[i], this.lastBatchPayments[index-1].startDate)
					// console.log('dif payment', dif, this.payments.startDate[index-1])
					if (dif <= 0) {
						count++
					}
				}
				let filterDates = this.$lodash.drop(dates, count)
				// console.log('filterDates', filterDates)

				return this.$lodash.map(filterDates, d => {
					d = new Date(d)
					d.setHours(0,0,0,0)
					return { label: this.$store.getters['schedules/formatDate'](d), value: d.toString() }
				})
			} else {
				let paymentDayOfWeek = this.$lodash.filter(this.getCourse.activities, a => { return  a.value === 'payments' || a.value === 'payment'})[0]
				let dates = this.$store.getters['schedules/getDatesOfWeek']({
					seasonStart: this.lastBatchOrientation.startDate,
					seasonEnd: this.seasonEnd, 
					daysofweek: paymentDayOfWeek.dayOfWeek
				})
				// console.log('dates', dates)
				return this.$lodash.map(dates, d => {
					d = new Date(d)
					d.setHours(0,0,0,0)
					return { label: this.$store.getters['schedules/formatDate'](d), value: d.toString()}
				})
			}
		},
		setTempLastBatchActivities () {
			let lastBatch = this.$lodash.maxBy(this.getSeasonBatches, b => {
				return b.batchNumber
			})
			this.tempLastBatchActivities = this.$store.getters['startUp/getPlainValue'](lastBatch.activities)
		},
		cancelNewPhotoshootLocation () {
			let tempPhotoshoot = this.$lodash.find(this.tempLastBatchActivities, a => {
				return a.type === 'photoshoot' || a.type === 'photoshoots'
			})
			// console.log(tempOrientation,'tempOrientation' )
			this.lastBatchPhotoshoot.locationID = tempPhotoshoot.locationID

			// console.log(this.lastBatchOrientation,'lastBatchOrientation' )
		},
		cancelNewOrientLocation () {
			let tempOrientation = this.$lodash.find(this.tempLastBatchActivities, a => {
				return a.type === 'orientation'
			})
			// console.log(tempOrientation,'tempOrientation' )
			this.lastBatchOrientation.locationID = tempOrientation.locationID

			// console.log(this.lastBatchOrientation,'lastBatchOrientation' )
		},
		onChangeOrientLocation (newVal) {
			try {
				// let tempOrientation = this.$lodash.find(this.tempLastBatchActivities, a => {
				// 	return a.type === 'orientation'
				// })
				// console.log(tempOrientation,'tempOrientation' )
				// this.lastBatchOrientation.locationID = tempOrientation.locationID
				this.lastBatchOrientation.location = this.getLocation(newVal).location
				this.lastBatchOrientation.details = this.getLocation(newVal).details
			} catch {}
		},
		saveOrientLocation () {
			// console.log('orientation', this.orientation, this.newOrientNameLocation)
			this.$store.dispatch('schedules/saveNewLocation', {name: this.newOrientNameLocation, location: this.lastBatchOrientation.location, details: this.lastBatchOrientation.details})
				.then(snapshot => {
					this.lastBatchOrientation.locationID = snapshot
					this.newOrientNameLocation = ''
				})
				.catch(() => {})
		},
		getLocation (key) {
			return this.$lodash.filter(this.locationTemplates, t => {
				return t['.key'] === key
			})[0]
		},
		onChangeWorkshopLocation (i) {
			try {
				this.lastBatchWorkshops[i].location = this.getLocation(this.lastBatchWorkshops[i].locationID).location
				this.lastBatchWorkshops[i].details = this.getLocation(this.lastBatchWorkshops[i].locationID).details
			} catch {}
		},
		cancelNewWorkshopSelectLocation (i) {

			let tempWorkshops = this.$lodash.filter(this.tempLastBatchActivities, a => {
				return a.type === 'workshop' || a.type === 'workshops'
			})
			console.log(tempWorkshops,'tempWorkshops' )
			this.lastBatchWorkshops[i].locationID = tempWorkshops[i].locationID



			// this.selectWorkshopLocation[i] = ''
			// this.$forceUpdate()
		},
		saveWorkshopLocation (i) {
			this.$store.dispatch('schedules/saveNewLocation', {name: this.newWorkshopNameLocation[i], location: this.lastBatchWorkshops[i].location, details: this.lastBatchWorkshops[i].details})
				.then(snapshot => {
					this.lastBatchWorkshops[i].locationID = snapshot
					this.newWorkshopNameLocation[i] = ''
					this.$forceUpdate()
				})
				.catch(() => {})
		},
		workshopsMinDate (i) {
			if (i > 0) {
				return date.addToDate(new Date(this.lastBatchWorkshops[i-1].startDate), {days: 1})
			} else {
				var dateData = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoshoot.startDate
				return date.addToDate(new Date(dateData), {days: 1})
			}
		},
		otherActivityOpt (act, index) {
				// console.log('act', act)
				var workshopsStartDates = this.$lodash.map(this.lastBatchWorkshops, w => {
					return w.startDate
				})

				var paymentsStartDates = this.$lodash.map(this.lastBatchPayments, p => {
					return p.startDate
				})

				if (act.datePick === false && act.actType === 'date range')  {

					// let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, act.dayOfWeek)

					let dates = this.$store.getters['schedules/getDatesOfWeek']({
						seasonStart: this.lastBatchOrientation.startDate, 
						seasonEnd: this.seasonEnd, 
						daysofweek: act.dayOfWeek
					})
					var count = 0
					for (var i = 0; i < dates.length; i++) {
						// var dif = date.getDateDiff(new Date(dates[i]), date.subtractFromDate(this.seasonEnd, {days: act.duration}))
						var dif = date.getDateDiff(new Date(dates[i]), this.lastBatchPayments[1].startDate)
						if (dif < 0) {
							count++
						}
						// console.log('dif', dif)
					}
					// console.log('dates', dates)
					// var filterDates = this.$lodash.drop(dates, count)
					// var merge = this.$lodash.union(this.lastbatch.startDate, [this.photoshoot.startDate], [this.photoliking.startDate], this.workshops.startDate)
					


					// console.log(workshopsStartDates, 'workshopsStartDates')
					var merge = this.$lodash.union(paymentsStartDates, [this.lastBatchPhotoshoot.startDate], [this.lastBatchPhotoliking.startDate], workshopsStartDates)
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
					let mapDates = this.$lodash.map(filterDates, d => {
						var toDate = new Date(d)
						toDate.setHours(0, 0, 0, 0)
						return { label: this.$store.getters['schedules/formatDate'](d), value: toDate.toString() }
					})
					// console.log(mapDates, 'mapDates')

					return mapDates
				} else {
					// let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, act.dayOfWeek)


					let dates = this.$store.getters['schedules/getDatesOfWeek']({
						seasonStart: this.lastBatchOrientation.startDate, 
						seasonEnd: this.seasonEnd, 
						daysofweek: act.dayOfWeek
					})

					var count = 0
					var minDateForOtherActivity = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoliking.startDate
					for (var i = 0; i < dates.length; i++) {
						var dif = date.getDateDiff(new Date(dates[i]), minDateForOtherActivity)
						if (dif < 0) {
							count++
						}
					}
					// console.log('payments', this.payments.startDate)
					// console.log('payments', [this.photoshoot.startDate])


					// console.log('workshopsStartDates', workshopsStartDates)

					var merge = this.$lodash.union(paymentsStartDates, [this.lastBatchPhotoshoot.startDate], [this.lastBatchPhotoliking.startDate], workshopsStartDates, this.getOtherActivityDatesUsed(act, index))
					// console.log('merge', merge)
					var filterDates = this.$lodash.drop(dates, count)
					var tempDates = filterDates
					for (var i = 0; i < filterDates.length; i++) {
						for (var j = 0; j < merge.length; j++) {
							var tempFilterDate = new Date(filterDates[i])
							var tempMergeDate = new Date(merge[j])
							tempFilterDate.setHours(0,0,0,0)
							tempMergeDate.setHours(0,0,0,0)

							if (date.isSameDate(tempFilterDate, tempMergeDate)) {
								tempDates.splice(i, 1)
							}
						}
					}
					// console.log('tempDates', tempDates)
					let mapDates = this.$lodash.map(tempDates, d => {
						return { label: this.$store.getters['schedules/formatDate'](d), value: this.$store.getters['schedules/removeTime'](d).toString() }
					})
					// console.log(mapDates, 'mapDates')
					return mapDates
				}
				
			},
		workshopOpt (index) {
			// try {
			// if (this.changeWorkshopActivity) {
				var dataSeasonStart = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoshoot.startDate

				let dates = this.$store.getters['schedules/getDatesOfWeek']({
					seasonStart: dataSeasonStart, 
					seasonEnd: this.seasonEnd, 
					daysofweek: this.getWorkshopActivity.dayOfWeek
				})
				if (index >= 1) {
					var count = 0
					var dLength = dates.length
					for (var i = 0; i < dLength; i++) {
						var dif = date.getDateDiff(dates[i], this.lastBatchWorkshops[index-1].startDate)
						if (dif <= 0) {
							// console.log('dif', dif)
							count++
						}
					}
					var filterDates = this.$lodash.drop(dates, count)
					let mapDates = this.$lodash.map(filterDates, d => {

						return { label: this.$store.getters['schedules/formatDate'](d), value: d }
					})
					// console.log(mapDates, 'mapDates')
					return mapDates
				} else {
					var count = 0
					var dLength = dates.length
					let paymentStartDate = this.lastBatchPayments[2].startDate ? this.lastBatchPayments[2].startDate : this.lastBatchPayments[1].startDate
					for (var i = 0; i < dLength; i++) {
						var dif = date.getDateDiff(dates[i], paymentStartDate)
						if (dif <= 0) {
							count++
						}
					}
					var filterDates = this.$lodash.drop(dates, count)
					// console.log('filsterdates', filterDates)
					var merge = this.$lodash.union(this.lastBatchPhotoshoot.startDate, [this.lastBatchPhotoshoot.startDate], [this.lastBatchPhotoliking.startDate])
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
						return { label: this.$store.getters['schedules/formatDate'](d), value: d }
					})
					// console.log(mapDates, 'mapDates')
					return mapDates
				}
			// } else {
			// 	return []
			// }
			// } catch {}
		
		},
		isFirstWorkshopIsNull (i) {
			if (i > 0 && this.lastBatchWorkshops[i-1].startDate === null) {
				return true
			} else {
				return false
			}
		},
		isConflictPhotoshootWorkshop () {
			let dif = date.getDateDiff(this.lastBatchPhotoshoot.startDate, this.lastBatchWorkshops[0].startDate) 
			// console.log(dif, 'dif')
			if (dif >= 0) {
				this.changeWorkshopActivity = true
			} else {
				this.changeWorkshopActivity = false
			}
		},
		generateOtherActivities () {


			this.$lodash.forEach(this.lastBatchOtherActivity, o => {
				var d = new Date(o.startDate)
				d.setHours(0, 0, 0, 0)
				o.startDate = d.toString()
			})

			console.log('lastBatchOtherActivity', this.lastBatchOtherActivity)
		},
		generateWorkshopActivity () {
			// console.log('lastBatchWorkshops', this.lastBatchWorkshops)
			// console.log('lastBatchPayments', this.lastBatchPayments)
			// check if conflict with other activity dates like photoshoot and payment 3 or 2
			// if (this.isConflictPhotoshootWorkshop === false) {

			// } else {
			// 	this.changeWorkshopActivity = true
			// }
			// check if batch is 4
				// if batch is 4
					// input workshops input dates
				// else
			for (var i = 0; i < this.lastBatchWorkshops.length; i++) {
				var d = new Date(this.lastBatchWorkshops[i].startDate)
				d.setHours(0,0,0,0)
				this.lastBatchWorkshops[i].startDate = d.toString()
				this.selectWorkshopLocation[i] = this.lastBatchWorkshops[i].locationIDs
			}

			this.$lodash.forEach(this.lastBatchWorkshops, w => {
				var d = new Date(w.startDate)
				d.setHours(0,0,0,0)
				w.startDate = d.toString()

			})
			// console.log(this.lastBatchWorkshops, 'lastBatchWorkshops')
		},
		generatePhotolikingActivity () {
			// try {
				if (this.hasPhotoliking) {
					if (this.getPhotolikingActivity.datePick === false) {
						var dataSeasonStart = this.lastBatchPayments[1].startDate ? this.lastBatchPayments[1].startDate : this.lastBatchPhotoshoot.startDate
						// console.log('dataSeasonStart', dataSeasonStart)
						let dates = this.$store.getters['schedules/getDatesOfWeek']({
							seasonStart: dataSeasonStart, 
							seasonEnd: this.seasonEnd, 
							daysofweek: this.getPhotolikingActivity.dayOfWeek
						})
						// console.log('dates', dates)
						// console.log('lastBatchPayments', this.lastBatchPayments)
						if (typeof dates[0] !== 'undefined') {
							var toStringDate = new Date(dates[0])
							toStringDate.setHours(0,0,0,0)
							this.lastBatchPhotoliking.startDate = toStringDate.toString()
							this.lastBatchPhotoliking.endDate = date.addToDate(new Date(dates[0]), { days: this.getPhotolikingActivity.duration })
						} else {
							// unable to add new batch
						}
						// console.log('lastBatchPhotoliking', this.lastBatchPhotoliking)
					}
				}
			// } catch  {() => {}}
		},
		generatePhotoshootActivity () {
			// try {
				// console.log('getPhotoshootActivity', this.getPhotoshootActivity)
				if (this.getPhotoshootActivity.datePick === false) {
					let dates = this.$store.getters['schedules/getDatesOfWeek']({
						seasonStart: this.lastBatchPayments[0].startDate, 
						seasonEnd: this.seasonEnd, 
						daysofweek: this.getPhotoshootActivity.dayOfWeek
					})
					// console.log('dates', dates)
					// for (var i = 0; i < dates.length; i++) {
					// 	var dif = date.getDateDiff(new Date(dates[i]), this.photoshootMinDate)
					// 	// console.log('dif', dif, this.photoshootMinDate)
					// 	if (dif >= 0) {
					// 		this.lastBatchPhotoshoot.startDate = dates[i]
					// 		break
					// 	}
					// }
					var getHours = new Date()
					this.lastBatchPhotoshoot.startDate = this.$store.getters['schedules/setTime']({date: dates[0], time: this.lastBatchPhotoshoot.time})
					this.lastBatchPhotoshoot.endDate = this.$store.getters['schedules/setTime']({date: dates[0], time: this.lastBatchPhotoshoot.time})
					// console.log('lastBatchPayments', this.lastBatchPayments)
					// console.log('photoshoot', this.lastBatchPhotoshoot)
				}
			// } catch {}
		},
		generatePaymentsDate () {
			// console.log('course', this.course)
			let paymentDayOfWeek = this.$lodash.filter(this.course[0].activities, a => { return  a.value === 'payments'})
			let lastBatchOrientStartDate = this.getLastBatch.activities[0]

			// console.log('this.lastBatchOrientation.startDate', this.lastBatchOrientation.startDate)
			// console.log('lastBatchOrientStartDate', lastBatchOrientStartDate)

			let dates = this.$store.getters['schedules/getDatesOfWeek']({
				seasonStart: this.lastBatchOrientation.startDate, 
				seasonEnd: this.seasonEnd, 
				daysofweek: paymentDayOfWeek[0].dayOfWeek
			})
			// console.log('dates', dates)

			// console.log('getLastBatch', this.getLastBatch)
			var paymentStart = 1
			let date0 = new Date(dates[0])
			date0.setHours(0,0,0,0)
			let date2 = new Date(dates[2])
			date2.setHours(0,0,0,0)
			this.lastBatchPayments[0].startDate = date0.toString()
			this.lastBatchPayments[0].endDate = date0.toString()
			if (typeof this.lastBatchPayments[1].startDate !== 'undefined') {
				this.lastBatchPayments[1].startDate = date2.toString()
				this.lastBatchPayments[1].endDate = date2.toString()
				++paymentStart
			}

			for (var i = paymentStart; i < this.lastBatchPayments.length; i++) {
				if (typeof dates[i+1] !== 'undefined') {
					// console.log('dates[i+1]', dates[i])
					let toDate = new Date(dates[i+1])
					toDate.setHours(0,0,0,0)
					this.lastBatchPayments[i].startDate = toDate.toString()
					this.lastBatchPayments[i].endDate = toDate.toString()
				} else {
					return
				}
			}

			// console.log('generate lastBatchPayments', this.lastBatchPayments)
			// this.payments.startDate = testArr
		},
		onChangeNewBatchDate (newVal) {
			// console.log('getSeasonBatches', this.getLastBatch)
			// this.generatePaymentsDate()
		},
		clickDate (e) {
		},
		clickEvent (e) {
		},
		dropOnDate (e, d) {

		},
		setShowDate (d) {
			this.showDate = d
		},
		generateSchedules () {
			// console.log('lastBatchOrientation', this.lastBatchOrientation)
			this.generatePaymentsDate()
			this.generatePhotoshootActivity()
			this.generatePhotolikingActivity()
			this.generateWorkshopActivity()
			this.isConflictPhotoshootWorkshop()
			this.generateOtherActivities()
			// console.log(this.workshopOpt(0), 'workshopOpt')
		},
		test () {
			// console.log(this.otherActivityOpt(this.lastBatchOtherActivity[0], 0), 'otherActivityOpt')
			// console.log(this.schedules, 'schedules')
			// this.workshopsToPreview()
			console.log(this.getOtherActivity, 'getOtherActivity')
			console.log(this.getOtherActivities, 'getOtherActivities')
			// console.log(this.batchKey, 'batchKey')
		}
	}
}
</script>