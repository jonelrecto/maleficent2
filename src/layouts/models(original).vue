<template>
	<div>
    <q-toolbar color="faded">
      <q-toolbar-title>
				Manage Models
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
		</q-toolbar>
    <!-- tabs -->
    <q-tabs>
      <q-tab default slot="title" name="tab-1" label="Contract Signed"/>
      <q-tab slot="title" name="tab-2" label="Show Up"/>
      <q-tab count="5" slot="title" name="tab-3" label="Registrants"/>
      <q-tab slot="title" name="tab-4" />
      <q-tab slot="title" name="tab-5" />
      <!-- Targets -->
      <q-tab-pane name="tab-1">
        <contract-signed></contract-signed>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <showup-model></showup-model>
      </q-tab-pane>
      <q-tab-pane name="tab-3" label="In-House Models">Tab Three</q-tab-pane>
      <q-tab-pane name="tab-4">Tab Four</q-tab-pane>
      <q-tab-pane name="tab-5">Tab Five</q-tab-pane>
    </q-tabs>

		<!-- event modal -->
		<q-modal v-model="eventModal" :content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearEventModal">
			<!-- modal layout -->
	    <q-modal-layout
		    content-class="{'bg-primary': isPrimary}"
		  >
		  <!-- layout content -->
		  <!-- header -->
		    <q-toolbar slot="header">
		    	<q-toolbar-title>
						{{isEdit ? 'Edit Event': 'Add New Event'}}
					</q-toolbar-title>
		    </q-toolbar>
		    <!-- content -->
		    	<div class="content-class">
		    		<q-input class="row textbox" v-model="newEvent.eventName" stack-label="Event Name" placeholder="Enter Event Name" />
		    		<q-input readonly class="row textbox" v-model="acroEventCode" stack-label="Event Code" placeholder="Enter Event Code" />
            <q-select
              class="textbox"
              v-model="newEvent.course"
              stack-label="Event Type"
              float-label="Select Event Type"
             :options="courseOpt"
            />
            <q-checkbox v-model="newEvent.ageRange.infant" label="Below 4 yrs old" class="caption textbox"/>
            <q-list link v-if="newEvent.ageRange.infant">
              <q-item tag="label">
                <q-item-side>
                  <q-radio color="secondary" v-model="newEvent.ageRange.type" val="infant" />
                </q-item-side>
                <q-item-main>
                  <q-item-tile label>Infant</q-item-tile>
                  <q-item-tile sublabel>7 months - 1yr.4months</q-item-tile>
                </q-item-main>
              </q-item>
              <q-item tag="label">
                <q-item-side>
                  <q-radio color="secondary" v-model="newEvent.ageRange.type" val="todler" @input="below4"/>
                </q-item-side>
                <q-item-main>
                  <q-item-tile label>Todler</q-item-tile>
                  <q-item-tile sublabel>1yr.5months - 3yr.11months</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
            <!-- 4 yrs old above -->
		    		<div class="row">
              <div v-if="!newEvent.ageRange.infant" class="col">
                <q-chip square color="secondary" class="col q-ma-md">
                  Age Range: {{ this.range.min }}yrs old to {{ this.range.max }} yrs old
                </q-chip>
                <div class="row q-ma-md">
                  <q-input class="col q-mx-md" v-model="range.min" stack-label="From"/>
                  <q-input class="col q-mx-md" v-model="range.max" stack-label="To"/>
                </div>
                
                <q-range label-always class="q-ma-md full-width" v-model="range" :min="4" :max="60" :step="1" color="primary" label/>
              </div>
		    		</div>
		    		<q-select
              class="row textbox"
				      v-model="newEvent.genderRestriction"
				      stack-label="Gender Restriction"
				      float-label="Select Gender"
				     :options="genderRestricOpt"
				    />
		    		<q-input class="textbox" type="textarea" v-model="newEvent.description" stack-label="Description" placeholder="Enter Event Details" />
		    	</div>
          <!-- add button -->
          <q-btn
            v-if="!isEdit"
            class="full-width textbox"
            color="primary"
            @click="addNewEvent"
            label="Save"
          />
          <!-- edit button -->
          <q-btn
            v-if="isEdit"
            class="full-width textbox"
            color="secondary"
            @click="editEvent"
            label="Update"
          />
          <!-- spinner loading -->
          <q-inner-loading :visible="loading">
            <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
          </q-inner-loading>
		  </q-modal-layout>
	  </q-modal>


    <!-- edit page modal -->
    <q-modal v-model="eventPageModal" :content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearEventModal">
      <q-modal-layout
        content-class="{'bg-primary': isPrimary}"
      >
        <q-toolbar>
          <q-toolbar-title>
            Page Details
          </q-toolbar-title>
        </q-toolbar>
        <editPage :data="this.newEvent"></editPage>
        <q-inner-loading :visible="eventPageLoading">
          <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
        </q-inner-loading>
      </q-modal-layout>
    </q-modal>
    <!-- page photo modal -->
    <q-modal v-model="eventPagePhotoModal" :content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearEventModal">
      <q-modal-layout
        content-class="{'bg-primary': isPrimary}"
      >
        <q-toolbar>
          <q-toolbar-title>
            Page Photos
          </q-toolbar-title>
        </q-toolbar>
        <editPagePhotos :data="this.newEvent"></editPagePhotos>
        <q-inner-loading :visible="eventPageLoading">
          <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
        </q-inner-loading>
      </q-modal-layout>
    </q-modal>


		<!-- sub-routes get injected here: -->
		<q-page-container>
			<router-view />
		</q-page-container>

  </div>
</template>

<script>
import editPage from '../pages/events/pageModal.vue'
import editPagePhotos from '../pages/events/pagePhotos.vue'
import ContractSigned from '../pages/manageModels/signedModels'
import ShowupModel from '../pages/manageModels/showUpModels'

export default {
  components: {
    editPage,
    editPagePhotos,
    ContractSigned,
    ShowupModel
  },
	mounted () {
    this.$bindAsArray('events', this.$database.ref('events'))
    this.$bindAsArray('courses', this.$database.ref('settings/courses'))
    this.$bindAsArray('models', this.$database.ref('models'))
    // this.setEvents()
	},
	computed: {
    eventState: {
      get () {
        return this.$store.state.users.getEvents
      },
      set (val) {
        this.$store.commit('users/getEvents', val)
      }
    },
    acroEventCode () {
      try {
        let eventName = this.newEvent.eventName
        var matches = eventName.match(/\b(\w)/g)
        var acronym = matches.join('')
        this.eventCode = acronym
        return acronym
      } catch (err) {}
    },
    infantOpt () {
      var months = []
      for (var i = 7; i <= 11; i++) {
        months.push(i)
      }
      let infOpt = this.$lodash.map(months, i => {
        return { label: i + 'months', value: i / 12}
      })
      return infOpt
    },
    below4 () {
      if (this.newEvent.ageRange.type === 'infant') {
        this.newEvent.ageRange.min = '7 months'
        this.newEvent.ageRange.max = '1yr.4months'
      }
      else if (this.newEvent.ageRange.type === 'todler') {
        this.newEvent.ageRange.min = '1yr.5months'
        this.newEvent.ageRange.max = '3yr.11months'
      }
      else {
        this.newEvent.ageRange.min = 0
        this.newEvent.ageRange.max = 0
      }
    },
    eventPageLoading () {
      return this.$store.getters['users/getEventPageLoading']
    },
    eventPageModal: {
      get () {
        // return this.$store.getters['users/getEventPageModal']
        return this.$store.state.users.eventPageModal
      },
      set (val) {
        this.$store.commit('users/updateEventPageModal', val)
      }
    },
    eventPagePhotoModal: {
      get () {
        return this.$store.state.users.eventPagePhotoModal
      },
      set (val) {
        this.$store.commit('users/updateEventPagePhotosModal', val)
      }
    },
    courseOpt () {
      let opt = this.$lodash.map(this.courses, c => {
        return {label: c.courseName, value: c['.key']}
      })
      return opt
    }
  },
  data () {
    return {
      dense: true,
      events: [],
      courses: [],
      models: [],
      range: {
        min: 4,
        max: 60
      },
      newEvent: {
        eventName: '',
        course: '',
        eventCode: '',
        ageRange: {
          min: '',
          max: '',
          infant: false,
          type: ''
        },
        genderRestriction: '',
        description: '',
        seasons: []
      },
      eventTypesOpt: [
        { label: 'Kids Fashion', value: 'kidsFashion' },
        { label: 'Basic Course', value: 'basicCourse' },
        { label: 'Full Course', value: 'fullCourse' },
      ],
      genderRestricOpt: [
        { label: 'Male Only', value: 'male' },
        { label: 'Female Only', value: 'female' },
        { label: 'None (Male/Female)', value: 'none(male/female)' }
      ],
      eventModal: false,
      editPageModal: false,
      pagePhotoModal: false,
      isEdit: false,
      loading: false,
      // table configuration
      filter: '',
      tableLoading: false,
      columns: [
        {
          name: 'code',
          required: true,
          label: 'Last Name',
          align: 'left',
          field: 'lastName',
          sortable: true
        },
        {
          name: 'name',
          required: true,
          label: 'First Name',
          align: 'left',
          field: 'firstName',
          sortable: true
        },
        {
          name: 'event',
          required: true,
          label: 'Event',
          align: 'left',
          field: 'eventName',
          sortable: true
        },
        {
          name: 'season',
          required: true,
          label: 'Season',
          align: 'left',
          field: 'seasonName',
          sortable: true
        },
        {
          name: 'gender',
          required: true,
          label: 'Gender Restriction',
          align: 'left',
          field: 'gender',
          sortable: true
        },
        {
          name: 'contract',
          required: true,
          label: 'Contract Sign',
          align: 'left',
          field: 'contractSign',
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
    setEvents () {
      this.$store.dispatch('users/setupEvents', this.events)
    },
    getCourse (courseKey) {
      try{
        var index = this.$lodash.findIndex(this.courses, c => {
          return c['.key'] === courseKey
        })
        return this.courses[index].courseName
      }catch (err) {}
    },
  	clearEventModal () {
      delete this.newEvent['.key']
      delete this.newEvent.__index
  		this.newEvent.eventName = ''
  		this.newEvent.eventCode = ''
  		this.newEvent.ageRange.min = ''
  		this.newEvent.ageRange.max = ''
      this.newEvent.ageRange.infant = false
      this.range.min = 4
      this.range.max = 40
      this.newEvent.ageRange.type  = ''
  		this.newEvent.genderRestriction = ''
  		this.newEvent.description = ''
      this.isEdit  = false
      this.$bindAsArray('events', this.$database.ref('events'))
  	},
    showEventPagePhotoModal (d) {
      this.newEvent = Object.assign({}, d.row)
      this.editPageModal = true
      if (!d.row.ageRange.infant) {
        this.range.min = parseInt(d.row.ageRange.min.match(/\d+/)[0])
        this.range.max = parseInt(d.row.ageRange.max.match(/\d+/)[0])
      }
      this.$forceUpdate()
      this.eventPagePhotoModal = true
      this.$store.dispatch('users/updateEvent', this.newEvent)
    },
    showEventPageModal (d) {
      this.newEvent = Object.assign({}, d.row)
      this.editPageModal = true
      if (!d.row.ageRange.infant) {
        this.range.min = parseInt(d.row.ageRange.min.match(/\d+/)[0])
        this.range.max = parseInt(d.row.ageRange.max.match(/\d+/)[0])
      }
      this.$forceUpdate()
      this.$store.dispatch('users/openEventPageModal')
      this.$store.dispatch('users/updatePages', this.newEvent.page)
    },
    showEvent (d) {
      this.newEvent = Object.assign({}, d.row)
      this.isEdit = true
      this.eventModal = true
      if (!d.row.ageRange.infant) {
        this.range.min = parseInt(d.row.ageRange.min.match(/\d+/)[0])
        this.range.max = parseInt(d.row.ageRange.max.match(/\d+/)[0])
      }
      this.$forceUpdate()
    },
    addNewEvent () {
      this.loading = true
      let event = Object.assign({}, this.newEvent)
      var ageRange = Object.assign([], event.ageRange)
      event.ageRange = ageRange
      event.eventCode = this.acroEventCode
      if (!event.ageRange.infant) {
        event.ageRange.min = this.range.min + 'yrs old'
        event.ageRange.max = this.range.max + 'yrs old'
        event.ageRange.type = 'above 4'
      }
      var page = {
        header: '',
        content: '',
        footer: ''
      }
      var pagePhotos = {
        eventLogo: '',
        homeLogo: '',
        titleImage: '',
        registrationImage: ''
      }
      event.page = page
      event.pagePhotos = pagePhotos
      console.log('add to event', event)
      this.$firebaseRefs.events.push(event)
        .then(() => {
          this.loading = false
          this.clearEventModal()
          this.eventModal = false
          this.$q.notify({
            message: `${event.eventName} has been succesfully added`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
        })
        .catch((err) => {
          this.loading = false
          this.clearEventModal()
          this.eventModal = false
          this.$q.notify({
            message: `An Error Occured`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'warning'
          })
          console.log('error', err)
        })
    },
    editEvent () {
      this.loading = true
      let event = Object.assign({}, this.newEvent)
      var key = event['.key']
      delete event['.key']
      if (!event.ageRange.infant) {
        event.ageRange.min = this.range.min + 'yrs old'
        event.ageRange.max = this.range.max + 'yrs old'
        event.ageRange.type = 'above 4'
      }
      this.$firebaseRefs.events.child(key).update(event)
        .then(() => {
          this.loading = false
          this.eventModal = false
          this.$q.notify({
            message: `${event.eventName} has been succesfully updated`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
        })
        .catch(error => {
          this.loading = false
          this.eventModal = false
          this.$q.notify({
            message: `An Error Occured`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'warning'
          })
          console.log('error', error)
        })
    },
    deleteEvent (d) {
      let self = this
      let key = d.row['.key']
      this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to delete ${d.row.eventName}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
          self.$firebaseRefs.events.child(key).remove()
            .then(() => {
              this.$q.notify({
                message: `${d.row.eventName} deleted`,
                type: 'info',
                color: 'info',
                textColor: 'white',
                icon: 'info'
              })
            })
            .catch(err => {
              this.$q.notify({
                message: `An Error occur`,
                type: 'info',
                color: 'info',
                textColor: 'white',
                icon: 'info'
              })
              console.log('err', err)
            })
        }).catch(() => {})
    },
    isOngoing (d) {
      let event = d.row
      try {
        if (event.seasons[0].status === 'ongoing') {
          return false
        }
        else {
          return true
        }
      }catch (err) {
        return true
      }
    }
  }
}
</script>
<style type="scoped">
.textbox {
  margin-top: 3%;
  margin-right: 3%;
  margin-left: 3%
}
.fromTo {
  margin-right: 10px;  
}
.modal-content {
  margin: 5%;
}
</style>