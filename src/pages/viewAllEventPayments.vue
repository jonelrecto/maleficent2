<template>
	<q-page>
<!-- 		<q-btn label="test"  @click="getAllTransacations" /> -->
			<div class="col q-ma-lg">
				<q-table
			    title="All Payment Records"
			    :filter="filter"
			    :data="getAllTransactions"
			    :columns="Modelcolumns"
			    row-key="batchNumber"
			  >
			 <template slot="top-right" class="">
        <q-search hide-underline inverted v-model="filter" class="bg-dark" style="width: 180px;" @input="test"/>
      </template>
			      <q-td slot="body-cell-firstName" slot-scope="props" :props="props">
          {{props.row.firstName}}
          </q-td>
          	<q-td slot="body-cell-payments" slot-scope="props" :props="props">
          		<q-btn-dropdown label="Payment Records" size="sm">
          		<q-list highlight link dense v-for="(pay,i) in getModelsPaymentTransactions(props.row['.key'])" :key="i">
						  <q-item>
						    <q-item-main class="">₱ {{pay.transaction_amount}} - {{pay.title.slice(-10)}} - {{$moment(pay.create_time).format('ll')}}
						    </q-item-main>
						  </q-item>
						</q-list>
					</q-btn-dropdown>
          </q-td>
				</q-table>
			</div>
	</q-page>
</template>
<script>
import { CalendarView } from 'vue-simple-calendar'
import { CalendarAgenda } from 'quasar-calendar'

export default {
	components: {
		CalendarView,
		CalendarAgenda
	},
	mounted () {
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
	  this.$bindAsArray('payment_transactions', this.$database.ref('payment_transactions'))
	   this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))
	},
	computed: {
		getAllTransactions () {
			try {
				let payments = this.payment_transactions
				console.log('payment_transactions', payments)
				let group = this.$lodash.groupBy(payments,'modelKey')
				let keys = this.$lodash.keys(group)
				console.log('keys',keys)
				let withpay = []
				let list = this.contractsigned
				for(var x=0; x<keys.length; x++) {
					for(var y=0;y<list.length;y++) {
						if(keys[x] === list[y]['.key']) {
							withpay.push(list[y])
						}
					}
				}
				return withpay
			} catch (err) {
				console.log('err',err)
				return []
			}
		},
		agendaEventSchedules () {
			try {
				let activities = this.allEventSchedules
				// console.log('activities', activities)
				let mapAct = this.$lodash.map(activities, act => {
					if (act.type !== 'payment') {
						return {
							id: act.id,
							summary: act.title,
							description: act.details ? act.details : '',
							location: act.location ? act.location : '',
							start: {
								dateTime: new Date(act.startDate).toISOString()
							},
							end: {
								dateTime: new Date(act.endDate).toISOString()
							},
							color: 'faded'
						}
					}
				})
				let agendaActivities = this.$lodash.compact(mapAct)
				return agendaActivities
			} catch {
				return []	
			}
		}
	},
	data () {
		return {
			activity: {
		    originalEvent: {}
		  },
		  filter: '',
		  contractsigned: [],
		  payment_transactions: [],
			activityModal: false,
			schedules: [],
			viewMode: 'calendarMode',
			showEventTimes: true,
			showDate: new Date(),
			startingDayOfWeek: 0,
			        Modelcolumns: [
                {
                name: 'firstName',
                required: true,
                label: 'First Name',
                align: 'left',
                sortable: true,
                field: 'firstName'
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
                name: 'eventName',
                required: true,
                label: 'Event',
                align: 'left',
                sortable: true,
                field: 'eventName'
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
                name: 'balance',
                required: true,
                label: 'Remaining Balance',
                align: 'left',
                sortable: true,
                field: 'balance'
                },              
                {
                name: 'payments',
                required: true,
                label: 'Payment Transactions',
                align: 'left',
                sortable: true
                }
        ],
		}
	},
	methods: {
		setShowDate (d) {
			this.showDate = d
		},
		clickEvent (e) {
			this.activity.originalEvent = e.originalEvent
			this.activityModal = true
		},
		dropOnDate (e, d) {
		},
		test () {
			console.log('schedules', this.schedules)
			let activities = this.allEventSchedules
			console.log('activities', activities)
			let mapAct = this.$lodash.map(activities, act => {
				if (act.type !== 'payment') {
					return {
						id: act.id,
						summary: act.title,
						description: act.details ? act.details : '',
						location: act.location ? act.location : '',
						start: {
							dateTime: new Date(act.startDate).toISOString()
						},
						end: {
							dateTime: new Date(act.endDate).toISOString()
						},
						color: act.classes
					}
				}
			})
			let agendaActivities = this.$lodash.compact(mapAct)
			console.log('agendaActivities', agendaActivities)
		},
		returnModelData (key) {
			try {
					let list = this.contractsigned
					let model = this.$lodash.filter(list, e=> {
						return e['.key'] === key
					})
					console.log(model)
					return model[0]		
			} catch (err) {
				console.log('err')
			}
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
    }
	}
}
</script>