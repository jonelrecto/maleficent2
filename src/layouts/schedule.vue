<template>
	<div>
		<q-toolbar color="faded">
			<q-toolbar-title>
				Create Schedule
			</q-toolbar-title>
			<q-btn v-if="!$store.state.schedules.isCreateNewBatch" rounded inverted color="primary" @click="newBatchModal">Create New Batch</q-btn>
			<q-toggle 
				unchecked-icon="visibility_off"
	 			checked-icon="visibility" class="center" 
	 			v-if="$store.state.schedules.isCreateNewBatch"
	 			v-model="isSeeAllSchedules" 
	 			label="View All Schedules" 
	 		/>
			<!-- <span v-if="$store.state.schedules.isCreateNewBatch">Click Date to Add Activity</span> -->
			<q-btn v-if="$store.state.schedules.isCreateNewBatch" class="q-mx-md" rounded inverted color="secondary" @click="saveBatchSchedule">Save</q-btn>
			<q-btn v-if="$store.state.schedules.isCreateNewBatch" rounded inverted color="negative" @click="cancel">Cancel</q-btn>
		</q-toolbar>
		<router-view />
	</div>
</template>
<script>
export default {
	computed: {
		isSeeAllSchedules: {
			get () {
				return this.$store.state.schedules.isViewAllSched
			},
			set (val) {
				this.$store.commit('schedules/isSeeAllSchedules', val)
			} 
		}
	},
	methods: {
		newBatchModal () {
			this.$store.commit('schedules/updateNewBatchModal', true)
		},
		saveBatchSchedule () {
			this.$q.dialog({
		    title: 'Save',
		    message: `Do you want to save?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
		      // please clear the activities array
		      this.$store.dispatch('schedules/saveBatchSchedule', {fireb: this.$firebase.database(), quasu: this.$q, lodash: this.$lodash})
		    }).catch(() => {})
		},
		cancel () {
			this.$q.dialog({
		    title: 'Discard',
		    message: `Do you want to discard batch?`,
		    ok: 'Yes',
		    cancel: 'No'
		  }).then(() => {
		      this.$store.commit('schedules/clearActivities')
		      this.$store.commit('schedules/restoreTaskList')
		      this.$store.commit('schedules/updateIsCreateNewBatch', false)
		    }).catch(() => {})
		}
	}
}
</script>