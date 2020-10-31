<template>
	<div>
		<!-- <q-btn label="test" @click="test" /> -->
		<q-table
	    title="Batches"
	    :data="customBatches"
	    :columns="customColumn"
	    no-data-label="No Batches Yet"
	    row-key="batchNumber"
			:pagination.sync="pagination"
			:loading="batchLoading"
	  >
	  	<!-- @click.native="rowClick(props.row)" -->
		  <q-tr slot="body" slot-scope="props" :props="props"  class="cursor-pointer">
        <q-td v-for="(col) in props.cols" :key="col.name" :props="props">
          <p v-if="isActivityDate(col)">{{$moment(col.value).format('ll')}}</p>
          <p v-else-if="col.name === 'batchNumber'">{{props.row.__index+1}}</p>
          <p v-else-if="col.name === 'noOfModels'">{{getNumOfSignedModels(props.row)}}</p>
          <div v-else>
          	<q-btn v-if="isAbleToRemove(props)" icon="delete" round color="negative" @click="removeBatch(props)"/>
          </div>
        </q-td>
				
      </q-tr>
		</q-table>
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
		// this.eventKey = this.$route.params.id
		// this.seasonNumber = this.$route.params.seasonNumber
		this.batchLoading = true
	},
	mounted () {
		this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey), null, () => {
			this.$bindAsArray('schedules', this.$database.ref('event_schedules').orderByChild('eventKey').equalTo(this.eventKey), null, () => {
				this.batchLoading = false
			})
		})
	},
	computed: {
		getSeasonStatus () {
			try {
				return this.$store.getters['startUp/getSeason']({eventKey: this.eventKey, seasonNumber: this.seasonNumber}).status
			} catch {}
		},
		contractSigned: {
			get () {
				return this.$store.state.startUp.contractSigned
			},
			set (v) {
				this.$store.state.startUp.contractSigned = v
			}
		},
		seasonBatchContractSigned () {
			let signed = this.$lodash.filter(this.contractSigned, cs => {
				var sn = parseInt(cs.seasonName.match(/\d+/g)[0])
				return cs.eventKey === this.eventKey &&  sn === parseInt(this.seasonNumber)
			})
			// console.log('signed', signed)
			return signed
		},
		seasonBatches () {
			// try {
				let batches = this.$lodash.filter(this.schedules, s => {
					return s.eventKey === this.eventKey && s.seasonNumber === this.seasonNumber
				})
				return batches
			// } catch {
			// 	return []
			// }
		},
		customBatches () {
			try {
				let custom = new Array()

				// console.log(seasonBatches, seasonBatches)
				// for (var i = 0; i < this.seasonBatches.length; i++) {

				// }
				let activities = [...this.seasonBatches[0].activities]
				// var numOfPayment = 0
				// var numOfWorkshop = 0
				// console.log('activities', activities)
				this.$lodash.forEach(this.seasonBatches, sb => {
					let custom2 = []
					let numOfPayment = 0
					let numOfWorkshop = 0
					this.$lodash.forEach(sb.activities, act => {
						
						let keys = new Array()
						if (act.actType === 'date range') {

			  			let toReturnStart = {
				  			[`${this.$lodash.capitalize(act.type)} Start`]: act.startDate
				  		}
				  		let toReturnEnd = {
				  			[`${this.$lodash.capitalize(act.type)} End`]: act.endDate	
				  		}
							// console.log(toReturnStart, 'act.toReturnStart')
							// console.log(toReturnEnd, 'act.toReturnEnd')
				  		custom2.push(toReturnStart)
				  		custom2.push(toReturnEnd)
			  		} else {
			  			if (act.type === 'payments') {
			  				++numOfPayment
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)} ${numOfPayment}`]: act.startDate,
					  		}
					  		custom2.push(toReturn)
			  			} else if (act.type === 'workshop' || act.type === 'workshops') {
			  				
								// console.log(act, 'act')
								// console.log(act, 'act')
			  				++numOfWorkshop
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`]: act.startDate
					  		}

								// console.log(toReturn, 'toReturn')
					  		custom2.push(toReturn)
			  			} else {
			  				let toReturn = {
					  			[`${this.$lodash.capitalize(act.type)}`]: act.startDate
					  		}
					  		custom2.push(toReturn)
			  			}
			  		}
					})
					// console.log(custom2, 'custom2')
					for (var i = 0; i < custom2.length; i++) {
						let key = this.$lodash.keys(custom2[i])[0]
						let value = custom2[i][key]
						// console.log('value', value)
						custom2[key] = key
						custom2[key] = value
					}
					custom2.splice(0, custom2.length)
					// console.log('cust2', custom2)
					custom.push({...custom2})
				})
				console.log('custom batches',  custom)
				return custom
			} catch {
				return []
			}
			
		},
		customColumn () {
			try {
				let activities = this.seasonBatches[0].activities
				let custom = new Array()
		  	var numOfPayment = 0
				var numOfWorkshop = 0
		  	this.$lodash.forEach(activities, act => {
		  		// console.log('act', act)
		  		if (act.actType === 'date range') {
		  			let toReturnStart = {
			  			name: this.$lodash.capitalize(act.type) + 'Start',
			  			required: true,
			  			label: this.$lodash.capitalize(act.type) + ' Start',
			  			align: 'left',
			  			field: this.$lodash.capitalize(act.type) + ' Start',
			  		}
			  		let toReturnEnd = {
			  			name: this.$lodash.capitalize(act.type) + 'End',
			  			required: true,
			  			label: this.$lodash.capitalize(act.type) + ' End',
			  			align: 'left',
			  			field: this.$lodash.capitalize(act.type) + ' End',
			  		}
			  		custom.push(toReturnStart)
			  		custom.push(toReturnEnd)
		  		} else {
		  			if (act.type === 'payments') {
		  				numOfPayment++
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: `${this.$lodash.capitalize(act.type)} ${numOfPayment}`,
				  			align: 'left',
				  			field: `${this.$lodash.capitalize(act.type)} ${numOfPayment}`,
				  		}
				  		custom.push(toReturn)
		  			} else if (act.type === 'workshop' || act.type === 'workshops') {
		  				numOfWorkshop++
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: `${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`,
				  			align: 'left',
				  			field: `${this.$lodash.capitalize(act.type)} ${numOfWorkshop}`,
				  		}
				  		custom.push(toReturn)
		  			} else {
		  				let toReturn = {
				  			name: act.title,
				  			required: true,
				  			label: this.$lodash.capitalize(act.type),
				  			align: 'left',
				  			field: this.$lodash.capitalize(act.type)
				  		}
				  		custom.push(toReturn)
		  			}
		  			
		  		}
		  	})
		  	let batch = {
		  		name: 'batchNumber',
		  		label: 'Batch',
		  		align: 'left',
		  	}
		  	custom.splice(0, 0, batch)
		  	var signedModels = {
					align: 'center',
					label: 'No. of Signed Models',
					name: 'noOfModels',
					style: 'width: 500px'
				}
				var action = {
					align: 'center',
					label: 'Action',
					name: 'action',
				}
				custom.push(signedModels)
				custom.push(action)
		  	// console.log('custom column', custom)
		  	return custom
			} catch (err) {
				return []
			}
			
		},
	},
	data () {
		return {
			batchLoading: false,
			// eventKey: '',
			// seasonNumber: ''
			event: [],
			schedules: [],
			pagination: {
				sortBy: null, // String, column "name" property value
				descending: false,
				page: 1,
				rowsPerPage: 0 // current rows per page being displayed
			}
		}
	},
	methods: {
		getProps (p) {

					console.log('props', p)
		},
		removeBatch (p) {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Are you sure you want to delete this batch?',
			  ok: 'Yes',
			  cancel: 'No'
			}).then(() => {
					// console.log('props', p)
					console.log('seasonBatches', this.seasonBatches)
					var batchNumber = p.row.__index
					batchNumber++
					// console.log('batchNumber', batchNumber)
					if (batchNumber <= 1) {
						var bIndex = this.$lodash.findIndex(this.seasonBatches, gb => {
							return gb.batchNumber === batchNumber
						})
						// console.log('bIndex', bIndex)
						// console.log('seasonBatches', this.seasonBatches[bIndex])
						let batch = this.seasonBatches[bIndex]
						var key = batch['.key']
						// console.log('key', key)
						let vm = this
						this.$database.ref('event_schedules').child(key).remove()
							.then(() => {
								let eventKey = this.eventKey
								let seasonNumber = this.seasonNumber
								this.$database.ref(`events/${this.eventKey}/seasons/${this.seasonNumber-1}`).remove()
									.then(() => {
										vm.$q.notify({
											message: `${batch.eventName} Season ${batch.seasonNumber} has been removed`,
											type: 'info',
											color: 'info',
											textColor: 'white',
											icon: 'info'
										})
										vm.$router.push(`/eventseason/${this.eventKey}`)
									})
									.catch((err) => {
										console.log('an error occur', err)
									})
								})
					} else {
						var bIndex = this.$lodash.findIndex(this.seasonBatches, gb => {
							return gb.batchNumber === batchNumber
						})
						console.log('bIndex', this.seasonBatches[bIndex])
						let batch = this.seasonBatches[bIndex]
						var key = batch['.key']
						this.$database.ref('event_schedules').child(key).remove()
							.then(() => {
								this.$q.notify({
									message: `Batch ${batchNumber} has been removed`,
									type: 'info',
									color: 'info',
									textColor: 'white',
									icon: 'info'
								})
							})
					}
				}).catch(() => {})
		},
		isAbleToRemove (p) {
			// try {
				// console.log('customBatches', this.customBatches)
				// console.log('p', p)
				if (p.row.__index >= this.customBatches.length-1) {
					var batchNumber = p.row.__index
					console.log('isAbleToRemove', this.getNumOfSignedModels(p.row))
					if (this.getSeasonStatus === 'standby'  &&  this.getNumOfSignedModels(p.row) <= 0) {

						console.log('getSeasonStatus', this.getSeasonStatus)
						console.log('batchn umber', batchNumber)
						//  &&
						
						if (this.getSeasonStatus === 'standby' || batchNumber <= 0) {
							return true
						}
						batchNumber++
						var bIndex = this.$lodash.findIndex(this.getSeasonBatches, gb => {
							return gb.batchNumber === batchNumber
						})
						console.log('bIndex', this.getSeasonBatches[bIndex])
						let batch = this.getSeasonBatches[bIndex]
						var key = batch['.key']
						let diff = this.$mathMixin.dayDiff(new Date(), new Date(p.row.orientation))
						if (diff > 0) {
							return true
						}
					}
				} else {
					return false
				}
			// } catch {
			// 	return false
			// }
		},
		hasBatchSignedModels (bNumber) {
			var bIndex = this.$lodash.findIndex(this.seasonBatches, gb => {
				// console.log('gb', gb)
				return gb.batchNumber === bNumber
			})
			// console.log('index', bIndex)
			let batch = this.seasonBatches[bIndex]
			// console.log('batch', batch)
			// console.log('batchkey', batch['.key'])
			let signedBatchModels = this.$lodash.filter(this.seasonBatchContractSigned, sbcs => {
				// console.log('sbcs', sbcs.batchKey)
				return sbcs.batchKey === batch['.key']
			})
			// console.log('signedbatchmodels', signedBatchModels.length)
			if (signedBatchModels.length > 0) {
				return true
			}
			return false
			// return signedBatchModels.length
		},
		getNumOfSignedModels (p) {
			var props = this.$store.getters['startUp/getPlainValue'](p)
			// console.log('props plain', props)
			var batchNumber = ++props.__index
			// console.log('batchNumber', batchNumber)
			// console.log('seasonBatches', this.seasonBatches)
			var bIndex = this.$lodash.findIndex(this.seasonBatches, gb => {
				// console.log('gb', gb)
				return gb.batchNumber === batchNumber
			})
			// console.log('index', bIndex)
			let batch = this.seasonBatches[bIndex]
			// console.log('batch', batch)
			// console.log('batchkey', batch['.key'])
			let signedBatchModels = this.$lodash.filter(this.seasonBatchContractSigned, sbcs => {
				// console.log('sbcs', sbcs.batchKey)
				return sbcs.batchKey === batch['.key']
			})
			// console.log('signedbatchmodels', signedBatchModels.length)
			return signedBatchModels.length
			// get the batch
		},
		isActivityDate (col) {
			if (col.name !== 'batchNumber' && col.name !== 'noOfModels' && col.name !== 'action') {
				return true
			} else {
				return false
			}
		},
		test () {
			console.log('seasonBatchContractSigned', this.seasonBatchContractSigned)
		}
	}
}
</script>