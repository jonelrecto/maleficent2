<template>
	<div>
		<q-page>
	    <q-toolbar color="faded">
				<q-toolbar-title>
					
					<!-- <span class="q-subheading">Season Activities</span>
					<span class="q-body-2" slot="subtitle">{{getEventName}} - Season {{seasonNumber}}</span>
					-->
					<q-btn @click="test" label="test" >
					</q-btn> 
						<span class="q-title">{{getEventName}}</span>	
					<div class="row justify-left">
						<div class="col-md-4">
							<q-breadcrumbs class="col-md-4" color="white" active-color="info" separator=">">
								<q-breadcrumbs-el class="q-subheading text-weight-bold" active color="info" label="Events" to="/events"/>
								<q-breadcrumbs-el class="q-subheading text-weight-bold" active color="info" label="Seasons" :to="{name: 'eventSeason', params: { id: eventKey }}" />
								<q-breadcrumbs-el class="q-subheading text-weight-bold" active color="info" label="Batch" />
							</q-breadcrumbs>	
						</div>
						
					</div>
					
				</q-toolbar-title>
				
				<div v-if="!isNewBatch && !$store.state.users.isNewSeasonActivities && !editMode">
					<span class="q-caption">View Mode: </span>
					<q-btn-toggle class="q-mx-md" rounded size="sm"
						@click="switchMode"
						v-model="viewMode"
						toggle-color="primary"
						:options="[
							{label: 'Batch', value: 'batchMode'},
							{label: 'Calendar', value: 'calendarMode'}
						]"
					/>
				</div>

				<div class="q-mr-md	">
					<q-toggle v-if="isNewBatch" v-model="viewAllBatches" label="All Batches" />
				</div>
				<div v-if="$store.state.users.isNewSeasonActivities || isNewBatch || editMode">
					<q-btn size="sm" rounded class="q-my-md" inverted color="secondary" @click="saveSeasonActivities">Save</q-btn>
					<q-btn size="sm" rounded class="q-my-md" inverted color="negative" @click="cancel">Cancel</q-btn>
				</div>
				
				<q-btn-group outline>
					<q-btn 
						v-if="!$store.state.users.isNewSeasonActivities && !isNewBatch && !editMode" 
						icon="add" 
						color="positive" 
						size="sm" 
						rounded 
						:disable="batchLoading"
						@click="checkIfOverlap()">
						New Batch
					</q-btn>
					<q-btn 
						v-if="!$store.state.users.isNewSeasonActivities && !isNewBatch && !editMode" 
						icon="edit" 
						color="primary" 
						rounded 
						size="sm" 
						label="Edit Batch" 
						:disable="batchLoading"
						@click="editBatch2()"
					/>

				</q-btn-group>
				<!-- $store.state.users.isNewSeasonActivities && isNewBatch ||  -->
				<q-btn v-if="isCalendarView || isNewBatch || $store.state.users.isNewSeasonActivities" icon="keyboard_arrow_left" class="q-ml-md" size="sm" color="info" rounded @click="showRight = !showRight, generateBatchNodes()" label="activity list" />
			</q-toolbar>
			<!-- tree -->
		<div>
		</div>


		<!-- table view -->
		<div class="q-ma-md">
			<event-batch-view-component
				v-if="!isNewBatch && !isCalendarView && !isAgendaView"
				:eventKey="eventKey"
				:seasonNumber="parseInt(seasonNumber)"
			></event-batch-view-component>
			
		</div>


		<div v-if="$store.state.users.isNewSeasonActivities || isNewBatch || isCalendarView" class="row justify-center q-ma-md calendar-parent" style="max-height: 100vw; height: 50vw; ">
			<div class="col-md-2">
					<q-select
						multiple
						float-label="Filter Activities"
						:display-value="`${filterActivitiesSelection.length} companies selected`"
						v-model="filterActivitiesSelection"
						:options="filterActivitiesOpt"
					/>
					<batch-trees
						:eventKey="eventKey"
						:seasonNumber="parseInt(seasonNumber)"
					></batch-trees>
			</div>
    	<calendar-view
    		:key="Date.now()"
				:show-date="showDate"
				:events="switchCalendarEvent"
				:show-event-times="showEventTimes"
				:enableDragDrop="enableDragDrop"
				:timeFormatOptions="{ hour: 'numeric', minute: 'numeric', hour12: true}"
				:startingDayOfWeek="startingDayOfWeek"
				:displayPeriodCount="2"
				@show-date-change="setShowDate"
				@click-date="clickDate"
				@click-event="clickEvent"
				@drop-on-date="dropOnDate"
				class="theme-default holiday-us-traditional "
			>
				 <calendar-view-header
						slot="header"
						slot-scope="t"
						:header-props="t.headerProps"
						@input="setShowDate" 
					>
						<div slot="dayHeader">
						
						</div>
						
				 </calendar-view-header>
			</calendar-view>
    </div>


		<!-- agenda calendar -->
		<div v-if="isAgendaView">
			<!-- <calendar-agenda
				class="q-ma-md"
				:start-date="showDate"
				:event-array="agendaActivities"
				:allow-editing="false"
			/> -->
			<event-batch-agenda-view-component></event-batch-agenda-view-component>
		</div>
    <!-- new activity modal -->
    <q-modal v-model="activityModal" :content-css="{minWidth: '30vw', minHeight: '50vh'}" @hide="clearActivityModal">
      <q-modal-layout
		    content-class="{'bg-primary': true}"
		    footer-class=""
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
        <q-toolbar>
          <q-toolbar-title>
            <!-- Activity Details -->
						{{activity.originalEvent.title}}
          </q-toolbar-title>
          <q-btn flat round dense @click="activityModal = false" icon="close" />
        </q-toolbar>
        <div>
			    <q-input
			    	readonly
			    	class="q-ma-md"
					  v-model="activity.originalEvent.type"
					  type="text"
					  stack-label="Activity"
			    />
			    <q-datetime
			    	disable
			   		v-if="activity.originalEvent.startDate && activity.originalEvent.type !== 'orientation' && activity.originalEvent.type !== getBatchFinalEvent.type"
			    	class="q-ma-md"
			    	:min="getStartDateMin(activity.originalEvent)"
			    	format="MMM-DD-YYYY"
			    	v-model="activity.originalEvent.startDate"
			    	stack-label="Date"
			    	type="date"
			    />
			    <q-input
			    	readonly
			   		v-if="activity.originalEvent.type === 'payment'"
			    	class="q-ma-md"
			    	prefix="P"
					  v-model="activity.originalEvent.amount"
					  type="number"
					  stack-label="Amount"
			    />
			    <q-datetime
			    	:disable="!editMode && !isNewBatch"
			   		v-if="activity.originalEvent.time"
			    	class="q-ma-md"
			    	format="h:mm A"
			    	v-model="activity.originalEvent.time"
			    	stack-label="Time"
			    	type="time"
			    />
			   	<q-datetime
			    	:disable="!editMode && !isNewBatch"
			   		v-if="activity.originalEvent.dueDate"
			    	class="q-ma-md"
			    	format="MMM-DD-YYYY"
			    	:min="$mathMixin.addDays(new Date(activity.originalEvent.startDate), 1)"
			    	v-model="activity.originalEvent.dueDate"
			    	stack-label="Due Date"
			    	type="date"
			    />
					 <q-input
			    	class="q-ma-md"
			    	:disable="!editMode && !isNewBatch"
			    	v-if="(activity.originalEvent.location === '' || activity.originalEvent.location )&& !activity.originalEvent.dueDate && !activity.originalEvent.amount"
					  v-model="activity.originalEvent.location"
					  type="textarea"
					  stack-label="Location"
					  rows="7"
					 >
					 	<q-autocomplete
							:min-characters="0"
							@search="searchLocation"
							:debounce="700"
							@selected="selected"
						/>
					 </q-input>
			    <q-input
			    	:disable="!editMode && !isNewBatch"
			    	v-if="(activity.originalEvent.details === '' || activity.originalEvent.details )&& !activity.originalEvent.dueDate && !activity.originalEvent.amount"
			    	class="q-ma-md"
					  v-model="activity.originalEvent.details"
					  type="textarea"
					  stack-label="Details"
					  rows="7"
					 >
					 	<q-autocomplete
							:min-characters="0"
							@search="searchDetails"
							:debounce="700"
							@selected="selected"
						/>
			    </q-input>
        </div>
        <!-- action -->
        <div slot="footer">
        	<q-btn color="primary" class="full-width" @click="saveActivity">OK</q-btn>
        	<!-- <q-btn color="negative" class="full-width" @click="removeActivity">Delete</q-btn> -->
        </div>
      </q-modal-layout>
    </q-modal>


    <!-- new batch modal :content-css="{minWidth: '50vw', minHeight: '50vh'}"-->
    <q-modal maximized v-model="newBatchModal"  @hide="clearNewBatch">
      <q-modal-layout
		    content-class="{'bg-primary': true}"
		    footer-class=""
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
        <q-toolbar>
          <q-toolbar-title>
            New Batch
          </q-toolbar-title>
          <q-btn flat round dense @click="closeNewBatchModal()" icon="close" />
        </q-toolbar>
        <!-- content -->
        <div>

        	<!-- <q-btn label="test" @click="test()"/> -->
        	<!-- <q-datetime
        		:min="getLastBatchOrientation"
        		:max="getBatchFinalEvent.startDate"
			    	class="q-ma-md"
			    	format="MMM-DD-YYYY"
			    	v-model="newBatchStartDate"
			    	stack-label="Batch Start"
			    	type="date"
			    /> -->
			    <!-- v-if="newBatchStartDate" -->
					<div>
						
						<new-batch-modal ref="newBatchModalRef"
							:eventKey="eventKey"
			 				:eventCode="getEventCode"
							:seasonNumber="parseInt(seasonNumber)"
							:seasonEnd="getSeasonEnd"
							:lastBatchCourse="course[0] ? getCourse['.key'] : ''"
						></new-batch-modal>
							<!-- v-if="is4BatchMax" -->
						<q-field class="q-mx-md" orientation="vertical">
							<div class="q-my-md" v-for="(ws, i) in getWorkshopActivity" :key="i">
								<div class="row">
									<div class="col">
										<span class="caption q-my-md">Workshop {{i+1}}</span>
										<p>Possible Dates: <br />
											<q-btn-group v-for="(upcoming,j) in upcomingSundays" :key="j" >
												<q-btn v-if="alreadySelected(upcoming)" size="sm" @click="selectUpcomingDate(i, upcoming)">
													{{$moment(upcoming).format('ll')}}
												</q-btn>
											</q-btn-group>
										</p>
										<q-datetime disable :max="new Date(getSeasonEnd)" format="MMM-DD-YYYY" v-model="workshops.startDate[i]" stack-label="Date" type="date" />

										<q-datetime format="h:mm A" v-model="workshops.time[i]" stack-label="Time" type="time"/>

										<q-input float-label="Location" :max-height="100" rows="7" type="textarea" v-model="workshops.location[i]" >
											<q-autocomplete
												:min-characters="0"
												@search="searchLocation"
												:debounce="700"
												@selected="selected"
											/>
										</q-input>
										<q-input v-if="getWorkshop.details" float-label="Details" type="textarea" :max-height="50" rows="5" v-model="workshops.details[i]" >
											<q-autocomplete
												:min-characters="0"
												@search="searchDetails"
												:debounce="700"
												@selected="selected"
											/>
										</q-input>
									</div>
								</div>
								<q-item-separator />
							</div>
						</q-field>
					</div>
        </div>
        <!-- action -->
        <!-- <div slot="footer">
        	<q-btn color="primary" class="full-width" @click="confirmNewBatch()">OK</q-btn>
        	<q-btn color="negative" class="full-width" @click="removeActivity">Delete</q-btn>
        </div> -->
      </q-modal-layout>
    </q-modal>
    <!-- edit batch modal  -->
    <q-modal v-model="batchNodeActivityModal" :content-css="{minWidth: '50vw', minHeight: '50vh'}" @hide="clearNewBatch">
	    <q-modal-layout
			    content-class="{'bg-primary': true}"
			    footer-class=""
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
			</q-modal-layout>
    </q-modal>



    <q-modal maximized v-model="editBatchModal" @show="onShowEditBatch()">
    	<q-modal-layout
		    content-class="{'bg-primary': true}"
		    footer-class=""
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
				  <q-toolbar slot="header">
				    <q-toolbar-title>Edit Batch</q-toolbar-title>
				    <q-select
				    	@input="onChangeSelectBatch()"
	           	style="width: 150px"
	           	inverted
	           	no-parent-field
	           	float-label="Select Batch"
				      v-model="selectedBatch"
				      :options="editBatchOpt"
				    />
	          <q-btn flat round dense v-close-overlay icon="close" />
				  </q-toolbar>

        <edit-batch-modal
        	ref="editBatchModalRefs"
        	v-if="selectedBatch !== 'final event'"
        	:batchKey="selectedBatch"
					:eventKey="eventKey"
					:eventCode="getEventCode"
					:seasonNumber="parseInt(seasonNumber)"
					:seasonEnd="getSeasonEnd"
					:lastBatchCourse="course[0] ? getCourse['.key'] : ''"
				
				></edit-batch-modal>

				<edit-final-activity
					:eventKey="eventKey"
					:seasonNumber="parseInt(seasonNumber)"
					:finalActivity="getBatchFinalEvent"
					v-else
				></edit-final-activity>

			</q-modal-layout>
    </q-modal>


	</q-page>

		<q-layout-drawer v-model="showRight" content-class="bg-grey-3 flex " :content-style="{padding: '10px'}" side="right">
			<div>
				<q-btn rounded color="info" label="hide" icon="keyboard_arrow_right" class="flex flex-right" size="xs" @click="showRight=!showRight" ></q-btn>
				<!-- <q-btn label="test" @click="test()"/> -->
				<div>
					<span class="q-title text-weight-bold q-ma-md">{{getEventName}}</span> <br/>
					<span class="q-title q-mx-md">Season {{seasonNumber}}</span>
					<!-- insert tree here -->
					<batch-trees
						:eventKey="eventKey"
						:seasonNumber="parseInt(seasonNumber)"
					></batch-trees>
				</div>
				<!-- <div>
					<q-list link inset-separator class="q-ma-md">
						<q-list-header class="text-weight-thin">{{getEventName}} - Season {{seasonNumber}}</q-list-header>
						<q-item  v-for="(act,i) in activities" :key="i" >
							<div @click="clickActivity(act)">
								<q-item-main>
									<q-item-tile label>{{act.title}}</q-item-tile>
									<q-item-tile v-if="act.type === 'photoliking'" sublabel>{{$moment(act.startDate).format('l')}} to {{$moment(act.endDate).format('l')}}</q-item-tile>
									<q-item-tile v-if="act.type !== 'photoliking'"sublabel>{{$moment(act.startDate).format('llll')}}</q-item-tile>
								</q-item-main>
							</div>
						</q-item>
					</q-list>
				</div> -->
			</div>
		</q-layout-drawer>
	</div>
</template>
<script>
import {CalendarView, CalendarViewHeader } from 'vue-simple-calendar'
import { CalendarAgenda } from 'quasar-calendar'
import { filter } from 'quasar'
import EventBatchViewComponent from '../../components/eventComponents/eventBatchViewComponent'
import EventBatchAgendaViewComponent from '../../components/eventComponents/batchAgendaView'
import newBatchModalComponent from '../../components/eventComponents/newBatchModal.vue'
import editBatchModalComponent from '../../components/eventComponents/editBatchModal.vue'
import editFinalActivity from '../../components/eventComponents/editFinalActivity'
import TestModal from '../../components/eventComponents/testModal'
import batchTrees from '../../components/eventComponents/batchTrees'

// require("vue-simple-calendar/static/css/default.css")
// require("vue-simple-calendar/static/css/holidays-us.css")


export default {
	created () {
		this.eventKey = this.$route.params.id
		this.viewMode = 'batchMode'
		this.seasonNumber = this.$route.params.seasonNumber
		this.batchLoading = true
		if (this.$store.state.users.isNewSeasonActivities) {
			// this.viewMode = 'calendarMode'
			this.editMode = true
			this.setShowDate(new Date(this.$store.state.users.newSeasonActivities[0].startDate))
		}
	},
	mounted () {
		this.$bindAsArray('schedules2', this.$database.ref('event_schedules'), null, () => {
			this.$bindAsArray('event', this.$database.ref('event_schedules').orderByChild('eventKey').equalTo(this.eventKey), null, () => {
				// console.log(this.event, 'event in mounted')
				this.$bindAsArray('course', this.$database.ref('settings/courses').orderByKey().equalTo(this.event[0].course), null, () => {
					console.log(this.event[0].course)
					console.log(this.course, 'course in mounted')
					this.batchLoading = false
					this.$store.state.startUp.schedules = this.schedules2
				})
			})
		})
		
		
	},
	components: {
		CalendarView,
		CalendarViewHeader,
		CalendarAgenda,
		EventBatchViewComponent,
		EventBatchAgendaViewComponent,
		'newBatchModal': newBatchModalComponent,
		'editBatchModal': editBatchModalComponent,
		'editFinalActivity': editFinalActivity,
		'batchTrees': batchTrees,
		TestModal
	},
	watch: {
		isCalendarView: {
			handler (newVal, oldVal) {
				if (newVal) {
					let allAct = []
					for (var i = 0; i < this.getSeasonBatches.length; i++) {
						for (var j = 0; j < this.getSeasonBatches[i].activities.length; j++) {
							allAct.push(this.getSeasonBatches[i].activities[j])
						}
					}
					for (var k = 0; k < allAct.length; k++) {
						if (allAct[k].type === 'payment' || allAct[k].type === 'payments' || allAct[k].type === 'date range' || allAct[k].type === 'photoliking' ) {
							allAct[k].startDate = this.$store.getters['schedules/removeTime'](new Date(allAct[k].startDate))
							allAct[k].endDate = this.$store.getters['schedules/removeTime'](new Date(allAct[k].endDate))
							allAct[k].dueDate = allAct[k].dueDate ? new Date(allAct[k].dueDate) : ''
							allAct[k].time = allAct[k].time ? new Date(allAct[k].time) : ''
						} else {
							allAct[k].startDate = new Date(allAct[k].startDate)
							allAct[k].endDate = new Date(allAct[k].endDate)
							allAct[k].dueDate = allAct[k].dueDate ? new Date(allAct[k].dueDate) : ''
							allAct[k].time = allAct[k].time ? new Date(allAct[k].time) : ''
						}
						
					}
					console.log(allAct, 'allact')
					this.$store.state.users.newSeasonActivities = allAct
					this.setShowDate(new Date(allAct[0].startDate))
					this.generateBatchNodes()
				} else {
					this.$store.state.users.newSeasonActivities = []
					this.$store.state.users.batchNode = []
				}
			},
			deep: true
		},
		isAgendaView: {
			handler (newVal, oldVal) {
				if (newVal) {
					let activities = this.getSeasonBatchesActivities
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
					this.agendaActivities = this.$lodash.compact(mapAct)
					this.setShowDate(new Date(activities[0].startDate))
				} else {
					this.agendaActivities = []
				}
			},
			deep: true
		},
		viewAllBatches () {
			console.log('watching viewall', this.viewAllBatches)
			if (this.viewAllBatches) {
				console.log('batches', this.getSeasonBatches)
				console.log('newSeasonActivities', this.$store.state.users.newSeasonActivities)
				let mergeAct = []
				let seasonBatches = this.getSeasonBatches
				let newSeasonAct = [...this.$store.state.users.newSeasonActivities]
				for (var i = 0; i < seasonBatches.length; i++) {
					for (var j = 0; j < seasonBatches[i].activities.length; j++) {
						seasonBatches[i].activities[j].startDate = new Date(seasonBatches[i].activities[j].startDate)
						seasonBatches[i].activities[j].endDate = new Date(seasonBatches[i].activities[j].endDate)
						seasonBatches[i].activities[j].dueDate = seasonBatches[i].activities[j].dueDate ? new Date(seasonBatches[i].activities[j].dueDate) : ''
						seasonBatches[i].activities[j].time = seasonBatches[i].activities[j].time ? new Date(seasonBatches[i].activities[j].time) : ''
						newSeasonAct.push(seasonBatches[i].activities[j])
					}
				}
				console.log('newSeasonAct', newSeasonAct)
				this.$store.state.users.seeAllBatch = newSeasonAct
			} else {
				this.$store.state.users.seeAllBatch = []
			}
		},
		isNewSeasonActivities () {
			if (this.isNewSeasonActivities) {
				this.viewMode = 'calendarMode'
			}
		}
	},
	computed: {
		filterActivitiesOpt () {
			console.log(this.lastBatch, 'lastbath')
			return [
				{label: 'All Activities', value: 'all'}
			]
		},
		editBatchOpt () {
			// console.log(this.getBatches, 'getBatches')
			let map = this.$lodash.map(this.getBatches, b => {
				return { label: `Batch ${b.batchNumber}`, value: b['.key'] }
			})
			map.push({ label: 'Final Event', value: 'final event' })
			return map
		},
		editBatchModal: {
			get () {
				return this.$store.state.schedules.editBatchModal
			},
			set (v) {
				this.$store.state.schedules.editBatchModal = v
			}
		},
		getEventCode () {
			try {

				return this.$store.getters['startUp/getEvent'](this.eventKey).eventCode
			} catch (err) {}
		},
		isCanAddAnotherBatch () {
			// console.log('this.is4BatchMax', this.is4BatchMax)
			if (this.is4BatchMax) {
				// console.log('seasons status', this.getSeasonBatches)
				let payment3 = this.$lodash.filter(this.getLastBatch.activities, lb => {
					return lb.type === 'payment'
				})[2]
				let firstOtherAct = this.$lodash.filter(this.getLastBatch.activities, lb => {
					return lb.type === this.getOtherActivities[0].label
				})[0]
				// console.log('payment3', payment3)
				// console.log('firstOtherAct', firstOtherAct)
				let sundays = this.$store.getters['startUp/getUpcomingWeekEnds']({startDate: new Date(payment3.startDate), weekEnd: 'sundays'})

				let filterSun = new Array()
	 			for (var i = 0; i < sundays.length; i++) {
	 				let dif = this.$mathMixin.dayDiff(new Date(payment3.startDate),  new Date(sundays[i]),)
	 				if (dif > 0) {
		 				filterSun.push(sundays[i])
	 				}
	 			}
		 		filterSun.splice(0, this.getWorkshopActivity.length)
		 		let filterSun2 = new Array()
		 		for (var i = 0; i < filterSun.length; i++) {
	 				let dif = this.$mathMixin.dayDiff(new Date(firstOtherAct.startDate),  new Date(filterSun[i]),)
	 				// console.log('dif', dif)
	 				if (dif < 0) {
		 				filterSun2.push(filterSun[i])
	 				}
	 			}
		 		// console.log('filterSun', filterSun2)
		 		if (filterSun2.length >= this.getWorkshopActivity.length) {
		 			if (filterSun2.length % this.getWorkshopActivity.length === 0) {
			 			console.log('can add another 4 batch', filterSun2.length % this.getWorkshopActivity.length)
			 			return true
			 		} else {
			 			console.log('bawal na mag add ng 4 batch')
			 			return false
			 		}
		 		} else {
		 			return false
		 		}
			} else {
				return true
			}

		},
		getOtherActivities () {
			let otherActivities = []
			let activities = [...this.course[0].activities]
			for (var i = 0; i < activities.length; i++) {
				if (activities[i].value !== 'orientation' && activities[i].value !== 'payment' && activities[i].value !== 'photoshoot' && activities[i].value !== 'photoliking' && activities[i].value !== 'workshop' && activities[i].value !== this.getFinalActivity.value) {
					otherActivities.push(activities[i])
				}
			}
			// console.log('other', otherActivities)
			return otherActivities
		},
		getFinalActivity () {
			try {
				let finalAct = this.course[0].activities[this.course[0].activities.length-1]
				return finalAct
			} catch (err) {
				return {}
			}
		},
		getCourse () {
			try {
				// var course = this.$lodash.filter(this.course[0], c => {
				// 	return c['.key'] === this.getLastBatch.course
				// })
				// console.log(course, 'course')
				return this.course[0]
			} catch (err) {
				return {}
			}
			
		},
		getLastBatch () {
			try {
				let lastBatch = this.$lodash.maxBy(this.getSeasonBatches, b => {
					return b.batchNumber
				})
				return lastBatch
			} catch (err) {
				return []
			}
			
		},
		otherActivities () {
				// try {
					let otherActivities = []
					let activities = [...this.course.activities]
					for (var i = 0; i < activities.length; i++) {
						if (activities[i].value !== 'orientation' && activities[i].value !== 'payment' && activities[i].value !== 'photoshoot' && activities[i].value !== 'photoliking' && activities[i].value !== 'workshop' && activities[i].value !== this.getFinalActivity.value) {
							otherActivities.push(activities[i])
						}
					}
					// console.log('other', otherActivities)
					for (var j = 0; j < otherActivities.length; j++) {
						this.otherActivity.value.push(otherActivities[j].value)
						this.otherActivity.label.push(otherActivities[j].label)
					}
					// console.log('ote', otherActivities)
					this.otherActivities2 = otherActivities
					return otherActivities
				// } catch (err) {
				// 	return {}
				// }
			},
		getSeasonBatchesActivities () {
			let batches = this.getSeasonBatches
			let allAct = new Array()
			for (var i = 0; i < batches.length; i++) {
				for (var j = 0; j < batches[i].activities.length; j++) {
					allAct.push(batches[i].activities[j])
				}
			}
			return allAct
		},
		// isNewSeasonActivities: {
		// 	get () {
		// 		return this.$store.state.users.isNewSeasonActivities
		// 	},
		// 	set (v) {
		// 		this.$store.state.users.isNewSeasonActivities = v
		// 	}
		// },
		seasonBatchContractSigned () {
			let signed = this.$lodash.filter(this.contractSigned, cs => {
				var sn = parseInt(cs.seasonName.match(/\d+/g)[0])
				return cs.eventKey === this.eventKey &&  sn === parseInt(this.seasonNumber)
			})
			// console.log('signed', signed)
			return signed
		},
		contractSigned: {
			get () {
				return this.$store.state.startUp.contractSigned
			},
			set (v) {
				this.$store.state.startUp.contractSigned = v
			}
		},
		switchCalendarEvent () {
			if (this.viewAllBatches) {
				return this.$store.state.users.seeAllBatch
			} else {
				return this.$store.state.users.newSeasonActivities
			}
		},
		isWorkshopIsAhead () {
			// try {
				if (!this.$store.state.users.isNewSeasonActivities) {
					// console.log('this new bach', this.newBatch)
					this.batch0 = {...this.getSeasonBatches[0]}
					// let batch = {...this.getSeasonBatches[0]}
					let batch = this.$store.getters['startUp/getPlainValue'](this.getSeasonBatches[0])
					var batchNumber = this.getSeasonBatches.length
					for (var a = 0; a < batch.activities.length; a++) {
						batch.activities[a].startDate = batch.activities[a].startDate.toString()
						batch.activities[a].endDate = batch.activities[a].endDate.toString()
					}
					// orientation
					++batchNumber
					var iOrientation = this.$lodash.findIndex(batch.activities, a => {
						return a.type === 'orientation'
					})
					batch.activities[iOrientation].startDate = new Date(this.newBatchStartDate)
					batch.activities[iOrientation].endDate = new Date(this.newBatchStartDate)
					batch.activities[iOrientation].startDate.setHours(0,0,0,0)
					batch.activities[iOrientation].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_orientation`
					batch.activities[iOrientation].title = `Batch(${batchNumber})_orientation`
					// batch.activities[iOrientation].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_orientation`
					// payment
					let paymentToDays = this.$store.getters['users/convertToDays']({dateType: this.getPaymentCourseActivity.dayAfter.dateType, dateNumber: this.getPaymentCourseActivity.dayAfter.dateNumber})
					var filterPayments = this.$lodash.filter(batch.activities, a => {
						return a.type === 'payment'
					})
					for (var i = 0; i < filterPayments.length; i++) {
						if (i  === 0) {
							filterPayments[i].startDate = this.$mathMixin.addDays(new Date(this.newBatchStartDate), 3)
							filterPayments[i].endDate = this.$mathMixin.addDays(new Date(this.newBatchStartDate), 3)
							filterPayments[i].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
							filterPayments[i].title = `Batch(${batchNumber})_payment(${i+1})`
							// filterPayments[i].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
						} else {
							filterPayments[i].startDate = this.$mathMixin.addDays(new Date(filterPayments[i-1].startDate), paymentToDays)
							filterPayments[i].endDate = this.$mathMixin.addDays(new Date(filterPayments[i-1].startDate), paymentToDays)
							filterPayments[i].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
							filterPayments[i].title = `Batch(${batchNumber})_payment(${i+1})`
							// filterPayments[i].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
						}
					}
					// photoshoot
					let photoshootToDays = this.$store.getters['users/convertToDays']({dateType: this.getPhotoshootCourseActivity.dayAfter.dateType, dateNumber: this.getPhotoshootCourseActivity.dayAfter.dateNumber})
					var iPhotoshoot = this.$lodash.findIndex(batch.activities, a => {
						return a.type === 'photoshoot'
					})
					batch.activities[iPhotoshoot].startDate = this.$mathMixin.addDays(new Date(filterPayments[0].startDate), photoshootToDays)
					batch.activities[iPhotoshoot].endDate = this.$mathMixin.addDays(new Date(filterPayments[0].startDate), photoshootToDays)
					batch.activities[iPhotoshoot].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoshoot`
					batch.activities[iPhotoshoot].title = `Batch(${batchNumber})_photoshoot`
					// batch.activities[iPhotoshoot].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoshoot`
					// photoliking
					let photolikingToDays = this.$store.getters['users/convertToDays']({dateType: this.getPhotolikingCourseActivity.dayAfter.dateType, dateNumber: this.getPhotolikingCourseActivity.dayAfter.dateNumber})
					var iPhotoliking = this.$lodash.findIndex(batch.activities, a => {
						return a.type === 'photoliking'
					})
					batch.activities[iPhotoliking].startDate = this.$mathMixin.addDays(new Date(filterPayments[1].startDate), photoshootToDays)
					batch.activities[iPhotoliking].endDate = this.$mathMixin.addDays(new Date(filterPayments[1].startDate), 14)
					batch.activities[iPhotoliking].dueDate = this.$mathMixin.addDays(new Date(filterPayments[1].startDate), 14)
					batch.activities[iPhotoliking].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoliking`
					batch.activities[iPhotoliking].title = `Batch(${batchNumber})_photoliking`
					// batch.activities[iPhotoliking].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoliking`
					let numOfWorkshop = 0
					for (var j = 0; j < batch.activities.length; j++) {
						if (batch.activities[j].type !== 'orientation' && batch.activities[j].type !== 'payment' && batch.activities[j].type !== 'photoshoot' && batch.activities[j].type !== 'photoliking') {
							batch.activities[j].startDate = new Date(batch.activities[j].startDate)
							batch.activities[j].endDate = new Date(batch.activities[j].endDate)
							batch.activities[j].time = batch.activities[j].time ? new Date(batch.activities[j].time) : ''
							batch.activities[j].dueDate = batch.activities[j].dueDate ? new Date(batch.activities[j].dueDate) : ''
							batch.activities[j].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}`
							batch.activities[j].title = `Batch(${batchNumber})_${batch.activities[j].type}`
							// batch.activities[j].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}`
							if (batch.activities[j].type === 'workshop') {
								numOfWorkshop++
								console.log('found workshop', numOfWorkshop)
								batch.activities[j].startDate = new Date(batch.activities[j].startDate)
								batch.activities[j].endDate = new Date(batch.activities[j].endDate)
								batch.activities[j].time = new Date(batch.activities[j].startDate)
								batch.activities[j].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}(${numOfWorkshop})`
								batch.activities[j].title = `Batch(${batchNumber})_${batch.activities[j].type}(${numOfWorkshop})`
								// batch.activities[j].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}(${numOfWorkshop})`
							}
						}
					}
					// console.log('photoshootToDays', photoshootToDays)
					// console.log('batch activities', batch.activities)
					// console.log('numOfWorkshop', numOfWorkshop)
					var last3Payments = new Array()
					for (var k = 0; k < filterPayments.length; k++) {
						if (k <= 3) {
							last3Payments.push(filterPayments[k])
						}
					}
					var lastPaymentDue = last3Payments[last3Payments.length-1]
					let filterWorkshops = this.$lodash.filter(batch.activities, baw => {
						return baw.type === 'workshop'
					})
					if (filterWorkshops.length === 0 ) {
						return false
					}
					// console.log('filterWorkshops', filterWorkshops)
					var diffOfPayNWork = this.$mathMixin.dayDiff(new Date(lastPaymentDue.startDate), new Date(filterWorkshops[0].startDate))
					// console.log('difference', diffOfPayNWork)
					this.generatedBatchActivities = {...batch}
					if (diffOfPayNWork > 0 ) {
						console.log('ahead pa ung workshop')
						return false
					} else {
						// this.generateWorkshopScheds()
						console.log('di na ahead ung workshop')
						return true
					}
					// getWorkshopActivity
					// var lastPayIndex = this.$lodash.findIndex(batch.activities, pa => {
					// 	return pa
					// })
				}
			// } catch {
			// 	console.log('not executing found error')
			// 	return false
			// }
		},
		getSeasonStatus () {
			try {
				return this.$store.getters['startUp/getSeason']({eventKey: this.eventKey, seasonNumber: this.seasonNumber}).status
			} catch {}
		},
		batchNodeActivityModal: {
			get () {
				return this.$store.state.users.batchNodeActivityModal
			},
			set (v) {
				this.$store.state.users.batchNodeActivityModal = v
			}
		},
		parseDetails () {
			return this.$store.getters['startUp/parseDetails']
		},
		parseLocations () {
			return this.$store.getters['startUp/parseLocations2']
		},
		upcomingSundays () {
			try {
				// console.log('batches in sunday', this.generatedBatchActivities.activities)
				let lastPaymentDate = this.$store.getters['users/getLastOf3Payment'](this.generatedBatchActivities.activities)
				// console.log('in sunday', lastPaymentDate)
				return this.$store.getters['startUp/getUpcomingSundays2'](lastPaymentDate.startDate)
			} catch {
				return []
			}
		},
		batchNode: {
			get () {
				return this.$store.state.users.batchesNode
			},
			set (v) {
				this.$store.state.users.batchesNode = v
			}
		},
		viewMode: {
			get () {
				return this.$store.state.users.viewMode
			},
			set (v) {
				this.$store.state.users.viewMode = v
			}
		},
		isCalendarView () {
			return this.viewMode === 'calendarMode'
		},
		isAgendaView () {
			return this.viewMode === 'agendaMode'
		},
		mergeBatches () {
			let allAct = []
			for (var i = 0; i < this.getSeasonBatches.length; i++) {
				for (var j = 0; j < this.getSeasonBatches[i].activities.length; j++) {
					allAct.push(this.getSeasonBatches[i].activities[i])
				}
			}
			for (var k = 0; k < allAct.length; k++) {
				allAct[k].startDate = new Date(allAct[k].startDate)
				allAct[k].endDate = new Date(allAct[k].endDate)
			}
			console.log('merge batches to calendar', allAct)
			this.$store.state.users.newSeasonActivities = allAct
		},
		getBatchNewOrientation () {
			return this.$store.state.users.newSeasonActivities[0]
		},
		activityModal: {
			get () {
				return this.$store.state.users.activityModal2
			},
			set (v) {
				this.$store.state.users.activityModal2 = v
			}
		},
		activity: {
			get () {
				return this.$store.state.users.activity
			},
			set (v) {
				return this.$store.state.users.activity = v
			}
		},
		showRight: {
			get () {
				return this.$store.state.users.showRight
			},
			set (v) {
				return this.$store.state.users.showRight = v
			}
		},
		is4BatchMax () {
			if (this.getSeasonBatches.length % 4 === 0) {
				this.generateWorkshopScheds()
				console.log('found modulo of 4')
				return true
			} else {
				console.log('is not 4 batch max')
				return false
			}
		},
		getWorkshopActivity () {
			try {
				// console.log('getWorkshopActivity', this.getSeasonBatches)
				var l = this.getSeasonBatches.length
				console.log(this.course, 'course')
				let lastBatch = {...this.getSeasonBatches[l-1]}
				let filterWorkshop = this.$lodash.filter(lastBatch.activities, lba => {
					return lba.type === 'workshop'
				})
				let workshop = Object.assign([], filterWorkshop)
				console.log('worksho', workshop)
				for (var i = 0; i < workshop.length; i++) {
					workshop[i].newStartDate = ''
				}
				return workshop
			} catch {
				return []
			}
		},
		// course () {
		// 	return this.$store.getters['startUp/getCourse'](this.getSeasonBatches[0].course)
		// },
		getWorkshop () {
			try {
				// console.log('getseaon batches', this.getSeasonBatches)
				// console.log('course activiteis in getWorkshop', this.course)
				// console.log('course activiteis in getWorkshop', this.course.activities)
				var i = this.$lodash.findIndex(this.course.activities, c => {
					return c.value === 'workshop'
				})
				console.log(this.course, 'course in workshop')
				return this.course.activities[i]
			} catch (err) {
				return {}
			}
		},
		getSeasonEnd () {
			try {
				return this.getSeasonBatches[0].seasonEnd
			} catch {
				return ''
			}

		},
		getEventName () {
			try {
				return this.$store.getters['startUp/getEvent'](this.eventKey).eventName
			} catch {
				return ''
			}
		},
		getBatchFinalEvent () {
			try {
				// console.log('batches', this.getSeasonBatches)
				var finalIndex = this.getSeasonBatches[0].activities.length-1
				return this.getSeasonBatches[0].activities[finalIndex]
			} catch {
				return ''
			}

		},
		getLastBatchOrientation () {
			try {
				// console.log('batches', this.getSeasonBatches)
				return this.$mathMixin.addDays(new Date(this.getSeasonBatches[this.getSeasonBatches.length-1].activities[0].startDate), 1).toString()
			} catch {
				return ''
			}

		},
		newBatchModal: {
			get () {
				return this.$store.state.users.newBatchModal
			},
			set (v) {
				this.$store.state.users.newBatchModal = v
			}
		},
		getColumnsActivities () {
			let activities = []
			let numOfPayment = 0
			let numOfWorkshop = 0
			for (var i = 0; i < this.getSeasonBatches[0].activities.length; i++) {
					var act = {}
					if (this.getSeasonBatches[0].activities[i].type.toLowerCase() === 'payment') {
						numOfPayment++
						act[this.getSeasonBatches[0].activities[i].type + numOfPayment] = {
				 			startDate: this.getSeasonBatches[0].activities[i].startDate,
							endDate: this.getSeasonBatches[0].activities[i].endDate,
							dueDate: this.getSeasonBatches[0].activities[i].dueDate,
							location: this.getSeasonBatches[0].activities[i].location,
							time: this.getSeasonBatches[0].activities[i].time,
							amount: this.getSeasonBatches[0].activities[i].amount,
							type: this.getSeasonBatches[0].activities[i].type,
							name: this.getSeasonBatches[0].activities[i].id,
							classes: this.getSeasonBatches[0].activities[i].classes,
							title: this.getSeasonBatches[0].activities[i].title
				 		}
					} else if (this.getSeasonBatches[0].activities[i].type.toLowerCase() === 'workshop') {
						numOfWorkshop++
						act[this.getSeasonBatches[0].activities[i].type + numOfWorkshop] = {
				 			startDate: this.getSeasonBatches[0].activities[i].startDate,
							endDate: this.getSeasonBatches[0].activities[i].endDate,
							dueDate: this.getSeasonBatches[0].activities[i].dueDate,
							location: this.getSeasonBatches[0].activities[i].location,
							time: this.getSeasonBatches[0].activities[i].time,
							amount: this.getSeasonBatches[0].activities[i].amount,
							type: this.getSeasonBatches[0].activities[i].type,
							name: this.getSeasonBatches[0].activities[i].id,
							classes: this.getSeasonBatches[0].activities[i].classes,
							title: this.getSeasonBatches[0].activities[i].title
				 		}
					} else {
						act[this.getSeasonBatches[0].activities[i].type.toLowerCase()] = {
				 			startDate: this.getSeasonBatches[0].activities[i].startDate,
							endDate: this.getSeasonBatches[0].activities[i].endDate,
							dueDate: this.getSeasonBatches[0].activities[i].dueDate,
							location: this.getSeasonBatches[0].activities[i].location,
							time: this.getSeasonBatches[0].activities[i].time,
							amount: this.getSeasonBatches[0].activities[i].amount,
							type: this.getSeasonBatches[0].activities[i].type,
							name: this.getSeasonBatches[0].activities[i].id,
							classes: this.getSeasonBatches[0].activities[i].classes,
							title: this.getSeasonBatches[0].activities[i].title
				 		}
					}
					activities.push(act)
			}
			return activities
		},
		customColumns () {
			try {
				// console.log('columns', this.columns)
				// console.log('batches', this.getSeasonBatches)
				// for (var i = 0; i < this.getSeasonBatches.length; i++) {
				// 	// get lng ung first batch separate ung sa next batch
				// }
				var numOfPayment = 0
				var numOfWorkshop = 0
				let col = this.$lodash.map(this.getSeasonBatches[0].activities, sb => {
					if (sb.type === 'payment') {
						// for number of payments
						numOfPayment++
						return {
							align: 'center',
							label: this.$store.getters['settings/titleCase'](`${sb.type} ${numOfPayment}`),
							name: `${sb.type.toLowerCase()}${numOfPayment}`,
							field: `${sb.type.toLowerCase()}${numOfPayment}`,
							type: sb.type,
							required: true
						}
					} else if (sb.type === 'workshop') {
						numOfWorkshop++
						return {
							align: 'center',
							label: this.$store.getters['settings/titleCase'](`${sb.type} ${numOfWorkshop}`),
							name: `${sb.type.toLowerCase()}${numOfWorkshop}`,
							field: `${sb.type.toLowerCase()}${numOfWorkshop}`,
							type: sb.type,
							required: true
						}
					} else {
						return {
							align: 'center',
							label: this.$store.getters['settings/titleCase'](sb.type),
							name: sb.type.toLowerCase(),
							type: sb.type,
							field: `${sb.type.toLowerCase()}`,
							required: true
						}
					}
				})
				// console.log('col', col)

				col.splice(0, 0, {
					align: 'center',
					label: 'Batch',
					name: 'batch',
					required: true
				})
				numOfPayment = 0
				numOfWorkshop = 0
				// console.log('custom col', col)
				col = [...col]
				var signedModels = {
					align: 'center',
					label: 'No. of Signed Models',
					name: 'signedModels',
					style: 'width: 500px'
				}
				var action = {
					align: 'center',
					label: 'Action',
					name: 'action',
				}
				col.push(signedModels)
				col.push(action)
				return col
			} catch {
				return []
			}

		},
		customBatches () {
			// console.log('cust', this.getSeasonBatches)
			let activities = []
			let numOfPayment = 0
			let numOfWorkshop = 0
			let toReturn = []
			for (var x = 0; x < this.getSeasonBatches.length; x++) {
				for (var i = 0; i < this.getSeasonBatches[x].activities.length; i++) {
					var act = {}
					if (this.getSeasonBatches[x].activities[i].type.toLowerCase() === 'payment') {
						numOfPayment++
						var startDate = this.$moment(this.getSeasonBatches[x].activities[i].startDate).format('ll')
						act[this.getSeasonBatches[x].activities[i].type + numOfPayment] = startDate
					} else if (this.getSeasonBatches[x].activities[i].type.toLowerCase() === 'workshop') {
						numOfWorkshop++
						var startDate = this.$moment(this.getSeasonBatches[x].activities[i].startDate).format('ll')
						act[this.getSeasonBatches[x].activities[i].type + numOfWorkshop] = startDate

					} else {
						var startDate = this.$moment(this.getSeasonBatches[x].activities[i].startDate).format('ll')
						act[this.getSeasonBatches[x].activities[i].type.toLowerCase()] = startDate
					}
					activities.push(act)
				}
				let obj = {}
				for (var i = 0; i < activities.length; i++) {
			    var o = activities[i]
			    for (var key in o) {
		        if (typeof o[key] != 'function') {
		           obj[key] = o[key];
		        }
			    }
				}
				numOfPayment = 0
				numOfWorkshop = 0
				toReturn.push(obj)
				// console.log('reconst', toReturn)
				// console.log('col', this.customColumns)
			}

			return toReturn
		},
		schedules: {
			get () {
				return this.$store.state.startUp.schedules
			},
			set (v) {
				this.$store.state.startUp.schedules
			}
		},
		getBatches () {
			var batches = this.$lodash.filter(this.schedules, s => {
				return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
			})
			return batches
		},
		getSeasonBatches: {
			get () {
				let sched = [...this.$store.state.startUp.schedules]
				let batch = this.$lodash.filter(sched, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
				})
				this.batches = batch
				// console.log('bat in seasonBatches', batch)
				return batch
			},
			set (v) {
				this.batches = v
			}
		},
		// getSeasonCourse: {
		// 	get () {
		// 		let sched = [...this.$store.state.startUp.schedules]
		// 		let batch = this.$lodash.filter(sched, s => {
		// 			return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
		// 		})
		// 		this.batches = batch
		// 		console.log('bat in seasonBatches', batch)
		// 		return batch
		// 	},
		// 	set (v) {
		// 		this.batches = v
		// 	}
		// },
		newSeason () {
			return this.$store.state.users.newSeason
		},
		newSeasonActivities: {
			get () {
				return this.$store.state.users.newSeasonActivities
			},
			set (v) {
				this.$store.state.users.newSeasonActivities = v
			}
		},
		getPaymentCourseActivity () {
			let event = this.$store.getters['startUp/getEvent'](this.eventKey)
			// console.log('event', event)
			// console.log('ourse', this.$store.state.startUp.courses)
			var i = this.$lodash.findIndex(this.$store.state.startUp.courses, c => {
				return c['.key'] === event.seasons[this.seasonNumber-1].course
 			})
 			// console.log('i', i)
			var index = this.$lodash.findIndex(this.$store.state.startUp.courses[i].activities, ca => {
				return ca.value === 'payment'
			})
			// console.log('index', index)
			return this.$store.state.startUp.courses[i].activities[index]
		},
		getPhotoshootCourseActivity () {
			let event = this.$store.getters['startUp/getEvent'](this.eventKey)
			// console.log('event', event)
			// console.log('ourse', this.$store.state.startUp.courses)
			var i = this.$lodash.findIndex(this.$store.state.startUp.courses, c => {
				return c['.key'] === event.seasons[this.seasonNumber-1].course
 			})
 			// console.log('i', i)
			var index = this.$lodash.findIndex(this.$store.state.startUp.courses[i].activities, ca => {
				return ca.value === 'photoshoot'
			})
			// console.log('index', index)
			return this.$store.state.startUp.courses[i].activities[index]
		},
		getPhotolikingCourseActivity () {
			let event = this.$store.getters['startUp/getEvent'](this.eventKey)
			// console.log('event', event)
			// console.log('ourse', this.$store.state.startUp.courses)
			var i = this.$lodash.findIndex(this.$store.state.startUp.courses, c => {
				return c['.key'] === event.seasons[this.seasonNumber-1].course
 			})
 			console.log('i', i)
			var index = this.$lodash.findIndex(this.$store.state.startUp.courses[i].activities, ca => {
				return ca.value === 'photoliking'
			})
			// console.log('index', index)
			return this.$store.state.startUp.courses[i].activities[index]
		}
	},
	data () {
		return {
			filterActivitiesSelection: [],
			setMyShowDate: 'asdfhasdf',
			batchLoading: false,
			course: [],
			selectedBatch: '',
			agendaActivities: [],
			someEventObject: [
				{
					id: 1,
					summary: 'Test event',
					description: 'Some extra info goes here',
					location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
					start: {
						dateTime: '2018-10-14T00:00:00.000Z' // ISO 8601 formatted // must string
					},
					end: {
						dateTime: '2018-10-14T00:00:00.000Z'
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
					summary: 'Test event',
					description: 'Some extra info goes here',
					location: 'Office of the Divine Randomness, 1232 Main St., Denver, CO',
					start: {
						dateTime: '2018-11-16T10:00:00' // ISO 8601 formatted // must string
					},
					end: {
						dateTime: '2018-11-16T10:00:00'
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
				}
			],
			viewAllBatches: '',
			editMode: false,
			generatedBatchActivities: [],
			selectedNode: '',
			workshops: {
				startDate: [],
				endDate: [],
				location: [],
				details: [],
				time: [],
			},
			workshopLength: 1,
			batch0: {},
			batches: [],
			messages: [],
			schedules2: [],
			isNewBatch: false,
			newBatch: {
				batchNumber: '',
				startDate: '',
			},
			newBatchStartDate: '',
			eventKey: '',
			seasonNumber: '',
			getAllActivities: [],
			showDate: new Date(),
			showEventTimes: true,
			enableDragDrop: false,
			startingDayOfWeek: 0,
			columns: [
		    {
		      name: 'batch',
		      required: true,
		      label: 'batch',
		      field: 'batchNumber',
		      align: 'left',
		    },
		    {
		      name: 'orientation',
		      required: true,
		      label: 'Orientation',
		      align: 'left',
		    },
		    {
		      name: 'payments',
		      required: true,
		      label: 'Payment',
		      align: 'left',
		    },
		    {

		      name: 'photoshoot',
		      required: true,
		      label: 'Photoshoot',
		      align: 'left',
		    },
		    {
		      name: 'photoliking',
		      required: true,
		      label: 'Photoliking',
		      align: 'center',
		    },
		    {
		      name: 'workshops',
		      required: true,
		      label: 'Workshops',
		      align: 'center',
		    },
		    {
		      name: 'otherActivities',
		      required: true,
		      label: 'Other Activities',
		      align: 'center',
		    },
		    {
		      name: 'finalEvent',
		      required: true,
		      label: 'Final event',
		      align: 'left',
		    }
		  ],
		  pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 0 // current rows per page being displayed
      }
		}
	},
	methods: {

		closeNewBatchModal () {
			this.$refs.newBatchModalRef.closeModal()
		},
		openNewBatch () {
			// :eventKey="eventKey"
			// 				:eventCode="getEventCode"
			// 				:seasonNumber="parseInt(seasonNumber)"
			// 				:seasonEnd="getSeasonEnd"
			// 				:lastBatchCourse="getLastBatch ? getLastBatch.course : []"> </new-batch-modal>
			this.$refs.newBatchModalRef.openModal(this.eventKey, this.getEventCode, parseInt(this.seasonNumber), this.getSeasonEnd, this.getLastBatch ? this.getLastBatch.course : {})
		},
		onChangeSelectBatch () {
			// console.log('this.$refs.editBatchModalRef', this.$refs.editBatchModalRefs)
			this.$refs.editBatchModalRefs.$refs.stepper.reset()
		},
		onShowEditBatch () {
			this.selectedBatch = this.editBatchOpt[0].value
			this.$refs.editBatchModalRefs.$refs.activityRef2.generateEventBatches()
			// console.log(, 'edit edit')
		},
		isMissingDetails (p) {
			// console.log('p', p)
			let location = typeof p.node.location !== 'undefined' ? p.node.location : false
			let details = typeof p.node.details !== 'undefined' ? p.node.details : false
			// console.log('loc det', location, details)
			if ((location === '' || details === '') && (p.node.type !== 'payment' && p.node.type !== 'photoliking' && p.node.type !== 'orientation')) {
				return true
			}
			return false
		},
		isBatchMissingDetails (p) {
			// console.log('p head', p)
			if (p.node.children) {
				let childrens = p.node.children
				for (var i = 0; i < childrens.length; i++) {
					if ((childrens[i].location === '' || childrens[i].details === '') && (childrens[i].type !== 'payment' && childrens[i].type !== 'photoliking' && childrens[i].type !== 'orientation')) {
						return true
					}
				}
			}
			return false
		},
		routeToSeason () {
			this.$router.push(`/eventseason/${eventKey}`)
		},
		getSignedModelInBatch (p) {
			console.log('getSignedModelInBatch', p)
		},
		activityType (t) {
			return this.$store.getters['startUp/titleCase'] (t)
		},
		editBatch2() {
			this.editBatchModal = true
		},
		editBatch () {
			this.editMode = !this.editMode
			this.viewMode = 'calendarMode'
		},
		selected (item) {
			console.log('item selected', item)
			// this.orientation.location = item.value
		},
		searchDetails (terms, done) {
			setTimeout(() => {
        done(filter(terms, {field: 'value', list: this.parseDetails}))
      }, 1000)
		},
		searchLocation (terms, done) {
			setTimeout(() => {
	      done(filter(terms, {field: 'value', list: this.parseLocations}))
	    }, 500)
		},
		selectUpcomingDate (ws, sun) {
			this.workshops.startDate[ws] = sun
			this.$forceUpdate()
		},
		alreadySelected (s) {
			try {
				let date = new Date(s)
				date.setHours(0,0,0,0)
				let lastPaymentDate = this.$store.getters['users/getLastOf3Payment'](this.generatedBatchActivities.activities)
				let aheadInFinalBatch = this.$mathMixin.dayDiff(new Date(this.getBatchFinalEvent.startDate), date)
				// console.log('aheadInFinalBatch', aheadInFinalBatch)
				// console.log('lastPaymentDate', lastPaymentDate.startDate)
				aheadInFinalBatch += 14
				var dif = this.$mathMixin.dayDiff(lastPaymentDate.startDate, date)
				if (aheadInFinalBatch >= 0) {
					return false
				}
				// console.log('dif', dif)
				if (dif <= 0) {
					return false
				}
				if (this.workshops.startDate.length != 0) {
					for (var i = 0; i < this.workshops.startDate.length; i++) {
						var dif2 = this.$mathMixin.dayDiff(new Date(this.workshops.startDate[i]), date)
						// console.log('dif2', dif2)
						if (dif2 <= 0) {
							return false
						}
					}
				}
				return true
			} catch	{
				return true
			}
		},
		generateBatchNodes () {
			this.batchNode = []
	    let sortedBatch = new Array()
			if (this.isNewBatch) {
				this.batchNode = []
				// console.log('schedules', this.$store.state.)
				// let batch = this.$lodash.filter(this.$store.state, s => {
				// 	return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
				// })
				let seasonBatches = [...this.getSeasonBatches]
				// console.log('seasonbatches', seasonBatches)
				// for (var x = 0; x < seasonBatches.length; x++) {
				// 	for (var y = 0; y < seasonBatches[x].activities.length; y++) {
				// 		seasonBatches[x].activities[y].startDate = new Date(seasonBatches[x].activities[y].startDate)
				// 		seasonBatches[x].activities[y].endDate = new Date(seasonBatches[x].activities[y].endDate)
				// 		seasonBatches[x].activities[y].dueDate = seasonBatches[x].activities[y].dueDate ? new Date(seasonBatches[x].activities[y].dueDate) : ''
				// 		seasonBatches[x].activities[y].time = seasonBatches[x].activities[y].time ? new Date(seasonBatches[x].activities[y].time) : ''
				// 		seasonBatchAct.push(seasonBatches[x].activities[y])
				// 	}
				// }
				let groupedBatch2 = new Array()
				for (var i = 0; i < seasonBatches.length; i++) {
					groupedBatch2.push(seasonBatches[i].activities)
				}
				groupedBatch2.push(this.$store.state.users.newSeasonActivities)
				// console.log('groupedBatch2', groupedBatch2)
				// console.log('newSeasonActivities', this.$store.state.users.newSeasonActivities)
				// let sortedBatch = new Array()
				for (var j = 0; j < groupedBatch2.length; j++) {
					var bnum = j
					bnum++
					let bat = {
						label: 'Batch ' + bnum,
						children: new Array()
					}
					let childs = new Array()
					for (var k = 0; k < groupedBatch2[j].length; k++) {
						let mapChild = {
							label: this.$store.getters['startUp/hasNumber'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch2[j][k].id)) ? this.$store.getters['startUp/titleCase'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch2[j][k].id)) : this.$store.getters['startUp/titleCase'](groupedBatch2[j][k].type),
							startDate: groupedBatch2[j][k].startDate.toString(),
							endDate: groupedBatch2[j][k].endDate.toString(),
							amount: groupedBatch2[j][k].amount ? groupedBatch2[j][k].amount : '',
							dueDate: groupedBatch2[j][k].dueDate ? groupedBatch2[j][k].dueDate : '',
							time: groupedBatch2[j][k].time ? groupedBatch2[j][k].time : '',
							location: groupedBatch2[j][k].location ? groupedBatch2[j][k].location : '',
							details: groupedBatch2[j][k].details ? groupedBatch2[j][k].details : '',
							batch: groupedBatch2[j][k].batch,
							classes: groupedBatch2[j][k].classes,
							eventKey: groupedBatch2[j][k].eventKey,
							id: groupedBatch2[j][k].id,
							title: groupedBatch2[j][k].title,
							type: groupedBatch2[j][k].type
						}
						childs.push(mapChild)
					}
					bat.children = childs
					sortedBatch.push(bat)
				}
				// console.log('sortedbat', sortedBatch)
				this.batchNode = sortedBatch
			} else if (this.$store.state.users.isNewSeasonActivities) {
				console.log('new season activities')

				// console.log('new season activiteis', this.$store.state.users.newSeasonActivities)
				let newSeasonAct = this.$store.state.users.newSeasonActivities
					let bat = {
						label: 'Batch 1',
						children: new Array()
					}
					let childs = new Array()
					for (var k = 0; k < newSeasonAct.length; k++) {
						let mapChild = {
							label: this.$store.getters['startUp/hasNumber'](this.$store.getters['startUp/get3rdAfterUnderline'](newSeasonAct[k].id)) ? this.$store.getters['startUp/titleCase'](this.$store.getters['startUp/get3rdAfterUnderline'](newSeasonAct[k].id)) : this.$store.getters['startUp/titleCase'](newSeasonAct[k].type),
							startDate: newSeasonAct[k].startDate.toString(),
							endDate: newSeasonAct[k].endDate.toString(),
							amount: newSeasonAct[k].amount ? newSeasonAct[k].amount : '',
							dueDate: newSeasonAct[k].dueDate ? newSeasonAct[k].dueDate : '',
							time: newSeasonAct[k].time ? newSeasonAct[k].time : '',
							location: newSeasonAct[k].location ? newSeasonAct[k].location : '',
							details: newSeasonAct[k].details ? newSeasonAct[k].details : '',
							batch: newSeasonAct[k].batch,
							classes: newSeasonAct[k].classes,
							eventKey: newSeasonAct[k].eventKey,
							id: newSeasonAct[k].id,
							title: newSeasonAct[k].title,
							type: newSeasonAct[k].type
						}
						childs.push(mapChild)
					}
					bat.children = childs
					sortedBatch.push(bat)
				// console.log('sorted batch', sortedBatch)
				this.batchNode = sortedBatch
			} else {
				// console.log('is not new batch')
				let seasonBatchAct = new Array()
				let activities = this.$store.state.users.newSeasonActivities
				// batch grouping
				let groupedBatch = new Array()
				// console.log('get season bachest', this.getSeasonBatches)
				for (var i = 1; i <= this.getSeasonBatches.length; i++) {
					var bat = this.$lodash.filter(activities, a => {
						return a.batch === i
					})
					groupedBatch.push(bat)
				}
				// console.log('grouped', groupedBatch)

				for (var j = 0; j < groupedBatch.length; j++) {
					var bnum = j
					bnum++
					let bat = {
						label: 'Batch ' + bnum,
						children: new Array()
					}
					let childs = new Array()
					for (var k = 0; k < groupedBatch[j].length; k++) {
						let mapChild = {
							label: this.$store.getters['startUp/hasNumber'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) ? this.$store.getters['startUp/titleCase'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) : this.$store.getters['startUp/titleCase'](groupedBatch[j][k].type),
							startDate: groupedBatch[j][k].startDate.toString(),
							endDate: groupedBatch[j][k].endDate.toString(),
							amount: groupedBatch[j][k].amount ? groupedBatch[j][k].amount : '',
							dueDate: groupedBatch[j][k].dueDate ? groupedBatch[j][k].dueDate : '',
							time: groupedBatch[j][k].time ? groupedBatch[j][k].time : '',
							location: groupedBatch[j][k].location ? groupedBatch[j][k].location : '',
							details: groupedBatch[j][k].details ? groupedBatch[j][k].details : '',
							batch: groupedBatch[j][k].batch,
							classes: groupedBatch[j][k].classes,
							eventKey: groupedBatch[j][k].eventKey,
							id: groupedBatch[j][k].id,
							title: groupedBatch[j][k].title,
							type: groupedBatch[j][k].type
						}
						childs.push(mapChild)
					}
					bat.children = childs
					sortedBatch.push(bat)
				}
				// console.log('sortedbat', sortedBatch)
				// children and label
				this.batchNode = sortedBatch
				// console.log('test', this.$store.getters['startUp/get3rdAfterUnderline']('TFF(1)_batch(1)_orientation'))
			}
		},
		selectNode (n) {
			console.log('n', n)
		},
		switchMode () {
			console.log('allAct', this.mergeBatches)
		},
		getStartDateMin (act) {
			// console.log('act min', act)
			// console.log('activities', this.$store.state.users.newSeasonActivities)
			try {
				return this.$store.state.users.newSeasonActivities[0].startDate
			} catch {
				return ''
			}
		},
		removeWorkshop (i) {
			try {
				if (typeof this.workshops.startDate[i] !== 'undefined') {
					this.workshops.startDate.splice(i, 1)
				}
				if (typeof this.workshops.location[i] !== 'undefined') {
					this.workshops.location.splice(i, 1)
				}
				if (typeof this.workshops.details[i] !== 'undefined') {
					this.workshops.details.splice(i, 1)
				}
			} catch {}
			this.workshopLength--
		},
		workshopMinDate (w) {
			// try {
				// console.log('w', w)
			// if (w >= 2) {
				// console.log('w > 2', w)
				// return this.$mathMixin.addDays(new Date(this.workshops.startDate[this.workshops.startDate.length-2]), 1).toString()
			// } else {
				// console.log('w < 2')
				try {
					if (w < 2) {
						if (this.workshops.startDate.length != 0) {
							let lastPaymentDate = this.$store.getters['users/getLastOf3Payment'](this.generatedBatchActivities.activities)
							return lastPaymentDate.startDate
						}
					} else {
						return this.$mathMixin.addDays(new Date(this.workshops.startDate[w-1]), 1).toString()
					}


				} catch {
					return ''
				}

				// console.log('lastpyamendate', lastPaymentDate)
				// var l = this.getSeasonBatches.length
				// let lastBatch = {...this.getSeasonBatches[l-1]}
				// let filterWorkshop = this.$lodash.filter(lastBatch.activities, lba => {
				// 	return lba.type === 'workshop'
				// })
				// var wLength = filterWorkshop.length
				// return this.$mathMixin.addDays(new Date(filterWorkshop[wLength-1].startDate), 1).toString()
			// }
			// } catch {
				// var l = this.getSeasonBatches.length
				// let lastBatch = {...this.getSeasonBatches[l-1]}
				// let filterWorkshop = this.$lodash.filter(lastBatch.activities, lba => {
				// 	return lba.type === 'workshop'
				// })
				// var wLength = filterWorkshop.length
				// return this.$mathMixin.addDays(new Date(filterWorkshop[wLength-1].startDate), 1).toString()
				// return ''
			// }
		},
		getSeasonBatches2 (eK, sN) {
			let b = this.$lodash.filter(this.schedules, s => {
				return s.eventKey === eK && s.seasonNumber === parseInt(sN)
			})
			return b
		},
		clearNewBatch () {
			this.newBatch.batchNumber = ''
			this.newBatchStartDate = ''
			this.workshops = {
				startDate: [],
				endDate: [],
				location: [],
				details: [],
				time: [],
			},
			this.workshopLength = 1
		},
		getField (b) {
			// console.log('batch', b)
			let key = Object.keys(b)
			// console.log('activities', this.getColumnsActivities)
			for (var i = 0; i < key.length; i++) {
				console.log('k', key[i])
				return `body-cell-${key[i]}`
			}
		},
		getBatch (b) {
			var batchNumber = {...b}
			// console.log('b', batchNumber)
			return ++batchNumber.__index
		},
		getOrientation (b) {
			console.log('b', b.activities)
			var activities = [...b.activities]
			var i = this.$lodash.findIndex(activities, a => {
				return a.type === 'orientation'
			})
			console.log('orientation', activities[i])
			return activities[i].startDate
		},
		getPayments (b) {
			console.log('p', b)
		},
		newSeasonStart () {
			// console.log('season', this.newSeason)
			return new Date(this.newSeason.seasonStart)
		},
		clearActivityModal () {
		},
		saveActivity () {
			// console.log('activity to save', this.activity.originalEvent)
			var i = this.$lodash.findIndex(this.newSeasonActivities, na => {
				return na.id === this.activity.originalEvent.id
			})
			this.newSeasonActivities[i].dueDate = this.activity.originalEvent.dueDate
			// console.log('due', this.activity.originalEvent.dueDate)
			if (this.activity.originalEvent.dueDate !== '' || typeof this.activity.originalEvent.dueDate !== 'undefined') {
				this.newSeasonActivities[i].endDate = this.activity.originalEvent.dueDate
			}
			this.newSeasonActivities[i].details = this.activity.originalEvent.details
			this.newSeasonActivities[i].location = this.activity.originalEvent.location
			this.newSeasonActivities[i].time = this.activity.originalEvent.time
			if (this.getSeasonStatus === 'open') {
				this.newSeasonActivities[i].updated = true
			}

			// console.log('type', this.activity.originalEvent.type)
			if (this.activity.originalEvent.time !== '' && typeof this.activity.originalEvent.time !== 'undefined') {
				console.log('with time')
 				this.newSeasonActivities[i].startDate = new Date(this.activity.originalEvent.startDate)
				this.newSeasonActivities[i].endDate	= new Date(this.activity.originalEvent.startDate)
				var getActHours = new Date(this.activity.originalEvent.time).getHours()
				var getActMin = new Date(this.activity.originalEvent.time).getMinutes()
				this.newSeasonActivities[i].endDate.setHours(getActHours, getActMin)
				this.newSeasonActivities[i].startDate.setHours(getActHours, getActMin)
			}
			else if (this.activity.originalEvent.dueDate !== '' && this.activity.originalEvent.type !== 'payment') {
				// console.log('no time')
				this.newSeasonActivities[i].startDate = new Date(this.activity.originalEvent.startDate)
				this.newSeasonActivities[i].endDate = new Date(this.activity.originalEvent.dueDate)
				console.log('act', this.newSeasonActivities[i])
				// this.newSeasonActivities[i].endDate.setHours(0,0,0,0)
				// this.activity.endDate.setHours(0,0,0,0)
			} else {
				this.newSeasonActivities[i].startDate = new Date(this.activity.originalEvent.startDate)
				this.newSeasonActivities[i].endDate = new Date(this.activity.originalEvent.startDate)
			}
			this.activity.endDate = this.newSeasonActivities[i].endDate
			console.log('real', this.activity)
			this.activityModal = false
			this.$forceUpdate()
		},
		saveSeasonActivities () {
			console.log('saving activities')
			this.showRight = false
			this.$q.dialog({
        title: 'Confirm Batch',
        message: `Do you want to save?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
      		if (this.$store.state.users.isNewSeasonActivities) {
		  			console.log('new seaon saving')
		  			console.log('season', this.$store.state.users.newSeason)
						console.log('season activities', this.$store.state.users.newSeasonActivities)
						this.$store.dispatch('users/addNewSeason')
							.then(() => {
								this.editMode = false
		            // this.$router.push(`/eventseason/${this.eventKey}`)
							})
		  		} else if (this.editMode) {
		  			console.log('editMode saving')
		  			this.confirmEditBatch()
		  		} else {
		  			console.log('new batch saving')
		  			let batchToSave = {...this.newBatch}
		  			var batchLength = this.getSeasonBatches.length
		  			++batchLength
		  			batchToSave.batchNumber = batchLength
		  			delete batchToSave.startDate
		  			for (var i = 0; i < batchToSave.activities.length; i++) {
		  				batchToSave.activities[i].batch = batchLength
		  				batchToSave.activities[i].startDate = batchToSave.activities[i].startDate.toString()
					    batchToSave.activities[i].endDate = batchToSave.activities[i].endDate.toString()
					    batchToSave.activities[i].dueDate = batchToSave.activities[i].dueDate ? batchToSave.activities[i].dueDate.toString() : ''
					    batchToSave.activities[i].updated = false
		  			}
		  			batchToSave.batchStart = batchToSave.activities[0].startDate
		  			console.log('batch to save', batchToSave)
		  			this.$store.dispatch('users/addNewBatch', batchToSave)
		  				.then(() => {
		  					this.isNewBatch = false
		  					this.$bindAsArray('schedules2', this.$database.ref('event_schedules'))
								let batches = this.$lodash.filter(this.schedules2, s => {
									return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
								})
								this.getSeasonBatches[0].activities = batches[0].activities
		  				})
		  			this.$forceUpdate()
		  		}
        }).catch(() => {})
      // this.showRight = false
		},
		cancel () {
			if (this.$store.state.users.isNewSeasonActivities) {
				this.$router.push(`/eventseason/${this.eventKey}`)
			} else if (this.editMode) {
				this.editMode = !this.editMode
				this.$bindAsArray('schedules2', this.$database.ref('event_schedules'))
				this.batches = this.$lodash.filter(this.schedules2, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
				})
				this.getSeasonBatches = this.batches
				this.newBatch = {}
				// this.newBatch.startDate = ''
				// this.newBatch.batchNumber = ''
				console.log('new batch refresh', this.newBatch)
				this.$bindAsArray('schedules2', this.$database.ref('event_schedules'))
				let batches = this.$lodash.filter(this.schedules2, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
				})
				this.getSeasonBatches[0].activities = batches[0].activities
				this.$store.state.users.showRight = false
				this.$store.state.startUp.schedules = this.schedules2
				this.viewMode = 'batchMode'
			} else {
				this.$store.state.users.newSeasonActivities = []
				this.$store.state.users.isNewSeasonActivities = false
				this.isNewBatch = false
				this.$bindAsArray('schedules2', this.$database.ref('event_schedules'))
				this.batches = this.$lodash.filter(this.schedules2, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
				})
				this.getSeasonBatches = this.batches
				this.newBatch = {}
				// this.newBatch.startDate = ''
				// this.newBatch.batchNumber = ''
				console.log('new batch refresh', this.newBatch)
				this.$bindAsArray('schedules2', this.$database.ref('event_schedules'))
				let batches = this.$lodash.filter(this.schedules2, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
				})
				this.viewAllBatches = false
				this.$store.state.startUp.schedules = this.schedules2
				this.getSeasonBatches[0].activities = batches[0].activities
				this.$store.state.users.showRight = false

			}
		},
		clickDate (e) {
		},
		clickEvent (e) {
			console.log('e', e)
			this.activity = this.$store.getters['startUp/getPlainValue'](e)
			console.log('this.activity', this.activity)
			this.activityModal = true
		},
		dropOnDate (e, d) {
			if (this.editMode || this.isNewBatch) {
				const eLength = this.$mathMixin.dayDiff(e.startDate, d)
				let eLength2 = 0
				if (this.$store.state.users.isNewSeasonActivities) {
					eLength2 = this.$mathMixin.dayDiff(new Date(this.newSeason.seasonStart), d)
				} else {
					eLength2 = this.$mathMixin.dayDiff(new Date(this.getBatchNewOrientation.startDate), d)
				}
				console.log('elength2', eLength2)
				console.log('elength', eLength)
				console.log('e', e)
				if (eLength2 >= 1 && e.originalEvent.type !== 'orientation' && e.originalEvent.type !== this.getBatchFinalEvent.type) {
					e.originalEvent.startDate = this.$mathMixin.addDays(new Date(e.startDate), eLength)
					e.originalEvent.endDate = this.$mathMixin.addDays(new Date(e.endDate), eLength)
				}
			}

		},
		setShowDate (d) {
			this.showDate = d
		},
		confirmNewBatch () {
			console.log('this new bach', this.newBatch)
			this.batch = new Array()
			this.batch0 = {...this.getSeasonBatches[0]}
			// let batch = this.$store.getters['startUp/getPlainValue'](this.getSeasonBatches[0])
			let batch = this.$store.getters['startUp/getPlainValue'](this.getLastBatch)
			var batchNumber = this.getSeasonBatches.length
			for (var a = 0; a < batch.activities.length; a++) {
				batch.activities[a].startDate = batch.activities[a].startDate.toString()
				batch.activities[a].endDate = batch.activities[a].endDate.toString()
			}
			// orientation
			++batchNumber
			var iOrientation = this.$lodash.findIndex(batch.activities, a => {
				return a.type === 'orientation'
			})
			batch.activities[iOrientation].startDate = new Date(this.newBatchStartDate)
			batch.activities[iOrientation].endDate = new Date(this.newBatchStartDate)
			batch.activities[iOrientation].startDate.setHours(0,0,0,0)
			batch.activities[iOrientation].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_orientation`
			batch.activities[iOrientation].title = `Batch(${batchNumber})_orientation`
			// batch.activities[iOrientation].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_orientation`
			// payment
			let paymentToDays = this.$store.getters['users/convertToDays']({dateType: this.getPaymentCourseActivity.dayAfter.dateType, dateNumber: this.getPaymentCourseActivity.dayAfter.dateNumber})
			var filterPayments = this.$lodash.filter(batch.activities, a => {
				return a.type === 'payment'
			})
			for (var i = 0; i < filterPayments.length; i++) {
				if (i  === 0) {
					filterPayments[i].startDate = this.$mathMixin.addDays(new Date(this.newBatchStartDate), 3)
					filterPayments[i].endDate = this.$mathMixin.addDays(new Date(this.newBatchStartDate), 3)
					filterPayments[i].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
					filterPayments[i].title = `Batch(${batchNumber})_payment(${i+1})`
					// filterPayments[i].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
					filterPayments[i].startDate.setHours(0,0,0,0)
					filterPayments[i].endDate.setHours(0,0,0,0)
				} else {
					filterPayments[i].startDate = this.$mathMixin.addDays(new Date(filterPayments[i-1].startDate), paymentToDays)
					filterPayments[i].endDate = this.$mathMixin.addDays(new Date(filterPayments[i-1].startDate), paymentToDays)
					filterPayments[i].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
					filterPayments[i].title = `Batch(${batchNumber})_payment(${i+1})`
					// filterPayments[i].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_payment(${i+1})`
					filterPayments[i].startDate.setHours(0,0,0,0)
					filterPayments[i].endDate.setHours(0,0,0,0)
				}
			}
			// photoshoot
			let photoshootToDays = this.$store.getters['users/convertToDays']({dateType: this.getPhotoshootCourseActivity.dayAfter.dateType, dateNumber: this.getPhotoshootCourseActivity.dayAfter.dateNumber})
			var iPhotoshoot = this.$lodash.findIndex(batch.activities, a => {
				return a.type === 'photoshoot'
			})
			batch.activities[iPhotoshoot].startDate = this.$mathMixin.addDays(new Date(filterPayments[0].startDate), photoshootToDays)
			batch.activities[iPhotoshoot].endDate = this.$mathMixin.addDays(new Date(filterPayments[0].startDate), photoshootToDays)
			batch.activities[iPhotoshoot].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoshoot`
			batch.activities[iPhotoshoot].title = `Batch(${batchNumber})_photoshoot`
			// batch.activities[iPhotoshoot].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoshoot`
			// photoliking
			let photolikingToDays = this.$store.getters['users/convertToDays']({dateType: this.getPhotolikingCourseActivity.dayAfter.dateType, dateNumber: this.getPhotolikingCourseActivity.dayAfter.dateNumber})
			var iPhotoliking = this.$lodash.findIndex(batch.activities, a => {
				return a.type === 'photoliking'
			})
			batch.activities[iPhotoliking].startDate = this.$mathMixin.addDays(new Date(filterPayments[1].startDate), photoshootToDays)
			batch.activities[iPhotoliking].endDate = this.$mathMixin.addDays(new Date(filterPayments[1].startDate), 14)
			batch.activities[iPhotoliking].dueDate = this.$mathMixin.addDays(new Date(filterPayments[1].startDate), 14)
			batch.activities[iPhotoliking].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoliking`
			batch.activities[iPhotoliking].title = `Batch(${batchNumber})_photoliking`
			// batch.activities[iPhotoliking].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_photoliking`
			batch.activities[iPhotoliking].startDate.setHours(0,0,0,0)
			batch.activities[iPhotoliking].endDate.setHours(0,0,0,0)
			// workshops
			let numOfWorkshop = 0
			for (var j = 0; j < batch.activities.length; j++) {

				if (batch.activities[j].type !== 'orientation' && batch.activities[j].type !== 'payment' && batch.activities[j].type !== 'photoshoot' && batch.activities[j].type !== 'photoliking') {
					batch.activities[j].startDate = new Date(batch.activities[j].startDate)
					batch.activities[j].endDate = new Date(batch.activities[j].endDate)
					batch.activities[j].time = batch.activities[j].time ? new Date(batch.activities[j].time) : ''
					batch.activities[j].dueDate = batch.activities[j].dueDate ? new Date(batch.activities[j].dueDate) : ''
					batch.activities[j].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}`
					batch.activities[j].title = `Batch(${batchNumber})_${batch.activities[j].type}`
					// batch.activities[j].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}`
					// eto ung pag change ng workshop ng batch number
					if (batch.activities[j].type === 'workshop') {
							numOfWorkshop++
							console.log('found workshop', numOfWorkshop)
							batch.activities[j].startDate = new Date(batch.activities[j].startDate)
							batch.activities[j].endDate = new Date(batch.activities[j].endDate)
							batch.activities[j].time = new Date(batch.activities[j].startDate)
							batch.activities[j].id = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}(${numOfWorkshop})`
							batch.activities[j].title = `Batch(${batchNumber})_${batch.activities[j].type}(${numOfWorkshop})`
							// batch.activities[j].title = `${this.$store.getters['startUp/getEvent'](this.eventKey).eventCode}(${this.seasonNumber})_batch(${batchNumber})_${batch.activities[j].type}(${numOfWorkshop})`
					}
				}
			}
			// if (this.isWorkshopIsAhead) {
			// 	console.log('workshops is ahead')
			// 	let filterWorkshop2 = this.$lodash.filter(batch.activities, ba => {
			// 		return ba.type === 'workshop'
			// 	})
			// 	for (var x = 0; x < filterWorkshop2.length; x++) {
			// 		filterWorkshop2[x].startDate = new Date(this.workshops.startDate[x])
			// 		filterWorkshop2[x].endDate = new Date(this.workshops.startDate[x])
			// 		filterWorkshop2[x].time = new Date(this.workshops.time[x])
			// 		filterWorkshop2[x].location = this.workshops.location[x] ? this.workshops.location[x] : ''
			// 		filterWorkshop2[x].details = this.workshops.details[x] ? this.workshops.details[x] : ''
			// 		var getWorkHours = new Date(filterWorkshop2[x].time).getHours()
			// 		var getWorkMin = new Date(filterWorkshop2[x].time).getMinutes()
			// 		filterWorkshop2[x].startDate.setHours(getWorkHours, getWorkMin)
			// 		filterWorkshop2[x].endDate.setHours(getWorkHours, getWorkMin)
			// 		delete filterWorkshop2[x].dueDate
			// 	}
			// }
			if (this.is4BatchMax) {
				console.log('workshop is 4batchMax')
				// console.log('workshops is ahead')
				let filterWorkshop2 = this.$lodash.filter(batch.activities, ba => {
					return ba.type === 'workshop'
				})
				for (var x = 0; x < filterWorkshop2.length; x++) {
					filterWorkshop2[x].startDate = new Date(this.workshops.startDate[x])
					filterWorkshop2[x].endDate = new Date(this.workshops.startDate[x])
					filterWorkshop2[x].time = new Date(this.workshops.time[x])
					filterWorkshop2[x].location = this.workshops.location[x] ? this.workshops.location[x] : ''
					filterWorkshop2[x].details = this.workshops.details[x] ? this.workshops.details[x] : ''
					var getWorkHours = new Date(filterWorkshop2[x].time).getHours()
					var getWorkMin = new Date(filterWorkshop2[x].time).getMinutes()
					filterWorkshop2[x].startDate.setHours(getWorkHours, getWorkMin)
					filterWorkshop2[x].endDate.setHours(getWorkHours, getWorkMin)
					delete filterWorkshop2[x].dueDate
				}
			}
			// console.log('photoshootToDays', photoshootToDays)
			console.log('batch', batch)
			this.newBatch = {...batch}
			this.$store.state.users.newSeasonActivities = [...batch.activities]
			this.setShowDate(new Date(this.newBatch.activities[0].startDate))
			this.generateBatchNodes
			this.isNewBatch = true
			this.newBatchModal = false
		},
		confirmEditBatch () {
			console.log('confirmEditBatch', this.getSeasonBatches)
			for (var i = 0; i < this.getSeasonBatches.length; i++) {
				var batchKey = this.getSeasonBatches[i]['.key']
				// console('batchkey', batchKey)
				let activities = this.getSeasonBatches[i].activities
				for (var j = 0; j < activities.length; j++) {
					activities[j].startDate = activities[j].startDate.toString()
					activities[j].endDate = activities[j].endDate.toString()
					activities[j].dueDate = activities[j].dueDate ? activities[j].dueDate.toString() : ''
					activities[j].time = activities[j].time ? activities[j].time.toString() : ''
				}
				console.log('act', activities)
				this.$database.ref(`event_schedules/${batchKey}/activities`).set(activities)
				.then(() => {
					console.log('success')
				})
				.catch((err) => {
					console.log('error', err)
					return
				})
			}
			// this.$store.dispatch('users/updateSeasonBatches', this.getSeasonBatches)
			// 	.then(() => {
			// 		console.log('done updating')
			// 	})
				// .then(() => {
				// 	this.$q.notify({
				// 		message: `${this.getSeasonBatches[0].eventName} Season ${this.getSeasonBatches[0].seasonNumber} has been succesfully updated`,
				// 		type: 'positive',
				// 		color: 'positive',
				// 		textColor: 'white',
				// 		icon: 'info'
				// 	})
				// 	// console.log('batch updated succesfully')
					this.$bindAsArray('schedules2', this.$database.ref('event_schedules'))
					this.$store.state.startUp.schedules = this.schedules2
					this.viewMode = 'batchMode'
					this.editMode = false
				// })
				// .catch(err => {
				// 	console.log('an error occur', err)
				// })
			// let vm = this
			// this.$q.dialog({
      //   title: 'Confirm Batch',
      //   message: `Do you want to save?`,
      //   ok: 'Yes',
      //   cancel: 'No'
      // }).then(() => {
      //   }).catch(() => {})
		},
		isAbleToRemove (p) {
			// try {
				if (p.row.__index >= this.customBatches.length-1) {
					var batchNumber = p.row.__index
					if (this.getSeasonStatus === 'standby') {

						// console.log('getSeasonStatus', this.getSeasonStatus)
						// console.log('batchn umber', batchNumber)
						//  &&
						if (this.getSeasonStatus === 'standby' || batchNumber === 0) {
							return true
						}
						batchNumber++
						var bIndex = this.$lodash.findIndex(this.getSeasonBatches, gb => {
							return gb.batchNumber === batchNumber
						})
						// console.log('bIndex', this.getSeasonBatches[bIndex])
						let batch = this.getSeasonBatches[bIndex]
						var key = batch['.key']
						let diff = this.$mathMixin.dayDiff(new Date(), new Date(p.row.orientation))
						if (diff > 0) {
							return true
						}
					}
				} else {
					return false
				}
			// } catch {
			// 	return false
			// }
		},
		removeBatch (p) {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Are you sure you want to delete this batch?',
			  ok: 'Yes',
			  cancel: 'No'
			}).then(() => {
					console.log('props', p)
					console.log('getSeasonBatches', this.getSeasonBatches)
					var batchNumber = p.row.__index
					batchNumber++
					if (batchNumber <= 1) {
						var bIndex = this.$lodash.findIndex(this.getSeasonBatches, gb => {
							return gb.batchNumber === batchNumber
						})
						console.log('bIndex', this.getSeasonBatches[bIndex])
						let batch = this.getSeasonBatches[bIndex]
						var key = batch['.key']
						let vm = this
						this.$database.ref('event_schedules').child(key).remove()
							.then(() => {
								let eventKey = this.eventKey
								let seasonNumber = this.seasonNumber
								this.$database.ref(`events/${this.eventKey}/seasons/${this.seasonNumber-1}`).remove()
									.then(() => {
										vm.$q.notify({
											message: `${batch.eventName} Season ${batch.seasonNumber} has been removed`,
											type: 'info',
											color: 'info',
											textColor: 'white',
											icon: 'info'
										})
										vm.$router.push(`/eventseason/${this.eventKey}`)
									})
									.catch((err) => {
										console.log('an error occur', err)
									})
								})
					} else {
						var bIndex = this.$lodash.findIndex(this.getSeasonBatches, gb => {
							return gb.batchNumber === batchNumber
						})
						console.log('bIndex', this.getSeasonBatches[bIndex])
						let batch = this.getSeasonBatches[bIndex]
						var key = batch['.key']
						this.$database.ref('event_schedules').child(key).remove()
							.then(() => {
								this.$q.notify({
									message: `${batch.eventName} Season ${batch.seasonNumber} has been removed`,
									type: 'info',
									color: 'info',
									textColor: 'white',
									icon: 'info'
								})
							})
					}
				}).catch(() => {})
		},
		checkIfOverlap () {
			// checkIfCompleteDetails
			// console.log('batches', this.getSeasonBatches)
			// let seasonBatches = this.$store.getters['users/getSeasonBatches']({eventKey: this.eventKey, seasonNumber: p.seasonNumber})
			// let upcomingBatch = this.$store.getters['users/getUpcomingBatch'](seasonBatches)
			// let bActivities = this.getSeasonBatches[0].activities
			// console.log('getLastBatch', this.getLastBatch)
			// var isNotComplete = false
			// let activityNotComplete = {}
			
			this.$refs.newBatchModalRef.openModal(this.eventKey, this.getEventCode, parseInt(this.seasonNumber), this.getSeasonEnd, this.getLastBatch ? this.getLastBatch.course : {})

			// for (var j = 0; j < bActivities.length; j++) {
			// 	if (!bActivities[j].dueDate && !bActivities[j].amount  && bActivities[j].type !== 'orientation') {
			// 		if (bActivities[j].location === '' || bActivities[j].details === '') {
			// 			activityNotComplete = bActivities[j]
			// 			isNotComplete = true
			// 			j = bActivities.length
			// 		}
			// 	}
			// }

			// if (isNotComplete) {
			// 	this.$q.dialog({
			// 		title: 'Failed to Launch',
			// 		message: `Please complete the details of Batch ${this.getSeasonBatches[0].batchNumber}`
			// 	})
			// } else {
			// 	console.log(this.isCanAddAnotherBatch, 'isCanAddAnotherBatch')
			// 	if (this.isCanAddAnotherBatch) {
			// 		this.generateNewBatchDate()
			// 	} else {
			// 		this.$q.dialog({ title: 'Add New Batch', message: `Batch Exceed to limit`})
			// 	}
			// }
			// console.log('is complete?', isNotComplete)
		},
		getNumOfSignedModels (p) {
			console.log('contractSigned', p)
			var batchNumber = p.__index
			++batchNumber
			console.log('b number', batchNumber)
			var bIndex = this.$lodash.findIndex(this.getSeasonBatches, gb => {
				return gb.batchNumber === batchNumber
			})
			// console.log('index', bIndex)
			let batch = this.getSeasonBatches[bIndex]
			console.log('batch', batch)
			console.log('batchkey', batch['.key'])
			let signedBatchModels = this.$lodash.filter(this.seasonBatchContractSigned, sbcs => {
				console.log('sbcs', sbcs.batchKey)
				return sbcs.batchKey === batch['.key']
			})
			console.log('signedbatchmodels', signedBatchModels.length)
			return signedBatchModels.length
			// get the batch
		},
		generateNewBatchDate () {
			let orient = this.getLastBatch.activities[0]
			let sundays = this.$store.getters['startUp/getUpcomingWeekEnds']({startDate: new Date(orient.startDate), weekEnd: 'sundays'})
			let filterSun = new Array()
 			for (var i = 0; i < sundays.length; i++) {
 				let dif = this.$mathMixin.dayDiff(new Date(orient.startDate),  new Date(sundays[i]),)
 				if (dif > 0) {
	 				filterSun.push(sundays[i])
 				}
 			}
 			// console.log('filterSun', filterSun)
 			this.newBatchStartDate = filterSun[0]
		},
		generateWorkshopScheds () {
			let payment3 = this.$lodash.filter(this.getLastBatch.activities, lb => {
				return lb.type === 'payment'
			})[2]
			let firstOtherAct = this.$lodash.filter(this.getLastBatch.activities, lb => {
				return lb.type === this.getOtherActivities[0].label
			})[0]
			// console.log('payment3', payment3)
			// console.log('firstOtherAct', firstOtherAct)
			let sundays = this.$store.getters['startUp/getUpcomingWeekEnds']({startDate: new Date(payment3.startDate), weekEnd: 'sundays'})

			let filterSun = new Array()
 			for (var i = 0; i < sundays.length; i++) {
 				let dif = this.$mathMixin.dayDiff(new Date(payment3.startDate),  new Date(sundays[i]),)
 				if (dif > 0) {
	 				filterSun.push(sundays[i])
 				}
 			}
	 		filterSun.splice(0, this.getWorkshopActivity.length)
	 		let filterSun2 = new Array()
	 		for (var i = 0; i < filterSun.length; i++) {
 				let dif = this.$mathMixin.dayDiff(new Date(firstOtherAct.startDate),  new Date(filterSun[i]),)
 				// console.log('dif', dif)
 				if (dif < 0) {
	 				filterSun2.push(filterSun[i])
 				}
 			}
 			console.log('filterSun2', filterSun2)
 			console.log('getWorkshopActivity', this.getWorkshopActivity)
 			for (var i = 0; i < this.getWorkshopActivity.length; i++) {
 				this.workshops.startDate[i] = new Date(filterSun2[i])
 				this.workshops.endDate[i] = new Date(filterSun2[i])
 				this.workshops.location[i] = this.getWorkshopActivity[i].location
 				this.workshops.details[i] = this.getWorkshopActivity[i].details
 				var getWorkHour = new Date(this.getWorkshopActivity[i].startDate).getHours()
				var getWorkMin = new Date(this.getWorkshopActivity[i].startDate).getMinutes()
				this.workshops.startDate[i].setHours(getWorkHour, getWorkMin,0,0)
				this.workshops.endDate[i].setHours(getWorkHour, getWorkMin,0,0)
				this.workshops.time[i] = new Date(this.getWorkshopActivity[i].startDate)
 			}
 			console.log('workshops', this.workshops)
		},
		test () {
			// console.log('getSeasonBatches', this.getSeasonBatches	)
			// this.$refs.testRef.openModal()
			console.log(this.filterActivitiesSelection,  'filterActivitiesSelection')
		}
		// end of methods
	}
}
</script>
<style>
.calendar {
display: flex;
	height: 50vh;
	width: 87vw;
	margin-left: 6vw;
}
</style>
