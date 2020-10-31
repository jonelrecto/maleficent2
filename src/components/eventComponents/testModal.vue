<template>
  <q-modal maximized v-model="editBatchModal" @show="onShowEditBatch()">
    	<q-modal-layout
		    content-class="{'bg-primary': true}"
		    footer-class=""
		    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
		  >
				  <q-toolbar slot="header">
				    <q-toolbar-title>Edit Batch</q-toolbar-title>
				    <q-select
				    	@input="onChangeSelectBatch()"
	           	style="width: 150px"
	           	inverted
	           	no-parent-field
	           	float-label="Select Batch"
				      v-model="selectedBatch"
				      :options="editBatchOpt"
				    />
	          <q-btn flat round dense v-close-overlay icon="close" />
				  </q-toolbar>

          <!-- <edit-batch-modal
            ref="editBatchModalRef"
            v-if="selectedBatch !== 'final event'"
            :batchKey="selectedBatch"
            :eventKey="eventKey"
            :eventCode="getEventCode"
            :seasonNumber="parseInt(seasonNumber)"
            :seasonEnd="getSeasonEnd"
            :lastBatchCourse="course[0] ? getCourse['.key'] : ''"
          ></edit-batch-modal> -->

          <!-- <edit-final-activity
            :eventKey="eventKey"
            :seasonNumber="parseInt(seasonNumber)"
            :finalActivity="getBatchFinalEvent"
            v-else
          ></edit-final-activity> -->
    	</q-modal-layout>
  </q-modal>
</template>
<script>
import editBatchModalComponent from '../../components/eventComponents/editBatchModal.vue'
import editFinalActivity from '../../components/eventComponents/editFinalActivity'


export default {
  components: {
		'editBatchModal': editBatchModalComponent,
		'editFinalActivity': editFinalActivity,
  },
  created () {
    this.eventKey = this.$route.params.id
    this.seasonNumber = this.$route.params.seasonNumber
    console.log('created')
  },
  mounted () {
    this.$bindAsArray('schedules2', this.$database.ref('event_schedules'), null, () => {})
  },
  data () {
    return {
      schedules: [],
      editBatchModal: false,
      selectedBatch: '',
      resolve: null,
      reject: null
    }
  },
  computed: {
    getBatches () {
			var batches = this.$lodash.filter(this.schedules, s => {
				return s.eventKey === this.eventKey && s.seasonNumber === parseInt(this.seasonNumber)
			})
			return batches
		},
    editBatchOpt () {
			// console.log(this.getBatches, 'getBatches')
			let map = this.$lodash.map(this.getBatches, b => {
				return { label: `Batch ${b.batchNumber}`, value: b['.key'] }
			})
			map.push({ label: 'Final Event', value: 'final event' })
			return map
		},
  },
  methods: {
    openModal () {
      this.editBatchModal = true
      return new Promise((resolve, reject) => {
        resolve = this.resolve
        reject = this.reject
      })
    },
    onShowEditBatch() {

    },
    onChangeSelectBatch() {

    }
  }
}
</script>

