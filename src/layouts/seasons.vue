<template>
	<div>
    <q-toolbar color="faded">
      <q-toolbar-title>
				Season / Cycle
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
      <!--  -->
      <q-btn color="primary" v-if="isEventEmpty" icon="create" label="New Season/Cycle" @click="seasonModal(true)" />
		</q-toolbar>
    <div class="row">
      <!-- event list-->
      <div class="col q-ma-md">
        <q-table
          :data="events"
          :loading="tableLoading"
          :columns="eventColumns"
          :pagination.sync="eventPagination"
          separator="cell"
          no-data-label="Empty Events"
          row-key="eventCode"
        >
          <!-- <q-tr slot="body" slot-scope="props" :props="props" @click.native="showSeason(props.row)" class="cursor-pointer">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr> -->
          <!-- season Name -->
          <q-td slot="body-cell-seasonName" slot-scope="props" :props="props">
          {{getSeasonName(props)}}
          </q-td>
          <!-- season start -->
          <q-td slot="body-cell-seasonStart" slot-scope="props" :props="props">
          {{getSeasonStart(props)}}
          </q-td>
          <!-- season end -->
          <q-td slot="body-cell-seasonEnd" slot-scope="props" :props="props">
          {{getSeasonEnd(props)}}
          </q-td>
          <!-- season status -->
          <q-td slot="body-cell-status" slot-scope="props" :props="props">
          {{getSeasonStatus(props)}}
          </q-td>
          <!-- action button -->
          <q-td slot="body-cell-actions" slot-scope="props" :props="props">
            <q-btn v-if="isReady(props.row)" color="positive" icon="launch" @click="launchSeason(props)" />
            <q-btn v-if="noSeason(props)" icon="edit" @click="showEditSeason(props) " />
            <q-btn v-if="isOngoing(props.row)" color='negative' icon="cancel" @click="cancelSeason(props.row)" />
            <!-- <q-btn color='negative' icon="cancel" @click="checkSeasonEnd" /> -->
          </q-td>
        </q-table>
      </div>
    </div>
    
			<!-- season modal -->
			<q-modal v-model="getSeasonModal" :content-css="{minWidth: '50vw', minHeight: '20vh'}" @hide="clearSeasonModal">
				<!-- modal layout -->
		    <q-modal-layout
			    content-class="{'bg-primary': isPrimary}"
			  >
			  <!-- layout content -->
			  <!-- header -->
			    <q-toolbar slot="header">
			    	<q-toolbar-title>
							{{isEdit ? 'Edit Season': 'New Season'}}
						</q-toolbar-title>
             <q-btn
                flat
                round
                dense
                @click="seasonModal(false)"
                icon="close"
              />
			    </q-toolbar>
			    <!-- content -->
          <div class="content-class">
            <q-select
              :disable="isEdit"
              class="textbox"
              v-model="season.eventKey"
              float-label="Event Name"
             :options="emptySeason"
            />
            <!-- <q-input readonly class="row textbox" v-model="season.eventName" stack-label="Event Name"/> -->
            <q-input readonly numeric-keyboard-toggle type="number" class="row textbox" v-model="getLatestSeason" stack-label="Season Number"/>
            <q-input :disable="isStandby" numeric-keyboard-toggle type="number" class="row textbox" v-model="season.ticketCount" stack-label="Ticket Count" @click="isTicketCount"/>
            <q-input :disable="isStandby" numeric-keyboard-toggle type="number" class="row textbox" v-model="season.ticketPrice" stack-label="Ticket Price" @click="isTicketPrice"/>
            <q-field label="Total Amount">
              <q-input disable type="text" prefix="P "class="row textbox" v-model="ticketAmount"/>
            </q-field>
            <q-input v-if="this.isEdit" readonly type="text" class="row textbox" v-model="season.status" stack-label="Status"/>
            <!-- <q-select
              v-if="this.isEdit"
              v-model="season.status"
              float-label="Status"
             :options="statusOption"
            /> -->
          </div>
            <!-- add button -->
            <q-btn
              v-if="!isEdit"
              class="full-width textbox"
              color="primary"
              @click="addNewSeason"
              label="Save"
            />
            <!-- edit button -->
            <q-btn
              v-if="isEdit"
              class="full-width textbox"
              color="secondary"
              @click="updateSeason"
              label="Update"
            />
            <!-- spinner loading -->
            <q-inner-loading :visible="getSeasonLoading">
              <q-spinner size="50px" color="primary"></q-spinner>
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
	export default {
	mounted () {
    this.$bindAsArray('events', this.$database.ref('events'))
    this.$bindAsArray('finishedSeason', this.$database.ref('finished_season'))
    this.$bindAsArray('seasons', this.$database.ref('events').equalTo('seasons'))
    this.checkSeasonEnd
    // console.log('seasons', this.seasons)
	},
  watch: {
    events: function (val) {
      this.checkSeasonEnd
    }
  },
	computed: {
    checkSeasonEnd () {
      let seasons = []
      try {
        for (var i = 0; i < this.events.length; i++) {
          var s = Object.assign([], this.events[i].seasons[0])
          if (typeof s != 'undefined' && s.seasonStart && s.seasonEnd && s.status === 'ongoing') {
            seasons.push(Object.assign({}, s))
          }
        }
      }catch (err) {}
      console.log('seasons', seasons)
      let dt = new Date()
      let seasonToEnd = []
      for (var j = 0; j < seasons.length; j++) {
        var se = new Date(seasons[j].seasonEnd)
        var eLength = this.$mathMixin.dayDiff(dt, se)
        console.log('el', eLength)
        if (eLength <= 0) {
          console.log('found near end')
          seasonToEnd.push(seasons[j])
        }
      }
      console.log('seasontoend', seasonToEnd)
      let finishedSeason = {
        seasonName: 'BFF_Season1',
        ticketCount: 65,
        ticketPrice: 65,
        totalAmount: 4225,
        seasonNumber: 1,
        status: 'finished',
        eventKey: '-LJlVFp-JcNcrdfLovvx',
        eventName: 'Baby Fashion Festival',
        seasonStart: 'Mon Aug 27 2018 00:00:00 GMT+0800 (Taipei Standard Time)',
        seasonEnd: 'Mon Sept 27 2018 00:00:00 GMT+0800 (Taipei Standard Time)',
        numOfParticipants: 40,
        numOfInquiries: 300,
        numOfOrientation: 80,
        participants: [],
        sales: 2000000
      }
      for (var k = 0; k < seasonToEnd.length; k++) {
        seasonToEnd[k].status = 'finished'
        seasonToEnd[k].numOfParticipants = 0 // not yet set
        seasonToEnd[k].numOfInquiries = 0 // not yet 
        seasonToEnd[k].participants = 'arrays here'
        seasonToEnd[k].sales = 20000
        var event = this.$lodash.filter(this.events, e => {
          return e['.key'] === seasonToEnd[k].eventKey
        })
        delete event[0].seasons[0]
        this.$store.dispatch('users/finishedSeason', {payload: seasonToEnd[k], fireb: this.$firebase.database(), quasu: this.$q})
        this.$store.dispatch('users/addNewSeason', {payload: event[0], fireb: this.$firebase.database(), quasu: this.$q})
      }
    },
    ticketAmount () {
      try {
        let amount = parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)
        let isNan = parseInt(amount) || 0
        // console.log('isnan', isNan)
        return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      } catch (err){ return 0 }
    },
    isEventEmpty () {
      let isSeason = this.$lodash.findIndex(this.events, e => {
        var s = e.seasons
        return typeof s === 'undefined'
      })
      // console.log('sss', isSeason)
      if (isSeason != -1) {
        return true
      }
      else {
        return false
      }
      // return this.$store.state.users.isEventEmpty
    },
    emptySeason () {
      if (!this.isEdit) {
        let eS = this.$lodash.filter(this.events, e => {
          var s = e.seasons
          return typeof s === 'undefined'
        })
        var opt = this.$lodash.map(eS, s => {
          return { label: s.eventName, value: s['.key']}
        })
        return opt
      }
      else {
        let eventOpt = this.$lodash.map(this.events, e => {
          return { label: e.eventName, value: e['.key']}
        })
        return eventOpt
      }
      
    },
    allSeasons () {
      let data2 = []
      try {
        let getUndefine = this.events[0].seasons
        var allSeasons = this.$lodash.map(this.events, s => {
          let isUndefined = s.seasons
          if (typeof(isUndefined) != 'undefined')  {
            var collection = []
            for (var i = 0; i < isUndefined.length; i++){
              collection.push(s.seasons[i])
            }
            var data = this.$lodash.map(collection, c => {
              data2.push(c)
              return data2
            })
            return data2
           }
        })
      }catch (err) { }

      // console.log('data2', data2)
      return data2
    },
    getSeasonModal: {
      get () {
        return this.$store.getters['users/getSeasonModal']  
      },
      set (val) {
        this.$store.commit('users/seasonModal', val)
      }
    },
    getSeasonLoading () {
      return this.$store.state.users.seasonLoading
    },
    getLatestSeason () {
      // try{
      //   let season = this.event.seasons
      //   let currentSeason = this.event.seasons[season.length-1]
      //   // console.log(currentSeason)
      //   if (currentSeason.status === 'standby' || currentSeason.status === 'ongoing' ) {
      //     return true
      //   }
      //   else {
      //     return false
      //   }  
      // } catch (err) {}
      if (this.season.eventKey != '') {
        console.log('finished', this.finishedSeason)
        var seasons = this.$lodash.filter(this.finishedSeason, fs => {
          return fs.eventKey === this.season.eventKey
        })
        console.log('seasons', seasons)
        if (seasons.length != 0) {
          var mapped = this.$lodash.map(seasons, s => {
            return s.seasonNumber
          })
          var max = Math.max.apply(null, mapped)
          return ++max
        }
        else {
          return 1
        }
      }
      else {
        return 0
      }
    }
  },
  data () {
    return {
      events: [],
      event: [],
      seasons: [],
      finishedSeason: [],
      season: {
        eventKey: '',
        eventName: '',
        seasonName: '',
        seasonNumber: 0,
        ticketCount: 0,
        ticketPrice: 0,
        totalAmount: 0,
        status: 'standby'
      },
      statusOption: [
        { label: 'Standby', value: 'standby' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Cancelled', value: 'Cancelled' }
      ],
      // seasonModal: false,
      // isEventEmpty: false,
      isEdit: false,
      isStandby: false,
      loading: false,
      // table configuration
      filter: '',
      tableLoading: false,
      eventColumns: [
        {
          name: 'eventCode',
          required: true,
          label: 'Code',
          align: 'left',
          field: 'eventCode',
          sortable: true
        },
        {
          name: 'eventName',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'eventName',
          sortable: true
        },
        {
          name: 'seasonName',
          required: true,
          label: 'Seasons',
          align: 'left',
          field: 'seasons',
          sortable: true
        },
        {
          name: 'seasonStart',
          required: true,
          align: 'left',
          label: 'Start',
          // field: 'seasons',
          sortable: true,
          visible: false
        },
        {
          name: 'seasonEnd',
          required: true,
          align: 'left',
          label: 'End',
          // field: 'seasons',
          sortable: true,
          visible: false
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          // field: 'seasons',
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
      columns: [
        {
          name: 'season',
          required: true,
          label: 'Seasons',
          align: 'left',
          field: 'seasonName',
          sortable: true
        },
        {
          name: 'seasonStart',
          required: true,
          align: 'left',
          label: 'Start',
          field: 'seasonStart',
          sortable: true,
          visible: false
        },
        {
          name: 'seasonEnd',
          required: true,
          align: 'left',
          label: 'End',
          field: 'seasonEnd',
          sortable: true,
          visible: false
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          field: 'status',
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
      },
      eventPagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
    }
  },
  methods: {
    getSeasonStart (d) {
      let getDate = new Date(d.row.seasonStart)
      if (typeof d.row.seasonStart === 'undefined') {
        return 'Not Set'
      }
      else {
        return this.$moment(getDate).format('ll')
      }
    },
    getSeasonEnd (d) {
      let getDate = new Date(d.row.seasonEnd)
      if (typeof d.row.seasonEnd === 'undefined') {
        return 'Not Set'
      }
      else {
        return this.$moment(getDate).format('ll')
      }
    },
    getSeasonName (d) {
      try {
        let season = Object.assign([], d.row.seasons)
        return season[0].seasonName
      }catch (err) {
        return 'no season yet'
      }
    },
    getSeasonStart (d) {
      try {
        let season = Object.assign([], d.row.seasons)
        let getDate = new Date(season[0].seasonStart)
        if (typeof season[0].seasonStart === 'undefined') {
          return 'Not Set'
        }
        else {
          return this.$moment(getDate).format('ll')
        }
      }catch (err) {}
    },
    getSeasonEnd (d) {
      try {
        let season = Object.assign([], d.row.seasons)
        let getDate = new Date(season[0].seasonEnd)
        if (typeof season[0].seasonEnd === 'undefined') {
          return 'Not Set'
        }
        else {
          return this.$moment(getDate).format('ll')
        }
      }catch (err) {}
    },
    getSeasonStatus (d) {
      try {
        let season = Object.assign([], d.row.seasons)
        return season[0].status
      }catch (err) {}
    },
    noSeason (d) {
      if(typeof d.row.seasons === 'undefined' || d.row.seasons[0].status === 'ongoing') {
        return false
      }
      else {
        return true
      }
    },
    isReady (d) {
      try {
        if (d.seasons[0].status === 'standby' && d.seasons[0].seasonStart && d.seasons[0].seasonEnd) {
          return true
        }
        else {
          return false
        }
      }catch (err) {
        return false
      }
    },
    isOngoing (d) {
      try {
        if (d.seasons[0].status === 'ongoing') {
          return true
        }
        else {
          return false
        }
      }catch (err) {}
    },
    isTicketCount () {
      if (this.season.status === 'standby') {
        this.season.ticketCount = ''
        this.isStandby = false
      }
      else {
        this.isStandby = true
      }
    },
    isTicketPrice () {
      if (this.season.status === 'standby') {
        this.season.ticketPrice = ''
        this.isStandby = false
      }
      else {
        this.isStandby = true
      }
    },
    seasonModal (val) {
      try {
        if (this.isEdit === false) {
          let newSeason = this.event.seasons
          // console.log('new season', newSeason)
          this.isStandby = true
          this.season.eventName = this.event.eventName
          this.season.seasonNumber = this.event.seasons[newSeason.length - 1].seasonNumber + 1
        }
        this.$store.dispatch('users/updateSeasonModal', val)
      } catch (err) {
        this.season.eventName = this.event.eventName
        this.season.seasonNumber = 1
        this.$store.dispatch('users/updateSeasonModal', val)
        // console.log('no seasons')
      }
    },
  	clearSeasonModal () {
      this.season.eventKey = ''
      this.season.eventName = ''
      this.season.seasonName = ''
      this.season.seasonNumber = 0
  		this.season.ticketCount = 0
  		this.season.ticketPrice = 0
      this.season.status = 'standby'
      this.isEdit = false
      this.$bindAsArray('events', this.$database.ref('events'))
  	},
    showSeason(d){
      this.event = d
      if (this.getLatestSeason) {
        this.$store.commit('users/updateIsEventEmpty', false)
        // this.isEventEmpty = false
      }
      else {
        this.$store.commit('users/updateIsEventEmpty', true)
        // this.isEventEmpty = true
      }
      this.filter = this.event.eventName
    },
    launchSeason (d) {
      this.season = Object.assign({}, d.row.seasons[0])
      console.log('this.season', this.season)
      this.filter = this.season.eventName
      let event = this.$lodash.filter(this.events, e => {
        return e['.key'] === this.season.eventKey
      })
      event[0].seasons[0].status = 'ongoing'
      console.log('events', event[0])
      this.$store.dispatch('users/addNewSeason', {payload: event[0], fireb: this.$firebase.database(), quasu: this.$q})
    },
    showEditSeason (d) {
      this.season = Object.assign({}, d.row.seasons[0])
      // console.log('row', d.row.seasons[0])
      console.log('this.season', this.season)
      this.filter = this.season.eventName
      console.log('this.eventname', this.event)
      this.isEdit = true
      if (this.season.status === 'standby') {
        this.isStandby = false
      }
      this.$forceUpdate()
      this.$store.dispatch('users/updateSeasonModal', true)
    },
    addNewSeason () {
      if (this.season.seasonNumber <= 1) {
        // console.log('season', this.season)
        let event = this.$lodash.filter(this.events, e => {
          return e['.key'] === this.season.eventKey
        })
        this.event = event[0]
        this.season.eventName = event[0].eventName
        this.season.seasonNumber = this.getLatestSeason
        this.season.seasonName = `${event[0].eventCode}_Season${this.season.seasonNumber}`
        this.season.totalAmount = parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)
        console.log('season', this.season)
        console.log('event', this.event)
        this.event.seasons = []
        this.event.seasons.push(this.season)
        console.log('less than 0')
      }
      else {
        // check kung meron na bagong season
        // let currentSeason = this.season
        // let currentEvent = this.event
        let event = this.$lodash.filter(this.events, e => {
          return e['.key'] === this.season.eventKey
        })
        let currentEvent = event[0]
        let currentSeason = this.season
        console.log('currentEvent', currentEvent)
        console.log('currentSeason', currentSeason)
        let newSeason = {
          seasonName: `${this.event.eventCode}_S${currentSeason.seasonNumber}`,
          ticketCount: currentSeason.ticketCount,
          ticketPrice: currentSeason.ticketPrice,
          totalAmount: parseFloat(currentSeason.ticketCount) * parseFloat(currentSeason.ticketPrice),
          seasonNumber: currentSeason.seasonNumber,
          status: 'standby',
          eventKey: this.event['.key'],
          eventName: this.event.eventName
        }
        console.log('present season', newSeason)
        this.event.seasons.push(newSeason)
      }
      console.log('event to update', this.event)
      this.$store.dispatch('users/addNewSeason', {payload: this.event, fireb: this.$firebase.database(), quasu: this.$q})
    },
    updateSeason () {
      var eventIndex = this.$lodash.findIndex(this.events, e => {
        return e['.key'] === this.season.eventKey
      })
      var seasonIndex = this.$lodash.findIndex(this.events[eventIndex].seasons, s => {
        return s.seasonName === this.season.seasonName
      })
      console.log('events', this.events[eventIndex])
      console.log('season to update', this.season)
      console.log('seasons', this.events[eventIndex].seasons[seasonIndex])
      this.$store.dispatch('users/updateSeason', {payload: this.season, seasonNumber: seasonIndex, fireb: this.$firebase.database(), quasu: this.$q})
    },
    cancelSeason (d) {
      
      // console.log('d', d.row.seasons[0])
      // let season = Object.assign([], d.row.seasons[0])
      // let key = d.row.eventKey
      // let index = d.row.__index
      // console.log('season to delete', season[0])
      // let event = this.$lodash.filter(this.events, events => {
      //   return events['.key'] == key
      // })
      // let getIndex = this.$lodash.findIndex(event[0].seasons, e => {
      //   return e.seasonName === season[0].seasonName
      // })
      // console.log('getindex', getIndex)
      // console.log('event', event)
      // this.$store.dispatch('users/addNewSeason', {payload: event, fireb: this.$firebase.database(), quasu: this.$q})
      // event[0].seasons.splice(index-1, 1)
      // console.log('event to update', event)
      // let event2 = Object.assign({}, event[0])
      // console.log('event2', event2)
      
      
      this.$q.dialog({
        title: 'Cancel Season Confirmation',
        message: `Do you want to cancel ${d.seasons[0].seasonName}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
          // event[0].seasons.splice(getIndex, 1)
          // this.$store.dispatch('users/addNewSeason', {payload: event[0], fireb: this.$firebase.database(), quasu: this.$q})
          // this.$store.commit('users/updateIsEventEmpty', false)
          // this.isEventEmpty = false
          console.log('events', d)
          this.season = Object.assign({}, d.seasons[0])
          console.log('this.season', this.season)
          this.filter = this.season.eventName
          let event = this.$lodash.filter(this.events, e => {
            return e['.key'] === this.season.eventKey
          })
          event[0].seasons[0].status = 'standby'
          console.log('events', event[0])
          this.$store.dispatch('users/addNewSeason', {payload: event[0], fireb: this.$firebase.database(), quasu: this.$q})
        }).catch(() => {})
    },
    testEndSeason (d) {
      let finishedSeason = {
        seasonName: 'BFF_Season1',
        ticketCount: 65,
        ticketPrice: 65,
        totalAmount: 4225,
        seasonNumber: 1,
        status: 'finished',
        eventKey: '-LJlVFp-JcNcrdfLovvx',
        eventName: 'Baby Fashion Festival',
        seasonStart: 'Mon Aug 27 2018 00:00:00 GMT+0800 (Taipei Standard Time)',
        seasonEnd: 'Mon Sept 27 2018 00:00:00 GMT+0800 (Taipei Standard Time)',
        numOfParticipants: 40,
        numOfInquiries: 300,
        numOfOrientation: 80,
        participants: [],
        sales: 2000000
      }
      this.$database.ref('finished_season').push(finishedSeason)
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