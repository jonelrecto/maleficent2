<template>
	<q-page class="q-pa-md">
		<div class="row">
			<div class="col-4-md q-px-md">
				<p class="q-headline">Total Sales: {{getTotalSales | currency}}</p>
		    <p class="q-title">Sales Percent (%): {{getSalesPercent}}%</p>
		    <apexcharts width="450" height="200" type="line" :options="getSalesChartData.chartOpt" :series="getSalesChartData.series" style="min-width: 250px;"></apexcharts>

				<!-- <q-card-title>
		        <div class="ellipsis">
		          <p class="q-headline">Total Sales: {{getTotalSales | currency}}</p>
		          <p class="q-title">Sales Percent (%): {{getSalesPercent}}%</p>
		        </div>
		      </q-card-title>
		      <q-card-main>
		        <apexcharts width="450" height="200" type="line" :options="getSalesChartData.chartOpt" :series="getSalesChartData.series" style="min-width: 250px;"></apexcharts>
		      </q-card-main>
		    </q-card> -->
			</div>
			<div class="col-md">
				<q-btn icon="print" label="Print" @click="print()" />
				<q-table
         	style="border-radius: 20px;"
          title="Top Events"
          :data="topEventTable"
          :columns="columns"
          row-key="name"
          hide-bottom
        >
          <q-td slot="body-cell-index" slot-scope="props" :props="props">
            <p>{{props.row.__index+1}}</p>
          </q-td>
        </q-table>
			</div>
		</div>
	</q-page>
</template>
<script>
import VueApexCharts from 'vue-apexcharts'
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
	components: {
   apexcharts: VueApexCharts,
	},
	created () {
		if (this.$q.localStorage.has('user')) {
			let user2 = this.$q.localStorage.get.item('user')
			this.$bindAsArray('userLoggedIn', this.$database.ref(`users`).orderByKey().equalTo(user2))
			// console.log('user2', user2)
		}
		// this.loadSelectedEvent()
	},
	mounted () {
		this.$bindAsArray('events', this.$database.ref('events'))
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
    this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
    this.$bindAsArray('models', this.$database.ref('models'))
    this.$bindAsArray('showUps', this.$database.ref('showUpModels'))
    this.$bindAsArray('payments', this.$database.ref('payment_transactions'))
	},
	computed: {
		topEventTable () {
      let groupByEvent = this.$lodash.groupBy(this.contractSigned, 'eventName')
      let dataMap = this.$lodash.map(groupByEvent, (value, key, obj) => {
      	console.log('obj[key]', obj[key][0].eventKey)
        var ret = {
        	totalSales: this.getTotalSales2(obj[key][0].eventKey),
          models: obj[key].length,
          eventName: key
        } 
        return ret
      })

      console.log('dataMap', dataMap)
      return this.$lodash.orderBy(dataMap, 'models', 'desc')
    },
		getSalesPercent () {
			try {
				console.log('payments', this.payments)
	      let pays = [...this.payments]
	      let changeDate = this.$lodash.map(pays, r => {
	        var dateMonthAdded = this.$moment(new Date(r.create_time), 'YYYY-MM-DD').format('MMMM')
	        r.dateMonthAdded = dateMonthAdded
	        return r
	      })
	      let payPerMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
	      // let registrants = this.getRegistranstByMonth
	      let months = this.$lodash.keys(payPerMonth)
	      let dataCollected = this.$lodash.map(payPerMonth, (value, key, obj) => {
	        // value.transaction_amount = parseFloat(value.transaction_amount)
	        this.$lodash.forEach(value, v => {
	          v.transaction_amount = parseFloat(v.transaction_amount)
	        })
	        // console.log('obj', obj)
	        obj[key] = this.$lodash.sumBy(value, 'transaction_amount')
	        return obj[key]
	      })
	      // dataCollected.push(150000) // for trial purpose
	      var len = dataCollected.length
	      let secondLastValue = dataCollected[len-2]
	      let newValue = dataCollected[len-1]
	      // console.log('dataCollected', dataCollected)
	      // console.log('secondLastValue', secondLastValue)
	      // console.log('newValue', newValue)
	      if (typeof secondLastValue === 'undefined') {
	        // console.log('is no comparable value')
	        return 100
	      } else {
	        let salesPercent = (parseFloat(secondLastValue) / parseFloat(newValue)) * 100
	        // console.log('salesPercent', salesPercent)
	        return salesPercent.toFixed(2)
	      }
			} catch {
				return 0
			}
    },
		getSalesChartData () {
			try {
				let pays = [...this.payments]
	      let changeDate = this.$lodash.map(pays, r => {
	        var dateMonthAdded = this.$moment(new Date(r.create_time), 'YYYY-MM-DD').format('MMMM')
	        r.dateMonthAdded = dateMonthAdded
	        return r
	      })
	      let payPerMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
	      // let registrants = this.getRegistranstByMonth
	      let months = this.$lodash.keys(payPerMonth)
	      let dataCollected = this.$lodash.map(payPerMonth, (value, key, obj) => {
	        // value.transaction_amount = parseFloat(value.transaction_amount)
	        this.$lodash.forEach(value, v => {
	          v.transaction_amount = parseFloat(v.transaction_amount)
	        })
	        // console.log('obj', obj)
	        obj[key] = this.$lodash.sumBy(value, 'transaction_amount')
	        return obj[key]
	      })

	      // console.log('monts', months)
	      // console.log('dataCollected', dataCollected)
	      let chartOpt = {
	        chart: {
	          id: 'HitRateChart'
	        },
	        xaxis: {
	          categories: months
	        }
	      }
	      let series = [{
	        name: 'HitRate',
	        data: [...dataCollected]
	      }]
	      let salesChartData = {
	        chartOpt: chartOpt,
	        series : series
	      }
	      // console.log('salesChartData', salesChartData)
	      return salesChartData
			} catch {
				return []
			}
    },
    getTotalSales () {
    	try {
    		// console.log('payments', this.payments)
	      let pays = [...this.payments]
	      let changeDate = this.$lodash.map(pays, r => {
	        var dateYearAdded = this.$moment(new Date(r.create_time), 'YYYY-MM-DD').format('YYYY')
	        r.dateYearAdded = dateYearAdded
	        return r
	      })
	      let payPerYear = this.$lodash.groupBy(changeDate, 'dateYearAdded')
	      // let registrants = this.getRegistranstByMonth
	      // console.log('payPerMonth' , payPerYear)
	      let years = this.$lodash.keys(payPerYear)
	      console.log('years' , years)
	      let dataCollected = this.$lodash.map(payPerYear, (value, key, obj) => {
	        // value.transaction_amount = parseFloat(value.transaction_amount)
	        this.$lodash.forEach(value, v => {
	          v.transaction_amount = parseFloat(v.transaction_amount)
	        })
	        // console.log('obj', obj)
	        obj[key] = this.$lodash.sumBy(value, 'transaction_amount')

	        return obj
	      })
	      let yearToday = this.$moment(new Date(), 'YYYY-MM-DD').format('YYYY')
	      // console.log('dataCollected total sales', dataCollected[0][yearToday])
	      return dataCollected[0][yearToday]
    	} catch {
    		return 0
    	}
    	
    },
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
			showUps: [],
			selectedEvent: {},
			graphSeasons: [],
			payments: [],
			data: [{name: 'Teen Fashion Festival', data: {'Season1': 10032, 'Season2': 1001492, 'Season3': 100150, 'Season4': 100500}}],
			events: [],
			models: [],
			schedules: [],
			contractSigned: [],
			showUpModels: [],
			paymentTransactions: [],
			columns: [
        {
          name: 'index',
          required: true,
          align: 'left',
          field: '__index',
          label: 'No.',
          sortable: true,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'eventName',
          required: true,
          align: 'left',
          label: 'Event',
          field: 'eventName',
          sortable: true
        },
        {
          name: 'models',
          required: true,
          align: 'center',
          label: 'Models',
          field: 'models',
          sortable: true
        },
        {
          name: 'totalSales',
          required: true,
          align: 'center',
          label: 'Total Sales',
          field: 'totalSales',
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
		getTotalSales2 (eventKey) {
			let filterPayments = this.$lodash.filter(this.payments, p => {
				return p.eventKey === eventKey
			})
			let totalSales = this.$lodash.sumBy(filterPayments, 'transaction_amount')
			return 'P ' + totalSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
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
				return { text: c.label, style: 'header'}
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
			let topEvent = [...this.topEventTable]
			for (var i = 0; i < topEvent.length; i++) {
				let term = topEvent[i].paymentTerms ? topEvent[i].paymentTerms : 'Not Paid'
				let toPush = [(i+1),topEvent[i].eventName, topEvent[i].models, topEvent[i].totalSales]
				toBody.push(toPush)
			}
			let vm = this
			let yearToday = this.$moment(new Date(), 'YYYY-MM-DD').format('YYYY')
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
					{text: `Sales Report: ${yearToday}`, alignment: 'left', margin: [5, 5, 5, 5]},
					{	
						// alignment: 'center',
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
					{text: `Total Sales: P ${vm.getTotalSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, alignment: 'left', margin: [1, 1, 1, 1]},
					{text: `Sales Percent (%): ${vm.getSalesPercent}%`, alignment: 'left', margin: [1, 1, 1, 1]}
				],
				styles: {
					header: {
						fontSize: 12,
						bold: true,
						margin: [0, 0, 0, 10]
					},
					tableExample: {
						alignment: 'center',
						fontSize: 8,
						margin: [140, 1, 0, 10]
					},
				}
			}
			for (var j = 0; j < toBody.length; j++) {
				dd.content[3].table.body.push(toBody[j])	
			}
			console.log('dd', dd)
			pdfMake.createPdf(dd).download(`SalesReport_${yearToday}`);
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
			console.log('getTotalSales', this.getTotalSales())
		}
	}
}
</script>