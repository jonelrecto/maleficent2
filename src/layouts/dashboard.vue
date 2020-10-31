<template>
  <div>
    <q-layout view="hhh Lpr lFf" >
			<!-- Header -->
			<q-layout-header reveal>
				<!-- First row of header is a QToolbar -->
				<q-toolbar color="dark">
					<!-- showLeft is a model attached to left side drawer below -->
					<q-btn
						flat round dense
						@click="showLeft = !showLeft"
						icon="menu"
					/>
					<!-- <q-btn label="test" @click="test" /> -->
					<q-toolbar-title>
						Maleficent Models Academy
						<!-- <span slot="subtitle">Optional subtitle</span> -->
					</q-toolbar-title>
					<!-- notification -->
					<q-btn flat dense icon="notifications">
						 <q-chip floating color="red">5</q-chip>
	      		<q-popover no-focus style="max-width: 500px" max-height="300px" anchor="bottom left" fit self="top right">
	      			<!-- <notification-module></notification-module> -->
					  </q-popover>
					</q-btn>
					<!-- message chat -->
					<q-btn flat dense icon="message" class="show-desktop" label="Messages">
							<q-chip floating color="red" v-if="GetTotalUnread">{{GetTotalUnread}}</q-chip>
	      					<q-popover no-focus anchor="bottom left" self="top left">
							<q-list separator link v-for="msgs in getMessagesFrom" :key="msgs['.key']">
								  <div @click="setUnreadTrue(msgs)">
								<q-item :to="'/chat/'+msgs.accountNumber">
									<q-item-side inverted :letter="returnLetter(msgs)" :color="returnLastColor(msgs)"/>
									<q-item-main :class="showBold(msgs.accountNumber)" :sublabel="returnLastMessage(msgs)" :label="returnFullName(msgs)">
										 <span class="q-caption">{{$moment(msgs.lastmsgdate).fromNow()}}<br></span>
									</q-item-main>
								</q-item>
							</div>
					    	</q-list>
							<q-list separator link class="bg-faded text-white" v-if="this.messages !== null">
								<q-item :to="'/chat/'+get1stMsg">
									<q-item-main class="capitalize text-center"  >See All Messages</q-item-main>
								</q-item>
					    	</q-list>
					    	<q-list separator link class="bg-secondary text-white" v-if="this.messages === null">
					    	<q-item >
									<q-item-main class="capitalize text-center"  >No Messages To Display</q-item-main>
								</q-item>
							</q-list>
					  </q-popover>
					</q-btn>
					<!-- message chat -->
					<q-btn @click="$router.push('/coursesSettings')" flat dense icon="build" label="Settings">
	      		<!-- <q-popover no-focus anchor="bottom left" self="top left">
					    <q-list separator link>
					      <q-item to="/coursesSettings">
					      	<q-item-side icon="local_activitys" />
							    <q-item-main label="Activity Settings" />
							  </q-item>
					    </q-list>
					  </q-popover>-->
					</q-btn>
					<q-btn
        	flat dense
        	icon="exit to app"
        	label="logout"
        	@click="logout"
      		/>
				</q-toolbar>

				<!-- Second row of header is a QTabs -->
			</q-layout-header>

			<!-- <q-layout-drawer v-model="showRight" content-class="bg-grey-3 flex " :content-style="{padding: '10px'}" side="right">
		  	<div>
		  		<q-btn rounded color="info" label="hide" icon="keyboard_arrow_right" class="flex flex-right" size="xs" @click="showRight=!showRight" ></q-btn>
		  		<q-btn label="test" @click="test()"/>
		  		<div>
		  			<span class="q-title text-weight-bold q-ma-md">{{dashEventName}}</span> <br/>
		  			<span class="q-title q-mx-md">Season {{seasonNumber}}</span>
		  			<q-tree
			        :nodes="batchNode"
			        node-key="label"
			        accordion
			        :selected.sync="selectNode"
			        default-expand-all
			      >

			        <div slot="default-header" slot-scope="prop" class="row items-center" @click="clickBatchNode(prop)">
			        	 <q-icon v-if="isBatchMissingDetails(prop)" name="warning" color="orange" size="28px" class="q-mr-sm" />
			          <div class="text-weight-bold text-primary">
			          	<q-icon v-if="isMissingDetails(prop)" name="warning" color="orange" size="28px" class="q-mr-sm" />
			          {{ prop.node.label }}</div>
			        </div>

			        <div slot="default-body" slot-scope="prop" >
			          <div v-if="prop.node.startDate">
			            <span class="text-weight-bold">Date</span>: {{ $moment(prop.node.startDate).format('ll') }}
			          </div>
								<div v-if="prop.node.amount">
			            <span class="text-weight-bold">Amount</span>: {{ prop.node.amount | currency}}
			          </div>
			          <div v-if="prop.node.dueDate">
			            <span class="text-weight-bold">Date End</span>: {{ $moment(prop.node.dueDate).format('ll') }}
			          </div>
			        </div>
			      </q-tree>
		  		</div>
		  		<div>
		  			<q-list link inset-separator class="q-ma-md">
			    		<q-list-header class="text-weight-thin">{{getEventName}} - Season {{seasonNumber}}</q-list-header>
						  <q-item  v-for="(act,i) in activities" :key="i" >
						  	<div @click="clickActivity(act)">
						  		<q-item-main>
							      <q-item-tile label>{{act.title}}</q-item-tile>
							      <q-item-tile v-if="act.type === 'photoliking'" sublabel>{{$moment(act.startDate).format('l')}} to {{$moment(act.endDate).format('l')}}</q-item-tile>
							      <q-item-tile v-if="act.type !== 'photoliking'"sublabel>{{$moment(act.startDate).format('llll')}}</q-item-tile>
							    </q-item-main>
						  	</div>
						  </q-item>
						</q-list>
					</div>
		  	</div>
		  </q-layout-drawer> -->
				<!-- Left Side Drawer -->
			<q-layout-drawer side="left" v-model="showLeft" class="inhouseModelsFonts" :content-class="$q.theme === 'mat' ? 'bg-grey-3' : null">
				<div padding style="width: 300px; max-width: 90vw;">
					<q-list inset-separator link>
					<q-list-header>
						<span class="header-logo">
<!--             <img alt="Quasar logo" src="~sta/quasar-logo-full.svg"> -->
            <i class="zmdi zmdi-landscape"></i>
          </span>
          <span class="header-title p-b-34 p-t-27">
            Welcome!
          </span>
					</q-list-header>
					<q-item-separator />

					<q-item to="/modelRegistration" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="directions_walk"></q-item-tile>
						</q-item-side>
						<q-item-main label="Walk-in Model" />
					</q-item>
          <!-- v-if="isDashAccess" -->
					<q-item  to="/dashboard" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="assessment"></q-item-tile>
						</q-item-side>
						<q-item-main label="Dashboard" />
					</q-item>

					<q-item v-if="isEventAccess" to="/events" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="event_note" ></q-item-tile>
						</q-item-side>
						<q-item-main label="Events" />
					</q-item>

					<!-- <q-item to="/seasons" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="loop" ></q-item-tile>
						</q-item-side>
						<q-item-main label="Season/Cycle" />
					</q-item> -->

					<!-- <q-collapsible icon="schedules" label="Schedules" >
				  	<q-item to="/schedules" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="create" color="primary"></q-item-tile>
							</q-item-side>
							<q-item-main label="Create Schedule" />
						</q-item>
						<q-item to="/allSchedules" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="calendar_today" color="primary"></q-item-tile>
							</q-item-side>
							<q-item-main label="All Schedules" />
						</q-item>
						<q-item to="/batchlist" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="format_list_numbered" color="primary"></q-item-tile>
							</q-item-side>
							<q-item-main label="Batch List" />
						</q-item>
				  </q-collapsible> -->


					<q-item v-if="isAttendanceAccess" to="/allAttendances" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="date_range"></q-item-tile>
						</q-item-side>
						<q-item-main label="Attendance" />
					</q-item>

					<q-item v-if="isContractSignedAccess" to="/contractsigned" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="assignment_turned_in"></q-item-tile>
						</q-item-side>
						<q-item-main label="Contract Signing" />
					</q-item>

					<q-item v-if="isRescheduleAccess" to="/reschedule" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="restore"></q-item-tile>
						</q-item-side>
						<q-item-main label="Reschedule" />
					</q-item>

					<q-item v-if="isModelsAccess" to="/models" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="assignment_ind" ></q-item-tile>
						</q-item-side>
						<q-item-main label="Manage Models" />
					</q-item>

					<q-item v-if="isModelsAccess" to="/showcasingSelection" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="star" ></q-item-tile>
						</q-item-side>
						<q-item-main label="Model Showcasing" />
					</q-item>

					<q-item v-if="isSchedulesAccess" to="/allEventSchedules" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="today" ></q-item-tile>
						</q-item-side>
						<q-item-main label="All Schedules" />
					</q-item>

					<q-item v-if="isPaymentRecordsAccess" to="/allEventPayments" class="item-height bg-grey-3">
						<q-item-side >
							<q-item-tile icon="payment"></q-item-tile>
						</q-item-side>
						<q-item-main label="Payment Records" />
					</q-item>

					<q-item v-if="isSMSNotifAccess" to="/allSMS" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="stay_primary_portrait"></q-item-tile>
						</q-item-side>
						<q-item-main label="Manage SMS Notifier" />
					</q-item>

					<q-collapsible v-if="isReportAccess" icon="assignment" label="Reports" >
						<q-item to="/reports" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="timeline" ></q-item-tile>
							</q-item-side>
							<q-item-main label="HitRate" />
						</q-item>

						<q-item to="/paymentReports" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="money" ></q-item-tile>
							</q-item-side>
							<q-item-main label="Payments" />
						</q-item>

						<q-item to="/contractSignedReports" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="people" ></q-item-tile>
							</q-item-side>
							<q-item-main label="Models" />
						</q-item>

						<q-item to="/sales" class="item-height bg-grey-3">
							<q-item-side>
								<q-item-tile icon="attach money" ></q-item-tile>
							</q-item-side>
							<q-item-main label="Sales" />
						</q-item>
					</q-collapsible>


					<q-item v-if="userRole === 'admin'" to="/users" class="item-height bg-grey-3">
						<q-item-side>
							<q-item-tile icon="group" ></q-item-tile>
						</q-item-side>
						<q-item-main label="Users" />
					</q-item>

				</q-list>
			</div>
			</q-layout-drawer>

			<!-- sub-routes get injected here: -->
			<q-page-container>
				<!-- <q-btn @click="startUpConfig" /> -->
				<router-view />
			</q-page-container>

			<!-- Footer -->
			<!-- <q-layout-footer>
				<q-toolbar-title>
					Layout Footer
				</q-toolbar-title>
			</q-layout-footer> -->
		</q-layout>
  </div>
</template>
<script>
import NotificationModule from '../components/notification.vue'

export default {
	components: {
		NotificationModule
	},
	created () {
		this.eventKey = this.$route.params.id
		this.seasonNumber = this.$route.params.seasonNumber
		// console.log('has user?', this.$q.localStorage.has('user'))
		if (this.$q.localStorage.has('user')) {
			let user2 = this.$q.localStorage.get.item('user')
			// console.log('user authenticated', this.$q.localStorage.get.item('user'))
			this.$bindAsArray('events', this.$database.ref('events'))
			this.$bindAsArray('courses', this.$database.ref('settings/courses'))
			this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
			this.$bindAsArray('contractsigned', this.$database.ref('contractSigned'))
			this.$bindAsArray('messages', this.$database.ref('messages'))
			this.$bindAsArray('first3', this.$database.ref('messages').orderByKey().limitToFirst(3))
			this.$bindAsArray('users3', this.$database.ref('users'))
      this.$bindAsArray('userLoggedIn', this.$database.ref(`users`).orderByKey().equalTo(user2))
			this.$store.state.startUp.courses = this.courses
			this.$store.state.startUp.events = this.events
			this.$store.state.startUp.schedules = this.schedules
			this.$store.state.startUp.contractSigned = this.contractsigned
			// console.log('userLoggedIn', this.userLoggedIn)
			this.$store.state.startUp.userLoggedIn = this.userLoggedIn[0]
			// this.$store.state.startUpConfig.registeredModels = this.registeredModels
			// this.startUpConfig
			// this.$router.push('/')
		}
		else {
			this.$router.push('/')
		}
	},
	mounted () {
		this.startUpConfig
		// console.log('startup in /', this.$store.state.startUp)
		// console.log('models', this.registeredModels)
	},
	MessageCounter: {
   		handler (newVal, oldVal) {
      	// console.log('old', oldVal)
      	// console.log('new', newVal)
  	},
   	deep: true
	},
	watch: {
		// showRight: {
		// 	handler () {
		// 		try {
		// 			// console.log('watching')
		// 			let event = this.$store.getters['startUp/getEvent'](this.eventKey).eventName
		// 			// console.log('event', event)
		// 			this.dashEventName = event
		// 		} catch {}
		// 	},
		// 	deep: true
		// },
		// userLoggedIn: {
		// 	handler () {
    //     if (typeof this.userLoggedIn[0] === 'undefined') {
		// 			this.$q.loading.show()
		// 			// console.log('user watch', this.userLoggedIn[0])
		// 			// console.log('user has no data')
		// 		} else {
    //       this.$q.loading.hide()
		// 			// console.log('user has now has a data')
		// 			// this.notifyUsers()
    //     }
		// 	},
		// 	deep: true
		// },
    // resourceLoad: {
    //   handler () {
    //     if (this.resourceLoad) {
    //       this.$q.loading.hide()
    //     } else {
    //       this.$q.loading.show()
    //     }
    //   },
    //   deep: true
    // }
	},
	computed: {
		isReportAccess () {
			try {
				return this.userLoggedIn[0].userAccess.reports
			} catch {
				return false
			}
		},
		isSMSNotifAccess () {
			try {
				return this.userLoggedIn[0].userAccess.smsNotifier
			} catch {
				return false
			}
		},
		isPaymentRecordsAccess () {
			try {
				return this.userLoggedIn[0].userAccess.paymentRecords
			} catch {
				return false
			}
		},
		isSchedulesAccess () {
			try {
				return this.userLoggedIn[0].userAccess.schedules
			} catch {
				return false
			}
		},
		isModelsAccess () {
			try {
				return this.userLoggedIn[0].userAccess.models
			} catch {
				return false
			}
		},
		isRescheduleAccess () {
			try {
				return this.userLoggedIn[0].userAccess.resched
			} catch {
				return false
			}
		},
		isContractSignedAccess () {
			try {
				return this.userLoggedIn[0].userAccess.contractSigned
			} catch {
				return false
			}
		},
		isAttendanceAccess () {
			try {
        // console.log('userlogin', this.userLoggedIn)
				return this.userLoggedIn[0].userAccess.attendance
			} catch {
				return false
			}
		},
		isEventAccess () {
			try {
				return this.userLoggedIn[0].userAccess.events
			} catch {
				return false
			}
		},
		isDashAccess () {
			try {
				return this.userLoggedIn[0].userAccess.dashboard
			} catch {
				return false
			}
		},
		userRole () {
			try {
				return this.userLoggedIn[0].role
			} catch {
				return ''
			}
		},
		userAccess () {
			try {
				return this.userLoggedIn[0].userAccess
			} catch {
				return {}
			}
		},
		get1stMsg () {
			try {
				// console.log('1stMessageToShow', this.getMessages[0].accountNumber)
				return this.getMessages[0].accountNumber
			}
			catch (err) {
				return null
			}
		},
		getCount () {
			let count = []
			try {
				for (var i = 0; i < this.messages.length; i++) {
					var num = Object.assign({}, this.messages[i])
					let counter = Object.keys(num).length - 1
					count.push({count: counter,key: num['.key']})
				}
				// console.log('countMSGS', count)
				return count
			} catch (error) {
				return null
			}
		},
		getMessages () {
			let accounts = []
			try {
				for (var i = 0; i < this.contractsigned.length; i++) {
				var s = Object.assign([], this.contractsigned[i])
					for (var j = 0; j < this.first3.length; j++) {
						var msgs = Object.assign([], this.first3[j])
						if(s.accountNumber === msgs['.key']){
                            delete msgs['.key']
							accounts.push(Object.assign({}, s,{msgs}))
						}
					}
				}
				// console.log('accts', accounts)
				return accounts
			} catch (err) {
				return null
			}
		},
		GetTotalUnread () {
			try {
				let total = this.$lodash.sumBy(this.MessageCounter, 'count')
				if (total === 0) {
					return 0
				} else {
					return total
				}
			} catch (error) {
				return null
			}
		},
		MessageCounter () {
			try {
				// console.log('mes', this.messages[0])
				let counter = []
				for (var x = 0; x < this.messages.length; x++) {
					let accntNumber = this.messages[x]['.key']
					let keys = Object.keys(this.messages[x])
					let mess = []
					for (var i = 0; i < keys.length-1; i++) {
						mess.push({...this.messages[x][keys[i]]})
					}
					let filtered = this.$lodash.filter(mess, m => {
						return m.to === 'Model Coordinator' && m.seen === false
					})
					counter.push({count: filtered.length, key: accntNumber})
				}
				// console.log('COUNTER', counter)
				return counter
			} catch (error) {
				return null
			}
		},
		activityModal: {
			get () {
				return this.$store.state.users.activityModal2
			},
			set (v) {
				this.$store.state.users.activityModal2 = v
			}
		},
		activity: {
			get () {
				return this.$store.state.users.activity
			},
			set (v) {
				this.$store.state.users.activity = v
			}
		},
		batchNode: {
			get () {
				// console.log('batch node', this.$store.state.users.batchesNode)
				return this.$store.state.users.batchesNode
			},
			set (v) {
				this.$store.state.users.batchNode = v
			}
		},
		isCalendarView () {
			return this.viewMode === 'calendarMode'
		},
		viewMode: {
			get () {
				return this.$store.state.users.viewMode
			},
			set (v) {
				this.$store.state.users.viewMode = v
			}
		},
		getSeasonBatches () {
			let sched = [...this.$store.state.startUp.schedules]
			let batch = this.$lodash.filter(sched, s => {
				return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
			})
			return batch
		},
		getMessagesFrom () {
			let accounts = []
			try {
				for (var i = 0; i < this.contractsigned.length; i++) {
				var s = Object.assign([], this.contractsigned[i])
					for (var j = 0; j < this.messages.length; j++) {
                        var msgs = Object.assign({}, this.messages[j])
                        // var msgs = Object.values(this.allMessage[j])
						if(s.accountNumber === msgs['.key']){
                            delete msgs['.key']
							accounts.push(Object.assign({}, s,{msgs: Object.values(msgs)}))
						}
					}
				}

                for(var x =0 ; x < accounts.length; x++) {
                    let index = accounts[x].msgs.length-1
                    let date = new Date(accounts[x].msgs[index].dateTime)
                    accounts[x].lastmsgdate = date
                    accounts[x].lastmessage = accounts[x].msgs[index].msg
                    accounts[x].lastmsgcolor = accounts[x].msgs[index].color
                    accounts[x].lastmsgtext = accounts[x].msgs[index].text
                    accounts[x].lastmsgto = accounts[x].msgs[index].to
                }
                let sorted = this.$lodash.orderBy(accounts,['lastmsgdate'],['desc'])
                // console.log('getMessagesFrom',sorted)
				return sorted.slice(0,3)
			} catch (err) {
        return null
      }
    },
		activities () {
			let sortByDate = this.$lodash.sortBy(this.$store.state.users.newSeasonActivities, 'startDate');
			return sortByDate
		},
		showRight: {
			get () {
				return this.$store.state.users.showRight
			},
			set (v) {
				this.$store.state.users.showRight = v
			}
		},
		startUpConfig () {
			this.$bindAsArray('this.$store.state.startUp.courses', this.$database.ref('settings/courses'))
			// try {
			// 	this.$bindAsArray('registeredModels', this.$database.ref('models'))
			// 	let models = [...this.registeredModels]
			// 	console.log('models', this.registeredModels)
			// 	for(var i = 0; i < this.registeredModels.length; i++) {
			// 		for (var j = 0; j < this.registeredModels[i].activitiesAttended.length; j++) {
			// 			if (this.registeredModels[i].activitiesAttended[j].type === 'orientation') {
			// 				let orientation = this.registeredModels.activitiesAttended[j]
			// 				if (this.registeredModels[i].activitiesAttended[j].status) {
			// 					let model = this.registeredModels[i]
			// 					let key = model['.key']
			// 					delete model['.key']
			// 					console.log('found models already oriented', key)
			// 					let self = this
			// 					this.$database.ref('showUpModels').child(key).set(model)
			// console.log('test', this.$store.state.users.newSeasonActivities)
			// console.log('num of batches', this.getSeasonBatches)
			let activities = this.$store.state.users.newSeasonActivities
			let groupedBatch = new Array()
			for (var i = 1; i <= this.getSeasonBatches.length; i++) {
				var bat = this.$lodash.filter(activities, a => {
					return a.batch === i
				})
				groupedBatch.push(bat)
			}
			// console.log('grouped', groupedBatch)
			/*
			customize: [
	      {
	        label: 'Satisfied customers',
	        header: 'root',
	        children: [
	          {
              label: 'Quality ingredients',
              header: 'generic',
              body: 'story',
              story: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt exercitationem quam est ea optio, rem placeat veritatis commodi dignissimos aspernatur labore, asperiores facilis dicta. Veniam enim molestiae odit obcaecati eum.'
            },
            {
              label: 'Good recipe',
              body: 'story',
              story: 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.'
            }
	        ]
	      }
	    ],*/
	    // console.log('index', key)
	    let sortedBatch = new Array()
			for (var j = 0; j < groupedBatch.length; j++) {
				var bnum = j
				bnum++
				let bat = {
					label: 'Batch ' + bnum,
					children: new Array()
				}
				let childs = new Array()
				for (var k = 0; k < groupedBatch[j].length; k++) {
					let mapChild = {
						label: this.$store.getters['startUp/hasNumber'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) ? this.$store.getters['startUp/titleCase'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) : this.$store.getters['startUp/titleCase'](groupedBatch[j][k].type),
						startDate: groupedBatch[j][k].startDate.toString(),
						endDate: groupedBatch[j][k].endDate.toString(),
						amount: groupedBatch[j][k].amount ? groupedBatch[j][k].amount : '',
						dueDate: groupedBatch[j][k].dueDate ? groupedBatch[j][k].dueDate : '',
					}
					childs.push(mapChild)
				}
				bat.children = childs
				sortedBatch.push(bat)
			}
			// console.log('sortedbat', sortedBatch)
			this.customize = sortedBatch
			// console.log('test', this.$store.getters['startUp/get3rdAfterUnderline']('TFF(1)_batch(1)_orientation'))// 						.then(() => {
			// 							self.$database.ref('models').child(key).remove()
			// 								.then(() => {
			// 									console.log('model is transfered')
			// 								})
			// 						})
			// 						.catch((err) => {
			// 							console.log('an error occur on transfering')
			// 						})
			// 				}
			// 			}
			// 		}
			// 	}
			// } catch {}

		}
	},
	data () {
		return {
      resourceLoad: false,
			users3: [],
			userLoggedIn: {},
			users: [],
			dashEventName: '',
			contractsigned: [],
			messages: [],
			first3: [],
			selectNode: '',
			customize: [],
			eventKey: '',
			seasonNumber: 0,
			registeredModels: [],
			events: [],
			courses: [],
			schedules: [],
			user: {},
			showLeft: false
		}
	},
  async asyncData () {
    await this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
    return {}
  },
	methods: {
    loadEventSchedules: async function () {
      let data = new Array()
      let promise = new Promise((resolve, reject) => {
        this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
      })
       this.$store.state.startUp.schedules =  await promise
       return await promise
    },
    loadResourses: async function () {
      // let promise = new Promise((resolve, reject ) => {
      //
      //   console.log('loadEventSchedules', this.loadEventSchedules)
      //   if (this.loadEventSchedules) {
      //     console.log('im done loading')
      //     resolve(true)
      //   }
      // })
      // console.log('eventSchedules', this.schedules)
      // this.resourceLoad = await promise
      this.loadEventSchedules()
      // console.log('schedules in soter', this.$store.state.startUp.schedules)
      this.resourceLoad = true
    },
		isBatchMissingDetails (p) {
			// console.log('p head', p)
			if (p.node.children) {
				let childrens = p.node.children
				for (var i = 0; i < childrens.length; i++) {
					if ((childrens[i].location === '' || childrens[i].details === '') && (childrens[i].type !== 'payment' && childrens[i].type !== 'photoliking' && childrens[i].type !== 'orientation')) {
						return true
					}
				}
			}
			return false
		},
		isMissingDetails (p) {
			// console.log('p', p)
			let location = typeof p.node.location !== 'undefined' ? p.node.location : false
			let details = typeof p.node.details !== 'undefined' ? p.node.details : false
			// console.log('loc det', location, details)
			if ((location === '' || details === '') && (p.node.type !== 'payment' && p.node.type !== 'photoliking' && p.node.type !== 'orientation')) {
				return true
			}
			return false
		},
		getEventName () {
			try {
				let event = this.$store.getters['startUp/getEvent'](this.eventKey).eventName
				// console.log('ervent name', event)
				this.dashEventName = event.eventName
				return event
			} catch (err) {
				// console.log('dash error', err)
				return ''
			}
		},
		returnFullName (s) {
			try {
				let full = this.$lodash.capitalize(s.firstName) + ' ' + this.$lodash.capitalize(s.lastName)
				return full
			} catch (err) {
				return ''
			}
		},
		returnLastMessage (s) {
        try {
            let full = s.lastmessage.toString()
            if(s.lastmsgto === 'Model Coordinator') {
                if(full.length > 45) {
                    return full.slice(0,45) + ' [. . .]'
                } else {
                    return full
                }
            } else {
                let msg = 'You: ' + full
                if(full.length > 45) {
                    return msg.slice(0,45) + ' [. . .]'
                } else {
                    return msg
                }
            }
        } catch (err) {
            return ''
        }
     },
	  returnLastColor (s) {
      try {
          let admin = s.lastmsgtext
          let model = s.lastmsgcolor
          if (s.lastmsgto !== 'Model Coordinator') {
              return 'light'
          } else {
              return model
          }
      } catch (err) {
        return ''
      }
	  },
	  returnLetter (s) {
      try {
          let full = s.firstName
          let letter = this.$lodash.filter(full, e=> {
              return e
          })
          return letter[0].toUpperCase()
      } catch (err) {
          return ''
      }
    },
    showBold (e) {
      let count = 0
      try {
          for (var x = 0; x < this.MessageCounter.length; x++) {
              let key = this.MessageCounter[x].key
          if (key === e) {
              count = this.MessageCounter[x].count
          }
          }
          if(count === 0) {
              return 'q-body-1'
          } else {
              return 'text-weight-bolder q-body-1'
          }
      } catch (error) {
      }
    },
		clickBatchNode (p) {
			// console.log('p', p)
			this.activity.originalEvent = p.node
			this.activityModal = !this.activityModal
		},
		test2 (p) {
			console.log('clicked node', p)
			// console.log('test', this.$store.state.users.newSeasonActivities)
			// console.log('num of batches', this.getSeasonBatches)
			// let activities = this.$store.state.users.newSeasonActivities
			// let groupedBatch = new Array()
			// for (var i = 1; i <= this.getSeasonBatches.length; i++) {
			// 	var bat = this.$lodash.filter(activities, a => {
			// 		return a.batch === i
			// 	})
			// 	groupedBatch.push(bat)
			// }
			// console.log('grouped', groupedBatch)
			/*
			customize: [
	      {
	        label: 'Satisfied customers',
	        header: 'root',
	        children: [
	          {
              label: 'Quality ingredients',
              header: 'generic',
              body: 'story',
              story: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt exercitationem quam est ea optio, rem placeat veritatis commodi dignissimos aspernatur labore, asperiores facilis dicta. Veniam enim molestiae odit obcaecati eum.'
            },
            {
              label: 'Good recipe',
              body: 'story',
              story: 'A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him.'
            }
	        ]
	      }
	    ],*/
	    // console.log('index', key)
	  //   let sortedBatch = new Array()
			// for (var j = 0; j < groupedBatch.length; j++) {
			// 	var bnum = j
			// 	bnum++
			// 	let bat = {
			// 		label: 'Batch ' + bnum,
			// 		children: new Array()
			// 	}
			// 	let childs = new Array()
			// 	for (var k = 0; k < groupedBatch[j].length; k++) {
			// 		let mapChild = {
			// 			label: this.$store.getters['startUp/hasNumber'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) ? this.$store.getters['startUp/titleCase'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) : this.$store.getters['startUp/titleCase'](groupedBatch[j][k].type),
			// 			startDate: groupedBatch[j][k].startDate.toString(),
			// 			endDate: groupedBatch[j][k].endDate.toString(),
			// 			amount: groupedBatch[j][k].amount ? groupedBatch[j][k].amount : '',
			// 			dueDate: groupedBatch[j][k].dueDate ? groupedBatch[j][k].dueDate : '',
			// 		}
			// 		childs.push(mapChild)
			// 	}
			// 	bat.children = childs
			// 	sortedBatch.push(bat)
			// }
			// console.log('sortedbat', sortedBatch)
			// this.customize = sortedBatch
			// console.log('test', this.$store.getters['startUp/get3rdAfterUnderline']('TFF(1)_batch(1)_orientation'))
		},
		clickActivity (act) {
			console.log('act in dash', act)
			this.$store.state.users.activity.originalEvent = act
			this.$store.state.users.activityModal2 = true
		},
		logout () {
			this.$auth.signOut().then(() => {
        console.log('Logout Successfull')
        this.$store.state.userType = ''
        this.$router.push('/')
        this.$q.localStorage.remove('user')
      })
		},
		setUnreadTrue (e) {
      let model = e
      this.$bindAsArray('getModelMessages', this.$database.ref('messages/'+model.accountNumber))
				for (var y=0; y < this.getModelMessages.length; y++) {
          if (this.getModelMessages[y].to === 'Model Coordinator' && this.getModelMessages[y].seen === false){
              this.$database.ref('messages/' + model.accountNumber + '/' + this.getModelMessages[y]['.key'] + '/seen').set(true)
          }
      	}
       console.log('clicked & set true')
     },
		test () {
			// console.log('act in dash', this.activities)
			// var batch = /^(?:[^_]+_){1}([^_ ]+)/
			// var sample = 'TFF(1)_batch(1)_orientation'
			// console.log('test', sample.match(batch))
			// console.log('batch nodes', this.selectNode)

      // let scheds = this.loadEventSchedules
      // this.$bindAsObject('schedules', this.$database.ref('event_schedules'))
      //   .then(() => {
      //     console.log('schedules', this.schedules)
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })

      let source = this.$database.ref('events')
      this.$store.dispatch('startUp/setItemsRef', source)
      console.log('events', this.$store.state.startUp.events)
		}
	}
}
</script>
<style scoped>
.inhouseModelsFonts{
  font-family: 'Raleway', sans-serif;
  margin: 0; padding: 0;
  box-sizing: border-box;
  }

.header-logo {
  font-size: 60px;
  color: #333333;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: white;
  background-image: url("/assets/mma.png");
  background-repeat: no-repeat;
  background-size: 110px 35px;
  background-position: center;
  margin: 0 auto;
}
.header-title {
  font-family: Poppins-Medium;
  font-size: 30px;
  color: black;
  text-align: center;
  text-transform: uppercase;

  display: block;
}
.item-height {
	height: 44px;
	max-height: 90vw;
}
</style>
