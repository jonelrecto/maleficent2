<template>
	<q-page class="q-pa-md">
		<!-- <q-btn label="test" @click="test" /> -->
<!-- <!- --> 
			<div class="col q-ml-md" v-if="byBatchShow">
	      <q-table
        :data="ByBatchTableData"
        :loading="tableLoading"
        :columns="columns"
        :pagination.sync="pagination"
        separator="cell"
        no-data-label="Empty Activities"
        row-key="id"
        :filter="filter"
      >
        <template slot="top-right" >
          <q-btn-group rounded class="q-ma-sm">
            <q-btn color="primary"  rounded label="By Batch" @click="showByBatch"/>
            <q-btn color="secondary"  rounded label="By Day" @click="showFullDay"/>
         </q-btn-group>
          <q-select
            inverted
            color="dark"
            class="text-white"
            v-model="filter"
            :options="mapActivities"
            stack-label="Activities"
            style="min-width: 150px"
          />
        </template>
        <template slot="top-left" >          <q-toggle v-model="seeAll" label="See All Schedules" checked-icon="visibility"
        unchecked-icon="visibility_off"/>
        </template>
        <q-td slot="body-cell-activity" slot-scope="props" :props="props">
            <!-- {{upcomingActivity(props) ? upcomingActivity(props).type : 'Finished'}} -->
            {{props.row.upcomingAct}}
        </q-td>
        <q-td slot="body-cell-date" slot-scope="props" :props="props">
            <!-- {{upcomingActivity(props) ? $moment(upcomingActivity(props).startDate).format('ll') : ''}} -->
            {{$moment(props.row.date).format('ll')}}
            <!-- {{upcomingActivity(props).type}} -->
        </q-td>
            <q-td slot="body-cell-time" slot-scope="props" :props="props">
            <!-- {{upcomingActivity(props) ? $moment(upcomingActivity(props).startDate).format('ll') : ''}} -->
            {{$moment(props.row.forSort).format('LT')}}
            <!-- {{upcomingActivity(props).type}} -->
        </q-td>

        <q-td slot="body-cell-action" slot-scope="props" :props="props">
            <q-btn color="primary" :to="{name: 'attendanceList', params: { id: props.row.key, title: props.row.id, type: props.row.upcomingAct }}">
              attendance List
            </q-btn>
              <q-btn color="secondary" icon="print" class="q-ml-sm" @click="selectedAttendancePrint(props.row)">
            </q-btn>
        </q-td>
      </q-table>
			</div>

			<!--     fullday activityList -->
    <div class="col q-ml-md" v-if="fullDayShow">
      <q-table
        :data="getFullDayTableData"
        :loading="tableLoading"
        :columns="fullDayColumns"
        :pagination.sync="pagination"
        separator="cell"
        no-data-label="Empty Activities"
        row-key=".key"
        :filter="filter"
      >
        <template slot="top-right" >
        <q-btn-group rounded class="q-ma-sm">
            <q-btn color="primary"  rounded label="By Batch" @click="showByBatch"/>
            <q-btn color="secondary"  rounded label="By Day" @click="showFullDay"/>
         </q-btn-group>
          <q-select
            inverted
            color="dark"
            class="text-white"
            v-model="filter"
            :options="mapActivities"
            stack-label="Activities"
            style="min-width: 150px"
          />
        </template>
        <template slot="top-left" >
          <h4 class="q-mr-lg">Upcoming Schedule<span class="text-secondary text-weight-bold"> Day View</span></h4>
          <q-toggle v-model="seeAllFullDay" label="See All Schedules" checked-icon="visibility"
        unchecked-icon="visibility_off"/>
        </template>
          <q-td slot="body-cell-date" slot-scope="props" :props="props">
            <!-- {{upcomingActivity(props) ? $moment(upcomingActivity(props).startDate).format('ll') : ''}} -->
            {{$moment(props.row.date).format('ll')}}
            <!-- {{upcomingActivity(props).type}} -->
        </q-td>
        <q-td slot="body-cell-batches" slot-scope="props" :props="props">
          <q-list dense v-for="col in props.row.batchTitles" :key="col" class="no-border">
            <q-item class="q-caption align-center">{{col}}</q-item>
          </q-list>
        </q-td>
        <q-td slot="body-cell-action" slot-scope="props" :props="props">
            <q-btn color="primary" :to="{name: 'attendanceFullDay', params: { id: props.row.routerParam, date: props.row.date, type: props.row.type }}">
              attendance List
            </q-btn>
            <q-btn color="secondary" icon="print" class="q-ml-sm" @click="selectedFullAttendancePrint(props.row)">
            </q-btn>
        </q-td>
      </q-table>
    </div>
    <!-- attendance -->
  <q-modal v-model="showPrintModal" :content-css="{minWidth: '100vw', minHeight: '100vh'}" maximized >
    <q-modal-layout class="text-center">
    <q-toolbar slot="header" color="dark" class="noprint">
      <q-btn
        flat
        round
        dense
        @click="showPrintModal = false"
        icon="clear"
        class="fixed-right q-ma-sm"
      />
       <q-btn class="" icon-right="print" color="secondary" label="print" @click="printPdf()"></q-btn>
      <q-toolbar-title>
        <span class="capitalize">{{selectedAttendance.id}}</span>
      </q-toolbar-title>
      </q-toolbar>
      <div class="absolute-center row modal_size text-center q-mt-lg">
        <q-table
        title=""
        :data="getModels"
        :loading="tableLoading"
        :columns="Modelcolumns"
        :pagination.sync="Modelpagination"
        separator="cell"
        hide-bottom
        row-key=".key"
        :filter="filter"
        class="no-shadow"
        style="width:95vw;height: 95vh;"
      >
        <template slot="top" >
         <span class="capitalize q-display-1">{{selectedAttendance.seasonName}}  - Batch {{selectedAttendance.batchNumber}} {{selectedAttendance.upcomingAct}}</span>
        </template>
            <q-td slot="body-cell-fullname" slot-scope="props" :props="props">
            <span class="q-title capitalize">{{props.row.firstName}} {{props.row.lastName}}</span>
        </q-td>
      </q-table>
      </div>
      </q-modal-layout>
  </q-modal>

        <!-- full day attendance -->
  <q-modal v-model="showFullPrintModal" :content-css="{minWidth: '100vw', minHeight: '100vh'}" maximized >
    <q-modal-layout class="text-center">
    <q-toolbar slot="header" color="dark" class="noprint">
      <q-btn
        flat
        round
        dense
        @click="showFullPrintModal = false"
        icon="clear"
        class="fixed-right q-ma-sm"
      />
       <q-btn class="" icon-right="print" color="secondary" label="print" @click="printPdf()"></q-btn>
      <q-toolbar-title>
        <span class="capitalize">{{selectedFull.date}}</span>
      </q-toolbar-title>
      </q-toolbar>
      <div class="absolute-center row modal_size text-center q-mt-lg">
        <q-table
        title=""
        :data="getModelsFull"
        :loading="tableLoading"
        :rows-per-page-options="RowsPage"
        :columns="ModelFullcolumns"
        :pagination.sync="Modelpagination"
        separator="cell"
        hide-bottom
        row-key="accountNumber"
        :filter="filter"
        class="no-shadow"
        style="width:95vw;height: 95vh;"
      >
        <template slot="top" >
          <div  v-for="select in selectedFull.batchTitles" :key="select.value" class="full-width">
            <h6 class="q-ma-xs">{{select}}</h6>
          </div>
        </template>
            <q-td slot="body-cell-fullname" slot-scope="props" :props="props">
            <span class="q-title capitalize">{{props.row.firstName}} {{props.row.lastName}}</span>
        </q-td>
          <q-td slot="body-cell-event" slot-scope="props" :props="props">
            <span class="q-title capitalize">{{props.row.seasonName}}</span>
        </q-td>
              <q-td slot="body-cell-time" slot-scope="props" :props="props">
            <span class="q-title capitalize">{{$moment(props.row.activityTime).format('LT')}}</span>
        </q-td>
      </q-table>
      </div>
      </q-modal-layout>
  </q-modal>
	</q-page>
</template>
<script>
import { CalendarView } from 'vue-simple-calendar'
import { CalendarAgenda } from 'quasar-calendar'

export default {
	created () {
		this.eventKey = this.$route.params.eventKey
		this.loadSelectSeason()
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
			this.$bindAsArray('event_schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey))
	  this.$bindAsArray('payment_transactions', this.$database.ref('payment_transactions'))
	   this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))	
	       this.$bindAsArray('courses', this.$database.ref('settings/courses'))
	           this.$bindAsArray('model_list', this.$database.ref('models'))
    this.$bindAsArray('attendance', this.$database.ref('attendance'))
        this.$bindAsArray('events', this.$database.ref('events'))
        this.$bindAsArray('batch', this.$database.ref('event_schedules'))
	 },
	components: {
		CalendarView,
		CalendarAgenda
	},
	computed: {
		getSeasons () {
			try {
				// this.$bindAsArray('events', this.$database.ref('events'))
				// let event = this.$lodash.filter(this.events, e => {
				// 	return e['.key'] === this.eventKey
				// })[0]
				// console.log('event', event)
				// this.$forceUpdate()
				return this.event[0].seasons
			} catch(err) {
				return []
			}
		},     
		getActivities () {
      let allSched = new Array()
      let scheds = [...this.event_schedules]
      this.$lodash.forEach(scheds, s => {
        this.$lodash.forEach(s.activities, act => {
          act.batchKey = s['.key']
          allSched.push(act)
        })
      })
      return allSched
      },
      getEvents () {
        return this.events
      },
      getStartDate (d) {
        let getDate = new Date(d.row.startDate)
        // console.log('getdate', d)
        // if (typeof d.row.startDate === 'undefined') {
        //     return 'Not Set'
        // }
        // else {
        //     return this.$moment(getDate).format('ll')
        // }
      },
      mapActivities () {
        let opt = this.$lodash.filter(this.courses, a => {
          return a
        })
        // console.log('opt', opt)
        let type = []

        for ( var x = 0 ; x<opt.length ; x++) {
          let gg = opt[x].activities
          for ( var y = 0 ; y<gg.length ; y ++) {
            if(gg[y].label !== 'Payment') {
              let wp = gg[y].label
              type.push(wp)
            }
          }
        }
        // console.log('type', type)
        // for each course get uniq activities
        let selection = this.$lodash.uniq(type)
        // console.log('selection',selection)
        //map for label and everything
        let options = this.$lodash.map(selection, s => {
          return {
            label: s,
            value: this.$lodash.lowerCase(s)
          }
        })
        let opp = []
        let all = {label: "All", value:''}
        opp.push(all)
        for (var z = 0 ; z<options.length ; z++) {
          let pusher = options[z]
          opp.push(pusher)
        }
        // console.log('opp', opp)
        this.filter = ''
        this.mapEventActivities
        return opp
      },
      mapEventActivities () {
        let paymentFilter = []
        let filterPayment = this.$lodash.map(this.getActivities, a => {
            if (a.type != 'payment') {
              paymentFilter.push(a)
            }
            return a
        })
        console.log('filtered payments', paymentFilter)
        return paymentFilter
      },
      getMapActivities () {
        let reconst = this.$lodash.map(this.event_schedules, es => {
        return {
          key: es['.key'],
          eventName: es.eventName,
          eventKey: es.eventKey,
          seasonName: es.seasonName,
          batchNumber: es.batchNumber,
          id: this.upcomingActivity(es.activities).id,
          upcomingAct: this.upcomingActivity(es.activities).type,
          date: this.$moment(this.upcomingActivity(es.activities).startDate).format('ll'),
          forSort:  new Date(this.upcomingActivity(es.activities).startDate),
          time:  this.$moment(this.upcomingActivity(es.activities).startDate).format('LT')
        }
      })
      // console.log('reconst',reconst)
      return reconst
      },
      getAllAttendance () {
        try {
            let activities = this.mapEventActivities
            // console.log('getAllAttendance')
            // console.log(activities)
            let open = this.OpenSeasonOnly
            // console.log(open)
            // console.log(this.batch)
            let batches = this.batch
            let openbatches = []
            let closebatches = []
            for(var z=0;z<batches.length;z++) {
              for(var a=0;a<open.length;a++) {
                if(batches[z].seasonName === open[a].seasonName){
                  openbatches.push(batches[z])
                } else {
                  closebatches.push(batches[z])
                }
              }
            }
            // console.log('openbatches',openbatches)  
            let filtered = []
            let none = []
            for(var x=0;x<activities.length;x++) {
              for(var y=0;y<openbatches.length;y++) {
                if(activities[x].batchKey === openbatches[y]['.key']){
                  let push = {
                      key: openbatches[y]['.key'],
                      upcomingAct: activities[x].type,
                      eventKey: openbatches[y].eventKey,
                      forSort:  new Date(activities[x].startDate),
                      eventName: openbatches[y].eventName,
                      seasonName: openbatches[y].seasonName,
                      batchNumber: openbatches[y].batchNumber,
                      id: activities[x].id,
                      date: this.$moment(activities[x].startDate).format('ll'),
                      time:  this.$moment(activities[x].startDate).format('LT')
                  } 
                  filtered.push(push)
                } else {
                  none.push(activities[x])
                }
              }
            }
            // console.log(filtered)
            let sorted = this.$lodash.orderBy(filtered,'forSort','asc')
            // console.log('getAllAttendance',sorted)
            return sorted
        } catch (err) {
          console.log('err',err)
          return []
        }
    },
      getFilteredActivities () {
        if(this.seeAllFullDay === true){
        	let eventAttendance = this.$lodash.filter(this.getAllAttendance, e=>{
        		return e.eventKey === this.$route.params.eventKey
        	})
          let uniq = this.$lodash.groupBy(eventAttendance,function (schedules) { return schedules.date + schedules.upcomingAct })
          // console.log('uniq', uniq)

          let filtered = this.$lodash.filter(uniq, (value,key,obj) => {
            value['.key'] = key
            // console.log(obj)
            return obj
          })

          console.log('filteredUNIQ', filtered)
          return filtered

        } else {
        	let eventAttendance = this.$lodash.filter(this.FilterActivitiesOpenSeason, e=>{
        		return e.eventKey === this.$route.params.eventKey
        	})
          let uniq = this.$lodash.groupBy(eventAttendance, function (schedules) { return schedules.date + schedules.upcomingAct })
          // console.log('uniq', uniq)

          let filtered = this.$lodash.filter(uniq, (value,key,obj) => {
            value['.key'] = key
            // console.log(obj)
            return obj
          })

          // console.log('filteredUNIQ', filtered)
          return filtered
        }
      },
      getFullDayTableData () {
        let map = []
        for(var x = 0; x< this.getFilteredActivities.length; x++) {
          let data = this.getFilteredActivities[x]
          map.push({date: this.getDateForTable(data),
            type: this.getTypeForTable(data),
            batchKeys: this.getBatchesPerDate(data),
            batchTitles: this.getBatchNameForTable(data),
            routerParam: this.getRouterLink(data),
            sortDate: this.getSortableDate(data)
          })
        }
        // console.log('fulldayTable',map)
        return map
      },
      OpenSeasonOnly () {
        try {
          let events = this.events
          let seasons = []
          let others = []
          let withseasons = this.$lodash.filter(events, e=> {
            return e.seasons
          })
          for(var x=0;x<withseasons.length;x++){
            for(var y=0;y<withseasons[x].seasons.length; y++)
            {
              if(withseasons[x].seasons[y].status === 'open'){
                seasons.push(withseasons[x].seasons[y])
              } else {
                others.push(withseasons[x].seasons[y])
              }
            }
          }
          // console.log('seasons',seasons)
          return seasons
        } catch (err) {
          console.log(err)
          return []
        }
      },
      FilterActivitiesOpenSeason (){
        try {
          let activities = this.getMapActivities
          let open = this.OpenSeasonOnly
          let filtered = []
          let none = []
          for(var x=0;x<activities.length;x++) {
            for(var y=0;y<open.length;y++) {
              if(activities[x].seasonName === open[y].seasonName){
                filtered.push(activities[x])
              } else {
                none.push(activities[x])
              }
            }
          }
          // console.log(filtered)
          return filtered
        } catch (err) {
          console.log(err)
          return []
        }
      },
      ByBatchTableData () {
        try {
            let all = this.getAllAttendance
            let upcoming = this.FilterActivitiesOpenSeason
            if(this.seeAll === true) {
               console.log('ByBatchTableData',all)
              let push = this.$lodash.filter(all, e=> {
            		return e.eventKey === this.$route.params.eventKey
              })
              let FilteredPayment = this.$lodash.filter(push, a=>{
                if(a.upcomingAct === 'payment' || a.upcomingAct === 'payments'){
                  return 0
                } else {
                  return a
                }
              })
              return FilteredPayment
            } else {
            	let push = this.$lodash.filter(upcoming, e=> {
            		return e.eventKey === this.$route.params.eventKey
            	})
              console.log('ByBatchTableData',push)
              return push
            }
          } catch (err) {
            console.log('err',err)
            return []
          }
      },
      getModels () {
        try {
          let id = this.selectedAttendance.key
          let title = this.selectedAttendance.id
          let type = this.selectedAttendance.upcomingAct
          console.log(title+id+type)

          if (type !== 'orientation') {  
            console.log('activity models',this.returnAttendanceList(id,title))
            return this.returnAttendanceList(id,title)
          } else {
          	console.log('orientation')
            let modelList = this.$lodash.filter(this.model_list, c => {
              return c.batchKey === id
            })
            
            console.log('modellist',modelList)
            return modelList
          }
        } catch (e) {
          return []
        }
      },
      getModelsFull () {
        try {
          if(typeof this.selectedFull === undefined)
          {
            return []
          } else {
            //start else
          if (this.selectedFull.type !== 'orientation') {  
            let keysRouter = this.selectedFull.routerParam
            let batches = this.$lodash.split(keysRouter,'$')
            let activityDate = this.selectedFull.date
            let type = this.selectedFull.type
            console.log('activityDate',activityDate)
            console.log('split batches', batches)

            let models = []
            // for (var x = 0; x < batches.length; x++) {
              this.$lodash.forEach(batches, e=> {
              // let key = batches[x]
              let key = e
              console.log('key NOT orientation',key)
              // this.$bindAsArray('batchActivity', this.$database.ref('event_schedules/'+ key+'/activities'))
              let batchActivity = this.returnBatchActivity(key)
              let remove = []
              let title = ''
              let time = null
              let date = this.$moment(new Date(activityDate)).format('ll')
              let acts = this.$lodash.map(batchActivity, a => {
                let actdate =  this.$moment(new Date(a.startDate)).format('ll')
                if(a.type ===type && date === actdate) {
                  title = a.id
                  time = new Date(a.startDate)
                } else {
                  remove.push(a)
                }
              })
              console.log('key',key)
              console.log('titles',title)
              // this.$bindAsArray('attendanceListFull', this.$database.ref('attendance/'+key+'/'+title+'/models'))

              let attendanceListFull = this.returnAttendanceList(key,title)
              for (var y = 0; y<attendanceListFull.length;y++) {
                let m = {...attendanceListFull[y]}
                m.activityID = title
                m.activityTime = time
                models.push(m)
              }                          
              })
            // }
            console.log('modelsBatch',models)
            return models
          } else {
            let keysRouter = this.selectedFull.routerParam
            let batches = this.$lodash.split(keysRouter,'$')
            let activityDate = this.selectedFull.sortDate
            let type = this.selectedFull.type
            console.log('activityDate',activityDate)
            console.log('split batches orientation', batches)

            let models = []
            for (var x = 0; x < batches.length; x++) {
              let key = batches[x]
              let batchActivity = this.returnBatchActivity(key)
              let remove = []
              let title = ''
              let time = null
              let date = this.$moment(new Date(activityDate)).format('ll')
              let acts = this.$lodash.map(batchActivity, a => {
                let actdate =  this.$moment(new Date(a.startDate)).format('ll')
                if(a.type === type && date === actdate) {
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
          //end else
        }
        } catch (e) {
          return []
        }
      }
	},
	data () {
		return {
			filter: '',
		  contractsigned: [],
		  payment_transactions: [],
			startingDayOfWeek: 0,
			showEventTimes: true,
			showDate: new Date(),
			schedules: [],
			selectedSeason: {},
			viewMode: 'batchMode',
			events: [],
			event: [],
			batch: [],
			eventKey: '',
			  batchActivity: [],
        attendanceListFull: [],
        batchActivity2: [],
        RowsPage: [0],
        selectedAttendance: {},
        selectedFull: {},
        showPrintModal: false,
        showFullPrintModal: false,
        seeAll: false,
        seeAllFullDay: false,
        fullDayShow: false,
        byBatchShow: true,
        activities: [],
        selectActivity: '',
        events: [],
        event_schedules: [],
        model_list: [],
        tableLoading: false,
               fullDayColumns: [
            {
            name: 'date',
            required: true,
            label: 'Date',
            align: 'left',
            sortable: true,
            field: 'sortDate'
            },
            {
            name: 'type',
            required: true,
            label: 'Activity Type',
            align: 'left',
            sortable: true,
            field: 'type'
            },
            {
            name: 'batches',
            required: true,
            label: 'Batches',
            align: 'left'
            },
            {
            name: 'action',
            required: true,
            label: 'Action',
            align: 'center',
            sortable: true
            }
        ],
      columns: [
            // {
            // name: 'eventName',
            // required: true,
            // label: 'Event Name',
            // align: 'left',
            // field: 'eventName',
            // sortable: true
            // },
            {
            name: 'season',
            required: true,
            label: 'Season',
            align: 'left',
            field: 'seasonName',
            sortable: true
            },
            {
            name: 'batch',
            required: true,
            label: 'Batch',
            align: 'left',
            field: 'batchNumber',
            sortable: true
            },
            {
            name: 'activity',
            required: true,
            label: 'Upcoming Activity',
            align: 'left',
            sortable: true,
            field: 'upcomingAct'
            },
            {
            name: 'date',
            required: true,
            label: 'Date',
            align: 'left',
            sortable: true,
            field: 'forSort'
            },
            {
            name: 'time',
            required: true,
            label: 'Time',
            align: 'left',
            sortable: true,
            field: 'forSort'
            },
            {
            name: 'action',
            required: true,
            label: 'Action',
            align: 'center',
            sortable: true
            }
        ],
      Modelcolumns: [
                {
                name: 'fullname',
                required: true,
                label: 'Full Name',
                align: 'left',
                },                
                {
                name: 'signature',
                required: true,
                label: 'Signature',
                align: 'left',
                }
        ],
        ModelFullcolumns: [
                {
                name: 'fullname',
                required: true,
                label: 'Full Name',
                align: 'left',
                }, 
                {
                name: 'event',
                required: true,
                label: 'Event',
                align: 'left',
                },
                {
                name: 'time',
                required: true,
                label: 'Time',
                align: 'left',
                },                       
                {
                name: 'signature',
                required: true,
                label: 'Signature',
                align: 'left',
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
            rowsPerPage: 0 // current rows per page being displayed
        }
		}
	},
	methods: {
		dropOnDate (e, d) {

		},
		clickEvent (e) {

		},
		setShowDate (d) {
			this.showDate = d
		},
		getCol (c) {
			console.log('c', c)
		},
		loadSelectSeason () {
			try {
				let events = this.$store.state.startUp.events
				console.log('events',events)
				let event = this.$lodash.filter(events, e => {
					return e['.key'] === this.eventKey
				})[0]
				let seasonLen = event.seasons.length
				this.selectedSeason = event.seasons[seasonLen-1]
				console.log('this.selectedSeason',this.selectedSeason)
			} catch(err) {
				this.selectedSeason = {}
			}
			
		},
		test () {
			console.log('seasonBatches', this.seasonBatches)
			
		},
		getModelsPaymentTransactions (k) {
      try {
        let payments = this.$lodash.filter(this.payment_transactions, p=> {
          return p.modelKey === k
        })
        console.log('modelpayments',payments)
        return payments       
      } catch (err) {
        console.log('error',err)
        return []
      }
    },
           getBatchesPerDate (data) {
        let test = data
        // console.log('testFilter',test)
        // getting bachtname for joining
        let keys = []
        for(var x =0; x < test.length; x++) {
          let b = test[x].key
          keys.push(b)
        }
        let batches = this.$lodash.join(keys,'$')
        // console.log('join', batches)
        let split = this.$lodash.split(batches,'$')
        // console.log('split', split)
        return split
        //batches of every table data
      },
      getRouterLink (data) {
        let test = data
        // console.log('testFilter',test)
        // getting bachtname for joining
        let keys = []
        for(var x =0; x < test.length; x++) {
          let b = test[x].key
          keys.push(b)
        }
        let batches = this.$lodash.join(keys,'$')
        // console.log('join', batches)
        let split = this.$lodash.split(batches,'$')
        // console.log('split', split)
        return batches
        //batches of every table data
      },
      getBatchNameForTable (data) {
        let test = data
        // console.log('data',test)
        // getting keys for joining
        let keys = []
        for(var x =0; x < test.length; x++) {
          let b = test[x].id
          let s = test[x].seasonName
          let i = this.$moment(test[x].forSort).format('LT')
          // console.log('i - time', i)
          let a = this.$lodash.join([s,b,i],' / ')
          keys.push(a)
        }
        let batches = this.$lodash.join(keys,'$')
        // console.log('join', batches)
        let split = this.$lodash.split(batches,'$')
        // console.log('split', split)
        return split
        //batches of every table data
      },
      getDateForTable (data) {
        let test = data[0].date
        return test
      },
      getSortableDate (data) {
        let test = data[0].forSort
        return test
      },
      getTypeForTable (data) {
        let test = data[0].upcomingAct
        return test
      },
      showByBatch () {
        this.fullDayShow = false
        this.byBatchShow = true
      },
      showFullDay() {
        this.fullDayShow = true
        this.byBatchShow = false
      },
      upcomingActivity (data) {
        let activity = data
        let dateToday = new Date()
        let upcoming = []
        for (var i = 0; i < activity.length; i++) {
          const eLength = this.$mathMixin.dayDiff(dateToday, new Date(activity[i].startDate))
          if (eLength >= 0 && activity[i].type != 'payment') {
            upcoming.push(activity[i])
          }
        }
        let ordered = upcoming.sort(function compare(a, b) {
          var dateA = new Date(a.startDate)
          var dateB = new Date(b.startDate)
          return dateA - dateB
        })
        return ordered[0]
      },
      showSeason (d) {
        console.log('show season',d)
      },
      getTitle (data) {
        let activities = data.row.activities
        //  console.log('activities1111',activities)
        let latest = this.$lodash.map(activities, a => {
          return a.title
        })
      },         // this is actually the default filtering method:
      mySort (data, sortBy, descending) {
      const col = this.computedCols.find(def => def.name === sortBy)
      if (col === null || col.field === void 0) {
        return data
      }

      const
        dir = descending ? -1 : 1,
        val = typeof col.field === 'function'
          ? v => col.field(v)
          : v => v[col.field]

      return data.sort((a, b) => {
        let
          A = val(a),
          B = val(b)

        if (A === null || A === void 0) {
          return -1 * dir
        }
        if (B === null || B === void 0) {
          return 1 * dir
        }
        if (col.sort) {
          return col.sort(A, B) * dir
        }
        if (isNumber(A) && isNumber(B)) {
          return (A - B) * dir
        }
        if (isDate(A) && isDate(B)) {
          return sortDate(A, B) * dir
        }
        if (typeof A === 'boolean' && typeof B === 'boolean') {
          return (a - b) * dir
        }

        [A, B] = [A, B].map(s => (s + '').toLowerCase())

        return A < B
          ? -1 * dir
          : (A === B ? 0 : dir)
      })
    },
    selectedAttendancePrint (data) {
      this.selectedAttendance = data
      console.log('for print',data)
      this.showPrintModal = true
    },
    printPdf () {
      window.print()
    },
    selectedFullAttendancePrint (data) {
      this.selectedFull = data
      console.log('for print',data)
      this.showFullPrintModal = true
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
      let keyfound = []
      this.$lodash.forEach(this.attendance, e=> {
        if(e['.key'] === key) {
          keyfound.push(e)
        }
      })
      if (typeof keyfound[0] === 'undefined') {
        return []
      } else {
      console.log('keyfound',keyfound[0])
      console.log('title',title)
      let zero = keyfound[0]
      let models = []
      console.log('zero',zero[title].models)
      this.$lodash.map(zero[title].models, (value, key, obj) => {
        value['.key'] = key
        models.push(value)
      })
      console.log('models',models)
      return models
    }
    }
	}
}
</script>