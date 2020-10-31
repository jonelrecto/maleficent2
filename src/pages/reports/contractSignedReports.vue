<template>
	<q-page>
		<q-toolbar color="primary" inverted>
			<q-icon name="people" />
		  <q-toolbar-title>
		    Models
		  </q-toolbar-title>
			<!-- <q-btn label="test" @click="test" /> -->
			 <q-select
			 	class="noprint"
	      v-model="reportType"
	      :options="reportTypeOpt"
	    />
	    <q-select
	    	class="noprint"
	      v-model="reportYear"
	      :options="reportYearOpt"
	    />
	    <q-btn class="q-mx-md" icon="print" label="print" @click="print()" />
		</q-toolbar>
		<div class="row">
			<div class="col-4  q-ma-md">
				<q-card>
				  <q-card-title class="bg-primary">
				    <p class="q-headline text-white">Total Registrants: {{totalRegistrants}}</p>
				  </q-card-title>
				  <q-card-separator />
				  <q-card-main>
				    <p>Show up: {{totalShowUp}}</p>
				    <p>No Show: {{totalNoShow}}</p>
				    <q-item-separator />
				    <p>Contract Signed: {{totalContractSigned}}</p>
				    <p>Not Signed: {{totalNotSigned}}</p>
				  </q-card-main>
				</q-card>
			</div>
			<div class="col">
				<q-chip class="q-title" detail square icon="assignment_ind" color="primary">Registrants: {{totalRegistrants2}}</q-chip>
				<!-- <p> note: some data has no dateCreated that why its only 40</p> -->
				<!-- <vue-chart :options="{responsive: false, maintainAspectRatio: false}" type="line" :data="chartData" :width="400" :height="140"></vue-chart> -->

					<line-chart :colors="['#027be3']" :data="registrantsLineChart"></line-chart>
			</div>
		</div>

		<div class="row q-ma-md">
			<div class="col q-ma-md">
				<q-chip class="q-title q-ma-md" detail square icon="how_to_reg" color="positive">Contract Signed: {{totalContractSigned2}}</q-chip>
				<line-chart :colors="['#21BA45']" :legend="true" :data="signedLineChart"  height="200px"></line-chart>
			</div>
			<div class="col q-ma-md">
				<q-chip class="q-title q-ma-md" detail square icon="voice_over_off
					" color="info">Not Signed: {{totalNotSigned2}}</q-chip>
				<line-chart :colors="['#31CCEC']" :legend="true" :data="notSignedLineChart"  height="200px"></line-chart>
			</div>
			<div class="col q-ma-md">
				<q-chip class="q-title q-ma-md" detail square icon="directions_walk" color="secondary">Show Up: {{totalShowUp2}}</q-chip>
				<line-chart :colors="['#26A69A']" :legend="true" :data="showUpLineChart"  height="200px"></line-chart>
			</div>
			<div class="col q-ma-md">
				<q-chip class="q-title q-ma-md" detail square icon="cancel_presentation" color="warning">No Show: {{totalNoShow2}}</q-chip>
				<line-chart :colors="['#C5B513']" :legend="true" :data="noShowLineChart"  height="200px"></line-chart>
			</div>
		</div>

		<div class="row q-ma-md">
			<div class="col-4 q-ma-md">
				<pie-chart :colors="['#21BA45', '#31CCEC', '#26A69A', '#C5B513']" :data="pieData"></pie-chart>
			</div>
			<div>
				<q-table
			    title="Top Events"
			    :data="topEventTable"
			    :columns="columns"
			    row-key="name"
			    hide-bottom
			    :pagination.sync="pagination"
			  />
			</div>
			
		</div>
		
	</q-page>
</template>
<script>
import VueChart from 'vue-chart-js'

export default {
	components: {
   VueChart
  },
	mounted () {
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
		this.$bindAsArray('models', this.$database.ref('models'))
		this.$bindAsArray('showUps', this.$database.ref('showUpModels'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
	},
	computed: {
		topEventTable () {
			let groupByEvent = this.$lodash.groupBy(this.registrants, 'eventName')
			let dataMap = this.$lodash.map(groupByEvent, (value, key, obj) => {
	  		var ret = {
	  			models: obj[key].length,
	  			eventName: key
	  		}	
	  		return ret
	  	})
	  	return this.$lodash.orderBy(dataMap, 'models', 'desc')
		},
		pieData () {
			let pieData = {
				'Contract Signed': this.totalContractSigned2,
				'Not Signed': this.totalNotSigned2,
				'Show Up': this.totalShowUp2,
				'No Show': this.totalNoShow2
			}
			return pieData
		},
		noShowLineChart () {
			let noShow = this.getNoShowByMonth
	  	let months = this.$lodash.keys(noShow)
	  	let dataCollected = this.$lodash.map(noShow, (value, key, obj) => {
	  		obj[key] = this.getRegistranstByMonth[key] - this.getShowUpsByMonth[key]
	  		return obj
	  	})
	  	let lineChartData = [
	  		
{	  			name: '',
	  			data: {...dataCollected[0]}
	  		}
	  	]
	  	return lineChartData
		},
		showUpLineChart () {
			// try {
				let showup = this.getShowUpsByMonth
		  	let months = this.$lodash.keys(showup)
		  	let dataCollected = this.$lodash.map(showup, (value, key, obj) => {
		  		obj[key] = obj[key].length
		  		return obj
		  	})
		  	let lineChartData = [
		  		{
		  			name: '',
		  			data: {...dataCollected[0]}
		  		}
		  	]
				return lineChartData
			// } catch {
			// 	return []
			// }
		},
		notSignedLineChart () {
			// try {
				let notSigned = this.getNotSignedByMonth
		  	let months = this.$lodash.keys(notSigned)
		  	let dataCollected = this.$lodash.map(notSigned, (value, key, obj) => {
		  		obj[key] = obj[key].length
		  		return obj
		  	})

		  	console.log('dataCollected', dataCollected)
		  	let lineChartData = [
		  		{
		  			name: '',
		  			data: {...dataCollected[0]}
		  		}
		  	]
				return lineChartData
			// } catch {
			// 	return []
			// }
		},
		signedLineChart () {
			// try {
				let signed = this.getSignedByMonth
		  	let months = this.$lodash.keys(signed)
		  	let dataCollected = this.$lodash.map(signed, (value, key, obj) => {
		  		obj[key] = obj[key].length
		  		return obj
		  	})
		  	let lineChartData = [
		  		{
		  			name: '',
		  			data: {...dataCollected[0]}
		  		}
		  	]
				return lineChartData
			// } catch {
			// 	return []
			// }
		},
		registrantsLineChart () {
				let registrants = this.getRegistranstByMonth
		  	let months = this.$lodash.keys(registrants)
		  	let dataCollected = this.$lodash.map(registrants, (value, key, obj) => {
		  		obj[key] = obj[key].length
		  		return obj
		  	})
		  	console.log('months', months)
		  	let lineChartData = [
		  		{
		  			name: '',
		  			data: {...dataCollected[0]}
		  		}
		  	]
		  	console.log('registrantsLineChart', lineChartData)
				return lineChartData
		},
		getNoShowByMonth () {
			let noShowModels = this.showUps
			let changeDate = this.$lodash.map(noShowModels, su => {
				var dateMonthAdded = this.$moment(new Date(su.dateAdded), 'YYYY-MM-DD').format('MMMM')
				su.dateMonthAdded = dateMonthAdded
				return su
			})
			let noShowMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
			return noShowMonth
		},
		getShowUpsByMonth () {
			try {
				let showUpsModels = this.showUps
				let changeDate = this.$lodash.map(showUpsModels, su => {
					var dateMonthAdded = this.$moment(new Date(su.dateAdded), 'YYYY-MM-DD').format('MMMM')
					su.dateMonthAdded = dateMonthAdded
					return su
				})
				let showUpsMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
				console.log('showUpsMonth', showUpsMonth['October'].length)
				return showUpsMonth
			} catch {
				return []
			}
		},
		getNotSignedByMonth () {
			let notSigned = this.notSignedModels
			let changeDate = this.$lodash.map(notSigned, s => {
				var dateMonthAdded = this.$moment(new Date(s.dateAdded), 'YYYY-MM-DD').format('MMMM')
				s.dateMonthAdded = dateMonthAdded
				return s
			})
			let notSignedMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
			return notSignedMonth
		},
		getSignedByMonth () {
			let signed = this.contractSigned
			let changeDate = this.$lodash.map(signed, s => {
				var dateMonthSigned = this.$moment(new Date(s.dateSigned), 'YYYY-MM-DD').format('MMMM')
				s.dateMonthSigned = dateMonthSigned
				return s
			})
			let signedMonth = this.$lodash.groupBy(changeDate, 'dateMonthSigned')
			return signedMonth
		},
		getRegistranstByMonth () {
			let reg = this.registrants
			let changeDate = this.$lodash.map(reg, r => {
				var dateMonthAdded = this.$moment(new Date(r.dateCreated), 'YYYY-MM-DD').format('MMMM')
				r.dateMonthAdded = dateMonthAdded
				return r
			})
			let registrantsByMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
			// console.log('showUpsMonth', showUpsMonth['October'].length)
			return registrantsByMonth
		},
		totalNotSignedModelsByYear () {
			try {
				return this.notSignedModelsByYear(this.reportYear).length	
			} catch {
				return 0
			}
		},
		totalShowUpByYear () {
			try {
				return this.showUpsByYear(this.reportYear).length	
			} catch {
				return 0
			}
		},
		totalContractByYear () {
			try {
				return this.contractByYear(this.reportYear).length
			} catch {
				return 0
			}
		},
		totalRegistrantsByYear () {
			try {
				return this.registrantsByYear(this.reportYear).length
			} catch {
				return 0
			}
		},
		registrants () {
			let regArrays = new Array()
			regArrays.push(this.showUps)
			regArrays.push(this.models)
			regArrays.push(this.contractSigned)
			let registrants = this.$lodash.spread(this.$lodash.union)(regArrays)
			return registrants
		},
		notSignedModels () {
			let showUpModels = this.showUps
			let notSignedModels = new Array()
			this.$lodash.forEach(showUpModels, sm => {
				let activities = this.getModelBatchActivities(sm.batchKey)
				let payment1 = activities[1]
				let dif = this.$mathMixin.dayDiff(new Date(), new Date(payment1.startDate))
				if (dif <= 0) {
					notSignedModels.push(sm)
				}	
			})
			console.log('notSignedModels', notSignedModels)
			return notSignedModels
		},
		totalNotSigned2 () {
			if (this.reportType === 'month') {
				return this.totalNotSignedModelsByYear
			}
		},
		totalNotSigned () {
			return this.notSignedModels.length
		},
		totalNoShow2 () {
			if (this.reportType === 'month') {
				return this.totalRegistrants2 - this.totalShowUp2
			}
		},
		totalNoShow () {
			return this.totalRegistrants - this.totalShowUp
		},
		totalShowUp2 () {
			if (this.reportType === 'month') {
				return this.totalShowUpByYear
			}
		},
		totalShowUp () {
			return this.showUps.length
		},
		totalContractSigned2 () {
			if (this.reportType === 'month') {
				return this.totalContractByYear
			}
		},
		totalContractSigned () {
			return this.contractSigned.length
		},
		totalRegistrants2 () {
			if (this.reportType === 'month') {
				return this.totalRegistrantsByYear
			}
		},
		totalRegistrants () {
			return this.registrants.length
		}
	},
	data () {
		return {
			reportType: 'month',
			reportYear: this.$moment(new Date(), 'YYYY-MM-DD').format('YYYY'),
			reportYearOpt: [
				{ label: '2018', value: '2018'}
			],
			reportTypeOpt: [
				{ label: 'Year', value: 'year'},
				{ label: 'Month', value: 'month'},
				{ label: 'Week', value: 'week'},
			],
			schedules: [],
			showUps: [],
			models: [],
			contractSigned: [],
			graphSigned: [],
			chartKickData: [{name: 'Teen Fashion Festival', data: {'Season1': 10032, 'Season2': 1001492, 'Season3': 100150, 'Season4': 100500}}],
			chartData: {
  			labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  			datasets: [
  				{
  					label: '2018',
  					data: [10, 20, 30,40,20],
  					backgroundColor: '#f87979',
  				}
  			]
  		},
  		pieChartData: {
				labels: ["Red", "Blue", "Yellow"],
        datasets:[{
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
  		},
  		columns: [
	      {
	        name: 'eventName',
	        required: true,
	        label: 'Event Name',
	        align: 'left',
	        field: 'eventName',
	        sortable: true
	      },
	      {
	        name: 'models',
	        required: true,
	        label: 'Models',
	        align: 'left',
	        field: 'models',
	        sortable: true
	      },
	    ],
	    pagination: {
	      page: 1,
	      rowsPerPage: 5
	    }
		}
	},
	methods: {
		notSignedModelsByYear (year) {
			let notSignedModels2 = this.notSignedModels
			let changeDate = this.$lodash.map(notSignedModels2, su => {
				var dateYearAdded = this.$moment(new Date(su.dateAdded), 'YYYY-MM-DD').format('YYYY')
				su.dateYearAdded = dateYearAdded
				return su
			})
			let notSignedModelsByYear = this.$lodash.groupBy(changeDate, 'dateYearAdded')
			return notSignedModelsByYear[year]
		},
		showUpsByYear (year) {
			let showUpModels = this.showUps
			let changeDate = this.$lodash.map(showUpModels, su => {
				var dateYearAdded = this.$moment(new Date(su.dateAdded), 'YYYY-MM-DD').format('YYYY')
				su.dateYearAdded = dateYearAdded
				return su
			})
			let showUpsByYear = this.$lodash.groupBy(changeDate, 'dateYearAdded')
			return showUpsByYear[year]
		},
		contractByYear (year) {
			let contractSignedModels = this.contractSigned
			let changeDate = this.$lodash.map(contractSignedModels, su => {
				var dateYearSigned = this.$moment(new Date(su.dateSigned), 'YYYY-MM-DD').format('YYYY')
				su.dateYearSigned = dateYearSigned
				return su
			})
			let contractByYear = this.$lodash.groupBy(changeDate, 'dateYearSigned')
			return contractByYear[year]
		},
		registrantsByYear (year) {
			let registrantsModels = this.registrants
			let changeDate = this.$lodash.map(registrantsModels, su => {
				var dateYearAdded = this.$moment(new Date(su.dateCreated), 'YYYY-MM-DD').format('YYYY')
				su.dateYearAdded = dateYearAdded
				return su
			})
			let changeDate2 = this.$lodash.map(registrantsModels, su => {
				var dateYearSigned = this.$moment(new Date(su.dateSigned), 'YYYY-MM-DD').format('YYYY')
				su.dateYearSigned = dateYearSigned
				return su
			})
			let registrantsByYear = this.$lodash.groupBy(changeDate, 'dateYearAdded')
			// let registrantsByYear2 = this.$lodash.groupBy(changeDate2, 'dateYearSigned')

			console.log('registrantsByYear', registrantsByYear)
			// console.log('registrantsByYear2', registrantsByYear2)
			return registrantsByYear['2018']
		},
		getModelBatchActivities (batchKey) {
			let testVar = '-LOCh9-bXTcr_Jtdwk1R'
			let activities = this.$lodash.filter(this.schedules, s => {
				return s['.key'] === batchKey
			})[0].activities
			return activities
		},
		print () {
			window.print()
		},
		test () {
			// showUps: [],
			// models: [],
			// contractSigned: [],
			// {'Blueberry': 44, 'Strawberry': 23}
			// var weeknumber = this.$moment(new Date('2018-12-29'), "MM-DD-YYYY").week();
   //  	console.log(weeknumber);
	  // 	console.log('groupByEvent')


			console.log('registrants', this.registrants)
			console.log('registrants', this.registrantsLineChart)
			let reg = this.registrants
			let changeDate = this.$lodash.map(reg, r => {
				var dateYearAdded = this.$moment(new Date(r.dateAdded), 'YYYY-MM-DD').format('YYYY')
				r.dateYearAdded = dateYearAdded
				return r
			})
			let registrantsByYear = this.$lodash.groupBy(changeDate, 'dateYearAdded')
			console.log('registrants', registrantsByYear)

			let registrants = registrantsByYear
	  	let year = this.$lodash.keys(registrants)
	  	let dataCollected = this.$lodash.map(registrants, (value, key, obj) => {
	  		obj[key] = obj[key].length
	  		return obj
	  	})
	  	let lineChartData = [
	  		{
	  			name: '',
	  			data: {...dataCollected[0]}
	  		}
	  	]
	  	console.log('lineChartData', lineChartData)
		}

	}
}
</script>
<style type="text/css">
  @media print{
   .noprint{
       display:none;
   }
  html, body {
    height:100%; 
    margin: 0 !important; 
    padding: 0 !important;
    overflow: hidden;
  }
}
</style>
