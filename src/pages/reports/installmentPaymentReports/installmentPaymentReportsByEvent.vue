<template>
	<q-page>
		<!-- <q-btn label="test" @click="test" /> -->
		<q-table
	    ref="table"
	    :data="mappedModels"
	    :columns="columns"
	    :filter="filter"
	    row-key="name"
	    no-data-label="No Installment Models"
	    :pagination.sync="pagination"
	    :loading="loading"
	  >
	  	<template slot="top-left" slot-scope="props">
	  		<p class="q-title">{{eventName}} - </p> <br/>
	  		<p><q-select v-model="selectedSeason" :options="seasonOpt" /></p>
	  		
	    </template>

	    <template slot="top-right" slot-scope="props">
	    	<div class="q-px-md">
	    		<p>Installment Models: {{mappedModels.length}}</p>
				  <p>Total Payments: P {{getTotalPayments}}</p>
	    	</div>
	      <q-search hide-underline v-model="filter" />
	      <q-btn label="print" icon="print" @click="print()"/>
	    </template>
	  <!--   <q-td slot="body-cell-lastPaidDate" slot-scope="props" :props="props">
	    	<p>{{$moment(props.row.lastPaidDate).format('ll') ? $moment(props.row.lastPaidDate).format('ll') : 'Not Paid'}}</p>
		  </q-td> -->
	  </q-table>
	</q-page>
</template>
<script>
// import logo from '~assets/mma.png'
var pdfMake = require('pdfmake/build/pdfmake.js')
var pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs
// var logo = require('assets/mma.png')
var logo = ""
var xhr = new XMLHttpRequest()
    xhr.open("GET", "assets/mma.png", true) 
    xhr.responseType = "blob"
    xhr.onload = function (e) {
            // console.log('this.response', this.response)
            var reader = new FileReader()
            reader.onload = function(event) {
               logo = event.target.result
               // console.log('res', logo)
            }
            var file = this.response
            reader.readAsDataURL(file)
    }
    xhr.send()

export default {
	created () {
		if (this.$q.localStorage.has('user')) {
			let user2 = this.$q.localStorage.get.item('user')
			this.$bindAsArray('userLoggedIn', this.$database.ref(`users`).orderByKey().equalTo(user2))

		this.loadSelectSeason()
			// console.log('user2', user2)
		}
	},
	mounted () {
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned').orderByChild('paymentTerms').equalTo('installment'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('paymentRecords', this.$database.ref('payment_transactions'))
		this.$bindAsArray('events', this.$database.ref('events'))
	},
	props: {
		eventKey: String,
		eventName: String
	},
	watch: {
		seasonOpt: {
			handler () {
				this.loadSelectSeason()
			},
			deep: true
		}
	},
	computed: {
		mappedModels () {
			let filterModels = this.$lodash.filter(this.contractSigned, cs => {
				return cs.eventKey === this.eventKey && cs.seasonName === this.selectedSeason
			})
			let mapmodels = this.$lodash.map(filterModels, cs => {
				cs.fullName = `${cs.lastName}, ${cs.firstName}`
				cs.seasonAndBatch = this.getSeasonAndBatch(cs.seasonName, cs.batchKey)
				cs.seasonRate = this.getSeasonRate(cs.batchKey)
				cs.lastPaidDate = this.getLastPaidDate(cs['.key'])
				cs.totalPaid = this.getTotalPaid(cs['.key'])
				cs.paymentTerms = this.$lodash.capitalize(cs.paymentTerms)
				return cs
			})
			// console.log('mapmodels', mapmodels)
			return this.$lodash.orderBy(mapmodels, 'fullName', 'asc')
		},
		getFullPaidModels () {
			let fullPaid = this.$lodash.filter(this.mappedModels, m => {
				return m.paymentTerms === 'Full'
			})
			// console.log('fullPaid', fullPaid)
			return fullPaid
		},
		getInstallmentModels () {
			let installment = this.$lodash.filter(this.mappedModels, m => {
				return m.paymentTerms === 'Installment'
			})
			// console.log('fullPaid', fullPaid)
			return installment
		},
		getNotPaidModels () {
			let models = [...this.mappedModels]
			let setNotPaid = this.$lodash.map(models, m => {
				m.paymentTerms2 = m.paymentTerms ? m.paymentTerms : 'Not Paid'
				return m
			})
			let notPaid = this.$lodash.filter(setNotPaid, np => {
				return np.paymentTerms2 === 'Not Paid'
			})
			// console.log('getNotPaidModels', notPaid)
			return notPaid
		},
		getTotalPayments () {
			let models = [...this.mappedModels]
			let total = this.$lodash.sumBy(models, function (value) {
				return parseFloat(value.totalPaid.replace(/,/g, ""))
			})
			return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
		getEvent () {
			let event = this.$lodash.find(this.events, e => {
				return e['.key'] === this.eventKey
			})
			return event
		},
		seasonOpt () {
			try {
				let seasons = this.getEvent.seasons
				// console.log('seasons	', seasons)
				let seasonOpt = this.$lodash.map(seasons, s => {
					return { label: `Season ${s.seasonNumber}`,value: s.seasonName}
				})
				return this.$lodash.orderBy(seasonOpt, 'label', 'desc')
			} catch {
				return []
			}
		},
	},
	data () {
		return {
			selectedSeason: '',
			selectOptions: [
				{ label: 'Season 1', value: 'season1'}
			],
			events: [],
			userLoggedIn: [],
			paymentRecords: [],
			schedules: [],
			contractSigned: [],
			loading: false,
			filter: '',
			serverData: [],
			columns: [
        { name: 'fullName', align: 'left', label: 'Full Name', field: 'fullName', sortable: true },
        { name: 'event', align: 'left', label: 'Event', field: 'eventName'},
        { name: 'seasonBatch', align: 'left', label: 'Season & Batch', field: 'seasonAndBatch'},
        { name: 'lastPaidDate', align: 'left', label: 'Last Paid Date', field: 'lastPaidDate', sortable: true },
        { name: 'seasonRate', align: 'left', label: 'Season Rate', field: 'seasonRate' },
        { name: 'balance', align: 'left', label: 'Remaining Balance', field: 'balance', sortable: true },
        { name: 'totalPaid', align: 'left', label: 'Total Paid', field: 'totalPaid', sortable: true },
      ],
      pagination: {
	      sortBy: null, // String, column "name" property value
	      descending: false,
	      page: 1,
	      rowsPerPage: 0 // current rows per page being displayed
	    }
		}
	},
	// end of data
	methods: {
		loadSelectSeason () {
			// console.log('loadSelectSeason',this.seasonOpt[0].value)
			try {
				this.selectedSeason = this.seasonOpt[0].value	
			} catch {
				return 0
			}
		},
		getSeasonAndBatch (seasonName, batchKey) {
			let batch = this.$lodash.find(this.schedules, s => {
				return s['.key'] === batchKey
			})
			return `${seasonName}_Batch(${batch.batchNumber})`
		},
		getSeasonRate (batchKey) {
			let batch = this.$lodash.find(this.schedules, s => {
				return s['.key'] === batchKey
			})
			return batch.totalAmount
		},
		getLastPaidDate (modelKey) {
			try {
				let payments = this.$lodash.filter(this.paymentRecords, pr => {
				return pr.modelKey === modelKey
				})
				let sortByDate = this.$lodash.orderBy(payments, function (value) {return new Date(value.create_time)}, 'desc')
				// console.log('sortByDate', sortByDate)
				return sortByDate[0].create_time ? this.$moment(sortByDate[0].create_time).format('ll') : 'Not Paid'	
			} catch {
				return 'Not Paid'
			}
		},
		getTotalPaid (modelKey) {
			let payments = this.$lodash.filter(this.paymentRecords, pr => {
				return pr.modelKey === modelKey
			})
			let totalPaid = this.$lodash.sumBy(payments, function (value) {return parseFloat(value.transaction_amount)})
			let isNan = parseInt(totalPaid) || 0
      return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
		print () {
			let mapColumns = this.$lodash.map(this.columns, c => {
				return { text: c.label, style: 'header'}
			})
			// mapColumns.splice(0,0, {text: type})

			console.log('columns', mapColumns)
			// console.log('getDataTable', this.getDataTable)
			let regLen = []
			let showUpLen = []
			let noShowLen = []
			let signedLen = []
			let hitRateShowUp = []
			let hitRateSigned = []
			// this.$lodash.forEach(this.getDataTable, dt => {
			// 	let p = {}
			// 	p.row = dt
			// 	regLen.push(this.getRegistrantsLength(p))
			// 	showUpLen.push(this.getShowUp(p))
			// 	noShowLen.push(this.getNoShow(p))
			// 	signedLen.push(this.getSigned(p))
			// 	hitRateShowUp.push(this.getHitShowUp(p))
			// 	hitRateSigned.push(this.getHitSigned(p))
			// })
			// console.log('regLen', regLen, showUpLen, noShowLen, signedLen, hitRateShowUp, hitRateSigned)
			// let toBody = []
			// for (var i = 0; i < this.getDataTable.length; i++) {
			// 	let toPush = [i+1,regLen[i], showUpLen[i], noShowLen[i], signedLen[i], hitRateShowUp[i], hitRateSigned[i]]
			// 	toBody.push(toPush)
			// }
			// console.log('toBody', toBody)
			let toBody = []
			let models = [...this.mappedModels]
			for (var i = 0; i < models.length; i++) {
				let toPush = [models[i].fullName, models[i].eventName, models[i].seasonAndBatch, models[i].lastPaidDate, models[i].seasonRate, models[i].balance, models[i].totalPaid]
				toBody.push(toPush)
			}
			let vm = this
			console.log('toBody', toBody)
			var dd = {
				pageMargins: [ 40, 40, 40, 60 ],
				footer: function (currentPage, pageCount) {
					return {
						table: {
							widths: '*',
							body: [
								[
									{text: `Date prepared: ${vm.$moment(new Date()).format('lll')}`, margin: [40, 0, 0, 0]},
									// {text: `Prepared By: ${vm.userLoggedIn[0].lastName}, ${vm.userLoggedIn[0].firstName}`},
									
									{ text: "", alignment: 'left', style: 'normalText', aligment: 'right' }
								],
								[
                  {text: `Prepared By: ${vm.userLoggedIn[0].lastName}, ${vm.userLoggedIn[0].firstName}`, margin: [40, 0, 0, 0]},
                  { text: "", alignment: 'left', style: 'normalText', aligment: 'right' }
                ],
                [
                  {text: 'Approved By: ', margin: [40, 0, 0, 0]},
                  { text: "Page " + currentPage.toString() + ' of ' + pageCount, alignment: 'right', style: 'normalText', aligment: 'right',margin: [0, 0, 40, 0]}
                ],
							]
						},
						layout: 'noBorders'
					};
				},
				content: [
					{
						image: logo,
						width: 100,
						height: 70,
						alignment: 'center'
					},
					{text: '3rd Floor Forab Building Kamuning Quezon City', alignment: 'center', margin: [5, 5, 5, 5]},
					{text: `Payment Records: Installment Payments - ${this.eventName} - ${this.selectedSeason}`, alignment: 'left', margin: [5, 5, 5, 5]},
					{
						style: 'tableExample',
						table: {
							headerRows: 1,
							body: [
								mapColumns
							]
						},
						layout: {
							hLineWidth: function (i, node) {
								return (i === 0 || i === node.table.body.length) ? 2 : 1;
							},
							vLineWidth: function (i, node) {
								return (i === 0 || i === node.table.widths.length) ? 2 : 1;
							},
							hLineColor: function (i, node) {
								return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
							},
							vLineColor: function (i, node) {
								return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
							}
						}
					},
					{text: `Installment Models: ${this.mappedModels.length}`, alignment: 'left', margin: [1, 1, 1, 1]},
					{text: `Total Payments: P ${this.getTotalPayments}`, alignment: 'left', margin: [1, 1, 1, 1]}
				],
				styles: {
					header: {
						fontSize: 12	,
						bold: true,
						margin: [0, 0, 0, 10]
					},
					tableExample: {
						fontSize: 8,
						margin: [30, 1, 30, 10]
					},
				}
			}
			for (var j = 0; j < toBody.length; j++) {
				dd.content[3].table.body.push(toBody[j])	
			}
			console.log('dd', dd)
			pdfMake.createPdf(dd).download(`PaymentReports_Installment_${this.eventName}_${this.selectedSeason}`);
		},
		test () {
			console.log('events', this.mappedModels)
		}
	}
	//end of methods
}
</script>
