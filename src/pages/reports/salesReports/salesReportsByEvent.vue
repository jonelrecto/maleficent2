<template>
	<q-page class="q-pa-md">
		<q-toggle v-model="isAdvanceDate" label="Advance Date to 2019-04-01" />
		<!-- <q-btn label="test" @click="test2" /> -->
		
		<div class="row">
			<div class="col-4-md q-px-md">
				<!-- <p class="q-headline">Total Sales: {{getTotalSales | currency}}</p> -->
		    <!-- <p class="q-title">Sales Percent (%): {{getSalesPercent}}%</p> -->
		    <!-- <apexcharts width="450" height="200" type="line" :options="getSalesChartData.chartOpt" :series="getSalesChartData.series" style="min-width: 250px;"></apexcharts> -->

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
				<q-table
			    :title="getEventName"
			    :data="getSeasons"
			    :columns="columns"
			    no-data-label="No Seasons yet"
			    row-key="name">

			    <template slot="top-right" slot-scope="props">
			    	<q-btn label="print" icon="print" @click="print"/>
			    </template>

	        <q-td slot="body-cell-contractSigned" slot-scope="props" :props="props">
	          {{getContractSigned(props)}}
	        </q-td>
		        <q-td slot="body-cell-fullPaid" slot-scope="props" :props="props">
		          {{ getFullPaid(props) }}
	        </q-td>
	        <q-td slot="body-cell-installment" slot-scope="props" :props="props">
		          {{ getInstallment(props) }}
	        </q-td>
	        <q-td slot="body-cell-backout" slot-scope="props" :props="props">
		          {{ getBackOut(props) }}
	        </q-td>

	        <q-td slot="body-cell-rate" slot-scope="props" :props="props">
	          {{(props.row.totalAmount) | currency}}
	        </q-td>

	        <q-td slot="body-cell-grossSales" slot-scope="props" :props="props">
	          {{getGrossSales(props) | currency}}
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
			this.eventKey = this.$route.params.eventKey
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
	watch: {
		isAdvanceDate () {
			if (this.isAdvanceDate) {
				this.advanceDate = '2019-04-01'
			} else {
				this.advanceDate = ''
			}
		}
	},
	computed: {
		getTotalGrossSales () {
			let seasons = [...this.getSeasons]
			let map = this.$lodash.map(seasons, s => {
				let props = {
					row: s
				}
				return {
					grossSales: this.getGrossSales(props)
				}
			})
			// console.log('map', map)
			let toSum = this.$lodash.sumBy(map, 'grossSales')
			return toSum
		},
		mapToPrint () {
			let vm = this
			console.log('seasons', vm.getSeasons)
			let seasons = [...vm.getSeasons]
			let mapSeasons = this.$lodash.map(seasons, s => {
				let props = {
					row: s
				}
				return {
					seasonNumber: s.seasonNumber,
					contactSigned: this.getContractSigned(props),
					fullPaid: this.getFullPaid(props),
					installment: this.getInstallment(props),
					backout: this.getBackOut(props),
					seasonRate: `P ${s.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
					grossSales: `P ${this.getGrossSales(props).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
				}
			})
			console.log('mapSeasons', mapSeasons)
			return mapSeasons
			// this.getSeasons
		},
		getSeasons () {
			try {
				return this.getEvent.seasons
			} catch {
				return []
			}
		},
		getEventName () {
			try {
				return this.getEvent.eventName
			} catch {
				return ''
			}
		},
		getEvent () {
			try {
				console.log('eventKey', this.eventKey)
				let event = this.$lodash.find(this.events, e => {
					return e['.key'] === this.eventKey
				})
				console.log('event', event)
				return event
			} catch {
				let event = {
					eventName: '',
					seasons: []
				}
				return event
			}
		},
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
			isAdvanceDate: false,
			advanceDate: '',
			eventKey: '',
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
	        name: 'backout',
	        required: true,
	        label: 'Back Out',
	        align: 'center',
	        sortable: true
	      },
	      {
	        name: 'rate',
	        required: true,
	        label: 'Season Rate',
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
		getTotalSales2 (eventKey) {
			let filterPayments = this.$lodash.filter(this.payments, p => {
				return p.eventKey === eventKey
			})
			let totalSales = this.$lodash.sumBy(filterPayments, 'transaction_amount')
			return 'P ' + totalSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		},
		getGrossSales (p) {
			console.log('gross p', p)
			var seasonName = p.row.seasonName
			var filterTransactions = this.$lodash.filter(this.payments, pt => {
				return pt.seasonName === seasonName
			})
			// console.log('filterTransactions', filterTransactions)
			let totalAmount = this.$lodash.sumBy(filterTransactions, t => {
				t.transaction_amount = parseFloat(t.transaction_amount)
				return t.transaction_amount
			})
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
			// console.log('fullterm', fullTerm)
			let fullPaidAmount = parseInt(fullTerm.length) * p.row.totalAmount
			let fullPaidRecord = []
			this.$lodash.forEach(this.payments, p => {
				this.$lodash.forEach(fullTerm, ft => {
					if (ft['.key'] === p.modelKey) {
						fullPaidRecord.push(p)
					}
				})
			})
			let fullTotalPaid = this.$lodash.sumBy(fullPaidRecord, 'transaction_amount')
			// console.log('fullTotalPaid', fullTotalPaid)
			return `P ${fullTotalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
		},
		getInstallment (p) {
			var seasonName = p.row.seasonName
			let signed = this.$lodash.filter(this.contractSigned, cs => {
				return cs.seasonName === seasonName
			})
			let installmentTerm = this.$lodash.filter(signed, s => {
				return s.paymentTerms === 'installment'
			})
			// console.log('installmentTerm', installmentTerm)
			let installmentRecord = []
			this.$lodash.forEach(this.payments, p => {
				this.$lodash.forEach(installmentTerm, it => {
					if (it['.key'] === p.modelKey) {
						installmentRecord.push(p)
					}
				})
			})
			let installTotalPaid = this.$lodash.sumBy(installmentRecord, 'transaction_amount')
			// console.log('installTotalPaid', installTotalPaid)
			return `P ${installTotalPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
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
		isFinishedSeason (seasonEnd) {
			// var seasonEnd = new Date('2019-03-02T15:18:53.000+08:00')
			// console.log('seasonsend', seasonEnd)
			let dif = this.$mathMixin.dayDiff(new Date(this.advanceDate), new Date(seasonEnd))
			// console.log('dif', dif)
			if (dif < 0) {
				return true
			} else {
				return false
			}
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
		getBackOut (p) {
			var seasonName = p.row.seasonName
			// var seasonEnd = new Date('2019-03-02T15:18:53.000+08:00')
			var seasonEnd = p.row.seasonEnd
			// console.log('seasonsend', seasonEnd)
			if (this.isFinishedSeason(seasonEnd)) {
				// let dif = this.$mathMixin.dayDiff(new Date('2019-04-01'), new Date(seasonEnd))
				// console.log('dif', dif)
				let backOutModels = []
				this.$lodash.forEach(this.contractSigned, cs => {
					if (cs.seasonName === seasonName && cs.balance !== 0) {
						backOutModels.push(cs)
					}
				})
				console.log('backOutModels', backOutModels)
				let backOutRecord = []
				this.$lodash.forEach(this.payments, p => {
					this.$lodash.forEach(backOutModels, b => {
						if(b['.key'] === p.modelKey) {
							backOutRecord.push(p)
						}
					})
				})
				console.log('backOutRecord', backOutRecord)
				return backOutModels.length
			} else {
				return 'Season Not Finish Yet'
			}
		},
		print () {
			let mapColumns = this.$lodash.map(this.columns, c => {
				return { text: c.label, style: 'header'}
			})
			// mapColumns.splice(0,0, {text: type})
			console.log('columns', mapColumns)
			let toBody = []
			let season = [...this.mapToPrint]
			for (var i = 0; i < season.length; i++) {
				let toPush = [season[i].seasonNumber, season[i].contactSigned, season[i].fullPaid, season[i].installment, season[i].backout, season[i].seasonRate, season[i].grossSales]
				toBody.push(toPush)
			}
			let vm = this
			// console.log('mappedModels', this.mappedModels.length.toString())
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
					{text: `Sales Record: ${vm.getEventName}`, alignment: 'left', margin: [5, 5, 5, 5]},
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
					{text: `Total Gross Sales: P ${vm.getTotalGrossSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, alignment: 'left', margin: [1, 10, 1, 1]},
					// {text: `Total Payments: P ${this.getTotalPayments}`, alignment: 'left', margin: [1, 1, 1, 1]}
				],
				styles: {
					header: {
						fontSize: 12,
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
			pdfMake.createPdf(dd).download(`SalesReport_${vm.getEventName}`);
		},
		test2 () {

		}
	} // end of metthods
}
</script>