<template>
  <div>
    <q-toolbar color="faded">
      <q-toolbar-title>
        Attendance List        
      </q-toolbar-title>
      <q-btn icon="people" :label="'Show Ups('+getShowupCount+')'" color="dark" class="q-ml-sm q-ma-sm float-right" v-if="ifOrientation" @click="showShowUpModal"/>
      <q-btn icon="border_color" :label="'Contract Signing('+getShowupCount+')'" color="secondary" class="q-ml-sm q-ma-sm float-right" to="/contractsigned" v-if="ifOrientation"/>
        <q-btn icon="check_box" :label="'Confirmed Attendance('+getPresentCount+')'" color="secondary" class="q-ml-sm q-ma-sm float-right" v-if="ifNotOrientation" @click="showConfirmed"/>
    </q-toolbar>
    <div class="col-3 q-ma-md">
      <q-table
        :title= "$route.params.title"
        :data="getModels"
        :loading="tableLoading"
        :columns="Modelcolumns"
        :pagination.sync="Modelpagination"
        separator="horizontal"
        selection="multiple"
        :selected.sync="selected"
        no-data-label="No Models"
        row-key=".key"
        :filter="filter"
      >
        <template slot="top-left" slot-scope="props">
          <h5 style="font-size: 18">{{activityType.toUpperCase()}} - <span class="text-faded text-weight-light text-italic">{{activityDate}}</span> </h5>
        </template>
          <template slot="top-right" slot-scope="props" class="">
        <q-search hide-underline inverted v-model="filter" class="bg-dark" style="width: 180px;" @input="test"/>
        <!-- if orientation show -->
        <q-btn :label="'View Selected('+getSelectedRowCount+')'" color="primary" class="q-ml-sm float-right cardsButtonsDesktop" @click="showModal"/>
        <q-btn :label="'View Selected('+getSelectedRowCount+')'" color="primary" class="q-ml-sm float-right cardsButtonsMobile" size="sm"  @click="showModal"/>
        </template>
        <q-td slot="body-cell-Picture" slot-scope="props" :props="props">
          <div class="" :style='"border-radius:15px; width: 150px;height:125px;background-position: center;background-image: url("+props.row.photo+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'/>
        </q-td>
        <q-td slot="body-cell-time" slot-scope="props" :props="props">
          {{$moment(props.row.activityTime).format('LT')}}
        </q-td>
      </q-table>
    </div>
        <q-modal v-model="attendanceModal" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="attendanceModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              {{activityType.toUpperCase()}} - {{activityDate}}
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
              {{activityType.toUpperCase()}} - {{activityDate}}
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
              {{activityType.toUpperCase()}} - {{activityDate}}
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
                <div v-if="getPresentCount===0" class="text-center text-faded q-display-1 fixed-center">No Models Listed</div>
          </q-scroll-area>
        </q-modal-layout>
      </q-modal>
      <q-page-sticky position="bottom-right" :offset="[20, 50]">
      <q-btn fab color="primary" icon="check_box" class="animate-pop" @click="showModal"><span class="text-weight-thin" style="font-size: 9px">Selected</span>
      </q-btn>
      <q-chip floating color="red" v-if="getSelectedRowCount">{{getSelectedRowCount}}</q-chip>
    </q-page-sticky>
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
export default {
    name: 'attendanceSheet',
    created() {
      this.batches = this.$route.params.id,
      this.activityDate = this.$route.params.date
      this.activityType = this.$route.params.type
    },
    mounted () {
      this.$bindAsArray('event_schedules', this.$database.ref('event_schedules'))
      this.$bindAsArray('model_list', this.$database.ref('models'))
      this.$bindAsArray('showUpList', this.$database.ref('showUpModels'))
      this.$bindAsArray('attendance', this.$database.ref('attendance'))
      // this.$bindAsArray('attendanceList', this.$database.ref('attendance/'+this.$route.params.title+'/models'))
      // this.$bindAsArray('seasons', this.$database.ref('events').equalTo('seasons'))
      // this.$store.state.schedules.allActivities = this.event_schedules
      // console.log('event_schedules', this.event_schedules)
      // console.log('model_list', this.model_list)
    },
    computed: {
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
        return this.getConfirmed.filter((s) => {
          var reg = new RegExp(this.nameSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
      getActivities () {
        console.log('activities',this.$store.getters['schedules/getSeeAllSchedules'])
        return this.$store.getters['schedules/getSeeAllSchedules']
      },
      getModels () {
        try {
          if (this.$route.params.type !== 'orientation') {  
            console.log('getmodels not orientation')
            // change CODE if not orientation
            // console.log('activity models',this.attendanceList)
            // return this.attendanceList
            let batches = this.$lodash.split(this.$route.params.id,'$')
            // console.log('split batches', batches)

            let models = []
            for (var x = 0; x < batches.length; x++) {
              let key = batches[x]
              console.log('key',key)
              let batchActivity = this.returnBatchActivity(key)
              console.log('batchActivity',batchActivity)
              let remove = []
              let title = ''
              let time = null
              let date = this.$moment(new Date(this.activityDate)).format('ll')
              let acts = this.$lodash.map(batchActivity, a => {
                let actdate =  this.$moment(new Date(a.startDate)).format('ll')
                if(a.type === this.activityType && date === actdate) {
                  title = a.id
                  time = new Date(a.startDate)
                } else {
                  remove.push(a)
                }
              })
              console.log('titles',title)
              let attendanceList = this.returnAttendanceList(key,title)
              console.log('attendanceList',attendanceList)
              // this.$bindAsArray('attendanceList', this.$database.ref('attendance/'+key+'/'+title+'/models'))
              for (var y = 0; y<attendanceList.length;y++) {
                let m = {...attendanceList[y]}
                m.activityID = title
                m.activityTime = time
                m.activityKey = key
                // console.log(m)
                models.push(m)
              }
              console.log('napush',models)
            }
            console.log('GETMODELS',models)
            return models
          } else {
            let batches = this.$lodash.split(this.$route.params.id,'$')
            console.log('split batches', batches)

            let models = []
            for (var x = 0; x < batches.length; x++) {
              let key = batches[x]
              let batchActivity = this.returnBatchActivity(key)
              let remove = []
              let title = ''
              let time = null
              let date = this.$moment(new Date(this.activityDate)).format('ll')
              let acts = this.$lodash.map(batchActivity, a => {
                let actdate =  this.$moment(new Date(a.startDate)).format('ll')
                if(a.type === this.activityType && date === actdate) {
                  title = a.id
                  time = new Date(a.startDate)
                } else {
                  remove.push(a)
                }
              })


              for (var y = 0; y<this.model_list.length;y++) {
                if(this.model_list[y].batchKey === batches[x]){
                  let m = this.model_list[y]
                  m.activityID = title
                  m.activityTime = time
                  models.push(m)
                }
              }
            }
            console.log('all models in batches', models)
            return models
          }
        } catch (e) {
          console.log('err',e)
          return []
        }
      },
      getModelsInfo () {
        let models = this.$lodash.filter(this.getModels, s => {
          return s
        })
        console.log('log',models)
        return models
      },
      getShowUps () {
            let batches = this.$lodash.split(this.$route.params.id,'$')
            console.log('split batches', batches)

            let models = []
            for (var x = 0; x < batches.length; x++) {
              let key = batches[x]
              // let m = this.$lodash.filter(this.model_list, s=> {
              //   return s.batchKey === batches[x]
              // })
              for (var y = 0; y<this.showUpList.length;y++) {
                if(this.showUpList[y].batchKey === batches[x]){
                  let m = this.showUpList[y]
                  models.push(m)
                }
              }
            }
            this.$bindAsArray('showUpList', this.$database.ref('showUpModels'))
            this.$forceUpdate()
            console.log('showUpModels In Batch',models)
            return models
      },
      getSelectedRowCount () {
        console.log('selectedL',this.selected.length)
        console.log('selectedL',this.selected)
        return this.selected.length
      },
      getPresentCount () {
            return this.getConfirmed.length
      },
      getConfirmed() {
        try{
            let batches = this.$lodash.split(this.$route.params.id,'$')

            let models = []
            for (var x = 0; x < batches.length; x++) {
              let key = batches[x]
              // this.$bindAsArray('batchActivitys', this.$database.ref('event_schedules/'+ key+'/activities'))
              let batchActivitys = this.returnBatchActivity(key)
              let remove = []
              let title = ''
              let acts = this.$lodash.map(batchActivitys, a => {
                if(a.type === this.activityType) {
                  title = a.id
                } else {
                  remove.push(a)
                }
              })
              let confirmList = this.returnConfirmedList(key,title)
              // this.$bindAsArray('confirmList', this.$database.ref('attendance/'+key+'/'+title+'/present'))
              for (var y = 0; y<confirmList.length;y++) {
                let m = confirmList[y]
                models.push(m)
              }
            }
            console.log('modelsBatch_length',models)
            return models
        } catch (err) {
          return []
        }
      },
      getShowupCount () {
            let batches = this.$lodash.split(this.$route.params.id,'$')
            console.log('split batches', batches)

            let models = []
            for (var x = 0; x < batches.length; x++) {
              let key = batches[x]
              // let m = this.$lodash.filter(this.model_list, s=> {
              //   return s.batchKey === batches[x]
              // })
              for (var y = 0; y<this.showUpList.length;y++) {
                if(this.showUpList[y].batchKey === batches[x]){
                  let m = this.showUpList[y]
                  models.push(m)
                }
              }
            }
            console.log('all models in batches', models.length)
            return models.length
      },
      // getSeasonName () {
      //   try{
      //     console.log('eventS',this.event_schedules)
      //     let seasonGet = this.$lodash.filter(this.event_schedules, s => {
      //       if (s['.key'] === this.batchKey) {
      //         return s
      //       }
      //     })
      //     console.log('seasonGet',seasonGet[0].seasonName)
      //     return seasonGet[0].seasonName
      //   } catch (e) {
      //     return ''
      //   }
      // },
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
        attendance: [],
        attendanceList: [],
        attendanceModal: false,
        showUpsModal: false,
        confirmedAttendanceModal: false,
        filter: '',
        selected: [],
        nameSearch: '',
        selectSearch: '',
        showUpSearch: '',
        activityType: '',
        activityDate: '',
        batchKey: '',
        event_schedules: [],
        model_list: [],
        showUpList: [],
        tableLoading: false,
        columns: [
          {
          name: 'title',
          required: true,
          label: 'title',
          align: 'left',
          field: 'title',
          sortable: true
          }
        ],
        Modelcolumns: [
                {
                name: 'Picture',
                required: true,
                label: 'Picture',
                align: 'center',
                sortable: true,
                },
                {
                name: 'seasonName',
                required: true,
                label: 'Season Name',
                align: 'left',
                sortable: true,
                field: 'seasonName'
                },
                {
                name: 'firstName',
                required: true,
                label: 'First Name',
                align: 'left',
                sortable: true,
                field: 'firstName'
                },
                {
                name: 'middleInitial',
                required: true,
                label: 'M.I.',
                align: 'left',
                sortable: true,
                field: 'middleInitial'
                },
                {
                name: 'lastName',
                required: true,
                label: 'Last Name',
                align: 'left',
                sortable: true,
                field: 'lastName'
                },
                {
                name: 'age',
                required: true,
                label: 'Age',
                align: 'left',
                sortable: true,
                field: 'age'
                },
                {
                name: 'time',
                required: true,
                label: 'Time',
                align: 'left',
                sortable: true,
                field: 'activityTime'
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
          rowsPerPage: 10 // current rows per page being displayed
        }
      }
    },
    methods: {
      showSeason (d) {
        console.log('show season',d)
      },
      test (){
                // console.log('filter',this.filter)
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
          let select = this.selected[x]
          let key = select['.key']
          let batchKey = select.activityKey
          let activityTitle = select.activityID
          console.log('key & title',select.batchKey +' '+ select.activityID)
          let self = this
          // this.selected[x].dateAdded = new Date().toString()
          // var index = this.$lodash.findIndex(select.activitiesAttended, a => {
          //   return a.id === activityTitle
          // })
          // console.log('index_activity',index)
          // if (index != -1) {
          // console.log('ind', index)
          // m.activitiesAttended[index].status = true
          // select.activitiesAttended[index].status = true
          delete select['.key']
          console.log('model selected', select)
          // model.activitiesAttended[index].status = true
          // this.$database.ref('contractSigned/' + key + '/activitiesAttended/' + index + '/status').set(true)
          //   .then(() => {
          this.$database.ref('attendance/'+batchKey+'/'+activityTitle+'/present').child(key).set(select)
            .then(() => {
              console.log('status updated')
              self.$database.ref('attendance/'+batchKey+'/'+activityTitle+'/models').child(key).remove()
                .then(() => {
                  this.selected = []
                  self.$bindAsArray('attendanceList', self.$database.ref('attendance/'+batchKey+'/'+activityTitle+'/models'))
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
                  this.$q.notify({
                    message: `Model/s Attendance Confirm`,
                    type: 'positive',
                    color: 'positive',
                    textColor: 'white',
                    icon: 'info'
                  })
        }
        ).catch(() => {})
      //END OF SETACTIVITYATTENDANCE
      },
      getConfirmationBack (m) {
        console.log('not set', m)
        let key = m['.key']
        let select = m
        let batchKey = select.activityKey
        let activityTitle = select.activityID
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
          this.$database.ref('attendance/'+batchKey+'/'+activityTitle+'/models').child(key).set(select)
            .then(() => {
              console.log('status updated')
              self.$database.ref('attendance/'+batchKey+'/'+activityTitle+'/present').child(key).remove()
                .then(() => {
                  this.selected = []
                  self.$bindAsArray('confirmedList', self.$database.ref('attendance/'+batchKey+'/'+activityTitle+'/present'))
                  self.$forceUpdate()
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
    returnBatchActivity (key) {
      let found = []
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
    returnAttendanceList (key,title) {
      try {
            let keyfound = []
            console.log(key,title)
            this.$lodash.forEach(this.attendance, e=> {
              if(e['.key'] === key) {
                keyfound.push(e)
              }
            })
            console.log(keyfound)
            let models = keyfound[0][title].models

            let filtered = this.$lodash.filter(models,(value,key,object)=>{
              console.log('value',value)
              console.log(key)
              object[key]['.key'] = key
              return object
            })
          console.log('returnAttendanceList models',filtered)
            return filtered        
          } catch (err) {
            return []
          }

    },
    returnConfirmedList (key,title) {
      try {
            let keyfound = []
            console.log(key,title)
            this.$lodash.forEach(this.attendance, e=> {
              if(e['.key'] === key) {
                keyfound.push(e)
              }
            })
            console.log(keyfound)
            let models = keyfound[0][title].present

            let filtered = this.$lodash.filter(models,(value,key,object)=>{
              console.log('value',value)
              console.log(key)
              object[key]['.key'] = key
              return object
            })
          console.log('returnAttendanceList models',filtered)
            return filtered        
          } catch (err) {
            return []
          }

    }//END OF CONFIMARTION BACK
  }
}
</script>
