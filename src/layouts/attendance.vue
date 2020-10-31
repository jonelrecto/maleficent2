<template>
<div>
    <q-toolbar color="faded">
      <q-toolbar-title>
        Attendance                <!-- <span slot="subtitle">Optional subtitle</span> -->
      </q-toolbar-title>
		</q-toolbar>
      <div class="col-3 q-ma-md">
      <q-table
        title=""
        :data="event_schedules"
        :loading="tableLoading"
        :columns="columns"
        :pagination.sync="pagination"
        separator="cell"
        no-data-label="Empty Activities"
        row-key="title"
      >
        <template slot="top-right" slot-scope="props">
          <q-select
            inverted
            color="secondary"
            v-model="selectActivity"
            :options="mapActivities"
            float-label="Activities"
            style="min-width: 150px"
          />
        </template>
        <q-td slot="body-cell-activity" slot-scope="props" :props="props">
            {{upcomingActivity(props) ? upcomingActivity(props).type : 'Finished'}} - {{upcomingActivity(props) ? $moment(upcomingActivity(props).startDate).format('ll') : ''}}
            <!-- {{upcomingActivity(props).type}} -->
        </q-td>
        <q-td slot="body-cell-action" slot-scope="props" :props="props">
            <q-btn color="primary" :to="{name: 'attendanceList', params: { id: props.row['.key'], title: props.row.eventName, type: upcomingActivity(props).type }}">
              attendance List
            </q-btn>
            <!-- <q-btn @click="upcomingActivity(props)" /> -->
          <!-- </q-btn> -->
        </q-td>
        <!-- <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr> -->
      </q-table>
    </div>
</div>
</template>

<script>
export default {
    mounted () {
    this.$bindAsArray('event_schedules', this.$database.ref('event_schedules'))
    this.$bindAsArray('model_list', this.$database.ref('models'))
    this.$bindAsArray('events', this.$database.ref('events'))
    this.$bindAsArray('activities', this.$database.ref('settings/activityList'))
    // this.$bindAsArray('seasons', this.$database.ref('events').equalTo('seasons'))
    this.$store.state.schedules.allActivities = this.event_schedules
    console.log('event_schedules', this.event_schedules)
    console.log('model_list', this.model_list)
    },
    computed: {
      getActivities () {
        console.log('activities',this.$store.getters['schedules/getSeeAllSchedules'])
        return this.$store.getters['schedules/getSeeAllSchedules']
      },
      getEvents () {
        return this.events
      },
      getStartDate (d) {
        let getDate = new Date(d.row.startDate)
        console.log('getdate', d)
        // if (typeof d.row.startDate === 'undefined') {
        //     return 'Not Set'
        // }
        // else {
        //     return this.$moment(getDate).format('ll')
        // }
      },
      mapActivities () {
        let opt2 = []
        let opt = this.$lodash.map(this.activities, a => {
            if (a.value != 'payment') {
              opt2.push({label: a.label, value: a.value})
            }
            return a
        })
        // console.log('opt2', opt2)
        this.mapEventActivities
        return opt2
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
      }
    },
    data () {
      return{
        activities: [],
        selectActivity: '',
        events: [],
        event_schedules: [],
        model_list: [],
        tableLoading: false,
        columns: [
            {
            name: 'eventName',
            required: true,
            label: 'Event Name',
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
            sortable: true
            },
            {
            name: 'action',
            required: true,
            label: 'Action',
            align: 'center',
            sortable: true
            }
        ],
        eventOpt: [
          {label: 'test', value: 'test'}
        ],
        Modelcolumns: [
            {
            name: 'firstName',
            required: true,
            label: 'First Name',
            align: 'left',
            field: 'firstName',
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
            rowsPerPage: 10 // current rows per page being displayed
        }
      }
    },
    methods: {
      upcomingActivity (data) {
        let activity = data.row.activities
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
			}
    }
}
</script>
