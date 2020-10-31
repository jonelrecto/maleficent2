<template>
  <div>
    <q-toolbar color="faded">

      <q-toolbar-title>
        SMS List / <span class="text-light">{{activityTitle}}</span>
      </q-toolbar-title>
      <q-btn icon="edit" label="Edit Schedule Details" color="secondary" class="q-ml-sm q-ma-sm float-right" @click="editScheduleDetails()"/>
      <q-btn :loading="loading" icon="send" :label="'Send Messages ('+getMessagesLength+')'" color="primary" class="q-ml-sm q-ma-sm float-right" @click="sendMessages" :disabled="disabled"/>
 <!--      <q-btn icon="border_color" :label="'Contract Signing('+getShowupCount+')'" color="secondary" class="q-ml-sm q-ma-sm float-right" :to="{name: 'contractsigned', params: { id: getSeasonName }}" v-if="ifOrientation"/>
        <q-btn icon="check_box" :label="'Confirmed Attendance('+getPresentCount+')'" color="secondary" class="q-ml-sm q-ma-sm float-right" v-if="ifNotOrientation" @click="showConfirmed"/> -->
    </q-toolbar>
    <div class="container row flex">
      <div class="col-4 q-px-lg">
        <q-field
          icon="textsms"
          label="Template"
          label-width="12"
          class="q-ma-lg"
        >
         <q-input
          v-model="area"
          type="textarea"
          float-label="SMS Template"
          :max-height="1000"
          rows="10"/>
        </q-field>
          <q-btn
        color="secondary"
        rounded
        size="md"
        label="Generate SMS"
         class=" full-width"  @click="generateSMS"/>
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
       <div class="col-8 q-mt-sm q-pa-md">
          <q-field
          icon="email"
          label="Select SMS Template"
          error-label="We need a valid email"
          label-width="6"
          class=""
        >
            <q-select
            inverted
            color="dark"
            v-model="selectedTemplate"
            class="text-white q-mb-md"
            :options="mapTemplates"
            stack-label="SMS Templates"
            style="min-width:170px;"
            :clearable="true"
            @input="getTemplate"
            @clear="clearArea"
          />
        </q-field>

        <q-progress
        :percentage="progress"
        stripe
        animate
        height="45px"
        class="q-mb-md"
      />
      <q-table
        :data="messageList"
        :loading="tableLoading"
        :columns="Modelcolumns"
        :pagination.sync="Modelpagination"
        separator="cell"
        :selected.sync="selected"
        no-data-label="No Models"
        row-key=".key"
        :filter="filter"
      >
        <q-td slot="body-cell-mobilenumber" slot-scope="props" :props="props">
          {{props.row.mobileNumber}}</q-td>
            <q-td slot="body-cell-msgs" slot-scope="props" :props="props" :class="showMaxedCharacters(props.row.msgs)">
          {{props.row.msgs}}</q-td>
      </q-table>

    </div>
    </div>
   
        <q-modal v-model="attendanceModal" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="attendanceModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              {{activityTitle}}
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
          <q-search icon="search" inverted color="faded" class="text-white" v-model="selectSearch" clearable placeholder="Search name" />
          <q-scroll-area style="width: 100%; height: 85vh;">
                    <q-list  link dense v-for="s in filteredSelect" :key="s['.key']">
                <q-item>
                  <q-item-side icon="label" color="faded"/>
                  <q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
                  <q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="UnSelect(s)"/></q-item-side>
                </q-item>
                </q-list>
                <div v-if="getSelectedRowCount===0" class="text-center text-faded q-display-1 fixed-center">No Models Listed</div>
          </q-scroll-area>
          <div slot="footer">
              <q-btn color="primary" icon="check" size="lg" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm full-width" @click="setSelectedPresent" v-if="ifOrientation"/>
              <q-btn color="primary" icon="check_box" size="lg" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm full-width" v-if="ifNotOrientation" @click="setActivityAttendance"/>
          </div>
        </q-modal-layout>
      </q-modal>
        <q-modal v-model="showUpsModal" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="showUpsModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              {{activityTitle}}
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
          <q-search icon="search" inverted color="faded" class="text-white" v-model="showUpSearch" clearable placeholder="Search name" />
          <q-scroll-area style="width: 100%; height: 85vh;">
                    <q-list  link dense v-for="s in filteredShowUp" :key="s['.key']">
                <q-item>
                  <q-item-side icon="label" color="faded"/>
                  <q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
                  <q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="Back2Models(s)"/></q-item-side>
                </q-item>               
                </q-list>
                <div v-if="getShowupCount===0" class="text-center text-faded q-display-1 fixed-center">No Models Listed</div>
          </q-scroll-area>
        </q-modal-layout>
      </q-modal>
    <!-- confirmActivityAttendance -->
              <q-modal v-model="confirmedAttendanceModal" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="confirmedAttendanceModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              {{activityTitle}}
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
          <q-search icon="search" inverted color="faded" class="text-white" v-model="nameSearch" clearable placeholder="Search name" />
          <q-scroll-area style="width: 100%; height: 85vh;">
                    <q-list  link dense v-for="s in filteredConfirm" :key="s['.key']">
                <q-item>
                  <q-item-side icon="check_box" color="faded"/>
                  <q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
                  <q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="getConfirmationBack(s)"/></q-item-side>
                </q-item>               
                </q-list>
              <!--   <div v-if="getPresentCount===0" class="text-center text-faded q-display-1 fixed-center">No Models Listed</div> -->
          </q-scroll-area>
        </q-modal-layout>
      </q-modal>
<!--           <q-page-sticky position="bottom-right" :offset="[20, 50]">
      <q-btn fab color="primary" icon="check_box" class="animate-pop" @click="showModal"><span class="text-weight-thin" style="font-size: 9px">Selected</span>
      </q-btn>
      <q-chip floating color="red" v-if="getSelectedRowCount">{{getSelectedRowCount}}</q-chip>
    </q-page-sticky> -->
    <!-- here -->
    <q-modal v-model="editDetailsModal" :content-css="{minWidth: '50vw', minHeight: '50vh'}">
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
            Edit Details
          </q-toolbar-title>
        </q-toolbar>

        <div slot="footer" class="row">
          <div class="col">
            <q-btn class="full-width" label="save" color="positive" @click="saveEditDetails"/>  
          </div>
          <div class="col">
            <q-btn class="full-width" label="cancel" color="negative" v-close-overlay/>  
          </div>
          
        </div>

        <div class="q-pa-md">
          <q-input
            v-model="editSchedLocation"
            type="textarea"
            float-label="Location"
            :max-height="100"
            rows="7"
          />
          <q-input
            v-model="editSchedDetails"
            type="textarea"
            float-label="Details"
            :max-height="100"
            rows="7"
          />
          <q-field
          icon="person"
          label="Model / Hour Batching"
          label-width="12"
          class="q-ma-lg"
          >
          <div class="row">
            <div class="col-6 q-pa-md">
              <q-input type="number" float-label="# of Models" value="" v-model="editModelCount"/>
            </div>
            <div class="col-6 q-pa-md">
              <q-input type="number" float-label="# of Hours" value="" v-model="editHourBasis"/>
            </div>
            </div>
          </q-field>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>
<style>
.modelCards{
    width:325px;
    height:600px;
    border-radius:15px;
}
.cardsButtonsMobile{
    display: none;
}
.cardsButtonsDesktop{
    display: block;
}
@media (max-width: 960px){
.qCardMobile{
    width: 90vw;
}
.modelCards{
    width:auto;
    height:600px;
    border-radius:15px;
}
.cardsButtonsMobile{
    display: block;
}
.cardsButtonsDesktop{
    display: none;
}
}
</style>
<script>
import router from '../router'
import axios from 'axios'

export default {
    name: 'SMSList',
    components: {
    },
    created() {
      this.batchKey = this.$route.params.id,
      this.activityTitle = this.$route.params.title
      this.activityType = this.$route.params.type
    },
    mounted () {
      this.$bindAsArray('event_schedules', this.$database.ref('event_schedules'))
      this.$bindAsArray('model_list', this.$database.ref('models'))
      this.$bindAsArray('showUpList', this.$database.ref('showUpModels'))
      this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))
      this.$bindAsArray('attendanceList', this.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/models'))
      this.$bindAsArray('confirmedList', this.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/present'))
      this.$bindAsArray('SMStemplates', this.$database.ref('SMStemplates'))
      this.$bindAsArray('payment_transactions', this.$database.ref('payment_transactions'))
      this.$bindAsArray('attendance', this.$database.ref('attendance'))
      // this.$bindAsArray('seasons', this.$database.ref('events').equalTo('seasons'))
      // this.$store.state.schedules.allActivities = this.event_schedules
      // console.log('event_schedules', this.event_schedules)
      // console.log('model_list', this.model_list)
      // console.log('attendanceList',this.attendanceList)
    },
    computed: {
      mapTemplates () {
        try {
            let sms = []
            sms = this.$lodash.map(this.SMStemplates, ex=>{
              return {
                label: ex.name,
                value: ex['.key']
              }
            })
            return sms          
          } catch (err) {
            console.log(err)
            return []
          }
      },
      filteredShowUp: function(){
        return this.getShowUps.filter((s) => {
          var reg = new RegExp(this.showUpSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
      filteredSelect: function(){
        return this.selected.filter((s) => {
          var reg = new RegExp(this.selectSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
      filteredConfirm: function(){
        return this.confirmedList.filter((s) => {
          var reg = new RegExp(this.nameSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
      getActivities () {
        console.log('activities',this.$store.getters['schedules/getSeeAllSchedules'])
        return this.$store.getters['schedules/getSeeAllSchedules']
      },
      getActivityForSms (){
      try{
        let batch = this.$route.params.id
        let id = this.$route.params.title
        let type = this.$route.params.type
        let batchActivitys = this.returnBatchActivity(batch)
        let activity = this.$lodash.filter(batchActivitys, es=> {
          return es.id === id
        })
        console.log('activity schedule',activity)
        return activity[0]
      } catch (err) {
        console.log(err)
        return []
      }
    },
      getModels () {
        try {
          if (this.$route.params.type !== 'orientation' && this.$route.params.type !== 'payment' && this.$route.params.type !== 'payments') {  
            console.log('activity models',this.attendanceList)
              let modelList = this.$lodash.filter(this.attendanceList, c => {
              c.activityDate = this.getActivityForSms.startDate
              c.activityType = this.getActivityForSms.type
              c.activityDetails = this.getActivityForSms.details
              c.activityLocation = this.getActivityForSms.location
              return c
            })
              console.log('modellist not orientation not payment',modelList)
            return modelList
          } else if (this.$route.params.type === 'payment' || this.$route.params.type === 'payments') {
            console.log('payment')
            let modelList2 = this.$lodash.filter(this.contractsigned, c => {
              c.activityDate = this.getActivityForSms.startDate
              c.activityType = this.getActivityForSms.type
              c.activityAmount = this.getActivityForSms.amount
              c.payNum = this.getActivityForSms.id.toString().slice(-10)
              c.d1 = this.getDuePayments(c['.key'])[0].amount
              c.d2 = this.getDuePayments(c['.key'])[1].amount
              c.d3 = this.getDuePayments(c['.key'])[2].amount
              c.totalPaid = this.getModelsPaymentTransactions(c['.key'])
              let payNum = this.getActivityForSms.id.toString().slice(-10)
              let totalPaid  = this.getModelsPaymentTransactions(c['.key'])
              let d1 = this.getDuePayments(c['.key'])[0].amount
              let d2 = this.getDuePayments(c['.key'])[1].amount
              let d3 = this.getDuePayments(c['.key'])[2].amount
              if(c.balance === 0){
                // return c.batchKey === this.$route.params.id
              } else {
                //start of else
                  if(payNum === 'payment(1)') {
                    if(totalPaid < d1){
                      // console.log('needed to pay' , totalPaid +' / ' + d1)
                      return c.batchKey === this.$route.params.id
                    }
                  } else if (payNum === 'payment(2)') {
                    if(totalPaid < d1+d2){
                      let t = d1+d2
                      // console.log('needed to pay' , totalPaid +' / ' + t)
                      return c.batchKey === this.$route.params.id
                    }
                  } else if (payNum === 'payment(3)'){
                    if(totalPaid < d1+d2+d3){
                      let t = d1+d2+d3
                       console.log('needed to pay' , totalPaid +' / ' + t)
                      return c.batchKey === this.$route.params.id
                    }
                  }
                //end of else
              }
              // c.activityLocation = this.getActivityForSms.location
            })
            console.log('modellist payment',modelList2)
            return modelList2
          } else {
            let modelList = this.$lodash.filter(this.model_list, c => {
              c.activityDate = this.getActivityForSms.startDate
              c.activityType = this.getActivityForSms.type
              c.activityDetails = this.getActivityForSms.details
              c.activityLocation = this.getActivityForSms.location
              return c.batchKey === this.$route.params.id
            })
            
            console.log('modellist orientation',modelList)
            return modelList
          }
        } catch (e) {
          return []
        }
      },
      getShowUps () {
        let showups = this.$lodash.filter(this.showUpList, s=> {
          return s.batchKey === this.batchKey
        })
        return showups
      },
      getMessagesLength () {
        if(this.messageList.length !== 0 && this.maxCharError !== true) {
          this.disabled = false
        }
        return this.messageList.length
      },
      getShowupCount () {
        let showup = this.$lodash.filter(this.showUpList, s => {
          return s.batchKey === this.batchKey
        })
        console.log('length', showup.length)
        return showup.length
      },
      // getPresentCount() {
      //   this.$bindAsArray('confirmedList', this.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/present'))
      //   return this.confirmedList.length
      // },
      getSeasonName () {
        try{
          console.log('eventS',this.event_schedules)
          let seasonGet = this.$lodash.filter(this.event_schedules, s => {
            if (s['.key'] === this.batchKey) {
              return s
            }
          })
          console.log('seasonGet',seasonGet[0].seasonName)
          return seasonGet[0].seasonName
        } catch (e) {
          return ''
        }
      },
      ifNotOrientation () {
        if (this.$route.params.type !== 'orientation'){
          return true
        } else {
          return false
        }
      },
      ifOrientation () {
        if (this.$route.params.type === 'orientation'){
          return true
        } else {
          return false
        }
      }
    },
    data () {
      return {
        editSchedLocation: '',
        editSchedDetails: '',
        editModelCount: '',
        editHourBasis: '',
        editDetailsModal: false,
        disabled: true,
        maxCharError: false,
        payment_transactions: [],
        selectedTemplate: '',
        SMStemplates: [],
        area: '',
        loading: false,
        messageList: [],
        attendanceList: [],
        attendanceModal: false,
        showUpsModal: false,
        confirmedAttendanceModal: false,
        filter: '',
        selected: [],
        activityType: '',
        activityTitle:'',
        batchKey: '',
        nameSearch: '',
        selectSearch: '',
        showUpSearch: '',
        contractsigned: [],
        event_schedules: [],
        model_list: [],
        showUpList: [],
        progress: 0,
        sent: 0,
        unsent: 0,
        tableLoading: false,
        Modelcolumns: [
                {
                name: 'mobilenumber',
                required: true,
                label: 'Mobile Number',
                align: 'left',
                field: 'mobileNumber',
                sortable: true
                },
                {
                name: 'msgs',
                required: true,
                label: 'SMS Message',
                align: 'left',
                field: 'msgs',
                sortable: true
                }
        ],
        pagination: {
          sortBy: null, // String, column "name" property value
          descending: false,
          page: 1,
          rowsPerPage: 10 // current rows per page being displayed
        },
        Modelpagination: {
          sortBy: null, // String, column "name" property value
          descending: false,
          page: 1,
          rowsPerPage: 5 // current rows per page being displayed
        }
      }
    },
    methods: {
      clearEditDetails () {
        // this.editSchedLocation = ''
        // this.editSchedDetails = ''
      },
      saveEditDetails () {
        let vm = this
        this.$q.dialog({
          title: 'Confirm Save',
          message: 'Do you want to Save ?',
          ok: 'OK',
          cancel: 'Cancel'
        }).then(() => {
          let sched = this.$lodash.find(this.event_schedules, e => {
            return e['.key'] === this.batchKey
          })
          console.log('sched',sched)
          let index = this.$lodash.findIndex(sched.activities, a => {
            return a.id === this.activityTitle
          })
          let act = this.$lodash.find(sched.activities, a => {
            return a.type === this.activityType
          })
          act.location = this.editSchedLocation
          act.details = this.editSchedDetails
          act.modelperhr = this.editModelCount
          act.hourbasis = this.editHourBasis
          
          console.log(`event_schedules/${this.batchKey}/activities/${index}`)
          console.log('act', act)
          this.$database.ref(`event_schedules/${this.batchKey}/activities/${index}`).update(act)
            .then(() => {
              vm.$q.notify({
                message: `Successfully Saved`,
                type: 'positive',
                color: 'positive',
                textColor: 'white',
                icon: 'info'
              })
              vm.editDetailsModal = false
              console.log('updated')
            })
            .catch(err => {
              vm.$q.notify({
                message: `Opps.. Error`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'info'
              })
              console.log('err', err)
            })
        }).catch(() => {})
      },
      getLocationDetails () {
        let sched = this.$lodash.find(this.event_schedules, e => {
          return e['.key'] === this.batchKey
        })
        let act = this.$lodash.find(sched.activities, a => {
          return a.type === this.activityType
        })
        this.editSchedLocation = act.location
        this.editSchedDetails = act.details
        this.editModelCount = act.modelperhr
        this.editHourBasis = act.hourbasis
      },
      editScheduleDetails () {
        this.getLocationDetails()
        this.editDetailsModal = true
      },
      showSeason (d) {
        console.log('show season',d)
      },
      test (){
      },
      showModal () {
          this.attendanceModal = true
      },
      showShowUpModal () {
          this.showUpsModal = true
      },
      showConfirmed () {
          this.confirmedAttendanceModal = true
      },
      isPresent (m) {
        var index = this.$lodash.findIndex(m.activitiesAttended, a => {
          return a.type === this.activityType
        })
        if (index != -1) {
          return m.activitiesAttended[index].status
        }
      },
      present (m) {
        console.log('m', m)
        let model = {...m}
        let key = model['.key']
        let self = this
        var index = this.$lodash.findIndex(model.activitiesAttended, a => {
          return a.type === this.activityType
        })
        if (index != -1) {
          // console.log('ind', index)
          // m.activitiesAttended[index].status = true
          m.activitiesAttended[index].status = true
          delete model['.key']
          console.log('model', model)
          // model.activitiesAttended[index].status = true
          this.$database.ref(`showUpModels`).child(key).set(model)
            .then(() => {
                  console.log('status updated')
              // self.$database.ref('models').child(key).remove()
              //   .then(() => {
              
              //   })
              //   .catch(() => {
              //     console.log('err on remove')
              //   })
            })
            .catch((err) => {
              console.log(err)
            })
        }
        this.$forceUpdate()
      },
      notSet (m) {
        console.log('not set', m)
        let key = m['.key']
        var index = this.$lodash.findIndex(m.activitiesAttended, a => {
          return a.type === this.activityType
        })
        if (index != -1) {
          m.activitiesAttended[index].status = false
          this.$database.ref('showUpModels').child(key).remove()
            .then(() => {
              console.log('model remove in showup')
            })
            .catch((err) => {
              console.log('err',err)
            })
        }
      },
      setSelectedPresent () {
      this.$q.dialog({
        title: 'Confirm Model/s Attendance?',
        message: ``,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
        
        for( var x = 0; x < this.selected.length; x++){
          let select = this.selected[x]
          let key = select['.key']
          let self = this
          this.selected[x].dateAdded = new Date().toString()
          var index = this.$lodash.findIndex(select.activitiesAttended, a => {
            return a.type === this.activityType
          })
          if (index != -1) {
          // console.log('ind', index)
          // m.activitiesAttended[index].status = true
          select.activitiesAttended[index].status = true
          delete select['.key']
          console.log('model selected', select)
          // model.activitiesAttended[index].status = true
          this.$database.ref(`showUpModels`).child(key).set(select)
            .then(() => {
              console.log('status updated')
              self.$database.ref('models').child(key).remove()
                .then(() => {
                  this.selected = []
                  self.$bindAsArray('model_list', self.$database.ref('models'))
                  self.$forceUpdate()
                  this.attendanceModal = false
                })
                .catch(() => {
                  console.log('err on remove')
                })
            })
            .catch((err) => {
              console.log(err)
            })
          }
        }
                  this.$q.notify({
                    message: `Model/s Attendance Confirm`,
                    type: 'positive',
                    color: 'positive',
                    textColor: 'white',
                    icon: 'info'
                  })
        }
        ).catch(() => {})
      },
      UnSelect(e) {
        let un = e
        let update = this.$lodash.filter(this.selected, no =>{
          if (no['.key'] !== un['.key']) {
            return no
          }
        })
        this.selected = update
      },
      Back2Models (m){
        console.log('not set', m)
        let key = m['.key']
        let selected = m
        var index = this.$lodash.findIndex(m.activitiesAttended, a => {
          return a.type === this.activityType
        })
        if (index != -1) {
          m.activitiesAttended[index].status = false
          delete selected['.key']
          this.$database.ref(`models`).child(key).set(selected)
            .then(() => {
              this.$database.ref('showUpModels').child(key).remove()
                .then(() => {
                  console.log('model remove in showup')
                  this.$bindAsArray('showUpList', this.$database.ref('showUpModels'))
                  this.$forceUpdate()
                })
                .catch((err) => {
                  console.log('err',err)
                })
            })
        }
      },
      setActivityAttendance () {
      this.$q.dialog({
        title: 'Confirm Model/s Attendance?',
        message: ``,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
        let confirmed = []
        for( var x = 0; x < this.selected.length; x++){
          let select = {...this.selected[x]}
          select.activityID = this.activityTitle
          let key = select['.key']
          let self = this
          // this.selected[x].dateAdded = new Date().toString()
          var index = this.$lodash.findIndex(select.activitiesAttended, a => {
            return a.id === this.activityTitle
          })
          console.log('index_activity',index)
          if (index != -1) {
          // console.log('ind', index)
          // m.activitiesAttended[index].status = true
          select.activitiesAttended[index].status = true
          delete select['.key']
          console.log('model selected', select)
          // model.activitiesAttended[index].status = true
          // this.$database.ref('contractSigned/' + key + '/activitiesAttended/' + index + '/status').set(true)
          //   .then(() => {
          this.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/present').child(key).set(select)
            .then(() => {
              console.log('status updated')
              self.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/models').child(key).remove()
                .then(() => {
                  this.selected = []
                  self.$bindAsArray('attendanceList', self.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/models'))
                  self.$forceUpdate()
                  this.attendanceModal = false
                })
                .catch(() => {
                  console.log('err on remove')
                })
            })
            // })
            .catch((err) => {
              console.log(err)
            })
          }
        }
                  this.$q.notify({
                    message: `Model/s Attendance Confirm`,
                    type: 'positive',
                    color: 'positive',
                    textColor: 'white',
                    icon: 'info'
                  })
        }
        ).catch(() => {})

      },
    getConfirmationBack (m) {
        console.log('not set', m)
        let key = m['.key']
        let select = m
        let self = this
        var index = this.$lodash.findIndex(m.activitiesAttended, a => {
          return a.type === this.activityType
        })
        if (index != -1) {
          select.activitiesAttended[index].status = false
          delete select['.key']
          console.log('model selected', select)
          // model.activitiesAttended[index].status = true
          this.$database.ref('contractSigned/' + key + '/activitiesAttended/' + index + '/status').set(false)
            .then(() => {
          this.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/models').child(key).set(select)
            .then(() => {
              console.log('status updated')
              self.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/present').child(key).remove()
                .then(() => {
                  this.selected = []
                  self.$bindAsArray('confirmedList', self.$database.ref('attendance/'+this.$route.params.id+'/'+this.$route.params.title+'/present'))
                  self.$forceUpdate()
                  this.confirmedAttendanceModal = false
                })
                .catch(() => {
                  console.log('err on remove')
                })
            })
            })
            .catch((err) => {
              console.log(err)
            })
        }

    },
    addToTemplate (e) {
      let data = e
      let msg = this.area
      msg = msg + '${'+data+'}'
      this.area = msg
    },
    generateSMS (){
      if(this.area === '') {
          this.$q.notify({
            message: 'SMS Template is blank.' ,
            position: 'center',
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'warning'
          })
      } else {
          this.sent = 0
          this.unsent = 0
          this.maxCharError = false
          this.messageList = []
          let models = this.getModels
          let original = models[0].activityDate
          let modelperhr = this.getActivityForSms.modelperhr
          let hour = this.getActivityForSms.hourbasis
          for (var i = 0; i < models.length; i++) {
            let counter = i

            const SMS = {
              mobile_number: '0' + models[i].mobileNumber
            }
            var fname = this.$lodash.capitalize(models[i].firstName)
            var lname = this.$lodash.capitalize(models[i].lastName)
            var location = models[i].activityLocation
            var activityType = this.$lodash.capitalize(this.activityType)
            var newActivityLocation = models[i].activityLocation
            var newActivityDate = this.$moment(models[i].activityDate).format('ll')
            var event = models[i].eventName
            var date = this.$moment(models[i].activityDate).format('ll')
            var details = models[i].activityDetails
            if(modelperhr !== null || hour !== null){
              if(counter === 0) {

              } else {
                if (counter % modelperhr === 0){
                  
                  original = this.$moment(original).add(hour,'hour')
                }
              }
            }



            var time = this.$moment(original).format('LT')


            let template =  eval("`" + this.area + "`")
            var data = 'mobile_number=' + SMS.mobile_number + '&' + 'message='+template
            console.log(data)
            let smscount = this.$lodash.size(template)
            if(smscount > 459){
              this.maxCharError = true
              this.disabled = true
              this.$q.notify({
                message: `SMS Generation Error: Max Character Reach!`,
                detail: 'Please check your template. Max Characters is 459 only.',
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'error'
              })
            }
            let messageTo = {
              mobileNumber: models[i].mobileNumber,
              msgs: template
            }
            this.messageList.push(messageTo)
           }
          console.log(this.messageList)
    }
    },
    showMaxedCharacters(e){
      let smscount = this.$lodash.size(e)
      if(smscount > 459){
        return 'text-white bg-negative'
      } else {
        return ''
      }
    },
    getModelsPaymentTransactions (key) {
      try {
        console.log('key',key)
        let payments = this.$lodash.filter(this.payment_transactions, p=> {
          return p.modelKey === key
        })
        // console.log('modelpayments',payments)     
        let trans = payments
        // console.log('payments',payments)
        let total = 0
        for (var x=0;x<trans.length;x++) {
          total = total + parseInt(trans[x].transaction_amount)
        }
        // console.log('total',total)
        return total 
      } catch (err) {
        console.log('error',err)
        return []
      }
    },    
    getDuePayments (key) {
      try{
        let due = this.$lodash.filter(this.contractsigned, e=> {
          return e['.key'] === key
        })
        // console.log('getDuePayments',due)
        let dates = []
        let pays = due[0].paymentDueDate
        for(var x=0; x < pays.length; x++) {
          dates.push(pays[x])
        }
        // console.log('dates',dates)
        return dates
      } catch (err) {
        return []
      }
    },
    posting (n, a) {
      const SMS = {
        mobile_number: '0' + n
      }
      let total = this.getModels.length
      console.log('sms', SMS)
      let message = a
      var data = 'mobile_number=' + SMS.mobile_number + '&' + `message=${message}`
      console.log(data)
      axios.post('https://maleficent-sms.000webhostapp.com/contractsign.php', data)
        .then(response => {
          console.log('response', response)
          let data = response.data.toString()
          if(data.slice(0,5) === 'Error'){
            console.log('Error Po',response)
            this.unsent = this.unsent + 1
                  this.$q.notify({
                    message: this.unsent +'/'+ total + `Not Messages Sent` ,
                    position: 'bottom-right',
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
                  })
          } else {
            console.log('Success')
            this.sent = this.sent + 1
            this.progress = (this.sent / total) * 100
                  this.$q.notify({
                    message: this.sent +'/'+ total + ` Messages Sent` ,
                    position: 'bottom-right',
                    type: 'info',
                    color: 'info',
                    textColor: 'white',
                    icon: 'info'
                  })
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    sendMessages () {
      try {
        this.loading = true
        let total = this.getModels.length
        let messages = this.messageList
        for(var x = 0; x < messages.length; x++) {
        let sms = messages[x].msgs
        let num = messages[x].mobileNumber
        setTimeout(() =>{
          this.posting(num,sms)
        },1000)
        }
        setTimeout(() =>{
          this.loading = false
          this.disabled = true
          this.area = ''
        },3000)
        this.sent = 0
        this.messageList = []
        this.selectedTemplate = ''
      } catch (err) {
        console.log(err)
      }
    },
    getTemplate () {
        try {
          let select = this.selectedTemplate
          let sms = this.$lodash.filter(this.SMStemplates, ex=> {
            return ex['.key'] === select
          })
          this.area = sms[0].template
          console.log('templates',sms)
        } catch (err) {
          return []
        }
      },
      clearArea () {
         this.area = ''
      },
      returnBatchActivity (key) {
      let found = []
      console.log('logeventschedules',this.event_schedules)
      this.$lodash.forEach(this.event_schedules,e=>{
        if(e['.key'] === key) {
          found.push(e)
        }
      })

      let activities = []
      this.$lodash.forEach(found,s=>{
        activities.push(s.activities)
      })
      console.log('found',found)
      console.log('activities',activities)
      return activities[0]
       // return found
    },
  }
}
</script>
