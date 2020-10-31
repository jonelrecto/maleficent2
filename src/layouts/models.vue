<template>
  <div class="container" >
    <q-toolbar color="faded">
      <q-toolbar-title>
        Manage Models
        </q-toolbar-title>
        <!-- <span slot="subtitle">Optional subtitle</span> -->
    </q-toolbar>
    <!-- tabs -->
    <q-tabs color="teal" v-model="selectedTab" no-pane-border>
      <q-tab default slot="title" name="tab-1" label="Contract Signed"/>
      <q-tab slot="title" name="tab-2" label="Show Up"/>
      <!-- <q-tab count="5" slot="title" name="tab-3" label="Registrants"/> -->
      <q-tab slot="title" name="tab-3" label="In-House Models"/>
      <q-tab slot="title" name="tab-4" />
      <q-tab slot="title" name="tab-5" />
      <!-- Targets -->
      <q-tab-pane name="tab-1">
        <contract-signed style="width: 100%;"></contract-signed>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <showup-model></showup-model>t
      </q-tab-pane>
      <q-tab-pane name="tab-3"><inhouse-model></inhouse-model></q-tab-pane>
      <q-tab-pane name="tab-4">Tab Four</q-tab-pane>
      <q-tab-pane name="tab-5">Tab Five</q-tab-pane>
    </q-tabs>
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
import InhouseModel from '../pages/manageModels/inhouseModels'

export default {
  components: {
    editPage,
    editPagePhotos,
    ContractSigned,
    ShowupModel,
    InhouseModel
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
      selectedTab: 'tab-1',
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
    },
    selectTab1 () {
      this.selectedTab = 'tab-1'
    },
    selectTab2 () {
      this.selectedTab = 'tab-2'
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
