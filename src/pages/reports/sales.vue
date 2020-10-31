<template>
	<q-page>
		<q-toolbar color="faded" class="q-py-none">
			<q-icon name="attach_money" size="30px"/>
        <q-toolbar-title shrink>
        	<span class="text-white">Sales Reports</span>
        </q-toolbar-title>
        <q-tabs color="faded" animated swipeable align="justify" class="text-white row">
            <q-route-tab default
					    label="All Sales"
					    to="/sales"
					    exact
					    slot="title"
					   />
				    <div v-for="(event, i) in events" :key="i" slot="title">
					  	<q-route-tab
					    :label="event.eventName"
					    :to="{name: 'salesReportsByEvent', params: { eventKey: event['.key'] }}"
					  	>
					 	 	</q-route-tab>
					  </div>
        </q-tabs>
    </q-toolbar>
		<router-view :key="$route.fullPath"></router-view>
		<!-- <q-btn label="test" @click="test2" /> -->
		<!-- 
		<q-chip class="q-title q-mt-md" detail square icon="attach money">Sales</q-chip>
		<div class="flex bg-gray-2">
			<div class="row inline">
				<div class="col-11 q-ma-md">
					<q-list inset-separator link>
					  <q-list-header >Events</q-list-header>
					  <div v-for="event in getEventsWithSeason" :key="event['.key']" @click="clickEvent(event)">
					  	<q-item highlight>
						  	<div>
						  		<q-item-main>
							      <q-item-tile label >{{event.eventName}}</q-item-tile>
							    </q-item-main>
				  			</div>
						  </q-item>
					  </div>
					</q-list>
				</div>
			</div>
			<div class="col q-ma-md">
				<div class="row">
					<line-chart :legend="true" :data="graphSeasons"></line-chart>
					<q-table
				    :title="selectedEvent.eventName"
				    :data="getEventSeasons"
				    :columns="columns"
				    no-data-label="No Seasons yet"
				    row-key="name">

		        <q-td slot="body-cell-contractSigned" slot-scope="props" :props="props">
		          {{getContractSigned(props)}}
		        </q-td>
 		        <q-td slot="body-cell-fullPaid" slot-scope="props" :props="props">
 		          {{ getFullPaid(props) }}
		        </q-td>
		        <q-td slot="body-cell-installment" slot-scope="props" :props="props">
 		          {{ getInstallment(props) }}
		        </q-td>

		        <q-td slot="body-cell-rate" slot-scope="props" :props="props">
		          {{(props.row.totalAmount) | currency}}
		        </q-td>

		        <q-td slot="body-cell-grossSales" slot-scope="props" :props="props">
		          {{getGrossSales(props) | currency}}
		        </q-td>

					</q-table>
				</div>
			</div> -->
		</div>
	</q-page>
</template>
<script>

export default {
	created () {
		this.loadSelectedEvent()
	},
	mounted () {
		this.$bindAsArray('events', this.$database.ref('events'))
		this.$bindAsArray('models', this.$database.ref('models'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
		this.$bindAsArray('showUpModels', this.$database.ref('showUpModels'))
		this.$bindAsArray('paymentTransactions', this.$database.ref('payment_transactions'))
	},
	computed: {
		getEventsWithSeason () {
			let event2 = new Array()
			this.$lodash.forEach(this.events, e => {
				if (this.$lodash.has(e, 'seasons')) {
					event2.push(e)
				}
			})
			return event2
		},
		getEventSeasons () {
			console.log('event seasons in select', this.selectedEvent.seasons)
			return this.selectedEvent.seasons
		},
	},
	data () {
		return {
			selectedEvent: {},
			graphSeasons: [],
			data: [{name: 'Teen Fashion Festival', data: {'Season1': 10032, 'Season2': 1001492, 'Season3': 100150, 'Season4': 100500}}],
			events: [],
			models: [],
			schedules: [],
			contractSigned: [],
			showUpModels: [],
			paymentTransactions: [],
			columns: [
	      {
	        name: 'season',
	        required: true,
	        label: 'Season',
	        align: 'center',
	        field: 'seasonNumber',
	        sortable: true,
	        classes: 'color: primary',
	        style: 'width: 500px, color: primary'
	      },
	      {
	        name: 'contractSigned',
	        required: true,
	        label: 'Contract Signed',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'fullPaid',
	        required: true,
	        label: 'Full Paid',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'installment',
	        required: true,
	        label: 'Installment',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'rate',
	        required: true,
	        label: 'Rate',
	        align: 'center',
	        field: 'totalAmount',
	        sortable: true
	      },
	      {
	        name: 'grossSales',
	        required: true,
	        label: 'Gross Sales',
	        align: 'center',
	        sortable: true
	      }
	    ],
	    tableData: [
	      {
	        name: 'Frozen Yogurt',
	        calories: 159,
	        fat: 6.0,
	        carbs: 24,
	        protein: 4.0,
	        sodium: 87,
	        calcium: '14%',
	        iron: '1%'
	      },
	      {
	        name: 'Frozen Yogurts',
	        calories: 159,
	        fat: 6.0,
	        carbs: 24,
	        protein: 4.0,
	        sodium: 87,
	        calcium: '14%',
	        iron: '1%'
	      }
	    ]
		}
	},
	methods: {
		getGrossSales (p) {
			console.log('p', p)
			var seasonName = p.row.seasonName
			var filterTransactions = this.$lodash.filter(this.paymentTransactions, pt => {
				return pt.seasonName === seasonName
			})
			let totalAmount = this.$lodash.sumBy(filterTransactions, t => {
				t.transaction_amount = parseFloat(t.transaction_amount)
				return t.transaction_amount
			})
			console.log('filter trans', totalAmount)
			return totalAmount
		},
		getFullPaid (p) {
			var seasonName = p.row.seasonName
			let signed = this.$lodash.filter(this.contractSigned, cs => {
				return cs.seasonName === seasonName
			})
			let fullTerm = this.$lodash.filter(signed, s => {
				return s.paymentTerms === 'full'
			})
			console.log('fullterm', fullTerm)
			return fullTerm.length
		},
		getInstallment (p) {
			var seasonName = p.row.seasonName
			let signed = this.$lodash.filter(this.contractSigned, cs => {
				return cs.seasonName === seasonName
			})
			let installmentTerm = this.$lodash.filter(signed, s => {
				return s.paymentTerms === 'installment'
			})
			return installmentTerm.length
		},
		loadSelectedEvent () {
			this.selectedEvent = this.$store.state.startUp.events[0]
			this.test()
			// console.log('selected event', this.$store.state.startUp.events[0])
		},
		getContractSigned (p) {
			var seasonName = p.row.seasonName
			let signed = this.$lodash.filter(this.contractSigned, cs => {
				return cs.seasonName === seasonName
			})
			return signed.length
		},
		clickEvent (e) {
			this.selectedEvent = e
			this.test()
			console.log('event', this.selectedEvent)
		},
		getGrossSales2 (p) {
			console.log('p', p)
			let vm = this
			var seasonName = p.seasonName
			var filterTransactions = vm.$lodash.filter(vm.paymentTransactions, pt => {
				return pt.seasonName === seasonName
			})
			let totalAmount = vm.$lodash.sumBy(filterTransactions, t => {
				t.transaction_amount = parseFloat(t.transaction_amount)
				return t.transaction_amount
			})
			console.log('filter trans', totalAmount)
			return totalAmount
		},
		print () {
			let mapColumns = this.$lodash.map(this.columns, c => {
				return { text: c.label}
			})
			// mapColumns.splice(0,0, {text: type})

			let eventName = this.eventName
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
				let term = models[i].paymentTerms ? models[i].paymentTerms : 'Not Paid'
				let toPush = [models[i].dateSigned, models[i].fullName, models[i].eventName, models[i].seasonAndBatch, models[i].seasonRate, models[i].mobileNumber, models[i].email]
				toBody.push(toPush)
			}
			console.log('mappedModels', this.mappedModels.length.toString())
			var dd = {
				content: [
					{
						image: logo,
						width: 100,
						height: 70,
						alignment: 'center'
					},
					{text: '3rd Floor Forab Building Kamuning Quezon City', alignment: 'center', margin: [5, 5, 5, 5]},
					{text: `Payment Records: Not Paid - ${eventName}`, alignment: 'left', margin: [5, 5, 5, 5]},
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
					{text: `Not Paid Models: ${this.mappedModels.length}`, alignment: 'left', margin: [1, 1, 1, 1]},
					{text: `Date prepared: ${this.$moment(new Date()).format('lll')}`, alignment: 'left', margin: [2, 8, 2, 2]},
					{text: `Prepared By: ${this.userLoggedIn[0].lastName}, ${this.userLoggedIn[0].firstName}`, alignment: 'left', margin: [2, 2, 7, 2]},
					{text: 'Approved By: ', alignment: 'left', margin: [2, 2, 2, 2]},
				],
				styles: {
					header: {
						fontSize: 18,
						bold: true,
						margin: [0, 0, 0, 10]
					},
					tableExample: {
						fontSize: 8,
						margin: [1, 1, 1, 1]
					},
				}
			}
			for (var j = 0; j < toBody.length; j++) {
				dd.content[3].table.body.push(toBody[j])	
			}
			console.log('dd', dd)
			pdfMake.createPdf(dd).download(`PaymentReports_NotPaid_${eventName}`);
		},
		test () {
			let mapSeasons = this.$lodash.map(this.selectedEvent.seasons, s => {
				let name = `Season${s.seasonNumber}`
				let gross = this.getGrossSales2(s)
				console.log('name gross', name, gross)
				return {
					[name]: gross
				}
			})
			let toReturnData = new Array()
			var data = {
				name: this.selectedEvent.eventName,
				data: Object.assign({}, mapSeasons[0])
			}
			toReturnData.push(data)
			this.graphSeasons = toReturnData
		},
		test2 () {

		}
	}
}
</script>
