<template>
	<div class="flex flex-center">
		<q-toolbar color="faded">
			<q-toolbar-title>
				Batch List
			</q-toolbar-title>
			<q-btn color="primary" icon="create" label="New Batch" @click="$router.push('/schedules')" />
		</q-toolbar>
		<div class="q-ma-md">
			<q-table
        title="Batches"
        :data="sortedBatches"
        :loading="tableLoading"
        :columns="columns"
        :pagination.sync="pagination"
        :filter="filter"
        separator="cell"
        no-data-label="Empty Events"
        row-key="eventCode"
        >
        <template slot="top-right" slot-scope="props">
          <!-- <q-btn color="primary" flat label="All Seasons" class="q-mr-sm" @click="filter = ''"/> -->
          <q-search color="secondary" v-model="filter" class="col-10"
          />
        </template>
        <!-- batch start date -->
        <q-td slot="body-cell-batchStart" slot-scope="props" :props="props">
          {{startBatch(props)}}
        </q-td>
        <!-- batch end date -->
        <q-td slot="body-cell-batchEnd" slot-scope="props" :props="props">
          {{endBatch(props)}}
        </q-td>
        <q-td slot="body-cell-upcomingActivity" slot-scope="props" :props="props">
          
          {{upcomingActivity(props) ? upcomingActivity(props).type : 'Finished'}} - {{upcomingActivity(props) ? $moment(upcomingActivity(props).startDate).format('ll') : ''}}
        </q-td>
        <!-- actions -->
        <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn v-if="props.row.status === 'standby'" color="positive" icon="launch" @click="launchSeason(props) " />
          <!-- <q-btn icon="edit" @click="showEditSeason(props) " /> -->
          <q-btn color='negative' icon="delete" @click="removeBatch(props.row)" />
        </q-td>
      </q-table>
		</div>
	</div>
</template>
<script>
	export default {
		mounted () {
			this.$bindAsArray('batches', this.$database.ref('event_schedules'))
			this.$store.commit('schedules/updateAllActivities', this.batches)
		},
		computed: {
			sortedBatches () {
				let sorted = this.$lodash.orderBy(this.batches, ['eventName'], ['asc'])
				console.log('sorted', sorted)
				return sorted
			}
		},
		data: () => ({
			batches: [],
			// data table configuration
			filter: '',
			tableLoading: false,
			columns: [
        {
          name: 'eventName',
          required: true,
          label: 'Event',
          align: 'left',
          field: 'eventName',
          sortable: true
        },
        {
          name: 'seasonName',
          required: true,
          align: 'left',
          label: 'Season',
          field: 'seasonName',
          sortable: true,
          visible: false
        },
        {
          name: 'batchNumber',
          required: true,
          label: 'Batch',
          align: 'left',
          field: 'batchNumber',
          sortable: true
        },
        {
          name: 'batchStart',
          required: true,
          label: 'Start',
          align: 'left',
          sortable: true
        },
        {
          name: 'batchEnd',
          required: true,
          label: 'End',
          align: 'left',
          sortable: true
        },
        {
          name: 'upcomingActivity',
          required: true,
          label: 'Upcomming Activity',
          align: 'left',
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
		}),
		methods: {
			test () {
				this.sortedBatches
				
			},
			startBatch (data) {
				let activities = data.row.activities
        // console.log('activities',activities)
				let latest = this.$lodash.map(activities, a => {
					return a.startDate
				})
				let sorted = this.$lodash.orderBy(latest, ['startDate'], ['asc'])
				return this.$moment(sorted[0]).format('ll')
			},
			endBatch (data) {
				let activities = data.row.activities
				let latest = this.$lodash.map(activities, a => {
					return a.endDate
				})
				let sorted = this.$lodash.orderBy(latest, ['endDate'], ['desc'])
				return this.$moment(sorted[sorted.length-1]).format('ll')
			},
			upcomingActivity (data) {
				let activity = data.row.activities
				let dateToday = new Date()
				let upcoming = []
        console.log('act', activity)
				for (var i = 0; i < activity.length; i++) {
					const eLength = this.$mathMixin.dayDiff(dateToday,new Date(activity[i].startDate))
          console.log('el', eLength)
					if (eLength >= 1 && activity[i].type != 'payment') {
						upcoming.push(activity[i])
					}
				}
        console.log('up', upcoming[0])
				return upcoming[0]
			},
			removeBatch (data) {
				this.$q.dialog({
        title: 'Delete Confirmation',
        message: `Do you want to delete ${data.eventName} Batch ${data.batchNumber}?`,
        ok: 'Yes',
        cancel: 'No'
      }).then(() => {
          console.log('data', data)
          let key = data['.key']
           this.$firebase.database().ref(`event_schedules/${key}`).remove()
		        .then(() => {
		          this.$q.notify({
		            message: `${data.eventName} batch ${data.batchNumber} deleted`,
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
			}
		}
	}
</script>