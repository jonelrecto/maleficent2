<template>
  <div>
    <q-toolbar color="faded">
      <q-toolbar-title>
        Attendance List        
      </q-toolbar-title>
    </q-toolbar>
    <div class="col-3 q-ma-md">
      <q-table
        :title= "$route.params.title"
        :data="getModels"
        :loading="tableLoading"
        :columns="Modelcolumns"
        :pagination.sync="Modelpagination"
        separator="cell"
        no-data-label="Empty Activities"
        row-key="['.key']"
      >
        <template slot="top-left" slot-scope="props">
          <h5 style="font-size: 18">{{activityTitle}} - {{activityType.toUpperCase()}}</h5>
        </template>
        <q-td slot="body-cell-fullName" slot-scope="props" :props="props">
          {{props.row.lastName.toUpperCase()}}, {{props.row.firstName.toUpperCase()}}
        </q-td>
        <q-td slot="body-cell-status" slot-scope="props" :props="props">
          <q-chip square :color="isPresent(props.row) ? 'positive':'warning'" class="col q-ma-md">
            {{isPresent(props.row) ? 'Present' : 'Not Set'}}
          </q-chip>
        </q-td>
        <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn v-if="!isPresent(props.row)" color="primary" @click="present(props.row)">
            Present
          </q-btn>
          <q-btn v-if="isPresent(props.row)"round color="negative" icon="close" @click="notSet(props.row)"/>
        </q-td>
      </q-table>
    </div>
  </div>
</template>

<script>
import router from '../router'
export default {
    name: 'attendanceSheet',
    created() {
      this.batchKey = this.$route.params.id,
      this.activityTitle = this.$route.params.title
      this.activityType = this.$route.params.type
    },
    mounted () {
      this.$bindAsArray('event_schedules', this.$database.ref('event_schedules'))
      this.$bindAsArray('model_list', this.$database.ref('models'))
      this.$bindAsArray('showUpList', this.$database.ref('showUpModels'))
      // this.$bindAsArray('seasons', this.$database.ref('events').equalTo('seasons'))
      this.$store.state.schedules.allActivities = this.event_schedules
      // console.log('event_schedules', this.event_schedules)
      // console.log('model_list', this.model_list)
    },
    computed: {
      getActivities () {
        console.log('activities',this.$store.getters['schedules/getSeeAllSchedules'])
        return this.$store.getters['schedules/getSeeAllSchedules']
      },
      getModels () {
        let modelList = this.$lodash.filter(this.model_list, c => {
          return c.batchKey === this.batchKey
        })
        
        // let showUp = this.$lodash.filter(this.showUpList, s => {
        //   return s.batchKey === this.batchKey
        // })
        // console.log('list', modelList)
        // console.log('list', showUp)
        // let mergeModels = this.$lodash.merge(modelList, showUp)
        // console.log('mergeModels', mergeModels)
        return modelList
      }
    },
    data () {
      return {
        activityType: '',
        activityTitle:'',
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
            name: 'fullName',
            required: true,
            label: 'Full Name',
            align: 'left',
            sortable: true
          },
          {
            name: 'status',
            required: true,
            label: 'Status',
            align: 'left',
            sortable: true
          },
          {
            name: 'actions',
            required: true,
            label: 'actions',
            align: 'left',
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
      showSeason (d) {
        console.log('show season',d)
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
      }
    }
}
</script>
