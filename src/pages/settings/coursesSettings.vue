<template>
	<div>
		<div>
		<!-- <q-toolbar>
		  <q-toolbar-title>
		  </q-toolbar-title>
			
		</q-toolbar> -->
		<q-page-sticky position="top-right" :offset="[10, 5]">
		  	<q-btn class="q-ma-md" icon="add" color="primary" label="New Course" @click="$store.commit('settings/updateNewCourseModal', true)"/>
			</q-page-sticky>

		<div class="flex">
			<div class="row inline">
				<div class="col-11 q-ma-md">
					<q-list inset-separator link>
					  <q-list-header>Courses</q-list-header>
					  <div v-for="(course,i) in courses" :key="i" @click="clickCourse(course)">
					  	<q-item highlight>
						  	<div>
						  		<q-item-main>
							      <q-item-tile label >{{course.courseName ? course.courseName : ''}}</q-item-tile>
							    </q-item-main>
						  	</div>
						  </q-item>
					  </div>
					</q-list>
				</div>
			</div>


			<div class="col q-ma-md">
				<q-list inline style="min-width: 40vw; min-height: auto">

				  <q-list-header>
				  	
			  		<div class="row">
			  			<!-- {{selectCourse.courseName}} -->
			  			<q-input 
								:hide-underline="!isEditActivity2"
								:readonly="!isEditActivity2"
								v-model="selectCourse.courseName" />

				  		<q-btn v-if="!isEditActivity2 && isUsedCourse(selectCourse)" class="q-mx-md" size="sm" color="positive" label="Arrange Activity" @click="selectCourse = selectCourse,arrangement(), arrangeModal = true" icon="open with" />	

				  		<div>
						  	<q-btn v-if="!isEditActivity2 && isUsedCourse(selectCourse)" class="q-mx-md" size="sm" color="secondary" label="Edit" @click="enableEdit()" icon="edit" />
						  	<div v-if="isEditActivity2" class="q-ml-md" >
							  	<q-btn size="sm" color="positive" label="Save" @click="updateCourse()" icon="save" />
						  		<q-btn size="sm" color="negative" label="Cancel" @click="cancelEdit()" icon="close" />	
						  		
						  		<div v-if="!isNewActivity"> 
										<q-btn rounded color="tertiary" size="sm" icon="add" label="Add Activity" @click="isNewActivity = true"/>
									</div>
									
									<div v-if="isNewActivity" class="row">
										<div class="col">
											<q-input v-model="newActivityLabel" float-label="Activity Name"/>
										</div>
										<div class="flex items-center col">
											<q-btn rounded color="positive" size="sm" label="ok" @click="addNewActivity2"/>
											<q-btn rounded color="negative" size="sm" label="cancel" @click="isNewActivity = false"/>
									</div>
						  	</div>
						  	

								</div>
					  	</div>

					  	<q-btn v-if="!isEditActivity2 && isUsedCourse(selectCourse)" size="sm" color="negative" @click="removeCourse(selectCourse)" label="Remove Course"/>
			  		</div>
					  	

				  	

				  </q-list-header>

					<q-item separator v-for="(activity, index) in getActivities" :key="index">
						<q-item-main>
							<div class="row flex items-end">
								<div class="col-4">
									<!-- {{activity.label ? activity.label : ''}} -->
									<!-- <q-btn label="test" @click="test(activity)" /> -->
									<q-input 
										:hide-underline="isCanEdit(activity, index)"
										:readonly="isCanEdit(activity, index)"
										v-model="activity.label" />

								</div>

								<div class="col-6">
									<div class="row">

										<q-btn-toggle
										v-if="actPrimary5(activity, index)"
										:readonly="isCanEdit(activity, index)"
										size="sm"
										rounded
									  v-model="activity.dayOfWeek"
									  toggle-color="primary"
									  :options="[
									    {label: 'M', value: 'monday'},
									    {label: 'T', value: 'tuesday'},
									    {label: 'W', value: 'wednesday'},
											{label: 'TH', value: 'thursday'},
											{label: 'F', value: 'friday'},
											{label: 'SAT', value: 'saturday'},
											{label: 'SUN', value: 'sunday'}
									  ]" />

									<q-checkbox
										:readonly="isCanEdit(activity, index)"  
										v-if="actPrimary5(activity, index) && activity.value != 'payments' "
										class="q-body-1 q-ml-md" 
										v-model="activity.datePick" 
										label="Picked Date" 
										@focus="activity.dayOfWeek = ''"/>

									</div>

									<q-btn-toggle
										v-if="actPrimary4(activity, index)"
										:readonly="isCanEditPayments(activity, index)"
										size="sm"
										v-model="activity.actType"
										rounded
										toggle-color="secondary"
										:options="[
											{label: 'Time/Location/Details', value: 'detailed'},
											{label: 'Date Range', value: 'date range'}
										]" />
									<q-input 
										v-if="activity.actType === 'date range'"
										:readonly="isCanEdit(activity, index)"
										class="q-mt-md" 
										type="number" 
										v-model="activity.duration" 
										stack-label="Duration(days)" />
								</div>

							</div>
							<!-- <q-chip v-if="activity.dayAfter.dateNumber != 0" square color="secondary">Days After: {{activity.dayAfter.dateNumber}} {{activity.dayAfter.dateType}} </q-chip> -->

						</q-item-main>
								<div class="row flex">
									<!-- <q-btn class="col" rounded size="md" v-if="isEditActivity(activity.value)" dense @click="editMode(selectCourse, activity, index)" color="info" label="" icon="edit" /> -->
									<!-- v-if="dontDelete(activity.value) && isUsedCourse(selectCourse)" -->
				    			<q-btn class="col" v-if="actPrimary4(activity, index) && !isCanEdit(activity, index)" rounded size="md" label="" dense @click="removeActivity(selectCourse, activity)" color="negative" icon="close" />
								</div>
					</q-item>


					<!-- <q-btn class="full-width" label="add activity" color="primary" @click="addActBtn(),newActivity.time = true, activitiesModal = true "/> -->
				</q-list>

					<q-inner-loading :visible="getNewActivityLoading">
	          <q-spinner size="50px" color="primary"></q-spinner>
	        </q-inner-loading>

			</div>
		</div>

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
						@click="saveNewCourse2"
						label="Save"
					/>
				 </div>

				<div class="q-ma-md">

					<q-field 
						class="col q-ma-md" 
						:error="$store.getters['settings/isExistCourses'](courseName)" 
						error-label="Course Already Exist">

	          <q-input 
	          	v-model="courseName" 
	          	@blur="capitalize()" float-label="Course Name" 
	          	color="primary" 
	          	:error="$v.courseName.$error"/>

	        </q-field>

					<div>
						<div class="flex justify-between">
								<p class="q-title text-weight-bold">Activities</p>
								<div  v-if="!isNewActivity">
									<q-btn rounded color="tertiary" size="sm" icon="add" label="Add Activity" @click="isNewActivity = true"/>
								</div>
								<div v-if="isNewActivity" class="row">
									<div class="col">
										<q-input v-model="newActivityLabel" float-label="Activity Name"/>
									</div>
									<div class="flex items-center col">
										<q-btn rounded color="positive" size="sm" label="ok" @click="addNewActivity"/>
										<q-btn rounded color="negative" size="sm" label="cancel" @click="isNewActivity = false"/>
									</div>

								</div>

						</div>

						<draggable class="list-group" element="ul" v-model="newCourseDefaultActivities" :options="dragOptions"  :move="newCourseCheckMove" @start="isDragging=false" @end="isDragging=false">
			        <transition-group type="transition" :name="'flip-list'">
	        			<q-item v-for="(activity, index) in newCourseDefaultActivities" :key="index">
									<q-item-main>
										<div class="flex row items-center">
											<div class="q-mr-md col">
												<q-input :readonly="isCanChange(activity)"  v-model="activity.label" />
											</div>
											<div class="col-5">
												<q-btn-toggle
													v-if="actPrimary(activity, index)"
													size="sm"
													rounded
													:disable="activity.datePick"
												  v-model="activity.dayOfWeek"
												  toggle-color="primary"
												  :options="[
												    {label: 'M', value: 'monday'},
												    {label: 'T', value: 'tuesday'},
												    {label: 'W', value: 'wednesday'},
														{label: 'TH', value: 'thursday'},
														{label: 'F', value: 'friday'},
														{label: 'SAT', value: 'saturday'},
														{label: 'SUN', value: 'sunday'}
												  ]"
												/>
												<q-checkbox v-if="actPrimary(activity, index)" class="q-body-1 q-ml-md" v-model="activity.datePick" label="Picked Date" @focus="activity.dayOfWeek = ''"/>
											</div>
											<div class="col-4">
												<q-btn-toggle
													:readonly="isReadOnlyActiivty(activity, index)"
													v-if="actPrimary2(activity, index)"
													size="sm"
													v-model="activity.actType"
													rounded
													toggle-color="secondary"
													:options="[
														{label: 'Time/Location/Details', value: 'detailed'},
														{label: 'Date Range', value: 'date range'}
													]"
												/>
												<q-input class="q-mt-md" v-if="activity.actType === 'date range'" type="number" v-model="activity.duration" stack-label="Duration(days)" />
											</div>
										</div>


										<!-- <q-chip tag color="secondary">Days After: {{activity.dayAfter.dateNumber}} {{activity.dayAfter.dateType}} </q-chip> -->
									</q-item-main>
   								<!-- <q-item-side right :icon="isDontMove(activity)" /> -->
									<q-item-side v-if="actPrimary3(activity, index)">
										<q-icon :name="isDontMove2(activity, index)" />
										<q-btn v-if="activity.value != 'payment'" class="q-ml-md" round color="negative" size="xs" icon="remove" @click="removeActivity2(index)"/>
									</q-item-side>
								</q-item>
							</transition-group>
			      </draggable>
					</div>
				</div>
			</q-modal-layout>
			<q-inner-loading :visible="getNewActivityLoading">
	      <q-spinner size="50px" color="primary"></q-spinner>
	    </q-inner-loading>
		</q-modal>



	    <!-- new activity modal -->
			<q-modal v-model="activitiesModal" :content-css="{minWidth: '30vw', minHeight: '45vh'}" @hide="clearModal">
	      <q-modal-layout
			    header-style="min-height: 100px"
			    content-class="{'bg-primary': isPrimary}"
			    footer-class="bg-primary some-class"
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
	        <q-toolbar>
	          <q-toolbar-title>
	          	{{isEdit ? 'Edit Activity' : 'New Activity'}}
	          </q-toolbar-title>
	          <q-btn flat round dense @click="activitiesModal = !activitiesModal" icon="close" />
	        </q-toolbar>
	        <!-- content -->
	        <div>
						<!-- :error-label="activityErrorLabel" -->
	        	<q-field class="col q-ma-md" :error="activityError" >
		        	<q-input class="col q-ma-md" v-model="activityName" @blur="$store.getters['settings/isExistActivity']({activities: selectCourse.activities, activity: activityName})" stack-label="Activity Name" :error="$v.activityName.$error">
		        		<q-autocomplete
				          @search="search"
				          :debounce="1000"
				        />
		        	</q-input>
		        </q-field>
		        <div class="q-ma-md">
		        	<q-field
		        		v-if="dayAfter.dateNumber != 0"
		        		class="col q-ma-md"
		        		label="Day Interval"
		        		orientation="vertical">

				        <div class="row q-ma-md">
									<div class="col-1 q-my-md">
				        		<q-input  v-model="dayAfter.dateNumber" />
				        	</div>
				        	<div class="col-3 q-mx-md">
				        		<q-select
								      v-model="dayAfter.dateType"
								      float-label="Interval"
								     :options="dateTypeOpt"
								    />
				        	</div>
				        </div>

							</q-field>
							<q-btn-toggle
								v-model="actType"
								rounded
								toggle-color="primary"
								:options="[
									{label: 'Time/Location/Details', value: 'detailed'},
									{label: 'Due Date', value: 'duedate'}
								]"
							/>
								<!-- <q-checkbox class="q-ma-md" v-model="activityStatus.time" label="Time" />
			        	<q-checkbox class="q-ma-md" v-model="activityStatus.location" label="Location" />
			        	<q-checkbox class="q-ma-md" v-model="activityStatus.details" label="Details" />
			        	<q-checkbox class="q-ma-md" v-model="activityStatus.dueDate" @input="isDueEnable()" label="Due Date" /> -->
		        </div>

	        </div>
	        <!-- action -->
	        <div slot="footer">
	        	<q-btn v-if="!isEdit" color="primary" class="full-width" @click="addActivities">Save</q-btn>
	        	<q-btn v-if="isEdit" color="secondary" class="full-width" @click="updateActivity">Update</q-btn>
	        </div>
	      </q-modal-layout>
	      <q-inner-loading :visible="getNewActivityLoading">
          <q-spinner size="50px" color="primary"></q-spinner>
        </q-inner-loading>
	    </q-modal>
	    <!-- arrange Modal -->
			<q-modal v-model="arrangeModal" :content-css="{minWidth: '30vw', minHeight: '45vh'}" @hide="clearModal">
	      <q-modal-layout
			    header-style="min-height: 100px"
			    content-class="{'bg-primary': isPrimary}"
			    footer-class="bg-primary some-class"
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
	        <q-toolbar>
	          <q-toolbar-title>
	            Arrange Activity
	          </q-toolbar-title>
	          <q-btn flat round dense @click="arrangeModal = !arrangeModal" icon="close" />
	        </q-toolbar>
	        <!-- content -->

	        <div>
	        	<draggable class="list-group" element="ul" v-model="activityArrangement.activities" :options="dragOptions"  :move="checkMove" @start="isDragging=true" @end="isDragging=false">
			        <transition-group type="transition" :name="'flip-list'">
	        			<q-item v-for="(activity, index) in activityArrangement.activities" :key="index">
									<q-item-main>
										{{activity.label ? activity.label : ''}}
										<!-- <q-chip tag color="secondary">Days After: {{activity.dayAfter.dateNumber}} {{activity.dayAfter.dateType}} </q-chip> -->
									</q-item-main>
   								<q-item-side right :icon="isDontMove(activity)" />
								</q-item>
							</transition-group>
			      </draggable>
	        </div>
	        <!-- action -->
	        <div slot="footer">
	        	<q-btn v-if="!isEdit" color="primary" class="full-width" @click="saveArrangement">Save</q-btn>
	        </div>
	      </q-modal-layout>
	      <q-inner-loading :visible="getNewActivityLoading">
          <q-spinner size="50px" color="primary"></q-spinner>
        </q-inner-loading>
	    </q-modal>
		</div>
	</div>
</template>
<script>
// import { SlickList, SlickItem } from 'vue-slicksort'
import draggable from 'vuedraggable'
import { required } from 'vuelidate/lib/validators'
import { filter } from 'quasar'

const isCourseNameError = (value, vm) => {
	if (vm.$store.getters['settings/isExistCourses'](vm.courseName))
		return true
	return false
}

export default {
	created () {
		this.callExternalServices().then(() => {
			this.loaded = true
		})
	},
	mounted () {
		// this.$bindAsArray('testData', this.$database.ref('contractSigned').orderByChild('accountNumber').equalTo('IZRDZI3QGX'))
		this.$bindAsArray('events', this.$database.ref('events'))
		// this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		this.$bindAsArray('activities', this.$database.ref('settings/activityList'))
		this.$bindAsArray('courses2', this.$database.ref('settings/courses'), null, () => { 
			this.$store.state.settings.courses = this.courses2
			this.loadSelectedCourse()
		})
		// console.log('activities in mounted', this.activities)
		this.selectCourse = this.courses[0] ? this.courses[0] : {}
		// this.$store.state.settings.courses = this.courses
	},
	update() {
		// this.$bindAsArray('testData', this.$database.ref('contractSigned').orderByChild('accountNumber').equalTo('IZRDZI3QGX'))
		// this.$bindAsArray('events', this.$database.ref('events'))
		// this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		// this.$bindAsArray('activities', this.$database.ref('settings/activityList'))
	},
	validations () {
		return {
			courseName: {
				required,
				isCourseNameError
			},
			activityName: {
				required
			}
		}
	},
	components: {
		// SlickList,
		// SlickItem,
		draggable
	},
	watch: {
		actType () {
			if (this.actType === 'detailed') {
				this.activityStatus.time = true
				this.activityStatus.location = true
				this.activityStatus.details = true
				this.activityStatus.dueDate = false
			} else {
				this.activityStatus.time = false
				this.activityStatus.location = false
				this.activityStatus.details = false
				this.activityStatus.dueDate = true
			}
		}
	},
	computed: {
		getLastActivity () {
			try {
				let actLen = this.selectCourse.activities.length
				let lastAct = this.selectCourse.activities[actLen-1]
				// console.log('lastAct', lastAct)
				return lastAct
			} catch {
				return ''
			}
		},
		dragOptions() {
      return {
        animation: 150,
				ghostClass: 'ghost',
				chosenClass: 'chosen-ghost',
        group: 'label',
        disabled: this.editActivity
      }
    },
		courses: {
			get () {
				try {
					return this.$store.state.startUp.courses
				} catch {
					return []
				}
			},
			set (val) {
				this.$store.state.settings.courses = val
			}
		},
		newActivityModal: {
			get () {
				return this.$store.state.settings.newActivityModal
			},
			set (val) {
				this.$store.commit('settings/updateNewActivityModal', val)
			}
		},
		arrangeModal: {
			get () {
				return this.$store.state.settings.arrangeModal
			},
			set (val) {
				this.$store.state.settings.arrangeModal = val
			}
		},
		activitiesModal: {
			get () {
				return this.$store.state.settings.activitiesModal
			},
			set (val) {
				this.$store.commit('settings/updateActivitiesModal', val)
			}
		},
		getNewActivityLoading () {
			return this.$store.state.settings.activityLoading
		},
		newCourseModal: {
			get () {
				return this.$store.state.settings.newCourseModal
			},
			set (val) {
				this.$store.commit('settings/updateNewCourseModal', val)
			}
		},
		eventTypeOpt () {
			try {

				let opt = this.$lodash.map(this.courses, c => {
					return { label: c.courseName, value: c['.key']}
				})
				return opt
			} catch {
				return []
			}

		},
		activitiesOpt () {
			try {
				for (var i = 0; i < this.activities.length; i++) {
					this.activities[i].visible = true
				}
				if (this.isEdit) {
					for (var i = 0; i < this.activities.length; i++) {
						this.activities[i].visible = true
					}
					let opt = []
					for (var k = 0; k < this.activities.length; k++) {
						if(this.activities[k].visible) {
							delete this.activities[k]['.key']
							opt.push({label: this.activities[k].label, value: this.activities[k].label})
						}
					}
					return opt
				}
				else if (this.newActivity.courseKey != '') {
					let course = this.$lodash.filter(this.courses, c => {
						return c['.key'] === this.newActivity.courseKey
					})
					// console.log('course', course)
					for (var i = 0; i < course[0].activities.length; i++) {
						for (var j = 0; j < this.activities.length; j++) {
							// console.log('this', course[0].activities[i].activityName)
							if (this.activities[j].label === course[0].activities[i].label) {
								this.activities[j].visible = false
							}
						}
					}
					let opt = []
					for (var k = 0; k < this.activities.length; k++) {
						if(this.activities[k].visible) {
							opt.push({label: this.activities[k].label, value: this.activities[k]})
						}
					}
					// console.log(opt)
					return opt
				}
				else {
					return []
				}
			} catch {
				return []
			}
		},
		parseActivities () {
			return this.$store.getters['settings/parseActivities']
		},
		activityError () {
			if (this.isEdit) {
				return false
			} else {
				return this.$store.getters['settings/isExistActivity']({activities: this.selectCourse.activities, activity: this.activityName})
			}
		},
		getActivities () {
			// try {
				return this.selectCourse.activities
			// } catch {}
		}
	},
	data () {
		return {
			tempSelectCourse: {},
			isEditActivity2: false,
			toggle: '',
			isNewActivity: false,
			courseName: '',
			newActivityLabel: '',
			newCourseDefaultActivities: [
				{
					day: '',
					datePick: false,
					dayOfWeek: '',
					duration: 0,
					actType: 'detailed',
					label: 'Orientation',
					value: 'orientation',
					visible: true
				},
				{
					day: '',
					duration: 0,
					datePick: false,
					dayOfWeek: '',
					actType: 'detailed',
					eventType: '',
					label: 'Payments',
					value: 'payments',
					visible: true
				},
				{
					day: '',
					duration: 0,
					datePick: false,
					dayOfWeek: '',
					actType: 'detailed',
					eventType: '',
					label: 'Photoshoot',
					value: 'photoshoot',
					visible: true
				},
				{
					day: '',
					duration: 5,
					datePick: false,
					dayOfWeek: '',
					actType: 'date range',
					eventType: '',
					label: 'Photoliking',
					value: 'photoliking',
					visible: true
				},
				{
					day: '',
					duration: 0,
					datePick: false,
					dayOfWeek: '',
					actType: 'detailed',
					eventType: '',
					label: 'Workshops',
					value: 'workshops',
					visible: true
				},
				{
					day: '',
					duration: 0,
					datePick: false,
					dayOfWeek: '',
					actType: 'detailed',
					eventType: '',
					label: 'Final Event',
					value: 'final event',
					visible: true
				}
			],
			loaded: false,
			actType: '',
			testData: [],
			editActivity: false,
			myArray: [],
			event: [],
			activityArrangement: [],
			list: ['Foo', 'Bar', 'Baz'],
			items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5',
        'Item 6',
        'Item 7',
        'Item 8'
      ],
      dayAfter: {
      	dateNumber: 1,
      	dateType: 'week'
      },
      dateTypeOpt: [
      	{ label: 'days', value: 'days'},
      	{ label: 'weeks', value: 'weeks'},
      	{ label: 'months', value: 'months'}
      ],
      activityIndex: -1,
			activities: [],
			kidsFashionCourse: [],
			basicCourse: [],
			fullCourse: [],
			isEdit: false,
			checked: '',
			selectCourse: {},
			activityName: '',
			newActivities: '',
			activityStatus: {
				time: false,
				location: false,
				details: false,
				dueDate: false
			},
			newActivity: {
				eventType: '',
				activityName: '',
				courseKey: '',
				time: true,
				location: true,
				details: true,
				dueDate: false
			}
		}
	},
	methods: {
		isReadOnlyActiivty (act, index) {
			// console.log(act, 'act')
			if (act.value === 'photoshoot' || act.value === 'photoshoots' || act.value === 'photoliking' || act.value ==='photo liking') {
				return true
			}
			return false
		},
		updateCourse () {
			this.$q.dialog({
        title: 'Save Confirmation',
        message: `Do you want to save ?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
      		this.$store.dispatch('settings/updateCourse', this.selectCourse)
					.then(res => {
						// console.log('res', res)
						this.isEditActivity2 = false
					})
     		})
      	.catch(() => {})
		},	
		enableEdit () {
			this.tempSelectCourse = this.$store.getters['startUp/getPlainValue'](this.selectCourse)
			this.isEditActivity2 = true
		},
		cancelEdit () {
			this.selectCourse = this.tempSelectCourse
			this.isEditActivity2 = false
		},
		isCanEditPayments (act, i) {
			if (!this.isEditActivity2) {
				return true
			} else {
				if (act.value === 'payments' || act.value === 'photoliking') {
					return true
				} else {
					return false
				}
			}
		},
		isCanEdit (act, i) {
			if (this.isEditActivity2) {
				// console.log(act, 'act')
				if (act.value === 'orientation' || act.value === 'final event') {
					return true
				} else {
					return false
				}	
			} else {
				return true
			}
		},
		isCanChange (act) {
			if (act.value === 'orientation' || act.value === 'payments') {
				return true
			} else {
				return false
			}
		},
		saveNewCourse2 () {
			if (this.$v.courseName.$error === false && this.$v.courseName.isCourseNameError === false)	{
				this.$q.dialog({
	        title: 'Save Confirmation',
	        message: `Do you want to save ?`,
	        ok: 'Yes',
	        cancel: 'No'
	      }).then(() => {
	         // your code here
					 let data = {
		 				courseName: this.courseName,
		 				activities: this.newCourseDefaultActivities
		 			}
		 			this.$store.dispatch('settings/saveNewCourse2', data)
						.then(() => {
							this.courseName = ''
							this.newCourseDefaultActivities = [
								{
									day: '',
									datePick: false,
									actType: 'detailed',
									label: 'Orientation',
									value: 'orientation',
									visible: true
								},
								{
									day: '',
									datePick: false,
									actType: '',
									eventType: '',
									label: 'Payment',
									value: 'payment',
									visible: true
								},
								{
									day: '',
									datePick: false,
									actType: '',
									eventType: '',
									label: 'Workshops',
									value: 'workshops',
									visible: true
								},
								{
									dayAfter: {
										dayOfWeek: '',
										dateNumber: 0,
										dateType: 0
									},
									datePick: false,
									actType: 'detailed',
									eventType: '',
									label: 'Final Event',
									value: 'final event',
									visible: true
								}
							]
						})
        }).catch(() => {})
			} else {
				this.$q.notify('Invalid Course Name')
			}
		},
		removeActivity2 (i) {
			// console.log('default acts', this.newCourseDefaultActivities, i)
			this.newCourseDefaultActivities.splice(i, 1)
		},
		fillActivityTypeIsPhotoshootOrPhotoliking (newActivityLabel) {
			if (newActivityLabel === 'photoshoot' || newActivityLabel === 'photoshoots') {
				return 'detailed'
			} else if (newActivityLabel === 'photoliking' || newActivityLabel === 'photo liking') {
				return 'date range'
			} else {
				return ''
			}
		},
		checkHasDuplicate (newActivityLabel) {
			let index = this.$lodash.findIndex(this.newCourseDefaultActivities, a => {
				return a.value === newActivityLabel
			})
			if (index <= -1) {
				return false
			}
			return true
		},
		addNewActivity () {
			if (this.checkHasDuplicate(this.newActivityLabel) === false) {
				this.newCourseDefaultActivities.splice(2, 0, {
					day: '',
					datePick: false,
					actType: this.fillActivityTypeIsPhotoshootOrPhotoliking(this.newActivityLabel),
					eventType: '',
					label: this.$store.getters['settings/titleCase'](this.newActivityLabel),
					value: this.newActivityLabel,
					visible: true
				})
				this.newActivityLabel = ''
				this.isNewActivity = false
			} else {
				this.$q.notify('Invalid Activity Name')
			}
		},
		addNewActivity2 () {
			this.selectCourse.activities.splice(5, 0, {
				day: '',
				datePick: false,
				actType: '',
				eventType: '',
				label: this.$store.getters['settings/titleCase'](this.newActivityLabel),
				value: this.newActivityLabel,
				visible: true
			})
			this.newActivityLabel = ''
			this.isNewActivity = false
		},
		actPrimary (act, i) {
			if(act.value === 'orientation' || i === this.newCourseDefaultActivities.length-1) {
				return false
			} else {
				return true
			}
		},
		actPrimary2 (act, i) {
			// console.log('act', act)
			if(i === 0 || i === this.newCourseDefaultActivities.length-1 || act.value === 'payments' || act.value === 'workshops' || act.value === 'workshop') {
				return false
			} else {
				return true
			}
		},
		actPrimary3 (act, i) {
			if (i === 0 || i === this.newCourseDefaultActivities.length-1 || act.value === 'payments') {
				return false
			} else {
				return true
			}
		},
		actPrimary4 (act, i) {
			// console.log('act', act)
			if(i === 0 || act.value === 'final event' || act.value === 'payments' || act.value === 'photoshoot' || act.value === 'photoshoots' || act.value === 'workshops' || act.value === 'workshop') {
				return false
			} else {
				return true
			}
		},
		actPrimary5 (act, i) {
			if(act.value === 'orientation' || act.value === 'final event') {
				return false
			} else {
				return true
			}
		},
		actPrimary6 (act, i) {
			// console.log('act', act)
			if(i === 0 || act.value === 'final event' || act.value === 'payments' ) {
				return false
			} else {
				return true
			}
		},
		capitalizeAct () {
			try {
				this.activityName = this.$store.getters['settings/titleCase'](this.activityName)
			} catch {}
		},
		callExternalServices: async function () {
			setTimeout(() => {
				return true
			}, 3000)
		},
		addActBtn () {
			// console.log('loadSelectedCourse', this.dayAfter)
			this.dayAfter.dateNumber = 0
			this.newActivity.time = true
			this.newActivity.location = true
			this.newActivity.details = true
			this.activityStatus.time = true
			this.activityStatus.location = true
			this.activityStatus.details = true
		},
		isUsed (a) {
			// console.log('a', a)
		},
		isDontMove (a) {
			if (a.value !== 'orientation' && a.value !== 'payments' && a.value !== 'final event' && a.value !== this.getLastActivity.value) {
				return 'open_with'
			} else {
				return ''
			}
			// return 'open_with'
		},
		isDontMove2 (act, i) {
			if (i <= 1) {
				return ''
			} else {
				return 'open_with'
			}
		},
		onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
		loadSelectedCourse () {
			try {
				// console.log('load selected course', this.courses2)
				this.selectCourse = this.courses2[0]
				// try {
				// 	// this.selectCourse = this.$store.state.startUp.courses[0]
				// 	this.selectCourse = this.courses[0]
				// } catch (err) {
				// 	this.selectCourse.activities = []
				// }
				// console.log('loaded', this.selectCourse)
			} catch (err) {}
		},
		clickCourse (c) {
			this.selectCourse = c
			// console.log('c', this.selectCourse)
		},
		arrangement () {
			try {
				this.activityArrangement = {...this.selectCourse}
				// console.log('activityArrangement', this.activityArrangement)
			} catch (err) {}
		},
		onMoveCallback(evt, originalEvent) {
			// console.log('evt move', evt)
			// console.log('origi', originalEvent)
		},
		checkMove: function(evt){
			// console.log('evt', evt)
			let length = evt.relatedContext.list.length
			// console.log('l', length)
			return (evt.draggedContext.element.value !== 'orientation' && 
							evt.draggedContext.element.value !== 'payments' && 
							evt.draggedContext.futureIndex > 1 && 
							evt.draggedContext.element.value !== 'final event' && 
							evt.draggedContext.futureIndex !== evt.relatedContext.list.length-1 && 
							evt.draggedContext.element.value !== this.getLastActivity.value)
		},
		newCourseCheckMove (evt) {
			// console.log('check move', evt)
			return (evt.draggedContext.element.value !== 'orientation' && 
							evt.draggedContext.element.value !== 'payments' && 
							evt.draggedContext.futureIndex > 1 && 
							evt.draggedContext.element.value !== 'final event' &&  
							evt.draggedContext.futureIndex !== evt.relatedContext.list.length-1 &&
							evt.draggedContext.element.value !== this.getLastActivity.value)
		},
		sortEnd(e, ni, oi, c) {
			// console.log('e', e)
			// console.log('e', ni)
			// console.log('e', oi)
			// console.log('e', c)
    },
		activityErrorLabel () {
			if (this.activityName === '') {
				return ''
			} else if (this.isEdit) {
				return ''
			}
			else {
				return 'Activity Already Exist'
			}
		},
		input (newArray) {
			// console.log('new Array', newArray)
		},
		sortStart (event, node, index, collection) {
			// console.log('e', event)
		},
		search (terms, done) {
			setTimeout(() => {
        done(filter(terms, {field: 'value', list: this.parseActivities}))
      }, 1000)
		},
		selected (item) {
			this.activityName = item.label
		},
		capitalize () {
			try {
				var name = this.courseName
				this.courseName = this.$store.getters['settings/titleCase'](name)
			} catch {}
		},
		addNewEventActivity () {

			let course = this.$lodash.filter(this.courses, c => {
				return c['.key'] === this.newActivity.courseKey
			})
			let activity = this.newActivity.activityName
			activity.details = this.newActivity.details
			activity.time = this.newActivity.time
			activity.location = this.newActivity.location
			activity.dueDate = this.newActivity.dueDate
			// console.log('act', activity)
			delete activity['.key']
			course[0].activities.push(activity)
			// console.log('new activity', course[0])
			this.$store.dispatch('settings/addNewEventActivity', {payload: course[0], fireb: this.$firebase.database(), quasu: this.$q})
			this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		},
		addNewCourse () {
			this.$v.courseName.$touch()
			if (!this.$v.courseName.$error) {
				this.capitalize()
				this.$store.dispatch('settings/addNewCourse', {payload: this.courseName, fireb: this.$firebase.database(), quasu: this.$q})
				this.courseName = ''
			} else {
				this.$q.notify('Enter Course Name')
				return
			}
		},
		removeCourse (c) {
			let vm = this
			this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to remove ${c.courseName}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
         // your code here
         this.$store.dispatch('settings/removeCourse', {payload: c, fireb: this.$firebase.database(), quasu: this.$q})
         	.then(() => {
         		vm.loadSelectedCourse()
         	})
        }).catch(() => {})
		},
		addActivities () {
			this.$v.activityName.$touch()
			// console.log('test', this.$v.activityName.$error)
			if (!this.$v.activityName.$error && !this.activityError)	{
				// this.$store.dispatch('settings/addActivities', {activity: this.activityName, status: this.activityStatus, dayAfter: this.dayAfter, course: this.selectCourse})
				// this.activityName = ''
				// this.$bindAsArray('courses', this.$database.ref('settings/courses'))
				// this.loadSelectedCourse()
			} else {
				this.$q.notify('Invalid Activity Name')
			}
		},
		removeActivities (a) {
			this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to remove ${a.label}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
         // your code here
         this.$store.dispatch('settings/removeActivities', {payload: a, fireb: this.$database, quasu: this.$q})
        }).catch(() => {})
		},
		clearModal () {
			// var i = this.$lodash.findIndex(this.courses, c => {
			// 	return c['.key'] === this.selectCourse['.key']
			// })
			// this.selectCourse = this.courses[i]
			this.activityStatus.time = false
			this.activityStatus.location = false
			this.activityStatus.details = false
			this.activityStatus.dueDate = false
			this.dayAfter.dateNumber = 0
			this.dayAfter.dateType = 'days'
			this.activityName = ''
			this.isEdit = false
		},
		clearNewCourseModal () {
			this.newCourse = ''
		},
		dontDelete (d) {
			if (d === 'orientation' || d === 'payment' || d === 'photoshoot' || d === 'photoliking' || d === 'general rehersal' || d === 'final event' || d === this.getLastActivity.value) {
				return false
			}
			else {
				return true
			}
		},
		isEditActivity (d) {
			if (d === 'orientation') {
				return false
			}
			else {
				return true
			}
		},
		editMode (c, a, i) {
			// console.log('a', a)
			this.selectCourse = c
			this.dayAfter.dateNumber = a.dayAfter.dateNumber
			this.dayAfter.dateType = a.dayAfter.dateType
			this.activityName = a.label
			this.activityStatus.details = a.details
			this.activityStatus.dueDate = a.dueDate
			this.activityStatus.location = a.location
			this.activityStatus.time = a.time
			this.activityIndex = i
			this.isEdit = true
			this.$forceUpdate()
			this.$store.state.settings.activitiesModal = true
		},
		updateActivity () {
			this.$store.dispatch('settings/editActivity', {course: this.selectCourse, activity: this.activityName, index: this.activityIndex, dayAfter: this.dayAfter, status: this.activityStatus})
				.then(() => {
					var i = this.$lodash.findIndex(this.courses, c => {
						return c['.key'] === this.selectCourse['.key']
					})
					this.selectCourse = this.courses[i]
					this.$forceUpdate()
				})
			this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		},
		removeActivity (c, a) {
			// console.log('course', c)
			// console.log('act', a)
			this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to delete ${c.courseName} ${a.label}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
       		this.$store.dispatch('settings/removeActivity', {course: c, activity: a})
        }).catch(() => {})
      this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		},
		saveArrangement () {
			this.$q.dialog({
        title: 'Save Confirmation',
        message: `Do you want to save ?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
         // your code here
       		this.$store.dispatch('settings/saveArrangement', this.activityArrangement)
       		this.$bindAsArray('courses', this.$database.ref('settings/courses'))
        }).catch(() => {})
		},
		isUsedCourse (c) {
			// console.log('c', c)
			let allSeasons = new Array()
			this.$lodash.forEach(this.events, e => {
				try {
					for (var i = 0; i < e.seasons.length; i++) {
						allSeasons.push(e.seasons[i])
					}
				} catch {}
			})
			let i = this.$lodash.findIndex(allSeasons, as => {
				return as.course === c['.key']
			})
			if (i !== -1) {
				return false
			} else {
				return true
			}
		},
		isDueEnable () {
			this.newActivity.time = false
			this.newActivity.location = false
			this.newActivity.details = false
			this.activityStatus.time = false
			this.activityStatus.location = false
			this.activityStatus.details = false
		},
		test (act) {
			console.log('act', act)
			console.log('getActivities', this.getActivities)
			console.log('selectCourse', this.selectCourse)
			console.log('courses', this.courses)
		},
		test2 () {

			console.log('selectCourse', this.selectCourse)
			let actLen = this.selectCourse.activities.length
			let lastAct = this.selectCourse.activities[actLen-1]
			console.log('lastAct', lastAct)
			return lastAct
		}
	}
}
</script>
<style>
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.0;
  background: #c8ebfb;
}
.chosen-ghost {
  opacity: 0.2;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
