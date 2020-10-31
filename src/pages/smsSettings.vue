<template>
	<div>
		<q-toolbar inverted>
		  <q-toolbar-title>
		    SMS Settings
		  </q-toolbar-title>
		  <q-btn color="primary" icon="add" label="New Template" class="q-mx-sm" v-if="newTemplate" @click="createNewTemplate"/>
		  <q-btn color="secondary" icon="edit" label="Edit Template" class="q-mx-sm" v-if="editTemplate" @click="editModeOn"/>
		  <q-btn color="dark" icon="save" label="Save Template" class="q-mx-sm"  v-if="saveTemplate" @click="saveNewTemplate"/>
		  <q-btn color="red" icon="close" label="Cancel" class="q-mx-sm" v-if="saveTemplate" @click="cancelNewTemplate"/>
		</q-toolbar>
		<div class="flex">
			<div class="row inline">
				<div class="col-11 q-ma-md">
					<q-list inset-separator link>
					  <q-list-header>SMS Templates</q-list-header>
					  <q-item v-for="sms,i in SMStemplates" :key="i" >
					  	<div @click="clickTemplate(sms)">
					  		<q-item-main>
						      <q-item-tile label >{{sms.name}}</q-item-tile>
						    </q-item-main>
					  	</div>
					  </q-item>
					</q-list>
				</div>
			</div>
			<div class="col q-ma-sm">
				 <div class="col-4 q-px-lg">
				 	 <q-input v-model="nameTemplate" float-label="Template Name" inverted color="dark" class="q-mb-md" v-if="saveTemplate"/>
        <q-field
          icon="textsms"
          label="Template"
          :count="300"
				  error-label="SMS Template Character Maxed Out"
          label-width="12"
          class="q-ma-sm"
        >
         <q-input
          v-model="area"
          type="textarea"
          float-label="SMS Template"
          :max-height="1000"
          rows="10"
          :readonly="readonly"/>
        </q-field>
           <q-field
          icon="playlist_add"
          label="Add Data to Template"
          label-width="12"
          class="q-ma-lg"
        >
        <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="First Name"
        class="q-ma-xs" @click="addToTemplate('fname')"/>
        <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="Last Name"
         class="q-ma-xs"  @click="addToTemplate('lname')"/>
        <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="Activity Date"
         class="q-ma-xs"  @click="addToTemplate('date')"/>
                 <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="Activity Time"
         class="q-ma-xs"  @click="addToTemplate('time')"/>
                 <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="Event Name"
         class="q-ma-xs"  @click="addToTemplate('event')"/>
                 <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="Activity Location"
         class="q-ma-xs"  @click="addToTemplate('location')"/>
                      <q-btn
        color="dark"
        outline rounded
        size="sm"
        label="Activity Details"
         class="q-ma-xs"  @click="addToTemplate('details')"/>
      </q-field>
      </div>
			</div>
		</div>
	</div>
</template>
<script>
import { SlickList, SlickItem } from 'vue-slicksort'
import draggable from 'vuedraggable'
import { required } from 'vuelidate/lib/validators'
import { filter } from 'quasar'

export default {
	created () {
	},
	mounted () {
		this.$bindAsArray('testData', this.$database.ref('contractSigned').orderByChild('accountNumber').equalTo('IZRDZI3QGX'))
		this.$bindAsArray('courses', this.$database.ref('settings/courses'))
		this.$bindAsArray('activities', this.$database.ref('settings/activityList'))
		this.$bindAsArray('SMStemplates', this.$database.ref('SMStemplates'))
		console.log('sms',this.SMStemplates)
		// this.$store.state.settings.courses = this.courses
	},
	validations () {
		return {
			courseName: {
				required
			},
			activityName: {
				required
			}
		}
	},
	components: {
		SlickList,
		SlickItem,
		draggable
	},
	computed: {
		// getSMSTemplates () {
		// 		console.log(this.SMStemplates)
		// 		let sms = this.$lodash.filter(this.SMStemplates, s=>{
		// 			return s
		// 		})
		// 		console.log('getSMSTemplates',sms)
		// 		return sms
		// },
		dragOptions() {
      return {
        animation: 0,
        ghostClass: 'ghost',
        group: 'label', 
        disabled: this.editActivity,
      }
    }
	},
	data () {
		return {
			autofocus: false,
			 readonly: true,
       area: '',
       nameTemplate: '',
       newTemplate: true,
       editTemplate: false,
      editMode: false,
       saveTemplate: false,
       selectedTemplate: {},
			testData: [],
			SMStemplates: [],
			editActivity: false,
			myArray: [],
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
			courseName: '',
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
				time: false,
				location: false,
				details: false,
				dueDate: false
			}
		}
	},
	methods: {
		addToTemplate (e) {
			if(this.readonly === false) {
		      let data = e
		      let msg = this.area
		      msg = msg + '${'+data+'}'
		      this.area = msg
			} else {

			}
    },
    createNewTemplate (){
    	this.readonly = false
    	this.saveTemplate = true
    	this.newTemplate = false
    	this.editTemplate = false
    	this.area = ''
    	this.nameTemplate = ''
    },
    cancelNewTemplate (){
    	this.readonly = true
    	this.area = ''
    	this.nameTemplate = ''
    	this.saveTemplate = false
    	this.newTemplate = true
    	this.selectedTemplate = {}
    	this.editMode = false
    },
    saveNewTemplate (){
    	if(this.editMode === true){
    		let sms = this.selectedTemplate
    		let key = sms['.key']
    		console.log(key)
    		delete sms['.key']
    		let updated = {
    			name: this.nameTemplate,
    			template: this.area
    		}
    		this.$database.ref('SMStemplates').child(key).update(updated)
    		.then(() => {
              this.$q.notify({
                message: `SMS Template Updated`,
                type: 'positive',
                color: 'positive',
                textColor: 'white',
                icon: 'positive'
              })
              this.cancelNewTemplate()
              this.$forceUpdate()
              this.$bindAsArray('SMStemplates', this.$database.ref('SMStemplates'))
            })
    		// saves edit
    	} else {
    		let template = {
    			name: this.nameTemplate,
    			template: this.area
    		}
    		this.$database.ref('SMStemplates').push(template)
    		    .then(() => {
              this.$q.notify({
                message: `SMS Template Added`,
                type: 'positive',
                color: 'positive',
                textColor: 'white',
                icon: 'positive'
              })
              this.cancelNewTemplate()
            })
    	}
    },
    clickTemplate(e){
    	let data = e
    	this.area = e.template
    	this.nameTemplate = e.name
    	this.editTemplate = true
    	this.selectedTemplate = e
    	console.log(this.selectedTemplate)
    },
    editModeOn (){
    	this.saveTemplate = true
    	this.editTemplate = false
    	this.newTemplate = false
    	this.readonly = false
    	this.editMode = true
    }
    //end of methods
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
  opacity: 0.5;
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