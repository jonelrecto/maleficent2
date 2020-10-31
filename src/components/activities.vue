<template>
	<div class="flex row wrap justify-center">
		<!-- <q-btn label="test" @click="test" /> -->
		<!-- orientation -->
		<div>
			<q-card inline class="col-md-3 q-ma-sm" >
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
		      		<q-datetime disable format="ddd MMM D, YYYY" readonly v-model="orientation.startDate" type="date" stack-label="Date" />
			      	<q-datetime format="h:mm A" v-model="orientation.time" type="time" stack-label="Time"/>	
		      	</div>
		      </q-field>

	      </q-card-main>
	      <q-card-separator inset />
	      <q-card-main>
	        <q-field
		        icon="description"
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
						  :max-height="80"
						  rows="5"
						/>
						<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
		      	<q-input
		      		:readonly="selectOrientationLocation === ''"
						  v-model="orientation.details"
						  type="textarea"
						  float-label="Details (optional)"
						  :max-height="80"
						  rows="5"
						/>
		      </q-field>
	      </q-card-main>
	    </q-card>
		</div>
		<!-- payment -->
    <div>
    	<q-card inline class="col-md-3 q-ma-sm" style="width: 350px">
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Payment</p>
	      </q-card-title>
	      <q-card-main>
	        <q-field orientation="vertical" icon="attach_money" class="q-my-md" label="Payment Amount" :error="isSameTotal" error-label="Please check Total Amount">
						<p class="caption"><b>Season Rate:</b> P {{ totalAmount }}</p>

						<div>
							<div class="row wrap justify-center">
								<div v-for="(n,i) in numberOfPayments" :key="n" class="row inline flex">
									<div class="row" >
											<div class="col">
												<q-select
													v-if="!paymentsPickDateChecked[i]"
													v-model="payments.startDate[i]"  
													:stack-label="`Payment ${i+1} Date`" 
													@input="onChangePaymentDate(i)"
													filter 
													:options="paymentsOpt(i)"
													:error="isPaymentsStartDateEmpty[i]"
												/>
												<q-datetime
													v-else
													:min="paymentsMinDate(i)"
													:max="paymentsMaxDate"
													format="ddd MMM D, YYYY" 
													stack-label="Date" 
													@input="onChangePaymentDate(i)"
													v-model="payments.startDate[i]" 
													type="date" 
												/>
											</div>

											<q-checkbox
												v-model="paymentsPickDateChecked[i]"
												checked-icon="calendar_today"
												unchecked-icon="calendar_today"
												class="col-2"
											/>
											<q-input class="col-3 q-mb-md" prefix="P " stack-label="Amount" type="number" v-model="paymentsAmount[i]" />
										</div>

							<!-- :stack-label="`Payment ${i+1} - (${paymentDateFormat(payments.startDate[i])} )`" -->
							<!-- <p class="q-caption">{{ $moment(payments.startDate[index]).format('ll') }}</p> -->
								</div>
							</div>
						</div>


						
						<q-item-separator />
						<span v-if="missingAmount < 0" class="text-weight-bold " >Missing Amount: {{ Math.abs(missingAmount) | currency}}</span><br/>
						<span v-if="missingAmount > 0" class="text-weight-bold " >Exceed Amount: {{ Math.abs(missingAmount) | currency}}</span><br/>
						<span class="text-weight-bold" >Total: {{ getTotal | currency}}</span>
					</q-field>
	      </q-card-main>
	    </q-card>
    </div>

    <!-- photoshoot -->
    <div v-if="hasPhotoshoot" class="col-md-3" >
			<q-card inline class="q-ma-sm" style="width: 300px">
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Photoshoot</p>
	      </q-card-title>
	      <q-card-main>
	        <q-field
	        	orientation="vertical"
	        	label-width="2"
		        icon="date_range"
		      >
		      	<div class="row">
		      		<div class="col">
		      			<q-select
		      				v-if="!photoshootPickDateChecked && !getPhotoshootActivity.datePick"
		      				v-model="photoshoot.startDate"
		      				stack-label="Select Date" 
									@input="onChangePhotoshootStartDate"
		      				filter 
		      				:error="!$v.photoshoot.startDate.required"
		      				:options="photoshootOpt"
	      				/>
			      		<q-datetime
			      			v-else
				      		:min="photoshootMinDate"
				      		:max="photoshootMaxDate"
				      		format="ddd MMM D, YYYY" 
									@input="onChangePhotoshootStartDate"
				      		v-model="photoshoot.startDate" 
				      		type="date" 
									:error="!$v.photoshoot.startDate.required"
				      		stack-label="Date" 
			      		/>
		      		</div>
		      		<q-checkbox
		      			v-if="!getPhotoshootActivity.datePick"
				        v-model="photoshootPickDateChecked"
				        checked-icon="calendar_today"
				        unchecked-icon="calendar_today"
				        class="col-2"
				      />
		      	</div>
		      		<q-datetime 
				      	format="h:mm A" 
				      	v-model="photoshoot.time" 
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
						<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
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
		</div>

		<!-- photoliking -->
		<div v-if="hasPhotoliking">
			<q-card inline class="q-ma-sm" style="width: 300px">
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
		      			<q-select
		      				v-if="!photolikingPickDateChecked && !getPhotolikingActivity.datePick"
				      		@input="onChangePhotolikingStartDate"
		      				v-model="photoliking.startDate"
		      				stack-label="Start Date" 
		      				filter
									:error="!$v.photoliking.startDate.required"
		      				:options="photolikingOpt"
	      				/>
			      		<q-datetime 
			      			v-else
				      		:min="photolikingMinDate" 
				      		:max="photolikingMaxDate"
				      		format="ddd MMM D, YYYY" 
				      		@input="onChangePhotolikingStartDate"
				      		v-model="photoliking.startDate" 
				      		type="date" 
				      		stack-label="Start Date" 
			      		/>
		      		</div>
		      		<q-checkbox
		      			v-if="!getPhotolikingActivity.datePick"
				        v-model="photolikingPickDateChecked"
				        checked-icon="calendar_today"
				        unchecked-icon="calendar_today"
				        class="col-2"
				      />
		      	</div>

		      	<div>
		      		<q-datetime 
		      			:min="photolikingMinEndDate"
		      			:max="photolikindMaxEndDate"
			      		format="ddd MMM D, YYYY" 
			      		v-model="photoliking.endDate" 
			      		type="date" 
								:error="!$v.photoliking.endDate.required"
			      		stack-label="End Date" 
		      		/>
		      	</div>
		      </q-field>
	      </q-card-main>
	    </q-card>
		</div>


    <!-- workshop -->
    <!-- <div v-if="hasWorkshops" class="col-md-12"> -->
    	<q-card v-if="hasWorkshops" inline class="col-md-12" >
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Workshops</p>
	      </q-card-title>
	      <q-card-main>
					<div class="row wrap justify-center">
						<div v-for="(workshop, i) in numberOfWorkshops" :key="i" class="q-ma-md col-md-2">
							<q-field class="col" :label="'Workshop ' + (i+1)" label-width="3" orientation="vertical" >
								<div >
									<q-select 
										v-if="!getWorkshopActivity.datePick && !workshopPickDateChecked[i]"
										:disable="isFirstWorkshopIsNull(i)" 
										v-model="workshops.startDate[i]"
										@input="onChangeFirstWorkshopDate(i)"
										stack-label="Select Date" 
										filter
										:error="isWorkshopStartDateIsEmpty[i]"
										:options="workshopOpt(i)"
									/>
									<q-datetime 
										v-else 
										:disable="isFirstWorkshopIsNull(i)" 
										:min="workshopsMinDate(i)" 
										:max="workshopsMaxDate" 
										format="ddd MMM D, YYYY" 
										stack-label="Date" 
										v-model="workshops.startDate[i]" 
										:error="isWorkshopStartDateIsEmpty[i]"
										type="date" 
									/>

								<q-checkbox
									@input="workshops.startDate[i] = ''"
									v-model="workshopPickDateChecked[i]"
									:disable="isFirstWorkshopIsNull(i)" 
									checked-icon="calendar_today"
									unchecked-icon="calendar_today"
									class="col-1 q-mt-md"
								/>

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
								</div>
								
							</q-field>
						</div>
					</div>
					
	      </q-card-main>
	    </q-card>
    <!-- </div> -->


    <!-- other activity -->
		<div v-for="(act, i) in getOtherActivity" :key="i">
			<q-card inline class="q-ma-sm" style="width: 300px">

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
		      				<q-select 
					      		v-if="act.datePick === false && !otherActivitiesPickDateChecked[i]" 
					      		v-model="otherActivities.startDate[i]" 
					      		stack-label="Select Date" 
					      		filter
					      		:error="isOtherActivityStartDateIsEmpty[i]"
					      		:options="otherActivityOpt(act, i)"
				      		/>

				      		<q-datetime 
				      			v-else
				      			:min="otherActivityMinStartDate(act, i)"
				      			:max="otherActivityMaxStartDate(act, i)"
					      		stack-label="Date" 
					      		format="ddd MMM D, YYYY" 
					      		v-model="otherActivities.startDate[i]" 
					      		type="date"
					      		:error="isOtherActivityStartDateIsEmpty[i]"
				      		/>
		      			</div>
		      			
		      			<q-checkbox
	      					@input="otherActivities.startDate[i] = ''"
					        v-model="otherActivitiesPickDateChecked[i]"
					        checked-icon="calendar_today"
					        unchecked-icon="calendar_today"
					        class="col-1 q-mt-md"
					      />
		      		</div>

		      		<q-datetime 
			      		stack-label="Time" 
			      		format="h:mm A" 
			      		v-model="otherActivities.time[i]" 
			      		type="time"
			      		:error="isOtherActivityTimeIsEmpty[i]"
		      		/>	
		      	</div>
		      	
		      	<div v-else>
		      		<div class="row">
		      			<div class="col">
		      				<q-select 
					      		v-if="act.datePick === false && !otherActivitiesPickDateChecked[i]"
					      		v-model="otherActivities.startDate[i]" 
					      		stack-label="Select Date" 
					      		filter 
					      		:options="otherActivityOpt(act)" 
					      		@input="onChangeOtherActivityDateRange(act, i)"
					      		:error="isOtherActivityStartDateIsEmpty[i]"
				      		/>

				      		<q-datetime 
				      			v-else
					      		:min="otherActivityMinStartDate(act, i)"
					      		:max="otherActivityMaxStartDate(act, i)"
					      		stack-label="Start Date" 
					      		format="ddd MMM D, YYYY"  
					      		@input="onChangeOtherActivityDateRange(act, i)"
					      		v-model="otherActivities.startDate[i]" 
					      		:error="isOtherActivityStartDateIsEmpty[i]"
					      		type="date" 
				      		/>
		      			</div>
			      		<q-checkbox
	      					@input="otherActivities.startDate[i] = '', otherActivities.endDate[i] = ''"
					        v-model="otherActivitiesPickDateChecked[i]"
					        checked-icon="calendar_today"
					        unchecked-icon="calendar_today"
					        class="col-1 q-mt-md"
					      />
		      		</div>
		      		
		      		<q-datetime 
		      			:disable="isOtherActivityDateEndNull(act, i)"
		      			:min="otherActivityMinEndDate(act, i)"
		      			:max="otherActivityMaxEndDate(act, i)"
			      		stack-label="End Date" 
			      		format="ddd MMM D, YYYY" 
			      		v-model="otherActivities.endDate[i]" 
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
			<q-card inline class="q-ma-sm" style="width: 300px">
	      <q-card-title>
	      	<p class="q-title text-weight-bold">Final Event</p>
	      </q-card-title>
	      <q-card-main>
	        <q-field
	        	label-width="2"
	        	label="Date"
		        icon="date_range"
		      >
		      	<q-datetime disable format="ddd MMM D, YYYY" v-model="finalEvent.startDate" type="date" />
		      	<q-datetime format="h:mm A" v-model="finalEvent.time" type="time" />
		      </q-field>

	      </q-card-main>
	      <q-card-separator inset />
	      <q-card-main>
	        <q-field
		        icon="description"
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
						<!-- <q-btn flat class="q-mx-md" label="New Location" icon="add" color="info" size="sm" @click=""/> -->
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

const isStartDateIsEmpty = (value, vm) => {
	for (var i = 0; i < value.length; i++) {
		if (value[i] === '' || typeof value[i] === 'undefined')
			return true
	}
	return false
}

	export default {
		props: {
			// seasonName: String,
			seasonStart: {
				type: String,
				default: ''
			},
			seasonEnd: {
				type: String,
				default: ''
			},
			latestSeason: {
				type: Number,
				default: 0
			},
			courseKey: {
				type: String,
				default: ''
			},
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
				default: 1
			},
			classes: {
				type: String,
				default: ''
			},
			totalAmount: {
				type: Number,
				default: 0
			},
			numberOfPayments: {
				type: Number,
				default: 0
			},
			// numberOfWorkshops: {
			// 	type: Number,
			// 	default: 0
			// },
			batchCapacity: {
				type: Number,
				default: 0
			},
			isRestoreAsDraft: {
				type: Boolean,
				default: false
			}
		},
		validations () {
			return {
				photoshoot: {
					startDate: {
						required,
						isStartDateIsEmpty
					}
				},
				photoliking: {
					startDate: {
						required,
						isStartDateIsEmpty
					},
					endDate: {
						required
					}
				},
				workshops: {
					startDate: {
						required,
						isStartDateIsEmpty
					}
				},
				otherActivities: {
					startDate: {
						required,
						isStartDateIsEmpty
					},
					time: {
						required,
						isStartDateIsEmpty
					}
				}
			}
		},
		firebase () {
			return {
				courses: this.$database.ref('settings/courses'), 
				locationTemplates: this.$database.ref('locationTemplates'),
				// event: this.$database.ref('events').orderByKey().equalTo(this.eventKey)
			}
		},
		created () {
			
				console.log('creatd')
			if (this.isRestoreAsDraft) {
				if (this.seasonStart !== this.tempSeasonDraft.seasonStart && this.seasonEnd !== this.tempSeasonDraft.seasonEnd) {
					this.onChangeStartDateOrEndDate()
				}
				if (this.totalAmount !== this.tempSeasonDraft.totalAmount) {
					// console.log('not the same')
					this.setPaymentsAmount()
				}
				// console.log('restore draft')
				return
			}
			this.commitStoreStates()
			this.setPaymentsAmount()
			this.setPaymentsToNull()
				// console.log(this.workshops.startDate[0])
			if (this.hasWorkshops) {
				// console.log('set to nulls')
				if (typeof this.workshops.startDate[0] === 'undefined') {
					this.setWorkshopsToNull()
				}
			}
			if (typeof this.otherActivities.startDate[0] === 'undefined') {
				this.setOtherActivitiesToNull()
			}
			this.generatePaymentsDate()
			if (this.hasPhotoshoot || this.photoshoot.startDate === '') {
				this.generatePhotoshootActivity()	
			}
			if (this.hasPhotoliking || this.photoliking.startDate === '') {	
				this.generatePhotolikingActivity()
			}

			
			// this.generateAutomatedSched()
		
		},
		computed: {
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
			numberOfWorkshops: {
				get () {
					return this.$store.state.schedules.numberOfWorkshops
				},
				set (v) {
					this.$store.state.schedules.numberOfWorkshops = v
				}
			},
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
			getEvent () {
				var i = this.$lodash.findIndex(this.$store.state.startUp.events, e => {
					return e['.key'] === this.eventKey
 				})
				return this.$store.state.startUp.events[i]
			},
			getOtherActivity () {
				return this.$lodash.remove(this.getCourse.activities, function(o) {
					return o.value != 'payments' && o.value != 'orientation' && o.value != 'photoshoots' && o.value != 'photoshoot' && o.value != 'photoliking' && o.value != 'workshop' && o.value != 'workshops' && o.value != 'final event'
				})
			},
			getWorkshopActivity () {
				return this.$lodash.filter(this.getCourse.activities, a => {
					return a.value === 'workshops' || a.value === 'workshop'
				})[0]
			},
			getPhotolikingActivity () {
				return this.$lodash.filter(this.getCourse.activities, a => {
					return a.value === 'photoliking'
				})[0]
			},
			getPhotoshootActivity () {
				return this.$lodash.filter(this.getCourse.activities, a => {
					return a.value === 'photoshoot' || a.value === 'photoshoots'
				})[0]
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
				let seasonTotal = parseFloat(this.totalAmount)
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
				var seasonTotal = parseFloat(totalAmount)
				var total = parseFloat(this.getTotal)
				return this.getTotal - seasonTotal
			},
			getCourse () {
				return this.$lodash.filter(this.courses, c => {
					return c['.key'] === this.courseKey
				})[0]
			}
		},
		data () {
			// event: `${this.getEvent.eventCode}`
			return {
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
			onLoad () {
					console.log('set to nulls')

				if (this.hasWorkshops) {
					if (typeof this.workshops.startDate[0] === 'undefined') {
						this.setWorkshopsToNull()
					}
				}
			},
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
					
					let totalAmount = this.$store.getters['startUp/removeComma'](this.totalAmount)
					if (this.numberOfPayments % 2 === 0) {
						let eachPayment = parseFloat(totalAmount) / parseInt(this.numberOfPayments)
						this.paymentsAmount = new Array(this.numberOfPayments)
						for (var i = 0; i < this.paymentsAmount.length; i++) {
							this.paymentsAmount[i] = eachPayment
						}
					} else {
						let firstPayment = parseFloat(totalAmount) * 0.20
						let otherPayment = (parseFloat(totalAmount) - firstPayment) / (parseInt(this.numberOfPayments) - 1)
						this.paymentsAmount = new Array(this.numberOfPayments)
						this.paymentsAmount[0] = firstPayment
						for (var i = 1; i < this.paymentsAmount.length; i++) {
							this.paymentsAmount[i] = otherPayment
						}
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
				for (var i = 0; i < this.getOtherActivity.length; i++) {
					this.otherActivitiesPickDateChecked[i] = false
					this.otherActivities.startDate[i] = ''
					this.otherActivities.endDate[i] = ''
					this.otherActivities.time[i] = ''
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
			onChangeWorkshopLocation (i) {
				try {
					this.workshops.location[i] = this.getLocation(this.selectWorkshopLocation[i]).location
					this.workshops.details[i] = this.getLocation(this.selectWorkshopLocation[i]).details
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
			test () {
				// this.generatePaymentsDate()

				// console.log(this.seasonStart, 'seasonStart')	
				// console.log(this.seasonEnd, 'seasonEnd')
				// let dates = this.getDatesOfWeek(this.seasonStart, this.seasonEnd, 'sunday')
				// console.log(dates, 'dates')
				// startDate = tempDate.clone().subtract(1, 'month').startOf('month')
				// startDate.clone().subtract(1, 'month').startOf('month')
				this.isStartDateIsEmpty()
				console.log(this.isOtherActivityTimeIsEmpty, 'v isOtherActivityTimeIsEmpty')
				console.log(this.isOtherActivityStartDateIsEmpty, 'v isOtherActivityStartDateIsEmpty')
				console.log(this.workshops, 'v worko')
				// console.log(this.otherActivities, 'v otherActivities')
				let workshopsStartDateIsEmpty = this.hasWorkshops ? this.$lodash.some(this.isWorkshopStartDateIsEmpty, Boolean) : false
				let otherActivityStartDateIsEmpty = this.$lodash.some(this.isOtherActivityStartDateIsEmpty, Boolean)
				let otherActivityTimeIsEmpty = this.$lodash.some(this.isOtherActivityTimeIsEmpty, Boolean)


				console.log(workshopsStartDateIsEmpty, 'workshopsIsEmpty')
				console.log(otherActivityStartDateIsEmpty, 'otherActivityStartDateIsEmpty')
				console.log(otherActivityTimeIsEmpty, 'otherActivityTimeIsEmpty')
				this.$forceUpdate()
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
			}
		}
	}
</script>
<style>
span.total {
  position: absolute;
  right: 500px;
  width: 200px;
} 
</style>