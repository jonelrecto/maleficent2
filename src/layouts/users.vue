<template>
	<div>
    <q-toolbar color="faded">
      <q-toolbar-title>
				Users
				<!-- <span slot="subtitle">Optional subtitle</span> -->
			</q-toolbar-title>
			<!-- <q-btn label="test" @click="test"/> -->
		</q-toolbar>
		<!-- data table -->
			<div class="layout-padding">
				<q-table
          grid
			    :data="getUsers"
          :loading="tableLoading"
			    :columns="columns"
          :filter="filter"
          :pagination.sync="pagination"
			    row-key="code"
			  >
	        <!-- search -->
	        <template slot="top-right" slot-scope="props">
	          <q-search
	            color="secondary"
	            v-model="filter"
	            class="col-10"
	          />
	        </template>
	        <q-td slot="body-cell-userAccess" slot-scope="props" :props="props">
	        	<ul v-for="(value, key) in props.row.userAccess" :key="key" >
	        		<li v-if="value">{{key}}</li>
	        	</ul>
	        </q-td>
	        <!-- activation button -->
					<q-td slot="body-cell-activated" slot-scope="props2" :props="props2" >
	          <q-toggle v-if="props2.row.role != 'admin'" v-model="props2.row.activated"  color="teal-8" @input="activate(props2.row)" />
	        </q-td>
	        <!-- action button -->
	        <q-td slot="body-cell-actions" slot-scope="props" :props="props">
	            <q-btn v-if="props.row.role != 'admin'" icon="edit" size="sm" color="secondary" label="edit" @click="editUser(props.row)" />
	            <q-btn v-if="props.row.role != 'admin'" color='negative' size="sm" label="remove" icon="delete" @click="removeUser(props)" />
	          </q-td>
	        </q-table>
			</div>
			<!-- sticky button -->
			<q-page-sticky position="bottom-right" :offset="[60, 18]">
			  <q-btn
			    round
			    size="lg"
			    color="primary"
			    @click="newUserModal = true"
			    icon="perm_identity"
			  />
			</q-page-sticky>
			<!-- event modal -->
			<q-modal v-model="newUserModal" :content-css="{maxWidth: '50vw', maxHeight: '95vh'}" @hide="clearUserModal">
				<!-- modal layout -->
		    <q-modal-layout
		    	content-style="{fontSize: '20px', fontWeight: 'bold'}"
			    content-class="bg-white"
			  >
			  <!-- layout content -->
			  <!-- header -->
			    <q-toolbar slot="header">
			    	<q-toolbar-title>
							{{isEdit ? 'Edit User': 'Add New User'}}
						</q-toolbar-title>
			    </q-toolbar>
			    <!-- content -->
			    	<div class="q-pa-md q-pa-xm">
			    		<q-input v-model="newUser.firstName" stack-label="First Name" class="q-my-md"/>
			        <q-input v-model="newUser.lastName" stack-label="Last Name" class="q-my-md"/>
			        <q-select
			          v-model="newUser.role"
			          float-label="Role"
			          radio
			          :options="roleOptions"
			          class="fields"
			        />
			        <q-input :disable="isEdit" v-model="newUser.username" type="email" stack-label="Username" class="q-my-md"/>
			        <q-input v-show="!isEdit" v-model="newUser.password" type="password" stack-label="Password" class="q-my-md"/>
			        <q-input v-show="!isEdit" v-model="confirmPassword" type="password" stack-label="Confirm Password" class="q-my-md"/>
						<q-field label="User Access" helper="Select User accessibility" icon="accessibility">

							<q-checkbox class="q-ma-md" v-model="newUser.userAccess.walkin" label="Walk in" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.events" label="Events" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.attendance" label="Attendance" />	
							<q-checkbox class="q-ma-md" v-model="newUser.userAccess.contractSigned" label="Contract Signed" />
							<q-checkbox class="q-ma-md" v-model="newUser.userAccess.resched" label="Reschedule" />
							<q-checkbox class="q-ma-md" v-model="newUser.userAccess.models" label="Models" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.allSchedule" label="All Schedules" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.paymentRecords" label="Payment Records" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.smsNotifier" label="SMS Notifier" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.reports" label="Reports" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.showcasing" label="Model Showcasing" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.messages" label="Messages" />
		        	<q-checkbox class="q-ma-md" v-model="newUser.userAccess.settings" label="Settings" />
			      </q-field>

			    	</div>
            
            <div slot="footer">
            	<!-- add button -->
	            <q-btn
	              v-if="!isEdit"
	              class="full-width textbox"
	              color="primary"
	              @click="addNewUser"
	              label="Save"
	            />
            	<!-- edit button -->
            	<q-btn
	              v-if="isEdit"
	              class="full-width"
	              color="info"
	              @click="updateUser"
	              label="Update"
	            />
	            <!-- reset password-->
            <!-- 	<q-btn
	              v-if="isEdit"
	              class="full-width"
	              color="secondary"
	              @click=""
	              label="Reset Password"
	            /> -->
            </div>
            <!-- spinner loading -->
            <q-inner-loading :visible="loading">
              <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
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
		this.$bindAsArray('users', this.$database.ref('users'))
	},
	computed: {
		getUsers () {
			try {
				let filterUsers = this.$lodash.filter(this.users, u => {
					return !u.deletedAccount && u.role !== 'admin'
				})
				return filterUsers
			} catch {
				return []
			}
		},
		getActivated: {
			get () {
				return 
			}
		}
	},
	data () {
		return {
			users: [],
			newUserModal: false,
			newUser: {
				firstName: '',
				lastName: '',
				role: '',
				username: '',
				email: '',
				password: '',
				activated: false,
				userAccess: {
					walkin: false,
					showcasing: false,
					events: false,
					attendance: false,
					contractSigned: false,
					resched: false,
					models: false,
					allSchedule: false,
					paymentRecords: false,
					smsNotifier: false,
					reports: false,
					messages: false,
					settings: false
				}
			},
			roleOptions: [
				// { label: 'Administrator', value: 'admin'},
				{ label: 'Secretary', value: 'secretary'},
				{ label: 'Staff', value: 'staff'},
			],
			confirmPassword: '',
			isEdit: false,
			filter: '',
			loading: false,
			tableLoading: false,
			columns: [
				{
          name: 'lastName',
          required: true,
          label: 'Last Name',
          align: 'center',
          field: 'lastName',
          sortable: false
        },
        {
          name: 'firstName',
          required: true,
          label: 'First Name',
          align: 'center',
          field: 'firstName',
          sortable: false
        },
        {
          name: 'email',
          required: true,
          label: 'Username',
          align: 'center',
          field: 'username',
          sortable: false
        },
        {
          name: 'role',
          required: true,
          label: 'Role',
          align: 'center',
          field: 'role',
          sortable: false
        },
        {
          name: 'userAccess',
          required: true,
          label: 'User Access',
          align: 'left',
          sortable: false
        },
        {
          name: 'activated',
          required: true,
          label: 'Activated',
          align: 'center',
          sortable: false
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
		removeUser (p) {
			console.log('p', p)
			let lName = p.row.lastName
			let userKey = p.row['.key']
			this.$database.ref(`users`).child(userKey).remove()
				.then(() => {
					this.$q.notify({
            message: `${lName} has been deleted`,
            type: 'info',
            color: 'info',
            textColor: 'white',
            icon: 'info'
          })
          this.$forceUpdate()
				})
				.catch(err => {
					this.$q.notify({
            message: `An error occur ${err}`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'info'
          })
				})
		},
		activate (data) {
			console.log(data)
			let key = data['.key']
			var status = data.activated
			this.$database.ref(`users/${key}/activated`).set(status)
				.then(() => {
					this.$q.notify({
            message: status ? `${data.lastName} has been activated`: `${data.lastName} has been deactivated`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
				})
				.catch((err) => {
					this.$q.notify({
            message: `An error occured`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'warning'
          })
					console.log(err)
				})
		},
		listUserAccess (o) {
			let objects = Object.keys(o)
			return objects
		},
		clearUserModal () {
			this.isEdit = false
			this.newUser.firstName = ''
			this.newUser.lastName = ''
			this.newUser.role = ''
			this.newUser.username = ''
			this.newUser.email = ''
			this.newUser.password = ''
			this.confirmPassword = ''
			this.newUser.events = false
			this.newUser.attendance = false
			this.newUser.contractSigned = false
			this.newUser.resched = false
			this.newUser.models = false
			this.newUser.allSchedule = false
			this.newUser.paymentRecords = false
			this.newUser.smsNotifier = false
			this.newUser.reports = false
			this.newUser.portfolio = false
		},
		addNewUser () {
			this.$q.dialog({
				title: 'Confirm',
			  message: 'Do you want to save user?',
			  ok: 'Save',
			  cancel: 'Cancel'
			})
			  .then(() => {
					this.newUser.email = this.newUser.username + '@maleficent.com'
					let data = this.newUser
		      let self = this
					this.loading = true
		      console.log('create data', data)
		      self.$auth2.createUserWithEmailAndPassword(data.email, data.password)
		        .then((user) => {
		        	setTimeout(() => {
		        		let userData = Object.assign({}, user.user)
			          console.log('user', userData.uid)
			          delete data['confirmPassword']
			          delete data['password']
			          self.$database.ref('users').child(userData.uid).set(data)
			          	.then(u => {
				            this.$q.notify({
				              message: `User has been successfully added`,
				              type: 'positive',
				              color: 'positive',
				              textColor: 'white',
				              icon: 'info'
				            })
				            this.newUserModal = false
				            this.loading = false
				          })
			            .catch(error => {
			              this.$q.notify({
			                message: `An error occured in adding to database${error}`,
			                type: 'negative',
			                color: 'negative',
			                textColor: 'white',
			                icon: 'warning'
			              })
			              this.loading = false
			            })	
		        	}, 3000)
		        })
		        .catch(error => {
		        	// error on adding new user in auth
		          console.log('error', error.message)
		          this.$q.notify({
		            title: 'Error Occured',
		            message: `${error.message}`,
		            type: 'negative',
		            color: 'negative',
		            textColor: 'white',
		            icon: 'warning'
		          })
		          this.loading = false
		        })
			  })
			  .catch(() => {})
		},
		editUser (u) {
			let data = {...u}
			this.newUser = data
			this.newUserModal = true
			this.isEdit = true
		},
		updateUser () {
			this.$q.dialog({
				title: 'Confirm',
			  message: 'Do you want to update user?',
			  ok: 'Update',
			  cancel: 'Cancel'
			})
			  .then(() => {
			    // Picked "OK"
			  })
			  .catch(() => {
			    // Picked "Cancel" or dismissed
			  })
			let data = {...this.newUser}
			var key = data['.key']
			delete data.__index
			delete data['.key']
			console.log('user', data)
			this.$database.ref(`users/${key}`).update(data)
				.then(() => {
					this.$q.notify({
            message: `${data.lastName} has been updated`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
          
				})
				.catch((err) => {
					this.$q.notify({
            message: `An error occured`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'warning'
          })
					console.log(err)

				})
			this.newUserModal = false
      this.isEdit = false
		},
		test () {
			console.log('getUsers', this.getUsers)
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