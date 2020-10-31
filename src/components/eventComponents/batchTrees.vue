<template>
	<div>
		<!-- <q-btn label="test" @click="test()"/> -->
 		<q-tree
			:nodes="batchNodes"
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

		<q-modal v-model="viewActivityModal" :content-css="{minWidth: '50vw', minHeight: '60vh'}" >
	    <q-modal-layout
			    content-class="{'bg-primary': true}"
			    footer-class=""
			    footer-style="{fontSize: '24px', fontWeight: 'bold'}"
			  >

			  <q-toolbar slot="header">
			    <q-toolbar-title>{{selectedActivity.title}}</q-toolbar-title>
          <q-btn flat round dense v-close-overlay icon="close" />
			  </q-toolbar>


				  <div>
				  	<q-datetime
				    	disable
				    	class="q-ma-md"
				    	format="MMM-DD-YYYY"
				    	v-model="selectedActivity.startDate"
				    	stack-label="Start Date"
				    	type="date"
				    />
				    <q-datetime
				    	disable
				  		v-if="selectedActivity.actType === 'date range'"
				    	class="q-ma-md"
				    	format="MMM-DD-YYYY"
				    	v-model="selectedActivity.endDate"
				    	stack-label="End Date"
				    	type="date"
				    />
				    <q-input
				    	readonly
				  		v-if="selectedActivity.type === 'payments'"
				    	class="q-ma-md"
				    	prefix="P"
						  v-model="selectedActivity.amount"
						  type="number"
						  stack-label="Amount"
				    />
				    <div v-if="selectedActivity.type != 'payments' && selectedActivity.actType != 'date range'">
				    	<q-select
		           	no-parent-field
					    	class="q-ma-md"
		           	float-label="Select Batch"
					      v-model="selectedActivity.locationID"
					      :options="[]"
					    />
					    <q-input 
					    	float-label="Details" 
					    	class="q-ma-md"
					    	type="textarea" 
					    	:max-height="50" 
					    	rows="5" 
					    	v-model="selectedActivity.location" 
					    />
					    <q-input 
					    	float-label="Details" 
					    	class="q-ma-md"
					    	type="textarea" 
					    	:max-height="50" 
					    	rows="5" 
					    	v-model="selectedActivity.details" 
					    />
				    </div>

				  </div>
			  

			</q-modal-layout>
    </q-modal>
	</div>
</template>
<script>
export default {
	props: {
		eventKey: {
			type: String,
			default: ''
		},
		seasonNumber: {
			type: Number,
			default: 0
		}
	},
	created () {
		this.generateBatchNodes()
	},
	firebase () {
		return {
			eventBatches: this.$database.ref('event_schedules').orderByChild('eventKey').equalTo(this.eventKey)
		}
	},
	computed: {
		getSeasonBatches () {
			return this.$lodash.filter(this.eventBatches, b => {
				return b.eventKey === this.eventKey && b.seasonNumber === this.seasonNumber
			})
		},
		getSeasonBatchActivities () {
			let activities = new Array()
			for (var b of this.getSeasonBatches) {
				activities.push(b.activities)
			}
			// console.log(activities, 'activities')
			return this.$lodash.flattenDeep(activities)
		}
	},
	data () {
		return {
			batchNodes: [],
			viewActivityModal: false,
			testvar: '',
			selectedActivity: {}
		}
	},
	methods: {
		clickBatchNode (p) {
			console.log('p', p)
			let activity = p.node
			this.selectedActivity = activity
			this.viewActivityModal = true
		},
		isMissingDetails (p) {
			var activity = p.node
			if (activity.type !== 'payments' && activity.actType !== 'date range') {
			// console.log(activity.locationID, 'activity')
				if (activity.locationID === '' || typeof activity.locationID === 'undefined') {
					return true
				}
				return false
 				// let location = typeof p.node.location !== 'undefined' ? p.node.location : false
				// let details = typeof p.node.details !== 'undefined' ? p.node.details : false
				// // console.log('loc det', location, details)
				// if ((location === '' || details === '') && (p.node.type !== 'payment' && p.node.type !== 'photoliking' && p.node.type !== 'orientation')) {
				// 	return true
				// }
			} else {
				return false
			}
			
		},
		isBatchMissingDetails (p) {
			// console.log('p head', p)
			if (this.isMissingDetails === true) {
				return true
			}
			return false
			// if (p.node.children) {
			// 	let childrens = p.node.children
			// 	for (var i = 0; i < childrens.length; i++) {
			// 		if ((childrens[i].location === '' || childrens[i].details === '') && (childrens[i].type !== 'payment' && childrens[i].type !== 'photoliking' && childrens[i].type !== 'orientation')) {
			// 			return true
			// 		}
			// 	}
			// }
			// return false
		},
		selectNode (n) {
			console.log('n', n)
		},
		generateBatchNodes () {
			let seasonBatchAct = new Array()
				let activities = this.getSeasonBatchActivities
				// batch grouping
				let groupedBatch = new Array()
				// console.log(activities, 'activities')
				// console.log(this.getSeasonBatches, 'getSeasonBatches')

				// console.log(getBatchNumber, 'getBatchNumber')
				for (var i = 1; i <= this.getSeasonBatches.length; i++) {
					var bat = this.$lodash.filter(activities, a => {
						let second = this.$store.getters['startUp/get2ndAfterUnderline'](a.id)
						let getBatchNumber = this.$store.getters['startUp/extractNumber'](second)
						return getBatchNumber[0] === i
					})
					groupedBatch.push(bat)
				}
				console.log('grouped', groupedBatch)
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

						var second = this.$store.getters['startUp/get2ndAfterUnderline'](groupedBatch[j][k].id)
						var getBatchNumber = this.$store.getters['startUp/extractNumber'](second)
					
						let mapChild = {
							label: this.$store.getters['startUp/hasNumber'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) ? this.$store.getters['startUp/titleCase'](this.$store.getters['startUp/get3rdAfterUnderline'](groupedBatch[j][k].id)) : this.$store.getters['startUp/titleCase'](groupedBatch[j][k].type),
							startDate: groupedBatch[j][k].startDate.toString(),
							endDate: groupedBatch[j][k].endDate.toString(),
							amount: groupedBatch[j][k].amount ? groupedBatch[j][k].amount : '',
							dueDate: groupedBatch[j][k].dueDate ? groupedBatch[j][k].dueDate : '',
							time: groupedBatch[j][k].time ? groupedBatch[j][k].time : '',
							location: groupedBatch[j][k].location ? groupedBatch[j][k].location : '',
							details: groupedBatch[j][k].details ? groupedBatch[j][k].details : '',
							batch: getBatchNumber[0],
							classes: groupedBatch[j][k].classes,
							eventKey: groupedBatch[j][k].eventKey,
							id: groupedBatch[j][k].id,
							title: groupedBatch[j][k].title,
							type: groupedBatch[j][k].type
						}
						childs.push(mapChild)
					}
					bat.children = childs
					sortedBatch.push(bat)
				}
				console.log('sortedbat', sortedBatch)
				// children and label
				this.batchNodes = sortedBatch
				// console.log('test', this.$store.getters['startUp/get3rdAfterUnderline']('TFF(1)_batch(1)_orientation'))
		},
		test () {
			this.generateBatchNodes()
			// console.log(this.getSeasonBatchActivities, 'getSeasonBatchActivities')

		}
	} // end of methods
}
</script>