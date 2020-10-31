<template>
	<div>
		<q-toolbar inverted>
		  <q-toolbar-title>
		    Activity Settings
		  </q-toolbar-title>
		  <q-btn color="primary" label="New Activity" @click="$store.commit('settings/updateNewActivityModal', true)"/>
		</q-toolbar>
		<div class="flex flex-center">
			<div class="row inline" v-for="course in courses" :key="course['.key']">
				<div class="col q-ma-md">
					<q-list >
					  <q-list-header>{{course.courseName}}</q-list-header>
					  <q-item v-for="(activity,i) in course.activities" :key="activity[i]" >
						  <q-item-main>
						    <q-item-tile label>{{activity.label}}</q-item-tile>
						  </q-item-main>
						  <q-item-side right>
						  	<q-btn flat round dense @click="editMode(course, activity)" color="info" icon="edit" />
						    <q-btn flat v-if="dontDelete(activity.value)" round dense @click="removeActivity(course, activity)" color="negative" icon="delete" />
						  </q-item-side>
						</q-item>
					</q-list>
				</div>
			</div>
		</div>
		<!-- new activity list modal -->
		<div>
			<q-modal v-model="newActivityModal" :content-css="{minWidth: '50vw', minHeight: '45vh'}" @hide="clearModal">
	      <q-modal-layout
			    header-style="min-height: 100px"
			    content-class="{'bg-primary': isPrimary, 'some-class': someBoolean}"
			    footer-class="bg-primary some-class"
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
	        <q-toolbar>
	          <q-toolbar-title>
	            New Activity List
	          </q-toolbar-title>
	          <q-btn flat round dense @click="newActivityModal = !newActivityModal" icon="close" />
	        </q-toolbar>
	        <div class="row q-pa-md">
        		<q-select :readonly="isEdit" class="col q-ma-md" v-model="newActivity.courseKey" :options="eventTypeOpt" stack-label="Event Type"/>
	        	<q-btn v-if="!isEdit" size="sm" color="primary" round class="col-1 q-my-md" icon="add" @click.native="$store.commit('settings/updateNewCourseModal', true)"/>
	        </div>
	        <div class="row q-px-md">
	        	<!-- <q-input class="col q-ma-md" v-model="newActivity.activityName" stack-label="Activity Name" /> -->
	        	<q-select :readonly="isEdit" class="col q-ma-md" v-model="newActivity.activityName" :options="activitiesOpt" stack-label="Activity"/>
	        	<q-btn v-if="!isEdit" size="sm" color="primary" round class="col-1 q-my-md" icon="add" @click.native="$store.commit('settings/updateActivitiesModal', true)"/>
	        </div>
	        <div class="flex flex-center">
	        	<q-checkbox class="q-ma-md" v-model="newActivity.time" label="Time" />
	        	<q-checkbox class="q-ma-md" v-model="newActivity.location" label="Location" />
	        	<q-checkbox class="q-ma-md" v-model="newActivity.capacity" label="Capacity" />
	        	<q-checkbox class="q-ma-md" v-model="newActivity.dueDate" label="Due Date" />	
	        </div>
        	
	        <!-- action -->
	        <div slot="footer">
	        	<q-btn v-if="!isEdit" color="primary" class="full-width" @click="addNewEventActivity">Save</q-btn>
	        	<q-btn v-if="isEdit" color="secondary" class="full-width" @click="updateActivity">Update</q-btn>
	        </div>
	      </q-modal-layout>
	      <q-inner-loading :visible="getNewActivityLoading">
          <q-spinner size="50px" color="primary"></q-spinner>
        </q-inner-loading>
	    </q-modal>
		</div>
		<!-- new course modal -->
		<div>
			<q-modal v-model="newCourseModal" :content-css="{minWidth: '30vw', minHeight: '45vh'}" @hide="clearNewCourseModal">
	      <q-modal-layout
			    header-style="min-height: 100px"
			    content-class="{'bg-primary': isPrimary}"
			    footer-class="bg-primary some-class"
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
	        <q-toolbar>
	          <q-toolbar-title>
	            Courses
	          </q-toolbar-title>
	          <q-btn flat round dense @click="newCourseModal = !newCourseModal" icon="close" />
	        </q-toolbar>
	        <!-- content -->
	        <div>
	        	<q-list>
						  <q-item v-for="course in courses" :key="course['.key']" >
							  <q-item-main>
							    <q-item-tile label>{{course.courseName}}</q-item-tile>
							  </q-item-main>
							  <q-item-side right>
							    <q-btn flat round dense @click="removeCourse(course)" color="negative" icon="delete" />
							  </q-item-side>
							</q-item>
						</q-list>	
	        </div>
	        <div>
	        	<q-input class="col q-ma-md" v-model="newCourse" stack-label="Course Name" />
	        </div>
	        <!-- action -->
	        <div slot="footer">
	        	<q-btn v-if="!isEdit" color="primary" class="full-width" @click="addNewCourse">Save</q-btn>
	        	<!-- <q-btn v-if="isEdit" color="secondary" class="full-width" @click="updateActivity">Update</q-btn> -->
	        </div>
	      </q-modal-layout>
	      <q-inner-loading :visible="getNewActivityLoading">
          <q-spinner size="50px" color="primary"></q-spinner>
        </q-inner-loading>
	    </q-modal>
		</div>
		<!-- new activity modal -->
		<div>
			<q-modal v-model="activitiesModal" :content-css="{minWidth: '30vw', minHeight: '45vh'}" @hide="clearNewCourseModal">
	      <q-modal-layout
			    header-style="min-height: 100px"
			    content-class="{'bg-primary': isPrimary}"
			    footer-class="bg-primary some-class"
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
	        <q-toolbar>
	          <q-toolbar-title>
	            Activities
	          </q-toolbar-title>
	          <q-btn flat round dense @click="activitiesModal = !activitiesModal" icon="close" />
	        </q-toolbar>
	        <!-- content -->
	        <div>
	        	<q-list>
						  <q-item v-for="(activity,i) in activities" :key="i" >
							  <q-item-main>
							    <q-item-tile label>{{activity.label}}</q-item-tile>
							  </q-item-main>
							  <q-item-side right>
							    <q-btn flat round dense @click="removeActivities(activity)" color="negative" icon="delete" />
							  </q-item-side>
							</q-item>
						</q-list>	
	        </div>
	        <div>
	        	<q-input class="col q-ma-md" v-model="newActivities" stack-label="Activity Name" />
	        </div>
	        <!-- action -->
	        <div slot="footer">
	        	<q-btn v-if="!isEdit" color="primary" class="full-width" @click="addActivities">Save</q-btn>
	        	<!-- <q-btn v-if="isEdit" color="secondary" class="full-width" @click="updateActivity">Update</q-btn> -->
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
import { required } from 'vuelidate/lib/validators'

export default {
	mounted () {
		this.$bindAsArray('kidsFashionCourse', this.$database.ref('settings/activityList/kidsFashionCourse'))
		this.$bindAsArray('basicCourse', this.$database.ref('settings/activityList/basicCourse'))
		this.$bindAsArray('fullCourse', this.$database.ref('settings/activityList/fullCourse'))
		this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		this.$bindAsArray('activities', this.$database.ref('settings/activityList'))
		this.$store.commit('settings/updateKidsFashionCourse', this.kidsFashionCourse)
		this.$store.commit('settings/updateBasicCourse', this.basicCourse)
		this.$store.commit('settings/updateFullCourse', this.fullCourse)
	},
	computed: {
		newActivityModal: {
			get () {
				return this.$store.state.settings.newActivityModal
			},
			set (val) {
				this.$store.commit('settings/updateNewActivityModal', val)
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
			let opt = this.$lodash.map(this.courses, c => {
				return { label: c.courseName, value: c['.key']}
			})
			return opt
		},
		activitiesOpt () {
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
			
		}
	},
	data () {
		return {
			courses: [],
			activities: [],
			kidsFashionCourse: [],
			basicCourse: [],
			fullCourse: [],
			isEdit: false,
			checked: '',
			newCourse: '',
			newActivities: '',
			newActivity: {
				eventType: '',
				activityName: '',
				courseKey: '',
				time: false,
				location: false,
				capacity: false,
				dueDate: false
			}
		}
	},
	methods: {
		addNewEventActivity () {
			let course = this.$lodash.filter(this.courses, c => {
				return c['.key'] === this.newActivity.courseKey
			})
			let activity = this.newActivity.activityName
			activity.capacity = this.newActivity.capacity
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
			this.$store.dispatch('settings/addNewCourse', {payload: this.newCourse, fireb: this.$firebase.database(), quasu: this.$q})
			this.newCourse = ''
		},
		removeCourse (c) {
			this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to remove ${c.courseName}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
         // your code here
         this.$store.dispatch('settings/removeCourse', {payload: c, fireb: this.$firebase.database(), quasu: this.$q})
        }).catch(() => {})
		},
		addActivities () {
			this.$store.dispatch('settings/addActivities', {payload: this.newActivities, fireb: this.$database, quasu: this.$q})
			this.newActivities = ''
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
			this.newActivity.courseKey = ''
			this.newActivity.activityName = ''
			this.newActivity.time = false
			this.newActivity.location = false
			this.newActivity.capacity = false
			this.newActivity.dueDate = false
			this.isEdit = false
			for (var i = 0; i < this.activities.length; i++) {
				this.activities[i].visible = true
			}
			this.$bindAsArray('kidsFashionCourse', this.$database.ref('settings/activityList/kidsFashionCourse'))
			this.$bindAsArray('basicCourse', this.$database.ref('settings/activityList/basicCourse'))
			this.$bindAsArray('fullCourse', this.$database.ref('settings/activityList/fullCourse'))
		},
		clearNewCourseModal () {
			this.newCourse = ''
		},
		dontDelete (d) {
			if (d === 'orientation' || d === 'payment' || d === 'workshop') {
				return false
			}
			else {
				return true
			}
		},
		editMode (c, a) {
			const course = c
			const activity = a
			this.newActivity.courseKey = course['.key']
			this.newActivity.activityName = a.label
			this.newActivity.capacity = a.capacity
			this.newActivity.dueDate = a.dueDate
			this.newActivity.location = a.location
			this.newActivity.time = a.time
			this.isEdit = true
			this.$forceUpdate()
			this.$store.state.settings.newActivityModal = true
		},
		updateActivity () {
			let course = this.$lodash.filter(this.courses, c => {
				return c['.key'] === this.newActivity.courseKey
			})
			let activity = {}
			activity.label = this.newActivity.activityName
			activity.value = this.newActivity.activityName.toLowerCase()
			activity.capacity = this.newActivity.capacity
			activity.time = this.newActivity.time
			activity.location = this.newActivity.location
			activity.dueDate = this.newActivity.dueDate
			var index = this.$lodash.findIndex(course[0].activities, ca => {
				return ca.label === activity.label
			})
			course[0].activities[index] = activity
			console.log('c', course)
			console.log('a', activity)
			// const activity = this.newActivity
			this.$store.dispatch('settings/addNewEventActivity', {payload: course[0], fireb: this.$firebase.database(), quasu: this.$q})
			this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		},
		removeActivity (c, a) {
			this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to delete ${c.courseName} ${a.label}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
         	// your code here
					var index = this.$lodash.findIndex(c.activities, ca => {
						return ca.value === a.value
					})
					c.activities.splice(index, 1)
       		this.$store.dispatch('settings/addNewEventActivity', {payload: c, fireb: this.$firebase.database(), quasu: this.$q})
        }).catch(() => {})
		}
	}
}
</script>