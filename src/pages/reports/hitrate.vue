<template>
	<q-page class="q-pa-md">
		<q-btn label="test" @click="test2" />
		<q-chip class="q-title q-mt-md" detail square icon="timeline">Hit Rates</q-chip>
		<div class="flex">
		  	<!-- events -->
		  	<div class="row inline">
					<div class="col-11 q-ma-md">
						<q-list inset-separator link>
						  <q-list-header >Events</q-list-header>
							  <q-item v-for="event in getEventsWithSeason" :key="event['.key']">
							  	<div @click="clickEvent(event)">
							  		<q-item-main>
								      <q-item-tile label >{{event.eventName}}</q-item-tile>
								    </q-item-main>
					  			</div>
							  </q-item>
						</q-list>
					</div>
				</div>
				<!-- table -->
				<div class="col q-ma-md">
				   <q-table
				   	id="content"
			      grid
			      hide-header
			      :data="getDataTable"
			      :columns="columns"
			      :filter="filter"
			      no-data-label="No Batches Yet"
			      row-key="name"
			      hide-bottom
			    >
			    	<!-- <template slot="top-left" slot-scope="props">
		    		 
			      </template> -->
			    	<!-- seasons -->
			    	<template slot="top-left" slot-scope="props" :props="props">
			    		<span class="q-title" v-if="reportType === 'seasonType'">{{selectedEvent.eventName}}</span>
		    		 <q-select
		    		 		class="noprint"
		    		 		v-if="reportType === 'batchType' || props.inFullscreen ? false : false"
		    		 		style="width: 110px;"
		    		 		stack-label="Season"
				        v-model="selectedSeason"
				        :options="eventSeasonsOpt"
				      />
				      <p class="q-headline" v-if="props.inFullscreen ? true : false">{{selectedEvent.eventName}} - {{selectedSeason}}</p>
			      </template>
			      <!-- report type -->
			    	<template slot="top-right" slot-scope="props">
		    		 <q-select
		    		 		v-if="props.inFullscreen ? false : true"
		    		 		style="width: 110px;"
		    		 		stack-label="Report Type"
				        v-model="reportType"
				        :options="reportTypeOpt"
				      />
				      <div class="noprint">
				      	<q-btn
				          flat dense
				          label="Print"
				          icon="print"
				          @click="isPrint(props)"
				        />
				        <q-btn
				        	v-if="props.inFullscreen ? true : false"
				          flat dense
				          icon="close"
				          label="close"
				          @click="props.toggleFullscreen"
				        />
				      </div>
				      
			      </template>


			      <div
			        slot="item"
			        slot-scope="props"
			        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 transition-generic"
			        :style="props.selected ? 'transform: scale(0.95);' : ''"
			      >
			        <q-card
			          class="transition-generic cursor-pointer"
			          :class="props.selected ? 'bg-grey-2' : ''"
			          @click.native="props.selected = !props.selected"
			        >
			          <q-card-title class="relative-position">
			            <span v-if="reportType === 'seasonType'" class="q-title">Season {{props.row.seasonNumber}}</span>
			            <span v-if="reportType === 'batchType'" class="q-subtitle">Batch {{ props.row.batchNumber }}</span>
			          </q-card-title>
			          <q-card-separator />
			          <q-card-main class="q-pa-none">
			            <q-list no-border>
			              <q-item v-for="col in props.cols.filter(col => col.name !== 'desc')" :key="col.name">
			                <q-item-main>
			                  <q-item-tile label>{{ col.label }}</q-item-tile>
			                </q-item-main>
			                <q-item-side right>
			                  <q-item-tile v-if="col.name === 'registrants'">{{ getRegistrantsLength(props) }}</q-item-tile>
			                  <q-item-tile v-if="col.name === 'showUps'">{{ getShowUp(props) }}</q-item-tile>
			                	<q-item-tile v-if="col.name === 'noShow'">{{ getNoShow(props) }}</q-item-tile>
			                	<q-item-tile v-if="col.name === 'signed'">{{ getSigned(props) }}</q-item-tile>
			                	<q-item-tile v-if="col.name === 'hitrateShowUp'">{{ getHitShowUp(props)	}} %</q-item-tile>
			                	<q-item-tile v-if="col.name === 'hitrateSigned'">{{ getHitSigned(props) }} %</q-item-tile>
			                </q-item-side>
			              </q-item>
			            </q-list>
			          </q-card-main>
			        </q-card>
			      </div>
			    </q-table>   
				</div>
		  </div>
	</q-page>
</template>
<script>
// import JSPDF from 'jspdf'
// require('pdfmake/build/pdfmake.js')
// require('pdfmake/build/vfs_fonts.js')
// require('pdfmake')
var pdfMake = require('pdfmake/build/pdfmake.js')
var pdfFonts = require('pdfmake/build/vfs_fonts.js')
pdfMake.vfs = pdfFonts.pdfMake.vfs
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
		this.loadSelectEvent()
		if (this.$q.localStorage.has('user')) {
			let user2 = this.$q.localStorage.get.item('user')
			this.$bindAsArray('userLoggedIn', this.$database.ref(`users`).orderByKey().equalTo(user2))
			// console.log('user2', user2)
		}
	},
	mounted () {
		this.$bindAsArray('events', this.$database.ref('events'))
		this.$store.state.startUp.events = this.events
		this.$bindAsArray('models', this.$database.ref('models'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
		this.$bindAsArray('showUpModels', this.$database.ref('showUpModels'))
		console.log('store in state', this.$store.state.startUp.events)
		this.selectedEvent = this.$store.state.startUp.events[0]
		this.loadSelectEvent()
	},
	watch: {
		timeNow: {
			handler (newD, oldD) {
				console.log('newd', newD)
				console.log('oldD', oldD)
				if (this.selectedEvent) {
					this.loadSelectEvent()
				}
			},
			deep: true
		}
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
		timeNow () {
			return Date.now()
		},
		getDataTable () {
			if (this.reportType === 'batchType') {
				return this.getEventBatches
			} else {
				return this.getEventSeasons
			}
		},
		eventSeasonsOpt () {
			try {
				console.log('seasons', this.selectedEvent)
				let mapEventSeasons = this.$lodash.map(this.selectedEvent.seasons, s => {
					return { label: `Season ${s.seasonNumber}`, value: s.seasonName}
				})
				console.log('map season', mapEventSeasons)
				let arrange = this.$lodash.orderBy(mapEventSeasons, ['label'], ['desc'])
				return arrange
			} catch {
				return []
			}
			
		},
		getEventSeasons () {
			console.log('event seasons in select', this.selectedEvent.seasons)
			return this.selectedEvent.seasons
		},
		getEventBatches () {
			try {
				console.log('sched', this.schedules)
				let filterBatches = this.$lodash.filter(this.schedules, s => {
					return s.eventKey === this.selectedEvent['.key'] && s.seasonName === this.selectedSeason
				})
				console.log('filterBatches', filterBatches)
				return filterBatches
			} catch {
				return []
			}
		}
	},
	data () {
		return {
			userLoggedIn: [],
			selectedSeason: '',
			selectedEvent: {},
			events: [],
			schedules: [],
			contractSigned: [],
			models: [],
			showUpModels: [],
			reportType: 'batchType',
			reportTypeOpt: [
				{label: 'Batch', value: 'batchType'},
				{label: 'Season', value: 'seasonType'}
			],
			filter: '',
			// {
   //        name: 'desc',
   //        required: true,
   //        label: 'Dessert (100g serving)',
   //        align: 'left',
   //        field: 'name',
   //        sortable: true
   //      },
   //      { name: 'calories', label: 'Calories', field: 'calories', sortable: true },
   //      { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
   //      { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
   //      { name: 'protein', label: 'Protein (g)', field: 'protein' },
   //      { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
   //      { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
			columns: [
        // {
        //   name: 'name',
        //   required: true,
        //   align: 'left',
        //   field: 'batchNumber',
        // },
        {
          name: 'registrants',
          required: true,
          label: 'No. of Registrants',
          align: 'left',
          field: 'registrants',
        },
        {
          name: 'showUps',
          required: true,
          label: 'No. of Show Up',
          align: 'left',
          field: 'showUps',
        },
        {
          name: 'noShow',
          required: true,
          label: 'No. of No Show',
          align: 'left'
        },
        {
          name: 'signed',
          required: true,
          label: 'No. of Signed',
          align: 'left'
        },
        {
          name: 'hitrateShowUp',
          required: true,
          label: 'Hitrate % ShowUps',
          align: 'left'
        },
        {
          name: 'hitrateSigned',
          required: true,
          label: 'Hitrate % Signed',
          align: 'left'
        },
      ],
      tableData: [
      	{name:'a', calories:'100', fat: '50', carbs: '10', protien: '20', sodium: '30', calcium: '40', iron: '60'},
      	{name:'b', calories:'100', fat: '50', carbs: '10', protien: '20', sodium: '30', calcium: '40', iron: '60'},
      	{name:'c', calories:'100', fat: '50', carbs: '10', protien: '20', sodium: '30', calcium: '40', iron: '60'}
     	]
		}
	},
	methods: {
		isPrint (s) {
			this.printPdf ()
			// console.log('state', s)
			// if (s.inFullscreen) {
			// 	this.printPdf()
			// } else {
			// 	s.toggleFullscreen()
			// }
		},
		// printPdf () {
  //     // window.print()
  //     var doc = new jsPDF()
		// 	var specialElementHandlers = {
		//     '#editor': function (element, renderer) {
		//         return true;
		//     }
		// 	};
	 //    doc.fromHTML($('#content').html(), 50, 50, {
	 //        'width': 170,
	 //        'elementHandlers': specialElementHandlers
	 //    })
	 //    doc.save('sample-file.pdf')
  //   },
		isEmpty(obj) {
	    for(var key in obj) {
        if(obj.hasOwnProperty(key))
          return false;
	    }
	    return true
		},
		getLatestSeason (event) {
			let latest = event.seasons[event.seasons.length-1]
			return latest
		},
		loadSelectEvent () {
			try {
				this.selectedEvent = this.$store.state.startUp.events[0]
				console.log('selected event', this.$store.state.startUp.events[0])
				this.selectedSeason = this.getLatestSeason(this.selectedEvent).seasonName
			} catch (err) {
				this.selectedEvent = {}
			}
		},
		clickEvent (e) {
			console.log('event', e)
			this.selectedEvent = e
			this.selectedSeason = this.getLatestSeason(e).seasonName
		},
		getRegistrantsLength (p) {
			try {
				if (this.reportType === 'batchType') {
					let batchKey = p.row['.key']
					let modelsLen = this.$lodash.filter(this.models, m => {
						return m.batchKey === batchKey
					})
					let showUpLen = this.$lodash.filter(this.showUpModels, s => {
						return s.batchKey === batchKey
					})
					let signedLen = this.$lodash.filter(this.contractSigned, cs => {
						return cs.batchKey === batchKey
					})
					let totalReg = modelsLen.length + showUpLen.length + signedLen.length
					return totalReg
				} else {
					console.log('p', p)
					let seasonName = p.row.seasonName
					let modelsLen = this.$lodash.filter(this.models, m => {
						return m.seasonName === seasonName
					})
					let showUpLen = this.$lodash.filter(this.showUpModels, s => {
						return s.seasonName === seasonName
					})
					let signedLen = this.$lodash.filter(this.contractSigned, cs => {
						return cs.seasonName === seasonName
					})
					let totalReg = modelsLen.length + showUpLen.length + signedLen.length
					return totalReg
				}
			} catch {
				return 0
			}
		},
		getShowUp (p) {
			try {
				if (this.reportType === 'batchType') {
					let batchKey = p.row['.key']
					let showUpLen = this.$lodash.filter(this.showUpModels, s => {
						return s.batchKey === batchKey
					})
					let signedLen = this.$lodash.filter(this.contractSigned, cs => {
						return cs.batchKey === batchKey
					})
					let totShowUp = showUpLen.length + signedLen.length
					return totShowUp
				} else {
					let seasonName = p.row.seasonName
					let showUpLen = this.$lodash.filter(this.showUpModels, s => {
						return s.seasonName === seasonName
					})
					let signedLen = this.$lodash.filter(this.contractSigned, cs => {
						return cs.seasonName === seasonName
					})
					let totShowUp = showUpLen.length + signedLen.length
					return totShowUp
				}
			} catch {
				return 0
			}
		},
		getNoShow (p) {
			try {
				let totalReg = this.getRegistrantsLength(p)
				let totalShowUp = this.getShowUp(p)
				return totalReg - totalShowUp
			} catch {
				return 0
			}
		},
		getSigned (p) {
			if (this.reportType === 'batchType') {
				var batchKey = p.row['.key']
				let signed = this.$lodash.filter(this.contractSigned, cs => {
					return cs.batchKey === batchKey
				})
				return signed.length
			} else {
				var seasonName = p.row.seasonName
				let signed = this.$lodash.filter(this.contractSigned, cs => {
					return cs.seasonName === seasonName
				})
				return signed.length
			}
		},
		getHitShowUp (p) {
			try {
				let reg = this.getRegistrantsLength(p)
				let showUp = this.getShowUp(p)
				let hitrateShowUp = parseFloat(showUp) / parseFloat(reg)
				let getTotal = hitrateShowUp * 100 || 0
				return getTotal.toFixed(2)
			} catch {
				return 0
			}
		},
		getHitSigned (p) {
			try {
				let signed = this.getSigned(p)
				let showUp = this.getShowUp(p)
				let hitrateSigned = parseFloat(signed) / parseFloat(showUp)
				let getTotal = hitrateSigned * 100 || 0
				return getTotal.toFixed(2)
			} catch {
				return 0
			}
		},
		test () {
		},
		printPdf () {
			let mapColumns = this.$lodash.map(this.columns, c => {
				return { text: c.label}
			})
			let type = this.reportType === 'seasonType' ? 'Season' : 'Batch'
			mapColumns.splice(0,0, {text: type})

			console.log('columns', mapColumns)
			// console.log('getDataTable', this.getDataTable)
			let regLen = []
			let showUpLen = []
			let noShowLen = []
			let signedLen = []
			let hitRateShowUp = []
			let hitRateSigned = []
			this.$lodash.forEach(this.getDataTable, dt => {
				let p = {}
				p.row = dt
				regLen.push(this.getRegistrantsLength(p))
				showUpLen.push(this.getShowUp(p))
				noShowLen.push(this.getNoShow(p))
				signedLen.push(this.getSigned(p))
				hitRateShowUp.push(this.getHitShowUp(p))
				hitRateSigned.push(this.getHitSigned(p))
			})
			console.log('regLen', regLen, showUpLen, noShowLen, signedLen, hitRateShowUp, hitRateSigned)
			let toBody = []
			for (var i = 0; i < this.getDataTable.length; i++) {
				let toPush = [(i+1),regLen[i], showUpLen[i], noShowLen[i], signedLen[i], hitRateShowUp[i], hitRateSigned[i]]
				toBody.push(toPush)
			}
			console.log('toBody', toBody)
			let vm = this
			let logo2 = logo
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
						image: logo2,
						width: 100,
						height: 70,
						alignment: 'center'
					},
					{text: '3rd Floor Forab Building Kamuning Quezon City', alignment: 'center', margin: [5, 5, 5, 5]},
					{text: `${this.getDataTable[0].eventName} Season ${this.getDataTable[0].seasonNumber}`, style: 'header', margin: [10, 10, 10, 10]},
					{text: `Hit Rate Reports`, alignment: 'left', margin: [5, 5, 5, 5]},
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
							},
							fillColor: function (i, node) {
								return (i % 2 === 0) ? '#CCCCCC' : null;
							}
						}
					}
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
				dd.content[4].table.body.push(toBody[j])	
			}
			// console.log('dd', dd)
			pdfMake.createPdf(dd).download(`HitRate_${vm.$moment(new Date()).format('lll')}`);
		},
		test2 () {
			console.log('this.userLoggedIn', this.userLoggedIn)
		}
	} // end of methods
}
</script>
<style type="text/css">
  /*@media print{
   .noprint{
       display:none;
   }
  html, body {
    height:100%; 
    margin: 0 !important; 
    padding: 0 !important;
    overflow: hidden;
  }
}*/
</style>
