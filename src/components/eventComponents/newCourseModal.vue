<template>
	<div>
	
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
									<q-input dense v-model="newActivityLabel" float-label="Activity Name"/>
								</div>
								<div class="flex items-center col">
									<q-btn rounded color="positive" size="sm" label="ok" @click="addNewActivity()"/>
									<q-btn rounded color="negative" size="sm" label="cancel" @click="isNewActivity = false"/>
								</div>

							</div>

					</div>

					<draggable class="list-group" element="ul" v-model="newCourseDefaultActivities" :options="dragOptions"  :move="newCourseCheckMove" @start="isDragging=true" @end="isDragging=false">
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
				<q-inner-loading :visible="newCourseLoading">
		      <q-spinner size="50px" color="primary"></q-spinner>
		    </q-inner-loading>
			</div>
	</div>
</template>
<script>
import draggable from 'vuedraggable'
import { required } from 'vuelidate/lib/validators'
import { filter } from 'quasar'

const isCourseNameError = (value, vm) => {
			if (vm.$store.getters['settings/isExistCourses'](vm.courseName))
				return true
			return false
		}

export default {
	components: {
		draggable
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
	computed: {
		dragOptions() {
      return {
        animation: 0,
				ghostClass: 'ghost',
				chosenClass: 'chosen-ghost',
        group: 'label',
        disabled: this.editActivity
      }
    },
	},
	data () {
		return {
			newCourseLoading: false,
			courseName: '',
			isNewActivity: false,
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
		}
	}, // end of data
	methods: {
		saveNewCourse2: async function () {
			return new Promise(resolve => {
				// console.log(this.$v.courseName, 'validations')
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
							.then((result) => {
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
								this.$store.state.schedules.newCourseModal = false
								// console.log(result, 'result')
								resolve(result)
							})
	        }).catch(() => {})
				} else {
					this.$q.notify('Invalid Course Name')
				}
			})
			
		},
		removeActivity2 (i) {
			// console.log('default acts', this.newCourseDefaultActivities, i)
			this.newCourseDefaultActivities.splice(i, 1)
		},
		isDontMove2 (act, i) {
			if (i <= 1) {
				return ''
			} else {
				return 'open_with'
			}
		},
		isReadOnlyActiivty (act, index) {
			// console.log(act, 'act')
			if (act.value === 'photoshoot' || act.value === 'photoshoots' || act.value === 'photoliking' || act.value ==='photo liking') {
				return true
			}
			return false
		},
		actPrimary (act, i) {
			if(act.value === 'orientation' || i === this.newCourseDefaultActivities.length-1) {
				return false
			} else {
				return true
			}
		},
		actPrimary2 (act, i) {
			// consle.log('act', act)
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
		isCanChange (act) {
			if (act.value === 'orientation' || act.value === 'payments') {
				return true
			} else {
				return false
			}
		},
		newCourseCheckMove (evt) {
			// console.log('check move', evt)
			return (evt.draggedContext.element.value !== 'orientation' && 
							evt.draggedContext.element.value !== 'payments' && 
							evt.draggedContext.futureIndex > 1 && 
							evt.draggedContext.element.value !== 'final event' &&  
							evt.draggedContext.futureIndex !== evt.relatedContext.list.length-1
							)
		},
		capitalize () {
			try {
				var name = this.courseName
				this.courseName = this.$store.getters['settings/titleCase'](name)
			} catch (err) {}
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
		fillActivityTypeIsPhotoshootOrPhotoliking (newActivityLabel) {
			if (newActivityLabel === 'photoshoot' || newActivityLabel === 'photoshoots') {
				return 'detailed'
			} else if (newActivityLabel === 'photoliking' || newActivityLabel === 'photo liking') {
				return 'date range'
			} else {
				return ''
			}
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
	} // end of methods
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