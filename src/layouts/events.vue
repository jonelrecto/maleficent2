<template>
	<div>
    <q-toolbar color="faded">
      <q-toolbar-title >
				<!-- Events -->
        <q-breadcrumbs  color="white" active-color="info" separator=">">
          <q-breadcrumbs-el class="q-subheading text-weight-bold" active color="info" label="Events" to="/events"/>
        </q-breadcrumbs>
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
      <!-- <q-btn label="test" @click="test"/> -->
		</q-toolbar>
		<!-- data table -->
		<div class="q-ma-md">
			<q-table
        :dense="dense"
		    :data="events"
        :loading="tableLoading"
		    :columns="columns"
        :filter="filter"`
        :pagination.sync="pagination"
		    row-key="code"
		  >
      <!-- search -->
      <template slot="top-right" >
        <q-search
          color="secondary"
          v-model="filter"
          class="col-10"
        />
      </template>
      <!-- age range -->
      <q-td slot="body-cell-ageRange" slot-scope="props" :props="props">
        <p>{{getAgeType(props.row)}}</p>
        {{getAgeRange(props.row)}}
      </q-td>
      <!-- season -->
      <q-td slot="body-cell-season" slot-scope="props" :props="props">
        <p>{{getLatestSeason(props.row)}}</p>
        <q-btn rounded size="sm" label="View Seasons" color="positive" @click="viewSeason(props)" />
      </q-td>
      <!-- schedules -->
      <q-td slot="body-cell-schedule" slot-scope="props" :props="props">
        <q-btn rounded size="sm" label="View Schedules" color="info" @click="viewSchedule(props)" />
      </q-td>
      <!-- action button -->
        <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn v-if="isHasSeason(props.row)" size="sm" label="Edit" color="info" icon="edit" @click="showEvent(props)" />
          <q-btn v-if="isHasSeason(props.row)" size="sm" label="Remove" color='negative' icon="delete" @click="deleteEvent(props)" />
        </q-td>
      </q-table>
		</div>
		<!-- sticky button -->
		<q-page-sticky position="top-right" :offset="[10, 10]">
		  <q-btn
		    rounded
        label="New Event"
		    size="md"
		    color="primary"
		    @click="eventModal = true" 
		    icon="event">
        <!-- <p class="q-caption">New Event</p> -->
      </q-btn>
		</q-page-sticky>
			<!-- event modal -->
			<q-modal class="q-pa-md" v-model="eventModal" no-backdrop-dismiss :content-css="{minWidth: '50vw', minHeight: '82vh'}" @hide="clearEventModal">
		    <q-modal-layout
			    content-class="{'bg-primary': isPrimary}"
          footer-class="bg-primary some-class"
          footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >
        <!-- <q-btn label="test" @click="test"/> -->
			    <q-toolbar slot="header">
			    	<q-toolbar-title>
              <q-icon v-if="isEdit" name="mdi-calendar-edit" />
              <q-icon v-else name="mdi-calendar-plus" />
							{{isEdit ? 'Edit Event': 'Add New Event'}}
						</q-toolbar-title>
            <q-btn flat round icon="close" @click="eventModal = !eventModal" />
			    </q-toolbar>
			    <!-- content -->
            <!-- <q-btn label="test" @click="test"/> -->
			    	<div class="content-class">
             <img v-if="isEdit" class="" :src="newEvent.pagePhotos.eventLogoUrl" alt="Image not set" width="100px" height="100px">
              <q-uploader
                class="q-ma-md"
                :url="eventPhotoLogo"
                name="eventLogo"
                hide-upload-progress
                float-label="Event Logo"
                hide-upload-button
                auto-expand
                @add="(photoAdded)"
                @remove="uploadedPhoto = null"
                ref="eventPhotoLogoRef"
                extensions="'.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'"
                :error="$v.uploadedPhoto.$error"
              />

			    		<q-input class="row textbox" :error="isErrorEventName" @blur="capitalize(), $v.newEvent.eventName.$touch, hasDuplicateEventName(), acroEventCode" v-model="newEvent.eventName" stack-label="Event Name" placeholder="Enter Event Name" />
			    		
              <q-input :error="isDuplicateCode" @blur="hasDuplicateEventCode(), removeEventCodeSpacing()" :hide-underline="!isCustomEventCode" :readonly="!isCustomEventCode" class="row textbox" v-model="newEvent.eventCode" stack-label="Event Code" placeholder="Enter Event Code" />

              <q-checkbox class="q-body-1 q-mx-md" v-model="isCustomEventCode" label="Custom Event Code"/>
              <br/>
              <!-- <q-select
                class="textbox"
                v-model="newEvent.course"
                stack-label="Course"
                float-label="Select Event Type"
               :options="courseOpt"
              /> -->
              <q-item-separator />
              <q-checkbox v-model="newEvent.ageRange.infant" label="Below 4 yrs old" class="q-ma-md" />
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
                 <q-item tag="label">
                  <q-item-side>
                    <q-radio color="secondary" v-model="newEvent.ageRange.type" val="infant&todler" @input="below4"/>
                  </q-item-side>
                  <q-item-main>
                    <q-item-tile label>Infant and Toddler</q-item-tile>
                    <q-item-tile sublabel>7months - 3yr.11months</q-item-tile>
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
                    <q-input class="col q-mx-md" v-model="range.min" stack-label="From" :error="isNotGreaterThanFromTo"/>
                    <q-input class="col q-mx-md" v-model="range.max" stack-label="To" :error="isNotGreaterThanFromTo"/>
                  </div>
                </div>
			    		</div>
			    		<q-select
                class="row textbox"
					      v-model="newEvent.genderRestriction"
					      stack-label="Gender Restriction"
					      float-label="Select Gender"
					     :options="genderRestricOpt"
               :error="$v.newEvent.genderRestriction.$error"
					    />
			    		<!-- <q-input class="textbox" type="textarea" v-model="newEvent.description" stack-label="Description" placeholder="Enter Event Details" /> -->
			    	</div>
            <div slot="footer">
              <!-- add button -->
              <q-btn
                v-if="!isEdit"
                class="full-width"
                color="primary"
                @click="addNewEvent"
                label="Save"
              />
              <!-- <q-btn
                v-if="!isEdit"
                class="full-width"
                color="primary"
                @click="test"
                label="test"
              /> -->
              <!-- edit button -->
              <q-btn
                v-if="isEdit"
                class="full-width"
                color="secondary"
                @click="editEvent"
                label="Update"
              />
            </div>
            <!-- spinner loading -->
            <q-inner-loading :visible="eventLoading">
              <q-spinner size="50px" color="primary"></q-spinner>
              <span>Proceeding to Season</span>
            </q-inner-loading>
			  </q-modal-layout>
		  </q-modal>
      <!-- edit page modal -->
      <q-modal v-model="eventPageModal"  no-backdrop-dismiss	:content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearEventModal">
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
      <q-modal v-model="eventPagePhotoModal" no-backdrop-dismiss :content-css="{minWidth: '50vw', minHeight: '95vh'}" @hide="clearEventModal">
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
import { required, between } from 'vuelidate/lib/validators'
import editPage from '../pages/events/pageModal.vue'
import editPagePhotos from '../pages/events/pagePhotos.vue'

export default {
  components: {
    editPage,
    editPagePhotos
  },
  created () {
    this.tableLoading = true
  },
	mounted () {
    this.storageRef = this.$firebase.storage().ref()
    this.$bindAsArray('events', this.$database.ref('events'), null, () => {
      this.$bindAsArray('courses', this.$database.ref('settings/courses').orderByChild('courseName'), null, () => {
        this.tableLoading = false
      })
    })
    
    // this.setEvents()
	},
  validations () {
    return {
      uploadedPhoto: {
        required
      },
      newEvent: {
        eventName: {
          required
        },
        eventCode: {
          required
        },
        genderRestriction: {
          required
        }
      },
      uploadedPhoto: {
        required
      }
    }
  },
  watch: {
    eventCode: {
      handler () {
        this.hasDuplicateEventCode()
      },
      deep: true
    }
  },
	computed: {
    isErrorEventName () {
      if (this.$v.newEvent.eventName.$error || this.isDuplicateEventName) {
        return true
      } else {
        return false
      }
    },
    isNotGreaterThanFromTo () {
      if (this.newEvent.ageRange.infant === false) {
        if (parseInt(this.range.min) < 4) {
          console.log('min < 4 range min > 60')
          return true
        }
        if (parseInt(this.range.max) > 60) {
          console.log('max > 60')
          return true
        }
        if (parseInt(this.range.min) > parseInt(this.range.max)) {
          console.log('min', this.range.min)
          console.log('max', this.range.max)
          console.log('range min > mx')
          return true
        }
        return false
      } else {
        return false
      }
    },
    isEmptyAgeRangeType () {
      if (this.newEvent.ageRange.infant) {
        if (this.newEvent.ageRange.type === '') {
          return true
        }
      } else {
        return false
      }
    },
    events2: {
      get () {
        return this.$store.state.startUp.events
      },
      set (v) {
        this.$store.state.startUp.events = v
      }
    },
    eventModal: {
      get () {
        return this.$store.state.users.eventModal
      },
      set (v) {
        this.$store.state.users.eventModal = v
      }
    },
    eventLoading: {
      get () {
        return this.$store.state.users.eventLoading
      },
      set (v) {
        this.$store.state.users.eventLoading = v
      }
    },
    photoAdded (p) {
      var photo = this.$refs.eventPhotoLogoRef.files[0]
      this.uploadedPhoto = photo
    },
    columns () {
      return this.$store.state.users.columns
    },
    eventState: {
      get () {
        return this.$store.state.users.getEvents
      },
      set (val) {
        this.$store.commit('users/getEvents', val)
      }
    },
    acroEventCode: {
      get () {
        try {
          let eventName = this.newEvent.eventName
          var matches = eventName.match(/\b(\w)/g)
          var acronym = matches.join('')
          this.newEvent.eventCode = acronym
          return this.newEvent.eventCodef
        } catch (err) {}
      },
      set (v) {
        this.newEvent.eventCode = v
        // this.acroEventCode = v
      }
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
      } else if (this.newEvent.ageRange.type === 'todler') {
        this.newEvent.ageRange.min = '1yr.5months'
        this.newEvent.ageRange.max = '3yr.11months'
      } else if (this.newEvent.ageRange.type === 'infant&toddler') {
        this.newEvent.ageRange.min = '7 months'
        this.newEvent.ageRange.max = '3yr.11months'
      } else {
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
      isDuplicateEventName: false,
      isDuplicateCode: false,
      customEventCode: '',
      isCustomEventCode: false,
      storageRef: null,
      uploadedPhoto: null,
      eventPhotoLogo: '',
      dense: true,
      events: [],
      courses: [],
      range: {
        min: 4,
        max: 60
      },
      newEvent: {
        eventName: '',
        eventCode: '',
        course: '',
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
      genderRestricOpt: [
        { label: 'Male Only', value: 'male' },
        { label: 'Female Only', value: 'female' },
        { label: 'None (Male/Female)', value: 'none(male/female)' }
      ],
      editPageModal: false,
      pagePhotoModal: false,
      isEdit: false,
      loading: false,
      // table configuration
      filter: '',
      tableLoading: false,
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
    }
  },
  methods: {
    removeEventCodeSpacing() {
      // this.newEvent.eventCode = this.newEvent.eventCode.toUpperCase()
      this.newEvent.eventCode =  this.newEvent.eventCode.replace(/\s/g, "").toUpperCase()
    },
    getAgeType (p) {
      try {
        if (p.ageRange.infant) {
          return this.$lodash.capitalize(p.ageRange.type)
        }
        return ''
      } catch {}
    },
    getLatestSeason (p) {
      try {
        let latest = this.$lodash.maxBy(p.seasons, s => {
          return s.seasonNumber
        })
        console.log(latest, 'lastest season')
        return latest.seasonNumber
      } catch {
        return 'No Season Yet'
      }
    },
    getAgeRange (p) {
      try {
        return `${p.ageRange.min} - ${p.ageRange.max}`
      } catch {}
    },
    viewSchedule (p) {
      let key = p.row['.key']
      this.$router.push(`/viewEventSchedules/${key}`)
    },
    hasDuplicateEventName () {
      let eventName = this.$store.getters['startUp/getPlainValue'](this.newEvent.eventName)
      var i = this.$lodash.findIndex(this.events2, e => {
        return e.eventName === eventName
      })
      // console.log('i', i)
      if (i != -1) {
        this.isDuplicateEventName = true
        // this.isCustomEventCode = true
        // console.log('has duplicate')
        // return true
      } else {
        this.isDuplicateEventName = false
        // console.log('no duplicate')
        // return false
      }
    },
    hasDuplicateEventCode () {
      // console.log('events', this.$store.state.startUp.events)
      // var testVar = 'TFS'
      // console.log('new event code', this.acroEventCode)
      // console.log('new event code', this.newEvent.eventCode)
      var i = this.$lodash.findIndex(this.events2, e => {
        return e.eventCode === this.newEvent.eventCode
      })
      // console.log('i', i)
      if (i != -1) {
        this.isDuplicateCode = true
        // this.isCustomEventCode = true
        // console.log('has duplicate event name')
        // return true
      } else {
        this.isDuplicateCode = false
        // console.log('no duplicate')
        // return false
      }
    },
    isHasSeason (e) {
      if (e.seasons) {
        return false
      }
      return true
    },
    viewSeason (data) {
      this.$router.push(`/eventseason/${data.row['.key']}`)
    },
    capitalize () {
      this.newEvent.eventName = this.$store.getters['settings/titleCase'](this.newEvent.eventName)
    },
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
      this.range.max = 60
      this.newEvent.ageRange.type  = ''
  		this.newEvent.genderRestriction = ''
  		this.newEvent.description = ''
      this.isEdit  = false
      this.uploadedPhoto = null
      this.$refs.eventPhotoLogoRef.clear()
      this.$refs.eventPhotoLogoRef.reset()
      this.$bindAsArray('events', this.$database.ref('events'))
      this.isDuplicateEventName = false
      this.isDuplicateCode = false
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
      console.log('event', this.newEvent)
      this.isEdit = true
      this.eventModal = true
      if (!d.row.ageRange.infant) {
        this.range.min = parseInt(d.row.ageRange.min.match(/\d+/)[0])
        this.range.max = parseInt(d.row.ageRange.max.match(/\d+/)[0])
      }
      this.$forceUpdate()
    },
    addNewEvent () {
      this.$v.uploadedPhoto.$touch()
      this.$v.newEvent.$touch()
      console.log('new event', this.newEvent)
      if (!this.$v.uploadedPhoto.$error && !this.$v.newEvent.$error && !this.isDuplicateCode && !this.isEmptyAgeRangeType && !this.isNotGreaterThanFromTo) {
        this.$q.dialog({
          title: 'Save Confirmation',
          message: `Do you want to save?`,
          ok: 'Yes',
          cancel: 'No'
        }).then(() => {
            this.eventLoading = true
            this.$store.dispatch('users/addNewEvent', {newEvent: this.newEvent, range: this.range, eventLogo: this.uploadedPhoto})
              .then(() => {
                this.eventLoading = false
                this.$router.push(`/eventseason/${this.$store.state.users.eventKey}`)
              })
          }).catch(() => {})
      } else {
        this.$q.notify('Please review fields again.')
      }
      
    },
    editEvent () {
      this.loading = true
      let event = Object.assign({}, this.newEvent)
      event.eventCode = this.acroEventCode
      var key = event['.key']
      delete event['.key']
      if (!event.ageRange.infant) {
        event.ageRange.min = this.range.min + 'yrs old'
        event.ageRange.max = this.range.max + 'yrs old'
        event.ageRange.type = 'above 4'
      }
      console.log('uploaded photo', this.uploadedPhoto)
      if (this.uploadedPhoto != null) {
        console.log('photo is null')
        const getEventLogoURL = async () => {
          var result = await this.$store.getters['users/uploadEventLogo']({e: event, eL: this.uploadedPhoto})
          return result
        }
        getEventLogoURL()
          .then(url => {
            console.log('url', url)
            event.pagePhotos.eventLogoUrl = url
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
                })
          .catch(err => {
            console.log('an error occur', err)
          })
      } else {
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
      }
      
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
    },
    test () {
      this.$v.uploadedPhoto.$touch()
      this.$v.newEvent.$touch()
      console.log('this.$v.uploadedPhoto.$touch()', this.$v.uploadedPhoto.$error)
      console.log('this.$v.newEvent.$touch()', this.$v.newEvent.$error)
      console.log('new event', this.newEvent)
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