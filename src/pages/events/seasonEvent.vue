<template>
	<div>
    <q-toolbar color="faded">
      <q-toolbar-title>
				<span class="q-title">{{getEventName}}</span>
				<div class="row justify-left" >
					<div class="col-md-3" >
						<q-breadcrumbs  color="white" active-color="info" separator=">">
							<q-breadcrumbs-el class="q-subheading text-weight-bold" color="info" label="Events" to="/events"/>
							<q-breadcrumbs-el class="q-subheading text-weight-bold" active color="info" label="Seasons" />
						</q-breadcrumbs>
					</div>
				</div>
				
				
        	<!-- <span class="q-title" slot="subtitle">{{getEventName}}</span> -->
					<!-- <q-btn @click="test">test</q-btn> -->
			</q-toolbar-title>

			<q-btn class="q-mx-md" icon="mdi-calendar-import" type="file" color="primary" @click="uploadNewSeasonBatchesModal = true" label="Import Season Batches" />	
      <q-btn
				:disable="seasonLoading"
				icon="mdi-calendar-plus"
      	v-if="getSeasons !== [] || isLastSeasonClosed"
      	size="md"
      	color="positive"	
        @click="seasonModal = !seasonModal"
        label="New Season"
      />
		</q-toolbar>
		<!-- season table -->
		
		<q-table
			class="q-ma-md"
      :data="getSeasons"
      :columns="columns"
      :pagination.sync="pagination"
			:loading="seasonLoading"
      separator="cell"
      no-data-label="No Season yet"
      row-key="eventCode"
    >
      <!-- <q-tr slot="body" slot-scope="props" :props="props" @click.native="showSeason(props.row)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr> -->
      <!-- season start -->
      <q-td slot="body-cell-seasonStart" slot-scope="props" :props="props">
      	{{$moment(getSeasonStart(props)).format('ll')}}
      </q-td>
      <!-- season end -->
      <q-td slot="body-cell-seasonEnd" slot-scope="props" :props="props">
      	{{$moment(props.row.seasonEnd).format('ll')}}
      </q-td>

      <!-- batches -->
      <q-td slot="body-cell-batches" slot-scope="props" :props="props">
        <q-btn rounded color="positive" size="sm" label="View Batches" @click="viewBatches(props.row)" >
					<!-- <q-chip v-if="hasMissingDetails(props)" floating color="warning"><q-icon name="warning" /></q-chip> -->
        </q-btn>
      </q-td>

      <!-- no of participants -->
      <q-td slot="body-cell-participants" slot-scope="props" :props="props">
      	{{getNumOfParticipants(props.row)}}
      </q-td>
      <!-- action button -->
      <q-td slot="body-cell-actions" slot-scope="props" :props="props">

      	<q-chip v-if="isReadyToLaunch" square color="info">Ready to Launch</q-chip> <br/><br/>
        <q-btn size="sm" v-if="isSeasonOngoing(props.row)" color="positive" icon="launch" @click="isSeasonBatchNotComplete(props.row)" > Launch</q-btn>
        <q-btn v-if="!isSeasonOngoing(props.row)" size="sm" color="negative" icon="cancel" @click="standbySeason(props.row)" >cancel</q-btn>
        <!-- <q-btn v-if="isSeasonOngoing(props.row)" color="secondary" @click="editSeason(props.row)" size="sm" icon="edit" >Edit</q-btn> -->
        <q-btn v-if="isHasBatches(props.row)" color='negative' icon="cancel" @click="deleteSeason(props.row)" />
        <!-- <q-btn color='negative' icon="cancel" @click="checkSeasonEnd" /> -->
      </q-td>
    </q-table>

    <!-- season modal :content-css="{minWidth: '50vw', minHeight: '30vh'}" -->
		<q-modal maximized :content-css="{minWidth: '100%', minHeight: '100%'}" v-model="seasonModal"  @show="hasSavedDraft" @hide="clearSeasonModal">
			<q-modal-layout>
				<q-toolbar slot="header">
					<q-toolbar-title>
						{{isEdit ? 'Edit Season': 'New Season'}}
					</q-toolbar-title>

					<!-- <q-select v-model="select" :options="selectOptions" /> -->
					<!-- <q-btn label="test" @click="test2" /> -->
					<q-btn rounded icon="save alt" color="secondary" size="sm" label="save as draft" @click="saveAsDraft()"/>

						<q-btn
							flat
							round
							dense
							@click="seasonModal = !seasonModal"
							icon="close"
						/>
						<!-- <q-btn label="test" @click="test2" /> -->
				</q-toolbar>
				<!-- content -->

				<q-stepper color="secondary" ref="stepper" alternative-labels>
					<!-- first page -->
					<q-step default name="first" title="Season Information">
						<div class="content-class q-ma-md">
							<q-select
								class="q-mx-md"
								v-model="season.course"
								stack-label="Course"
								float-label="Select Event Type"
								:error="$v.season.course.$error"
								:options="courseOpt"
							/>
							<q-btn flat class="q-mx-md" label="add new course" icon="add" color="info" size="sm" @click="newCourseModal = true"/>
							<!-- <q-btn flat class="q-mx-md" label="add new course" icon="add" color="info" size="sm" @click="$router.push('/coursesSettings')"/> -->
							<br/>
							<q-chip v-if="season.course" class="q-mx-md" square color="info">
								<span  class="q-caption">Activities:
									<span class="q-caption" v-for="(act, i) in getCourseActivities" :key="i">
										, {{act.label}}
									</span>
								</span>
							</q-chip>
							<q-input readonly hide-underline type="number" class="q-ma-md" v-model="getLatestSeason" stack-label="Season Number"/>
							<q-field
								class="q-ma-md"
							>
							<!-- -->
								<q-datetime
									format="MMM-DD-YYYY"
									v-model="season.seasonStart"
									@change="seasonStartIsWeekEnd"
									stack-label="Season Start (1st Batch Orientation)"
									:min="getSeasonStartMinDate ? getSeasonStartMinDate : null"
									:error="$v.season.seasonStart.$error || seasonStartError"
								/>
							</q-field>

							<q-field
								class="q-ma-md"
								error-label="Please pick weekend date"
							>
								<q-datetime
									:disable="isSeasonStartEmpty"
									v-model="season.seasonEnd"
									@change="seasonEndIsWeekEnd"
									format="MMM-DD-YYYY"
									stack-label="Season End (Final Event)"
									:min="$mathMixin.addDays(new Date(season.seasonStart), 44)"
									:error="$v.season.seasonEnd.$error || seasonEndError"
								/>
							</q-field>

							<q-item-separator />
							<q-field
								class="q-ma-md"
								error-label="Invalid TIcket Count"
							>
								<q-input type="number" v-model="season.ticketCount" stack-label="Ticket Count" :error="$v.season.ticketCount.$error"/>
							</q-field>

							<q-field
								class="q-ma-md"
								error-label="Invalid Ticket Price"
							>
								<q-input type="number" v-model="season.ticketPrice" prefix="P " stack-label="Ticket Price" :error="$v.season.ticketPrice.$error"/>
							</q-field>

							<q-field
								class="q-ma-md"
								error-label="Invalid Registration Fee"
							>
								<q-input type="number"  v-model="season.discount" stack-label="Pre-Registration Fee" prefix="P" :error="$v.season.discount.$error"/>
							</q-field>

							<q-field label="Total Amount" class="q-mx-md">
								<q-input hide-underline readonly type="text" prefix="P " class="q-mx-md" v-model="getTotalAmount" float-label="Cash"/>
								<q-input hide-underline readonly type="text" prefix="P " class="q-mx-md" v-model="getInstallmentAmount" float-label="Installment"/>
							</q-field>

							<q-field
								class="q-ma-md"
								error-label="Invalid Number of Payments"
							>
								<q-input type="number" v-model="season.numberOfPayments" stack-label="Number of Payments" :error="$v.season.numberOfPayments.$error"/>
							</q-field>

							<q-field
								error-label="Please check fields"
							>
								<div class="row" v-if="isHasWorkshop">
									<q-input type="number" class="q-ma-md" v-model="season.numberOfWorkshops" stack-label="Number of Workshops" :error="$v.season.numberOfWorkshops.$error"/>

									<!-- <q-input type="number" class="q-ma-md" v-model="season.batchCapacity" stack-label="Batch Capacity" :error="$v.season.batchCapacity.$error"/>	 -->
								</div>
								
							</q-field>

							

							<q-select
								class="q-ma-md"
								v-model="season.colorCode"
								:disable="getLastSeason > 1"
								float-label="Color Code (for scheduling purpose)"
								:options="colorOpt"
								:error="$v.season.colorCode.$error"
							/>
						</div>

						<!-- Navigation for this step at the end of QStep-->
						<q-stepper-navigation class="flex">
							<q-btn class="q-ma-md fixed-bottom-right" v-if="!isEdit" color="positive" @click="createActivity()" label="Next" icon="navigate_next"/>
							<!-- <q-btn color="secondary" @click="$refs.stepper.next()" label="Continue" /> -->
						</q-stepper-navigation>
					</q-step>

					<!-- activity tab -->
					<q-step name="second" icon="calendar_today" title="Activity Schedules">

							<!-- <preview></preview> -->
						<!-- <activity-modal ref="activityRef" :season="season"></activity-modal> -->
						<activities 
							ref="activityRef"
							:seasonStart="season.seasonStart" 
							:seasonEnd="season.seasonEnd"
							:latestSeason="getLatestSeason"
							:courseKey="season.course"
							:eventKey="eventKey"
							:eventCode="getEventCode"
							:seasonNumber="getLatestSeason"
							:classes="season.colorCode"
							:totalAmount="getInstallmentAmount2"
							:numberOfPayments="parseInt(season.numberOfPayments)"
							:batchCapacity="season.batchCapacity"
							:isRestoreAsDraft="isRestoreAsDraft"
						> </activities>
							<!-- :numberOfWorkshops="season.numberOfWorkshops" -->
						<!-- navigation -->
						<q-stepper-navigation>
							<!-- <q-btn color="secondary" @click="$refs.activityRef.saveSeasonActivities()" icon="navigate_next" label="Confirm Activities" /> -->
							<q-btn class="q-ma-md fixed-bottom-left" color="secondary" icon="arrow back ios" @click="$refs.stepper.previous(), isRestoreAsDraft = false" label="Back" />
								<q-btn class="q-ma-md fixed-bottom-right" color="positive" icon-right="arrow forward ios" @click="toPreviewActivity()" label="Next" />
						</q-stepper-navigation>
					</q-step>

					<!-- preview tab -->
					<q-step name="third" icon="visibility" title="Preview">
						
						<div class="q-pb-md">
							<preview
								ref="previewRef"
								:course="season.course"
								:discount="season.discount"
								:eventKey="eventKey"
								:eventCode="getEventCode"
								:eventName="getEventName"
								:numberOfPayments="season.numberOfPayments"
								:numberOfWorkshops="season.numberOfWorkshops"
								:seasonNumber="getLatestSeason"
								:ticketCount="season.ticketCount"
								:ticketPrice="season.ticketPrice"
								:totalAmount="getInstallmentAmount2"
								:seasonDraftKey="getSeasonDraftKey"
								:hasSeasonDraft="checkIfHasSavedDraft"
							></preview>
						</div>
						<!-- navigation -->
						<q-stepper-navigation>
							<!-- <q-btn color="secondary" @click="$refs.activityRef.saveSeasonActivities()" icon="navigate_next" label="Confirm Activities" /> -->
							<q-btn class="q-ma-md fixed-bottom-left" color="secondary" icon="arrow back ios" @click="toBackActivity()" label="Back" />
								<q-btn class="q-ma-md fixed-bottom-right" color="positive" icon-right="arrow forward ios" @click="confirmActivities(), isRestoreAsDraft = false" label="Finish" />
						</q-stepper-navigation>
					</q-step>


				</q-stepper>

				<!-- <div slot="footer">
					<q-btn
						v-if="!isEdit"
						class="full-width"
						color="positive"
						@click="createActivity"
						label="Next"
					/>
					<q-btn
						v-if="isEdit"
						class="full-width textbox"
						color="secondary"
						@click="updateSeason"
						label="Update"
					/>
				</div> -->
					<!-- spinner loading -->
					<q-inner-loading :visible="seasonLoading">
						<q-spinner size="50px" color="primary"></q-spinner>
					</q-inner-loading>
			</q-modal-layout>
		</q-modal>
		<!-- activity modal -->
		<q-modal v-model="activityModal" :content-css="{minWidth: '60vw', minHeight: '60vh'}" @hide="clearSeasonModal">
				<q-modal-layout
					footer-style="{fontSize: '24px', fontWeight: 'bold'}"
				>
				<div slot="header">
					<q-toolbar>
						<q-toolbar-title>
							Activities
						</q-toolbar-title>
							<q-btn flat round dense @click="activityModal = !activityModal" icon="close" />
					</q-toolbar>
				</div>

				<div>
					<!-- <activity-modal :courseKey="season.course" :numOfPayments="season.numberOfPayments" :seasonStart="season.seasonStart" :seasonEnd="season.seasonEnd" :totalAmount="season.totalAmount" ref="activityRef"></activity-modal> -->
					<activity-modal ref="activityRef"></activity-modal>
				</div>

				<div slot="footer">
					<q-btn
							v-if="!isEdit"
							class="full-width"
							color="primary"
							@click="viewActivities"
							label="Save"
						/>
				</div>
			</q-modal-layout>
		</q-modal>
		
		<!-- add new course modal -->
		<q-modal maximized v-model="newCourseModal" :content-css="{minWidth: '80vw', minHeight: '80vh'}">
			<q-modal-layout
				footer-style="{ height: '24px' }"
			>
				<q-toolbar slot="header">
					<q-btn
						flat
						round
						dense
						v-close-overlay
						icon="keyboard_arrow_left"
					/>
					<q-toolbar-title>
						New Course
					</q-toolbar-title>
				</q-toolbar>

				<div slot="footer" class="bg-primary row flex justify-center">
					<q-btn
						icon="save"
						v-if="!isEdit"
						color="positive"
						@click="saveNewCourse2()"
						label="Save"
					/>
				</div>
				<new-course
				ref="newCourseRef"> </new-course>
			</q-modal-layout>
		</q-modal>


		<!-- season edit modal -->
		<!-- mark -->
		<q-modal v-model="editSeasonModal" :content-css="{minWidth: '50vw', minHeight: '50vh'}">
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
						Edit Season
					</q-toolbar-title>
				</q-toolbar>

				<div class="q-pa-md">
					<q-select
								class="q-mx-md"
								v-model="season.course"
								stack-label="Course"
								float-label="Select Event Type"
								:error="$v.season.course.$error"
								:options="courseOpt"
							/>
							<!-- <q-btn flat class="q-mx-md" label="add new course" icon="add" color="info" size="sm" @click="courseModal = true"/> -->
								<q-btn flat class="q-mx-md" label="add new course" icon="add" color="info" size="sm" @click="$router.push('/coursesSettings')"/>
							<br/>
							<q-chip class="q-mx-md" square color="info">
								<span class="q-caption">Activities:
									<span class="q-caption" v-for="(act, i) in getCourseActivities" :key="i">
										, {{act.label}}
									</span>
								</span>
							</q-chip>
							<q-input 
								readonly 
								hide-underline 
								type="number" 
								class="q-ma-md" 
								v-model="getLatestSeason" 
								stack-label="Season Number"/>

							<q-datetime
								class="q-ma-md"
								format="MMM-DD-YYYY"
								v-model="season.seasonStart"
								stack-label="Season Start"
								:min="$mathMixin.addDays(new Date(), 1)"
								:error="$v.season.seasonStart.$error"
							/>
							<q-datetime
								:disable="isSeasonStartEmpty"
								class="q-ma-md"
								v-model="season.seasonEnd"
								format="MMM-DD-YYYY"
								stack-label="Season End"
								:min="$mathMixin.addDays(new Date(season.seasonStart), 30)"
								:error="$v.season.seasonEnd.$error"
							/>
							<q-item-separator />
							<q-input type="number" class="q-ma-md" v-model="season.ticketCount" stack-label="Ticket Count" :error="$v.season.ticketCount.$error"/>

							<q-input type="number" class="q-ma-md" v-model="season.ticketPrice" stack-label="Ticket Price" :error="$v.season.ticketPrice.$error"/>

							<q-input type="number" class="q-ma-md" v-model="season.discount" stack-label="Pre-Registration Fee" prefix="P" :error="$v.season.discount.$error"/>

							<q-input type="number" class="q-ma-md" v-model="season.numberOfPayments" stack-label="Number of Payments" :error="$v.season.numberOfPayments.$error"/>

							<q-input v-if="isHasWorkshop" type="number" class="q-ma-md" v-model="season.numberOfWorkshops" stack-label="Number of Workshops"/>

							<q-field label="Total Amount">
								<q-input disable type="text" prefix="P " class="q-mx-md" v-model="getTotalAmount"/>
							</q-field>
							<q-select
								class="q-ma-md"
								v-model="season.colorCode"
								float-label="Color Code (for scheduling purpose)"
								:options="colorOpt"
								:error="$v.season.colorCode.$error"
							/>

				</div>
				<div slot="footer">
					<div class="row">
						<q-btn class="col" label="Save" color="positive" />
						<q-btn class="col" label="cancel" color="negative" />
					</div>
				</div>
			</q-modal-layout>
		</q-modal>

		<import-new-season-batches
			:courseOpt="courseOpt"
			:latestSeason="getLatestSeason"
			> </import-new-season-batches>

  </div>
</template>
<script>
import XLSX from 'xlsx'
import JsonExcel from 'vue-json-excel'

import ActivityModal from './activityModal'
import Activities from '../../components/activities'
import Preview from '../../components/activityPreview'
import NewCourse from '../../components/eventComponents/newCourseModal'
import ImportNewSeasonBatches from '../../components/ImportNewSeasonBatches'

import { required, between } from 'vuelidate/lib/validators'
import { filter } from 'quasar'
import draggable from 'vuedraggable'

export default {
	components: {
		Activities,
		Preview,
		ActivityModal,
		draggable,
		NewCourse,
		'downloadExcel': JsonExcel,
		ImportNewSeasonBatches
	},
	validations () {
		return {
			season: {
				course: {
					required
				},
				ticketCount: {
					required,
					between: between(1, 200)
				},
				ticketPrice: {
					required,
					between: between(1, 9999)
				},
				discount: {
					required,
					between: between(1, 9999)
				},
				numberOfPayments: {
					required,
					between: between(1, 20)
				},
				numberOfWorkshops: {
					between: between(1, 10)
				},
				batchCapacity: {
					between: between(1, 10)
				},
				seasonStart: {
					required
				},
				seasonEnd: {
					required
				},
				colorCode: {
					required
				},
			},
			courseName: {
				required
			},
			activityName: {
				required
			}
		}
	},
	created () {
		this.eventKey = this.$route.params.id
		this.seasonLoading = true
		// this.getSetTempSeasonDraft()
	},
	mounted () {
		this.$bindAsArray('courses', this.$database.ref('settings/courses'), null, () => {
			this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey), null, () => {
				this.$bindAsArray('schedules2', this.$database.ref('event_schedules'), null, () => {
					this.$bindAsArray('seasonDraft', this.$database.ref('seasonDraftTemplate').orderByChild('eventKey').equalTo(this.eventKey), null, () => {
						console.log(this.colorOpt, 'color op')
						this.season.colorCode = this.getLastSeasonColorCode
						
						this.seasonLoading = false
						this.$store.state.settings.courses = this.courses
						this.$store.state.startUp.schedules = this.schedules2
					})			
				})		
			})	
		})
	},
	watch: {
		'getTotalAmount': function () {
			let amount = parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)
			let getDiscount = amount * 0.10
			// console.log('getDiscount', getDiscount)
			// this.season.discount = getDiscount || 0
		}
	},
	computed: {
		uploadNewSeasonBatchesModal: {
			get () {
				return this.$store.state.schedules.uploadNewSeasonBatchesModal
			},
			set (v) {
				this.$store.state.schedules.uploadNewSeasonBatchesModal = v
			}
		},
		newCourseModal: {
			get () {
				return this.$store.state.schedules.newCourseModal
			},
			set (v) {
				this.$store.state.schedules.newCourseModal = v
			}
		},
		getSeasonDraftKey () {
			try {
				// console.log('seasonsdraft', this.seasonDraft[0])
				return this.seasonDraft[0] ? this.seasonDraft[0]['.key'] : ''
			} catch {}
		},
		// waitForSeasonDraft () {
		// 	return new Promise(resolve => {
		// 		resolve(this.$store.getters['startUp/getPlainValue'](this.seasonsDraft[0]))
		// 	})
		// },
		getEventCode () {
			try {
				var i = this.$lodash.findIndex(this.$store.state.startUp.events, e => {
					return e['.key'] === this.eventKey
				})
				return this.$store.state.startUp.events[i].eventCode
			} catch (err) {}
		},
		getSeasonStartMinDate () {
			if (this.getLatestSeason >= 2) {
				return this.getLastBatchOrientation
			} else {
				return this.$mathMixin.addDays(new Date(), 1)
			}
		},
		getLastBatchOrientation () {
			try {
				this.$bindAsArray('events3', this.$database.ref('events'))
				let event = this.$lodash.find(this.events3, e => {
					return e['.key'] === this.eventKey
				})
				let seasonLen = event.seasons.length
				let season = event.seasons[seasonLen-1]
				let seasonBatches = this.$lodash.filter(this.schedules2, s => {
					return s.eventKey === this.eventKey && s.seasonName === season.seasonName
				})
				let lastBatch = this.$lodash.maxBy(seasonBatches, b => {
					return b.batchNumber
				})
				let orientation = lastBatch.activities[0]
				return orientation.startDate
				// let seasonLen = event.seasons.length
		 		// console.log('lastBatch', lastBatch)
			} catch (err) {
				return {}
			}
		},
		getLastSeasonColorCode () {
			try {
				this.$bindAsArray('events3', this.$database.ref('events'))
				let event = this.$lodash.find(this.events3, e => {
						return e['.key'] === this.eventKey
					})
					let seasonLen = event.seasons.length
					let season = event.seasons[seasonLen-1]
					let seasonBatches = this.$lodash.filter(this.schedules2, s => {
						return s.eventKey === this.eventKey && s.seasonName === season.seasonName
					})
					let lastBatch = this.$lodash.maxBy(seasonBatches, b => {
						return b.batchNumber
					})
					let orientation = lastBatch.activities[0]
					// return orientation.startDate
					// let seasonLen = event.seasons.length
					// 			console.log('orientation', orientation)
					// console.log('colorOpt', this.colorOpt)
					this.season.colorCode = orientation.classes
					return orientation.classes		
					// this.clearDataAfterSaveAsDraft()
			} catch (err) {
				return ''
			}
		},
		isHasWorkshop () {
			let courseActivities = this.getCourseActivities
			let isHas = false
			this.$lodash.forEach(this.getCourseActivities, ca => {
				if (ca.value === 'workshop' || ca.value === 'workshops') {
					// console.log('has a workshop')
					isHas = true
					return
				}
			})
			return isHas
		},
		isReadyToLaunch() {
			return this.isNotComplete
		},
		isSeasonStartEmpty () {
			if (this.season.seasonStart === '') {
				return true
			}
			return false
		},
		getCourseActivities () {
			try {
			 	let course = this.$lodash.filter(this.courses, c => {
			 		return c['.key'] === this.season.course
			 	})[0]
			 	return course.activities
			} catch (err) {
				return []
			}
	  },
		dragOptions() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        group: 'label',
        disabled: this.isEditNewActivity
      }
    },
		parseActivities () {
			return this.$store.getters['settings/parseActivities']
		},
		activityErrorLabel () {
			if (this.activityName === '') {
				return ''
			} else if (this.isEditNewActivity) {
				return ''
			}
			else {
				return 'Activity Already Exist'
			}
		},
		activityError () {
			if (this.isEditNewActivity) {
				return false
			} else {
				// console.log('activity error processing')
				return this.$store.getters['settings/isExistActivity']({activities: this.newCourseActivities, activity: this.activityName})
			}
		},
		getLastActivity () {
			try {
				let actLen = this.newCourseActivities.length
				let lastAct = this.newCourseActivities[actLen-1]
				// console.log('lastAct', lastAct)
				return lastAct
			} catch (err) {
				return ''
			}
		},
		// courseModal: {
		// 	get () {
		// 		return this.$store.state.users.courseModal
		// 	},
		// 	set (v) {
		// 		this.$store.state.users.courseModal = v
		// 	}
		// },
		event2: {
			get () {
				return this.$store.getters['startUp/getEvent'](this.eventKey)
			},
			set (v) {
				let event = this.$store.getters['startUp/getEvent'](this.eventKey)
				event = v
			}
		},
		contractSigned: {
			get () {
				return this.$store.state.startUp.contractSigned
			},
			set (v) {
				this.$store.state.startUp.contractSigned = v
			}
		},
		isLastSeasonClosed () {
			try {
				var i = this.$lodash.findIndex(this.events, e => {
					return e['.key'] === this.eventKey
				})
				if (this.events[i].seasons[this.getLastSeason].status === 'closed') {
					return true
				}
				return false
			} catch (err) {
				return false
			}
		},
		events () {
			return this.$store.state.startUp.events
		},
		schedules () {
			return this.$store.state.startUp.schedules
		},
		dateToday () {
			return new Date()
		},
		getEventName () {
			try {
				return this.event[0].eventName
			} catch (err) {}
		},
		getSeasons () {
			try {
				console.log('event in get seasons', this.event)
				return this.event[0].seasons
			} catch (err) {
				return []
			}
		},
		getLastSeason () {
			try {
				let event = this.$store.getters['startUp/getEvent'](this.eventKey)
				var len = event.seasons.length
				return len-1
			} catch (err) {
				return 1
			}
		},
		getLatestSeason () {
			try {
        if (this.event[0].seasons.length != 0) {

					let lastSeason = this.$store.getters['startUp/getPlainValue'](this.$lodash.last(this.event[0].seasons))
					console.log(lastSeason, 'latest season')
					return ++lastSeason.seasonNumber
          // return ++this.event[0].seasons.length
        } else {
          return 1
        }
			} catch (err) {
				return 1
			}
		},
		getInstallmentAmount () {
			try {
        let amount = (parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)) + this.season.discount
        let isNan = parseInt(amount) || 0
        // console.log('isnan', isNan)
        return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } catch (err) { return 0 }
		},
		getInstallmentAmount2 () {
			try {
        let amount = (parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)) + this.season.discount
        let isNan = parseInt(amount) || 0
        // console.log('isnan', isNan)
        return isNan
      } catch (err) { return 0 }
		},
		getTotalAmount () {
			try {
        let amount = parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)
        let isNan = parseInt(amount) || 0
        // console.log('isnan', isNan)
        return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } catch (err) { return 0 }
		},
		courseOpt () {
      let opt = this.$lodash.map(this.courses, c => {
        return {label: c.courseName, value: c['.key']}
      })
      return opt
    },
		seasonModal: {
      get () {
        return this.$store.state.users.seasonModal
      },
      set (v) {
        this.$store.state.users.seasonModal = v
      }
    },
    seasonLoading: {
    	get () {
        return this.$store.state.users.seasonLoading
      },
      set (v) {
        this.$store.state.users.seasonLoading = v
      }
    },
    activityModal: {
    	get () {
        return this.$store.state.users.activityModal
      },
      set (v) {
        this.$store.state.users.activityModal = v
      }
    },
    colorOpt () {
			console.log(this.getLastSeason, 'last seasn')
			if (this.getLatestSeason < 2) {
				// if (this.getseason)
				let events = this.$store.state.startUp.events
				let colorCodes = [...this.$store.state.startUp.colorOpt]
				for (var i = 0; i < events.length; i++) {
					if (typeof events[i].seasons !== 'undefined') {
						for (var j = 0; j < colorCodes.length; j++) {
							if (events[i].seasons[0].colorCode === colorCodes[j].value) {
								colorCodes[j].visible = false
							}
						}
					}
				}
				let filter = this.$lodash.filter(colorCodes, c => {
					return c.visible === true
				})
				return filter
			} else {
				let events = this.$store.state.startUp.events
				let colorCodes = [...this.$store.state.startUp.colorOpt]
				// for (var i = 0; i < events.length; i++) {
				// 	if (typeof events[i].seasons !== 'undefined') {
				// 		for (var j = 0; j < colorCodes.length; j++) {
				// 			if (events[i].seasons[0].colorCode === colorCodes[j].value) {
				// 				colorCodes[j].visible = false
				// 			}
				// 		}
				// 	}
				// }
				return colorCodes
			}
    },
    checkIfHasSavedDraft () {
    	if (this.seasonDraft !== undefined && this.seasonDraft.length !== 0) {
				return true
			} else {
				return false
			}
    }
	},
	data () {
		return {
			testevent: [],
			dataForExcel: [
        { colA: "Hello", colB: "World" },
        {
          colA: "Multi-line",
          /* Multi-line value: */
          colB:
            "This is a long paragraph\nwith multiple lines\nthat should show in a single cell."
        },
        { colA: "Another", colB: "Regular cell" }
      ],
			json_fields: [],
			json_data: [
				{
					'name': '',
					'city': '',
					'country': '',
					'birthdate': ''
				}
			],
			json_meta: [
				[
					{
						'key': 'charset',
						'value': 'utf-8'
					}
				]
			],
			isRestoreAsDraft: false,
			drafts: [],
			selectOptions: [],
			select: '',
			events3: [],
			seasonEndError: false,
			seasonStartError: false,
			editSeasonModal: false,
			schedules2: [],
			activityArrangement: [],
			arrangeModal: false,
			activityIndex: -1,
			dateTypeOpt: [
      	{ label: 'days', value: 'days'},
      	{ label: 'weeks', value: 'weeks'},
      	{ label: 'months', value: 'months'}
      ],
			isEditNewActivity: false,
			activityStatus: {
				time: true,
				dueDate: false,
				location: true,
				details: true
			},
			dayAfter: { dateNumber: 0, dateType: 'days'},
			activityName: '',
			newActivityModal: false,
			newCourseActivities: [
				{
					dayAfter: { dateNumber: 0, dateType: 'days' },
					details: false,
					eventType: '',
					dueDate: false,
					label: 'Orientation',
					location: true,
					time: true,
					value: 'orientation',
					visible: true
				},
				{
					dayAfter: { dateNumber: 1, dateType: 'weeks' },
					details: false,
					eventType: '',
					dueDate: false,
					label: 'Payment',
					location: false,
					time: false,
					value: 'payment',
					visible: true
				},
				{
					dayAfter: { dateNumber: 3, dateType: 'days' },
					details: false,
					dueDate: false,
					eventType: '',
					label: 'Photoshoot',
					location: true,
					time: true,
					value: 'photoshoot',
					visible: true
				},
				{
					dayAfter: { dateNumber: 2, dateType: 'days' },
					details: false,
					dueDate: true,
					eventType: '',
					label: 'Photoliking',
					location: false,
					time: false,
					value: 'photoliking',
					visible: true
				},
				{
					dayAfter: { dateNumber: 0, dateType: 'days' },
					details: true,
					dueDate: false,
					eventType: '',
					label: 'Workshop',
					location: true,
					time: true,
					value: 'workshop',
					visible: true
				},
				{
					dayAfter: { dateNumber: 0, dateType: 'days' },
					details: true,
					dueDate: false,
					eventType: '',
					label: 'General Rehersal',
					location: true,
					time: true,
					value: 'general rehersal',
					visible: true
				},
				{
					dayAfter: { dateNumber: 0, dateType: 'days' },
					details: true,
					dueDate: false,
					eventType: '',
					label: 'Final Event',
					location: true,
					time: true,
					value: 'final event',
					visible: true
				}
			],
			courseName: '',
			courseModal: false,
			isEdit: false,
			eventKey: '',
			courses: [],
			event: [],
			season: {
				course: '',
				ticketCount: '',
				ticketPrice: '',
				discount: '',
				totalAmount: this.getInstallmentAmount2,
				numberOfPayments: 3,
				numberOfWorkshops: 3,
				batchCapacity: 4,
				seasonStart: '',
				seasonEnd: '',
				colorCode: '',
			},
			columns: [
		    {
		      name: 'seasonName',
		      required: true,
		      label: 'Season Name',
		      align: 'left',
		      field: 'seasonName',
		      sortable: true
		    },
		    {
		      name: 'seasonNumber',
		      required: true,
		      label: 'Season No.',
		      align: 'center',
		      field: 'seasonNumber',
		      sortable: true
		    },
		    {
		      name: 'seasonStart',
		      required: true,
		      label: 'Start',
		      align: 'left',
		      sortable: true
		    },
		    {
		      name: 'seasonEnd',
		      required: true,
		      label: 'End',
		      align: 'center',
		      sortable: true
		    },
		    {
		      name: 'status',
		      required: true,
		      label: 'Status',
		      align: 'center',
		      field: 'status',
		      sortable: true
		    },
		    {
		      name: 'batches',
		      required: true,
		      label: 'Batches',
		      align: 'center',
		      sortable: true
		    },
		    {
		      name: 'participants',
		      required: true,
		      label: 'No. of Participants',
		      style: 'width: 50px',
		      align: 'center',
		      sortable: true
		    },
		    {
		      name: 'actions',
		      required: true,
		      label: 'Actions',
		      align: 'center',
		      field: 'name',
		      sortable: false
		    }
		  ],
		  pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
		}
	},
	methods: {
		getSetTempSeasonDraft: async function () {
			// console.log('calling')
			// console.log('await this.waitForSeasonDraft', await this.waitForSeasonDraft)
			this.$store.state.schedules.tempSeasonDraft = await this.waitForSeasonDraft
			// console.log('done', this.$store.state.schedules.tempSeasonDraft)
		},
		hasSavedDraft () {
			if (this.seasonDraft !== undefined && this.seasonDraft.length !== 0) {
				this.$q.dialog({
			    title: 'Draft',
			    message: `Do you want to continue saved draft?`,
			    ok: 'Yes',
			    cancel: 'No'
			  }).then(() => {
			  		// console.log('continue to fill data')
			  		this.fillSeasonDraft()
			    }).catch(() => {
			    	// console.log('disagreed')
			    	// this.clearDataAfterSaveAsDraft()
			    })
			} else {
				console.log(this.getLatestSeason, 'getLastSeason')
				console.log(this.getLastSeasonColorCode, 'color code')
					console.log(this.colorOpt, 'color code')
					
				if (this.getLatestSeason > 1) {
					
					// 	let color = this.$lodash.find(this.colorOpt, c => {
					// 	return c.value === this.getLastSeasonColorCode
					// })
					this.season.colorCode = this.getLastSeasonColorCode
					// console.log(color, 'color code')
				}
			}
		},
		saveAsDraft () {
			// console.log('season datas', this.season)
			this.$q.dialog({
		    title: 'Save as draft',
		    message: `Do you want to save as draft?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
					let seasonDraft = {}
					this.season.totalAmount = this.getInstallmentAmount2
					seasonDraft.season = this.season
					this.setToStrings()
					seasonDraft.photolikingPickDateChecked = this.$store.state.schedules.photolikingPickDateChecked
		  		seasonDraft.photoshootPickDateChecked = this.$store.state.schedules.photoshootPickDateChecked
		  		seasonDraft.paymentsPickDateChecked = this.$store.state.schedules.paymentsPickDateChecked
		  		seasonDraft.workshopPickDateChecked = this.$store.state.schedules.workshopPickDateChecked
		  		seasonDraft.otherActivitiesPickDateChecked = this.$store.state.schedules.otherActivitiesPickDateChecked
		  		seasonDraft.selectFinalEventLocation = this.$store.state.schedules.selectFinalEventLocation
		  		seasonDraft.selectOtherActivityLocation = this.$store.state.schedules.selectOtherActivityLocation
		  		seasonDraft.selectWorkshopLocation = this.$store.state.schedules.selectWorkshopLocation
		  		seasonDraft.selectPhotoshootLocation = this.$store.state.schedules.selectPhotoshootLocation
		  		seasonDraft.selectOrientationLocation = this.$store.state.schedules.selectOrientationLocation
		  		seasonDraft.orientation = this.$store.state.schedules.orientation
		  		seasonDraft.paymentsAmount = this.$store.state.schedules.paymentsAmount
		  		seasonDraft.payments = this.$store.state.schedules.payments
		  		seasonDraft.photoshoot = this.$store.state.schedules.photoshoot
		  		seasonDraft.photoliking = this.$store.state.schedules.photoliking
		  		seasonDraft.workshops = this.$store.state.schedules.workshops
		  		seasonDraft.otherActivities = this.$store.state.schedules.otherActivities
		  		seasonDraft.finalEvent = this.$store.state.schedules.finalEvent
		  		seasonDraft.plottedActivities = this.$store.state.schedules.plottedActivities
		  		seasonDraft.seasonNumber = this.getLatestSeason
		  		seasonDraft.eventKey = this.eventKey
		  		seasonDraft.dateCreated = new Date().toString()
		  		// console.log('seasondraft', seasonDraft)
		  		if (this.checkIfHasSavedDraft) {
		  			var key = this.seasonDraft[0]['.key']
		  			this.$store.dispatch('schedules/updateAsDraft', {key: key, draft: seasonDraft})
			  			.then(() => {
			  				this.clearDataAfterSaveAsDraft ()
			  				this.$refs.stepper.goToStep('first')
			  				this.seasonModal = false
			  			})
			  			.catch(() => {})
		  		} else {
		  			this.$store.dispatch('schedules/saveAsDraft', seasonDraft)
			  			.then(() => {
			  				this.clearDataAfterSaveAsDraft()
			  				this.$refs.stepper.goToStep('first')
			  				this.seasonModal = false
			  			})
			  			.catch(() => {})
		  		}
		    }).catch(() => {})
		},
		fillSeasonDraft () {
			let seasonDraft = this.$store.getters['startUp/getPlainValue'](this.seasonDraft[0])
			// console.log('seasonDraft', seasonDraft)
			this.season = seasonDraft.season
			this.$store.state.schedules.photolikingPickDateChecked = seasonDraft.photolikingPickDateChecked
  		this.$store.state.schedules.photoshootPickDateChecked = seasonDraft.photoshootPickDateChecked
  		this.$store.state.schedules.paymentsPickDateChecked = seasonDraft.paymentsPickDateChecked
  		this.$store.state.schedules.workshopPickDateChecked = seasonDraft.workshopPickDateChecked
  		this.$store.state.schedules.otherActivitiesPickDateChecked = seasonDraft.otherActivitiesPickDateChecked
  		this.$store.state.schedules.selectFinalEventLocation = seasonDraft.selectFinalEventLocation
  		this.$store.state.schedules.selectOtherActivityLocation = seasonDraft.selectOtherActivityLocation
  		this.$store.state.schedules.selectWorkshopLocation = seasonDraft.selectWorkshopLocation
  		this.$store.state.schedules.selectPhotoshootLocation = seasonDraft.selectPhotoshootLocation
  		this.$store.state.schedules.selectOrientationLocation = seasonDraft.selectOrientationLocation
  		this.$store.state.schedules.orientation = seasonDraft.orientation
  		this.$store.state.schedules.paymentsAmount = seasonDraft.paymentsAmount
  		this.$store.state.schedules.payments = seasonDraft.payments
  		this.$store.state.schedules.photoshoot = seasonDraft.photoshoot
  		this.$store.state.schedules.photoliking = seasonDraft.photoliking
  		if (typeof seasonDraft.workshops.startDate !== 'undefined') {
  			// console.log('not undefined', seasonDraft.workshops)
  			this.$store.state.schedules.workshops = seasonDraft.workshops
  		} else {
  			// console.log('undefined')
  			seasonDraft.workshops.startDate = []
  			for (var i = 0; i < seasonDraft.season.numberOfWorkshops; i++) {
					this.workshops.startDate[i] = null
					this.workshops.endDate[i] = null
				}
  		}
  		// console.log('seasonDraft.otherActivities', seasonDraft.otherActivities)
  		this.$store.state.schedules.otherActivities = seasonDraft.otherActivities
  		this.$store.state.schedules.finalEvent = seasonDraft.finalEvent
  		if (typeof seasonDraft.plottedActivities !== 'undefined') {
	  		for (var i = 0; i < seasonDraft.plottedActivities.length; i++) {
	  			seasonDraft.plottedActivities[i].startDate = new Date(seasonDraft.plottedActivities[i].startDate)
	  			seasonDraft.plottedActivities[i].endDate = new Date(seasonDraft.plottedActivities[i].endDate)
	  		}
	  		this.$store.state.schedules.plottedActivities = seasonDraft.plottedActivities
  		} else {
  			// console.log('seasonDraft.plottedActivities undefined', seasonDraft.plottedActivities)
  		}
			this.isRestoreAsDraft = true
		},
		clearDataAfterSaveAsDraft () {
			this.season = {
				course: '',
				ticketCount: '',
				ticketPrice: '',
				discount: '',
				totalAmount: 0,
				numberOfPayments: 3,
				numberOfWorkshops: 3,
				batchCapacity: 4,
				seasonStart: '',
				seasonEnd: '',
				colorCode: '',
			}
			this.$store.state.schedules.photolikingPickDateChecked = false
  		this.$store.state.schedules.photoshootPickDateChecked = false
  		this.$store.state.schedules.paymentsPickDateChecked = []
  		this.$store.state.schedules.workshopPickDateChecked = []
  		this.$store.state.schedules.otherActivitiesPickDateChecked = []
  		this.$store.state.schedules.selectFinalEventLocation = ''
  		this.$store.state.schedules.selectOtherActivityLocation = []
  		this.$store.state.schedules.selectWorkshopLocation = []
  		this.$store.state.schedules.selectPhotoshootLocation = ''
  		this.$store.state.schedules.selectOrientationLocation = ''
  		this.$store.state.schedules.orientation = {
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
		  }
  		this.$store.state.schedules.paymentsAmount = []
  		this.$store.state.schedules.payments = {
		    startDate: [],
		    endDate: [],
		    eventKey: [],
		    id: [],
		    title: [],
		    actType: '',
		    type: [],
		    classes: [],
		    amount: []
		  }
  		this.$store.state.schedules.photoshoot = {
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
		  }
  		this.$store.state.schedules.photoliking = {
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
		  }
  		this.$store.state.schedules.workshops = {
		    startDate: [],
		    endDate: [],
		    time: [],
		    location: [],
		    details: [],
		    eventKey: [],
		    id: [],
		    title: [],
		    actType: [],
		    type: [],
		    classes: []
		  }
  		this.$store.state.schedules.otherActivities = {
		    startDate: [],
		    endDate: [],
		    time: [],
		    location: [],
		    details: [],
		    eventKey: [],
		    id: [],
		    title: [],
		    type: [],
		    actType: [],
		    classes: []
		  }
  		this.$store.state.schedules.finalEvent = {
		    startDate: '',
		    endDate: '',
		    time: 'Sat Jan 12 2019 08:00:00',
		    location: '',
		    details: '',
		    eventKey: '',
		    id: '',
		    title: `Final Event`,
		    type: 'final event',
		    actType: 'detailed',
		    classes: ''
		  },
  		this.$store.state.schedules.plottedActivities = []
		},
		setToStrings () {
			// orientation
			this.$store.state.schedules.orientation.startDate = this.$store.state.schedules.orientation.startDate.toString()
			this.$store.state.schedules.orientation.endDate = this.$store.state.schedules.orientation.endDate.toString()
			// payments
			for (var i = 0; i < this.$store.state.schedules.payments.startDate.length; i++) {
				// console.log('isdate', this.$store.state.schedules.payments.startDate[i] instanceof Date)
				if (this.$store.state.schedules.payments.startDate[i] instanceof Date) {
					this.$store.state.schedules.payments.startDate[i] = this.$store.state.schedules.payments.startDate[i].toString()
					this.$store.state.schedules.payments.endDate[i] = this.$store.state.schedules.payments.endDate[i].toString()
				}
			}
			// photoshoot
			this.$store.state.schedules.photoshoot.endDate = this.$store.state.schedules.photoshoot.endDate.toString()
			this.$store.state.schedules.photoshoot.startDate = this.$store.state.schedules.photoshoot.startDate.toString()
			// photoliking
			this.$store.state.schedules.photoliking.endDate = this.$store.state.schedules.photoliking.endDate.toString()
			this.$store.state.schedules.photoliking.startDate = this.$store.state.schedules.photoliking.startDate.toString()
			// workshops
			for (var i = 0; i < this.$store.state.schedules.workshops.startDate.length; i++) {
				if (this.$store.state.schedules.workshops.startDate[i] instanceof Date) {
					this.$store.state.schedules.workshops.startDate[i] = this.$store.state.schedules.workshops.startDate[i].toString()
					this.$store.state.schedules.workshops.endDate[i] = this.$store.state.schedules.workshops.endDate[i].toString()
				}
			}
			// otheractivities
			for (var i = 0; i < this.$store.state.schedules.otherActivities.startDate.length; i++) {
				if (this.$store.state.schedules.workshops.startDate[i] instanceof Date) {
					this.$store.state.schedules.otherActivities.startDate[i] = this.$store.state.schedules.otherActivities.startDate[i].toString()
				}
			}
			for (var j = 0; j < this.$store.state.schedules.otherActivities.endDate.length; j++) {
				// if (this.$store.state.schedules.workshops.endDate[j] instanceof Date) {
					this.$store.state.schedules.otherActivities.endDate[j] = this.$store.state.schedules.otherActivities.endDate[j].toString()
				// }
			}
			// final event
			this.$store.state.schedules.finalEvent.endDate = this.$store.state.schedules.finalEvent.endDate.toString()
			this.$store.state.schedules.finalEvent.startDate = this.$store.state.schedules.finalEvent.startDate.toString()
			// plottedactivities
			for (var i = 0; i < this.$store.state.schedules.plottedActivities.length; i++) {
				this.$store.state.schedules.plottedActivities[i].startDate = this.$store.state.schedules.plottedActivities[i].startDate.toString()
				this.$store.state.schedules.plottedActivities[i].endDate = this.$store.state.schedules.plottedActivities[i].startDate.toString()
			}
		},
		toBackActivity () {
			this.$refs.stepper.previous()
			this.$store.state.schedules.plottedActivities = []
			// console.log('plotted', this.$store.state.schedules.plottedActivities)
		},
		toPreviewActivity () {
			console.log(this.$refs.activityRef, 'actref')
			this.$refs.activityRef.$v.workshops.$touch()
			this.$refs.activityRef.toPreview()
				.then(result => {
					if (result) {
						console.log(result, 'result')
						this.$refs.stepper.next()
					}
				})
		},
		seasonEndIsWeekEnd () {
			// try {	
				let seasonEnd = new Date(this.season.seasonEnd)

			 	// console.log('getDay of season start', seasonEnd.getDay())
			 	if(seasonEnd.getDay() === 0 || seasonEnd.getDay() === 6) {
			 		// console.log('getDay', seasonEnd.getDay())
			 		this.seasonEndError = false
			 	} else {
			 		// console.log('triggering seasonstart error')
			 		this.seasonEndError = true
			 	}

			// } catch {
			// 	this.seasonStartError = false
			// }
		},
		seasonStartIsWeekEnd () {
			// try {
				let seasonStart = new Date(this.season.seasonStart)

			 	// console.log('getDay of season start', seasonStart.getDay())
			 	if(seasonStart.getDay() === 0 || seasonStart.getDay() === 6) {
			 		// console.log('getDay', seasonStart.getDay())
			 		this.seasonStartError = false
			 	} else {
			 		// console.log('triggering seasonstart error')
			 		this.seasonStartError = true
			 	}

			// } catch {
			// 	this.seasonStartError = false
			// }
		},
		editSeason (p) {
			// console.log('p', p)
			this.editSeasonModal = true
		},
		capitalizeAct () {
			try {
				this.activityName = this.$store.getters['settings/titleCase'](this.activityName)
			} catch (err) {}
		},
		capitalize () {
			try {
				this.courseName = this.$store.getters['settings/titleCase'](this.courseName)
			} catch (err) {}
		},
		saveNewCourse2 () {
			var vm = this
			async function getPromise () {
				// let promise = new Promise.resolve()
				let result = await vm.$refs.newCourseRef.saveNewCourse2()
				// console.log(result, 'key')

				vm.season.course = result
			}
			getPromise()
		},
		saveNewCourse () {
			this.$v.courseName.$touch()
			this.capitalize()
			let newCourse = {
				courseName: this.courseName,
				courseValue: this.courseName.toLowerCase(),
				activities: this.newCourseActivities
			}
			if (this.$v.courseName.$error || this.$store.getters['settings/isExistCourses'](this.courseName)) {
				this.$q.notify('Please review fields')
			} else {
				this.$q.dialog({
			    title: 'Confirmation',
			    message: `Do you want to add new ${this.courseName}?`,
			    ok: 'Yes',
			    cancel: 'No'
			  }).then(() => {
			  		this.$database.ref('settings/courses').push(newCourse)
							.then((snapshot) => {
								this.courseModal = false
								// console.log('snapshot', snapshot)
								this.season.course = snapshot.key
							})
							.catch(err => {
								console.log('err', err)
							})
			    }).catch(() => {})
			}
		},
		saveArrangement () {
			// console.log('activityArrangement', this.activityArrangement)
			this.newCourseActivities = this.activityArrangement
			this.arrangeModal = false
		},
		isDontMove (a) {
			if (a.value !== 'orientation' && a.value !== 'payment' && a.value !== 'final event' && a.value !== 'photoshoot' && a.value !== 'photoliking' && a.value !== this.getLastActivity.value) {
				return 'open_with'
			} else {
				return ''
			}
		},
		arrangement () {
			this.activityArrangement = [...this.newCourseActivities]
			this.arrangeModal = true
		},
		checkMove: function(evt){
			// console.log('moving')
			let length = evt.relatedContext.list.length
    	return (evt.draggedContext.element.value !== 'orientation' && evt.draggedContext.element.value !== 'payment' && evt.draggedContext.futureIndex !== 0 && evt.draggedContext.element.value !== 'final event' && evt.draggedContext.element.value !== 'general_rehersal' && evt.draggedContext.futureIndex !== evt.relatedContext.list.length-1 && evt.draggedContext.element.value !== 'photoshoot' && evt.draggedContext.element.value !== 'photoliking' && evt.draggedContext.futureIndex > 3 && evt.draggedContext.element.value !== this.getLastActivity.value)
		},
		editModeActivity (a, i) {
			this.dayAfter.dateNumber = a.dayAfter.dateNumber
			this.dayAfter.dateType = a.dayAfter.dateType
			this.activityName = a.label
			this.activityStatus.details = a.details
			this.activityStatus.dueDate = a.dueDate
			this.activityStatus.location = a.location
			this.activityStatus.time = a.time
			this.activityIndex = i
			this.isEditNewActivity = true
			this.$forceUpdate()
			this.newActivityModal = true
			// this..activitiesModal = true
		},
		addNewCourseActivity () {
			if (this.isEditNewActivity) {
				// console.log('can update now')
				this.$v.activityName.$touch()
				if (this.$v.activityName.$error) {
					this.$q.notify('Please Enter Activity Name')
				} else {
					let toUpdateActivity = {
				    dayAfter: this.dayAfter,
				    label: this.$store.getters['settings/titleCase'](this.activityName),
				    value: this.activityName.toLowerCase(),
				    // order: course.activities.length + 1,
				    details: this.activityStatus.details,
				    dueDate: this.activityStatus.dueDate,
				    location: this.activityStatus.location,
				    time: this.activityStatus.time,
				    visible: true
				  }
				  this.newCourseActivities[this.activityIndex] = toUpdateActivity
				  this.newActivityModal = false
				}
			} else {
				this.$v.activityName.$touch()
				if (this.$v.activityName.$error) {
					this.$q.notify('Please Enter Activity Name')
				} else {
					let newActivity = {
				    dayAfter: this.dayAfter,
				    label: this.$store.getters['settings/titleCase'](this.activityName),
				    value: this.activityName.toLowerCase(),
				    details: this.activityStatus.details,
				    dueDate: this.activityStatus.dueDate,
				    location: this.activityStatus.location,
				    time: this.activityStatus.time,
				    visible: true
				  }
				  this.newCourseActivities.splice(5, 0, newActivity)
				  this.newActivityModal = false
				}

			}
		},
		search (terms, done) {
			setTimeout(() => {
        done(filter(terms, {field: 'value', list: this.parseActivities}))
      }, 1000)
		},
		removeActivity (i) {
			// console.log('remove act', i)
			this.newCourseActivities.splice(i, 1)
		},
		isEditActivity (d) {
			if (d === 'orientation') {
				return false
			}
			else {
				return true
			}
		},
		dontDelete (d) {
			if (d === 'orientation' || d === 'payment' || d === 'photoshoot' || d === 'photoliking' || d === 'general rehersal' || d === 'final event' || d === this.getLastActivity.value) {
				return false
			}
			else {
				return true
			}
		},
		isOutDatedBatches () {
		},
		removeComma (total) {
			return total.replace(',', '')
		},
		standbySeason (s) {
			this.$q.dialog({
		    title: 'Cancel Season',
		    message: `Do you want to cancel ${s.eventName} Season ${s.seasonNumber}?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
		  		this.$store.dispatch('users/standBySeason', {event: this.event[0], season: s})
		    }).catch(() => {})
		},
		launchSeason (s) {
			this.$q.dialog({
		    title: 'Confirmation',
		    message: `Do you want to launch ${s.eventName} Season ${s.seasonNumber}?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
					// console.log(s, 's')
		  		this.$store.dispatch('users/launchSeason', {event: this.event[0], season: s})
		    }).catch(() => {})
		},
		isHasBatches (season) {
			// console.log('schedules', this.schedules)
			let batches = this.$lodash.filter(this.schedules, s => {
				return s.eventKey === this.eventKey && s.seasonNumber === season.seasonNumber
			})
			if (batches.length >= 1) {
				return false
			}
			return true
		},
		isSeasonOngoing (s) {
			// console.log('s', s)
			if (s.status === 'open') {
				return false
			}
			return true
		},
		deleteSeason (s) {
			// console.log('s', s)
			var i = this.$lodash.findIndex(this.events, e => {
				return e['.key'] === s.eventKey
			})
			this.$q.dialog({
		    title: 'Delete Confirmation',
		    message: `Do you want to remove Season ${s.seasonNumber}?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
				console.log(this.event, 'event')
				let index = this.$lodash.findIndex(this.event[0].seasons, e => {
					return e.seasonNumber === s.seasonNumber
				})
				console.log(index, 'index')
		  	this.$store.dispatch('users/deleteSeason2', {eventKey: this.eventKey, index: index, seasonNo: s.seasonNumber})
		    }).catch(() => {})
		},
		getSeasonStart (s) {
			return s.row.seasonStart
		},
		viewBatches (s) {
			// console.log('s', s)
			this.$router.push(`/eventseason/${s.eventKey}/${s.seasonNumber}/seasonBatches`)
		},
		clearSeasonModal () {},
		createActivity2 () {

		},
		createActivity () {
			// console.log('$refs', this.$refs)
			// this.$refs.activityRef.setWorkshopsToNull()
			// this.$refs.activityRef.setWorkshopsToNull()
			// this.$refs.activityRef.setOtherActivitiesToNull()
			this.$v.season.$touch()
			console.log(this.$v.season, 'this.$v.season')
			if (!this.$v.season.$error) {
				if (this.checkIfHasSavedDraft) {
					this.$store.state.schedules.tempSeasonDraft = this.seasonDraft[0].season	
				}
				this.$store.state.schedules.numberOfWorkshops = this.season.numberOfWorkshops
				this.$refs.activityRef.onLoad()
				this.$refs.stepper.next()
			}
			
			// this.$v.season.$touch()
			// console.log('$v season', this.$v.season)
			// if (this.$v.season.$error || this.seasonStartError) {
			// 	this.$q.notify('Please review fields')
			// } else {
			// 	this.season.seasonName = `${this.event[0].eventCode}_Season${this.getLatestSeason}`
	  // 		this.season.seasonNumber = this.getLatestSeason
	  // 		this.season.totalAmount = this.getTotalAmount
	  // 		this.season.eventKey = this.event[0]['.key']
	  // 		this.season.eventName = this.event[0].eventName
	  // 		this.season.status = 'standby'
	  // 		this.$store.state.users.courseKey = this.season.course
	  // 		this.$store.state.users.numOfPayments = this.season.numberOfPayments
	  // 		// this.$store.state.users.numOfWorkshops = this.season.numberOfWorkshops
	  // 		this.$store.state.users.seasonStart = this.season.seasonStart
	  // 		this.$store.state.users.seasonEnd = this.season.seasonEnd
	  // 		this.$store.state.users.totalAmount = this.removeComma(this.season.totalAmount)
	  // 		this.$store.state.users.colorCode = this.season.colorCode
	  // 		this.$refs.stepper.next()
	  // 		console.log('season course', this.$store.state.users.totalAmount)
	  // 		// this.$refs.activityRef.setPaymentsAmount()
	  // 		// this.seasonModal = false
	  // 		// this.activityModal = true
			// }
		},
		viewActivities () {
			this.$store.state.users.newSeason = this.season
			this.$store.state.users.isNewSeasonActivities = true
			this.$refs.activityRef.saveSeasonActivities()
		},
		addNewSeason () {
			this.$q.dialog({
        title: 'Save Confirmation',
        message: `Do you want to save?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
      		// auto generate schedule
          this.$store.dispatch('users/addNewSeason', {event: this.event[0], season: this.season})
        }).catch(() => {})
		},
		isSeasonBatchNotComplete (p) {
			// console.log('test', p)
			// console.log('getSeasonBatches', this.$store.getters['users/getSeasonBatches']({eventKey: this.eventKey, seasonNumber: p.seasonNumber}))
			let seasonBatches = this.$store.getters['users/getSeasonBatches']({eventKey: this.eventKey, seasonNumber: p.seasonNumber})
			// let upcomingBatch = this.$store.getters['users/getUpcomingBatch'](seasonBatches)
			let bActivities = seasonBatches[0]
			var isNotComplete = false
			let activityNotComplete = {}
			for (var j = 0; j < bActivities.length; j++) {
				if (!bActivities[j].dueDate && !bActivities[j].amount) {
					if (bActivities[j].location === '' || bActivities[j].details === '') {
						activityNotComplete = bActivities[j]
						isNotComplete = true
						j = bActivities.length
					}
				}
			}
			// console.log('isnotcomplete', upcomingBatch)
			// console.log('activityNotComplete', activityNotComplete)
			if (!isNotComplete) {
				this.launchSeason(p)
			} else {
				this.$q.dialog({
					title: 'Failed to Launch',
					message: `Batch ${seasonBatches[0].batchNumber} has less details to launch`
				})
			}
		 },
		 getNumOfParticipants (p) {
		 		// console.log('contract signed', this.contractSigned)
		 		// console.log('p', p)
		 		// var sn = parseInt(cs.seasonName.match(/\d+/g)[0])
		 		let signed = this.$lodash.filter(this.contractSigned, cs => {
		 			var sn = parseInt(cs.seasonName.match(/\d+/g)[0])
		 			return cs.eventKey === this.eventKey && sn === parseInt(p.seasonNumber)
		 		})
		 		// console.log('signed', signed)
		 		return signed.length
		 },
		 getSeasonBatches (seasonName) {
		 	let filterBatches = this.$lodash.filter(this.schedules, s => {
		 		return s.seasonName === seasonName
		 	})
		 	return filterBatches
		 },
		 	hasMissingDetails (p) {
				// console.log('hasMissingDetails', p)
				let batches = this.getSeasonBatches(p.row.seasonName)
				// console.log('batches', batches)
				for (var i = 0; i < batches.length; i++) {
					for (var j = 0; j < batches[i].activities.length; j++) {
						if (!batches[i].activities[j].dueDate && !batches[i].activities[j].amount) {
							if (batches[i].activities[j].location === '' || batches[i].activities[j].details === '') {
								// console.log('batches[i].activities[j]', batches[i].activities[j])
								return true
							}
						}
					}
				}
				return false
			},
			confirmActivities () {
				this.$refs.previewRef.saveNewSeasonBatchActivity()
			},
		 test () {
			 this.$bindAsArray('testevent', this.$database.ref('event_schedules').orderByChild('eventKey').equalTo('-LeoKDyPXFXMHrkiv4SS'), null, () => {
				 console.log(this.testevent, 'test')
			 })
			 
			 this.$unbind('testevent')
		 },
		
		test2 (e) {
		}
	}, // end of methods
	beforeDestroy () {
		this.$store.commit('schedules/commitClearActivityComponentState')
	}
}
</script>
<style>
ul#menu li {
    display:inline;
}
</style>
