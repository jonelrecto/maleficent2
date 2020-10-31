<template>
    <q-modal maximized no-backdrop-dismiss v-model="uploadNewSeasonBatchesModal" @show="hasLastSeason()" >
      <q-modal-layout>
			<q-toolbar slot="header">
				<q-btn
					flat
					round
					dense
					v-close-overlay 
					icon="keyboard_arrow_left"
				/>
				<q-toolbar-title>
					New Season Batches 
					<q-btn label="test" @click="test"/>
				</q-toolbar-title>
			</q-toolbar>

			<q-stepper color="secondary" ref="stepper" alternative-labels>
				<!-- first page -->
				<q-step default name="first" title="Season Information">
					<div class="row wrap q-ma-md">
						<div class="q-mx-md col-xs-12 col-md-8">
							<q-select
								v-model="season.course"
								stack-label="Course"
								float-label="Select Event Type"
								:error="$v.season.course.$error"
								:options="courseOpt"
								@input="courseActivities"
							/>
							
								<!-- @input="getCourseActivities()" -->
							<q-btn flat class="q-mx-md col-xs-12 col-md-12" label="add new course" icon="add" color="info" size="sm" @click="newCourseModal = true"/>
							<br/>
							<q-chip v-if="season.course !== ''" class="q-mx-md col-xs-12 col-md-12" square color="info">
								<span  class="q-caption">Activities:
									<span class="q-caption" v-for="(act, i) in courseActivities" :key="i">
										, {{act.label}}
									</span>
									<!-- {{courseActivities}} -->
								</span>
							</q-chip>
						</div>
						<!-- <q-btn flat class="q-mx-md" label="add new course" icon="add" color="info" size="sm" @click="$router.push('/coursesSettings')"/> -->
						<q-input type="number" class="q-ma-md col-xs-12 col-md-2" v-model="season.seasonNumber" stack-label="Season Number"/>

						<q-item-separator />
						<q-field
							class="q-ma-md col-xs-12 col-md-2"
							error-label="Invalid Ticket Count"
						>
							<q-input type="number" v-model="season.ticketCount" stack-label="Ticket Count" :error="$v.season.ticketCount.$error"/>
						</q-field>

						<q-field
							class="q-ma-md col-xs-12 col-md-2"
							error-label="Invalid Ticket Price"
						>
							<q-input type="number" v-model="season.ticketPrice" prefix="P " stack-label="Ticket Price" :error="$v.season.ticketPrice.$error"/>
						</q-field>

						<q-field
							class="q-ma-md col-xs-12 col-md-3"
							error-label="Invalid Registration Fee"
						>
							<q-input type="number"  v-model="season.discount" stack-label="Pre-Registration Fee" prefix="P" :error="$v.season.discount.$error"/>
						</q-field>

						<q-field label="Total Amount" class="q-mx-md col-xs-12 col-md-3" orientation="vertical">
							<q-input hide-underline readonly type="text" prefix="P " class="q-mx-md" v-model="getTotalAmount" float-label="Cash"/>
							<q-input hide-underline readonly type="text" prefix="P " class="q-mx-md" v-model="getInstallmentAmount" float-label="Installment"/>
						</q-field>

						<q-field
							class="q-ma-md col-xs-12 col-md-5"
							error-label="Invalid Number of Payments"
						>
							<q-input type="number" v-model="season.numberOfPayments" stack-label="Number of Payments" :error="$v.season.numberOfPayments.$error"/>
						</q-field>

						<q-field
							 v-if="isHasWorkshop"
							class="q-ma-md col-xs-12 col-md-5"
							error-label="Please check fields"
						>
							<q-input type="number" v-model="season.numberOfWorkshops" stack-label="Number of Workshops" :error="$v.season.numberOfWorkshops.$error"/>
							
						</q-field>

						

						<q-select
							class="q-ma-md col-xs-12 col-md-6"
							v-model="season.colorCode"
							:disable="getLastSeason > 1"
							float-label="Color Code (for scheduling purpose)"
							:options="colorOpt"
							:error="$v.season.colorCode.$error"
						/>

						<!-- <div class="row justify-center q-ma-md"
						 :style="{[`background-color`]: seasonColor.hex,
							fontSize: '13px',
							height: '100px',
							width: '500px',}" >
							<div class="q-pa-md">
									<p class="col-auto text-white">Color Code (for scheduling purpose)</p>
								<slider-picker v-model="seasonColor"></slider-picker>
							</div>
							
							
						</div> -->

						

					</div>

					<q-btn icon="mdi-arrow-collapse-down" size="md" class="q-ma-md col-xs-12 col-md-6" color="positive" @click="downloadTemplate()" label="Download Template" />
					
					<!-- <q-field
						class="q-ma-md col-xs-12 col-md-6"
						orientation="vertical"
						label="Import Template">
						
						<input 
							type="file" 
							@change="importTemplate"
							accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" >
					</q-field> -->
					
					<q-btn icon="mdi-upload" size="md" color="primary" v-if="!files[0]" >
						<file-upload
              :maximum="1"
              extensions=".xlsx"
              accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              name="avatar"
              class="btn btn-primary"
              post-action="/upload/post"
              drop="false"
              v-model="files"
              @input-filter="inputFilter"
              @input-file="inputFile"
              ref="upload">
              Upload Template
            </file-upload>
					</q-btn>

					<q-chip v-else icon="mdi-file" closable @hide="removeFile()" color="red">{{files[0].name}}</q-chip>
					
					
					<q-btn v-if="files[0]" class="q-ma-md fixed-bottom-right" color="positive" @click="nextStep()" label="Next" icon="navigate_next"/>
					
					
					<!-- Navigation for this step at the end of QStep-->
					<q-stepper-navigation class="flex">
						
						
						
						
						<!-- <q-btn color="secondary" @click="$refs.stepper.next()" label="Continue" /> -->
					</q-stepper-navigation>
				</q-step>

				<!-- activity tab -->
				<q-step name="second" icon="calendar_today" title="Activity Schedules">

						<!-- <preview></preview> -->
					<!-- <activity-modal ref="activityRef" :season="season"></activity-modal> -->
					<activities 
						ref="activityRef"
						:eventKey="eventKey"
						:eventName="getEventName"
						:eventCode="getEventCode"
					> </activities>
					<!-- :eventCode="getEventCode" -->
						<!-- :numberOfWorkshops="season.numberOfWorkshops" -->
					<!-- navigation -->
					<q-stepper-navigation>
						<!-- <q-btn color="secondary" @click="$refs.activityRef.saveSeasonActivities()" icon="navigate_next" label="Confirm Activities" /> -->
						<q-btn class="q-ma-md fixed-bottom-left" color="secondary" icon="arrow back ios" @click="$refs.stepper.previous(), isRestoreAsDraft = false" label="Back" />
						<q-btn class="q-ma-md fixed-bottom-right" color="positive" icon-right="arrow forward ios" label="Next" @click="$refs.activityRef.saveImportSeason()"/>
					</q-stepper-navigation>
				</q-step>
				<q-inner-loading :visible="importLoadingState">
					<q-spinner size="50px" color="primary"></q-spinner>
				</q-inner-loading>
			</q-stepper>

        </q-modal-layout>
    </q-modal>
</template>
<script>
import XLSX from 'xlsx'
import JsonExcel from 'vue-json-excel'
import FileUpload from 'vue-upload-component'
import xlsxParser from 'xlsx-parse-json'
import { Slider } from 'vue-color'


import Activities from '../components/importActivities.vue'

import { required, between } from 'vuelidate/lib/validators'
import seasonEventVue from '../pages/events/seasonEvent.vue';



const { getJsDateFromExcel } = require('excel-date-to-js')

let sri = require('simple-random-id')

export default {
	props: {
		courseOpt: {
			type: Array,
			default: []
		},
		latestSeason: {
			type: Number,
			default: 1
		}
	},
	components: {
		Activities,
		FileUpload,
		'slider-picker': Slider
	},
	watch: {
		['season.course'] () {
			let course = this.$lodash.find(this.courses, c => {
				return c['.key'] === this.season.course
			})
			console.log('course n com', course)
			this.courseActivities = course.activities
		}
	},
	created () {
		this.eventKey = this.$route.params.id
		this.getLatestSeason()
	},
	mounted () {
		this.$bindAsArray('courses', this.$database.ref('settings/courses'), null, () => {
			// console.log('courses', this.courses)
			this.$bindAsArray('event', this.$database.ref('events').orderByKey().equalTo(this.eventKey), null, () => {
				this.$bindAsArray('schedules2', this.$database.ref('event_schedules'), null, () => {
					this.$bindAsArray('seasonDraft', this.$database.ref('seasonDraftTemplate').orderByChild('eventKey').equalTo(this.eventKey), null, () => {
						this.$store.state.settings.courses = this.courses
						this.$store.state.startUp.schedules = this.schedules2
						this.hasLastSeason()
					})			
				})		
			})	
		})
	},
	validations () {
		return {
			season: {
				course: {
					required
				},
				ticketCount: {
					required,
					between: between(1, 200)
				},
				ticketPrice: {
					required,
					between: between(1, 9999)
				},
				discount: {
					required,
					between: between(1, 9999)
				},
				numberOfPayments: {
					required,
					between: between(1, 20)
				},
				numberOfWorkshops: {
					between: between(1, 10)
				},
				colorCode: {
					required
				}
			},
			courseName: {
				required
			},
			activityName: {
				required
			}
		}
	},
	computed: {
		courseActivities: {
			get () {
				return this.$store.state.schedules.courseActivities
			},
			set (v) {
				this.$store.state.schedules.courseActivities = v
			}
		},
		season: {
			get () {
				return this.$store.state.schedules.season
			},
			set (v) {
				this.$store.state.schedules.season = v
			}
		},
		importLoadingState: {
			get () {
				return this.$store.state.schedules.importLoadingState
			},
			set (v) {
				this.$store.state.schedules.importLoadingState = v
			}
		},
		getEventName () {
			// console.log(this.event, 'event to get')
			try {
				return this.event[0].eventName
			} catch (err) {
				return ''
			}
		},
		getEventCode () {
			try {
				return this.event[0].eventCode
			} catch (err) {
				return ''
			}
		},
		excelData: {
			get () {
				return this.$store.state.schedules.excelData
			},
			set (v) {
				this.$store.state.schedules.excelData = v
			}
		},
		// getLatestSeason () {
		// 	try {
		// 		if (this.event[0].seasons.length != 0) {
		// 			let lastSeason = this.$store.getters['startUp/getPlainValue'](this.$lodash.last(this.event[0].seasons))
		// 			console.log(lastSeason, 'latest season')
		// 			this.season.seasonNumber = ++lastSeason.seasonNumber
		// 			return ++lastSeason.seasonNumber
		// 			// return ++this.event[0].seasons.length
		// 		} else {
		// 			return 1
		// 		}
		// 	} catch (err) { return 1 }
		// },
		getLastSeasonColorCode () {
			try {
				this.$bindAsArray('events3', this.$database.ref('events'))
				let event = this.$lodash.find(this.events3, e => {
						return e['.key'] === this.eventKey
					})
					let seasonLen = event.seasons.length
					let season = event.seasons[seasonLen-1]
					let seasonBatches = this.$lodash.filter(this.schedules2, s => {
						return s.eventKey === this.eventKey && s.seasonName === season.seasonName
					})
					let lastBatch = this.$lodash.maxBy(seasonBatches, b => {
						return b.batchNumber
					})
					let orientation = lastBatch.activities[0]
					// return orientation.startDate
					// let seasonLen = event.seasons.length
					// 			console.log('orientation', orientation)
					// console.log('colorOpt', this.colorOpt)
					return orientation.classes		
					// this.clearDataAfterSaveAsDraft()
			} catch (err) {
				return ''
			}
		},
		colorOpt () {
			// console.log(this.getLatestSeason, 'last seasn')
			if (this.getLastSeason < 2) {
				// if (this.getseason)
				let events = this.$store.state.startUp.events
				let colorCodes = [...this.$store.state.startUp.colorOpt]
				for (var i = 0; i < events.length; i++) {
					if (typeof events[i].seasons !== 'undefined') {
						for (var j = 0; j < colorCodes.length; j++) {
							if (events[i].seasons[0].colorCode === colorCodes[j].value) {
								colorCodes[j].visible = false
							}
						}
					}
				}
				let filter = this.$lodash.filter(colorCodes, c => {
					return c.visible === true
				})
				return filter
			} else {
				let events = this.$store.state.startUp.events
				let colorCodes = [...this.$store.state.startUp.colorOpt]
				for (var i = 0; i < events.length; i++) {
					if (typeof events[i].seasons !== 'undefined') {
						for (var j = 0; j < colorCodes.length; j++) {
							if (events[i].seasons[0].colorCode === colorCodes[j].value) {
								colorCodes[j].visible = false
							}
						}
					}
				}
				return colorCodes
			}
    	},
		getLastSeason () {
			try {
				let event = this.$store.getters['startUp/getEvent'](this.eventKey)
				var len = event.seasons.length
				return len-1
			} catch (err) {
				return 1
			}
		},
		isHasWorkshop () {
			let courseActivities = this.courseActivities
			let isHas = false
			this.$lodash.forEach(this.courseActivities, ca => {
				if (ca.value === 'workshop' || ca.value === 'workshops') {
					// console.log('has a workshop')
					isHas = true
					return
				}
			})
			return isHas
		},
		getInstallmentAmount () {
			try {
				let amount = (parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)) + this.season.discount
				let isNan = parseInt(amount) || 0
				// console.log('isnan', isNan)
				return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			} catch (err) { return 0 }
		},
		getTotalAmount () {
			try {
				let amount = parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)
				let isNan = parseInt(amount) || 0
				// console.log('isnan', isNan)
				return isNan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
			} catch (err) { return 0 }
		},
		getInstallmentAmount2 () {
			try {
				let amount = (parseFloat(this.season.ticketCount) * parseFloat(this.season.ticketPrice)) + this.season.discount
				let isNan = parseInt(amount) || 0
				// console.log('isnan', isNan)
				return isNan
			} catch (err) { return 0 }
		},
		getLastBatchOrientation () {
			try {
				this.$bindAsArray('events3', this.$database.ref('events'))
				let event = this.$lodash.find(this.events3, e => {
					return e['.key'] === this.eventKey
				})
				let seasonLen = event.seasons.length
				let season = event.seasons[seasonLen-1]
				let seasonBatches = this.$lodash.filter(this.schedules2, s => {
					return s.eventKey === this.eventKey && s.seasonName === season.seasonName
				})
				let lastBatch = this.$lodash.maxBy(seasonBatches, b => {
					return b.batchNumber
				})
				let orientation = lastBatch.activities[0]
				return orientation.startDate
				// let seasonLen = event.seasons.length
		 		// console.log('lastBatch', lastBatch)
			} catch (err) {
				return {}
			}
		},
		// getLatestSeason () {
		// 	try {
		// 		if (this.event[0].seasons.length != 0) {
		// 			return ++this.event[0].seasons.length
		// 		} else {
		// 			return 1
		// 		}
		// 	} catch (err) {
		// 		return 1
		// 	}
		// },
		getSeasonStartMinDate () {
			if (this.getLatestSeason >= 2) {
				return this.getLastBatchOrientation
			} else {
				return this.$mathMixin.addDays(new Date(), 1)
			}
		},
		// getCourseActivities () {
		// 	// try {
		// 		console.log('course n cathc', this.courses)
		// 	 	let course = this.$lodash.find(this.courses, c => {
		// 	 		return c['.key'] === this.season.course
		// 		 })
		// 		 	console.log('course n cathc', this.courses)
		// 	 	return course
		// 	// } catch (err) {
		// 	// 	return []
		// 	// }
	    // },
		// courseOpt () {
		// 	let opt = this.$lodash.map(this.courses, c => {
		// 		return {label: c.courseName, value: c['.key']}
		// 	})
		// 	return opt
		// },
		newCourseModal: {
			get () {
				return this.$store.state.schedules.newCourseModal
			},
			set (v) {
				this.$store.state.schedules.newCourseModal = v
			}
		},
		uploadNewSeasonBatchesModal: {
			get () {
				return this.$store.state.schedules.uploadNewSeasonBatchesModal
			},
			set (v) {
				this.$store.state.schedules.uploadNewSeasonBatchesModal = v
			}
		},
		// courseActivities () {
		// 	// try {
		// 		let course = this.$lodash.find(this.courses, c => {
		// 			return c['.key'] === this.season.course
		// 		})
		// 		console.log('course n com', course)
		// 		// this.courseActivities = course.activities
		// 		return []
		// 	// } catch (err) {
		// 	// 	return []
		// 	// }
		
			
		// }
	},
	data () {
		return {
			testbatches: [],
			// seasonColorClass: {
			// 	['background-color']: { h: 150, s: 0.66, v: 0.30 },
			// 	'height': '100px', 
			// 	'width': '500px'
			// },
		
			seasonColor: {
				hex: '#1C5C3C'
			},
			seasonColorClass: {
				color: 'red',
				[`background-color`]: '#1C5C3C',
				fontSize: '13px',
				height: '100px',
				width: '500px',
				border: '1px solid black'
			},
			files: [],
			seasonNumber: '',
			// courseActivities: [],
			
		}
	}, // end of data
	methods: {
		getLatestSeason () {
			try {
				if (this.event[0].seasons.length != 0) {
					let lastSeason = this.$store.getters['startUp/getPlainValue'](this.$lodash.last(this.event[0].seasons))
					console.log(lastSeason, 'latest season')
					this.season.seasonNumber = ++lastSeason.seasonNumber
					// return ++this.event[0].seasons.length
				} else {
					 this.season.seasonNumber = 1
				}
			} catch (err) { this.season.seasonNumber = 1 }
		},
		removeFile () {
			this.files.splice(0, 1)
		},
		hasLastSeason () {
			try {
				if (this.getLastSeason > 1) {
					console.log(this.getLastSeasonColorCode, 'color code')
					console.log(this.colorOpt, 'color code')
					let color = this.$lodash.find(this.colorOpt, c => {
						return c.value === this.getLastSeasonColorCode
					})
					this.season.colorCode = color.value
					console.log(color, 'color code')
				}
			} catch (err) {}
		},
	
		importTemplate () {
			return new Promise((resolve, reject) => {
				function get_header_row(sheet) {
				var headers = [], range = XLSX.utils.decode_range(sheet['!ref']);
				var C, R = range.s.r; /* start in the first row */
				for(C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
					var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */
					var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
					if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
					headers.push(hdr);
				}
				return headers;
			}

			function fixdata(data) {
				var o = "", l = 0, w = 10240;
				for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
				o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
				return o;
			}


			var file = this.files[0].file
			var i, f;
			var state = {
				tickets:[{name:"test"}],
				headers:["Test header"]
			}
			
			var worksheet2 = null
				var reader = new FileReader(),
          name = file.name
          
				reader.onload = function(e) {
					var results, 
						data = e.target.result, 	
						fixedData = fixdata(data), 
						workbook = XLSX.read(btoa(fixedData), {type: 'base64'}), 
						firstSheetName = workbook.SheetNames[0], 
						worksheet = workbook.Sheets[firstSheetName]
					state.headers = get_header_row(worksheet)	
					results = XLSX.utils.sheet_to_json(worksheet)
					state.tickets=results
				}
				reader.readAsArrayBuffer(file)

			resolve(state)
			// this.$store.state.schedules.template = this.$store.getters['startUp/getPlainValue'](seasonTemplate)
			// this.$refs.stepper.next()
	
			
			})

		},
		importTemplate2 () {
			return new Promise((resolve, reject) => {
				function get_header_row(sheet) {
				var headers = [], range = XLSX.utils.decode_range(sheet['!ref']);
				var C, R = range.s.r; /* start in the first row */
				for(C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
					var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */
					var hdr = "UNKNOWN " + C; // <-- replace with your desired default 
					if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
					headers.push(hdr);
				}
				return headers;
			}

			function fixdata(data) {
				var o = "", l = 0, w = 10240;
				for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
				o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
				return o;
			}


			var file = this.files[0].file
			var i, f;
			var state = {
				tickets:[{name:"test"}],
				headers:["Test header"]
			}
			var state2 = {
				tickets:[{name:""}],
				headers:[]
			}
			let data = []
			var worksheet2 = null
			// for (i = 0, f = files[i]; i != files.length; ++i) {
				var reader = new FileReader(),
          name = file.name
          
				reader.onload = function(e) {
					var results, 
						data = e.target.result, 	
						fixedData = fixdata(data), 
						workbook = XLSX.read(btoa(fixedData), {type: 'base64'}), 
						firstSheetName = workbook.SheetNames[0], 
						worksheet = workbook.Sheets[firstSheetName]
					state.headers = get_header_row(worksheet)	
					results = XLSX.utils.sheet_to_json(worksheet)
					state.tickets=results
				}
				reader.readAsArrayBuffer(file)
					

				var reader2 = new FileReader(),
          name = file.name
          
				reader2.onload = function(e) {
					var results, 
						data = e.target.result, 	
						fixedData = fixdata(data), 
						workbook = XLSX.read(btoa(fixedData), {type: 'base64'}), 
						firstSheetName = workbook.SheetNames[1], 
						worksheet = workbook.Sheets[firstSheetName]
					state2.headers = get_header_row(worksheet)	
					results = XLSX.utils.sheet_to_json(worksheet)
					console.log(results, 'results in import')
						state2.tickets=Object.assign({}, results[0])
				}
				reader2.readAsArrayBuffer(file)
			// let seasonTemplate = { template: state}
		
			// console.log(reader2, 'reader2')
			// console.log(data, 'data')
			// console.log(state2, 'state2')
			resolve(this.$store.getters['startUp/getPlainValue'](state2))
			// this.$store.state.schedules.template = this.$store.getters['startUp/getPlainValue'](seasonTemplate)
			// this.$refs.stepper.next()
	
			
			})
		},
		generateTemplate () {
			let numberOfPayment = this.season.numberOfPayments
			
			let numOfWorkshops = this.season.numberOfWorkshops
			
			let courseActivities = this.courseActivities

			this.$store.state.schedules.seasonTemplateID = sri(10)

			let seasonInfo =[{ 
				course: this.season.course,
				seasonNumber: this.season.seasonNumber,
				ticketCount: this.season.ticketCount,
				ticketPrice: this.season.ticketPrice,
				discount: this.season.discount,
				installmentAmount: this.getInstallmentAmount,
				totalAmount: this.getTotalAmount,
				numberOfPayment: this.season.numberOfPayments,
				numberOfWorkshops: this.season.numberOfWorkshops,
				colorCode: this.season.colorCode,
				uid: this.$store.state.schedules.seasonTemplateID
			}]
			
			console.log(courseActivities, 'course')
			// console.log(this.courses, 'courses')
			var template = new Array()

			template.push({'Batch': ''})
			for (var c of courseActivities) {
				if (c.value === 'payments' || c.value === 'payment') {
					for (var i = 1; i <= numberOfPayment; i++) {
						template.push({[`Payment ${i}`]: ''})
					}
				} else if (c.value === 'workshops' || c.value === 'workshop') {
					for (var i = 1; i <= numOfWorkshops; i++) {
						template.push({[`Workshop ${i}`]: ''})
					}
				} else if (c.actType === 'date range') {
					console.log(c, 'date range')
					template.push({[`${c.label} Start`]: ''})
					template.push({[`${c.label} End`]: ''})
				}
				else {
					template.push({[`${c.label}`]: ''})
				}
				// console.log(c, 'c')
			}
			

			this.uploadNewSeasonBatchesModal = true
			console.log(template, 'temp')

			let test = [
				{
					cols: [{ name: "A", key: 0 }, { name: "B", key: 1 }, { name: "C", key: 2 }],
					data: [
						[ "id",    "name", "value" ],
						[    1, "sheetjs",    7262 ],
						[    2, "js-xlsx",    6969 ]
					]
				}
			]
	
			// export json to Worksheet of Excel
			// only array possible
			var template3 = XLSX.utils.json_to_sheet(template)
			var info = XLSX.utils.json_to_sheet(seasonInfo)
			// var pokemonWS = XLSX.utils.json_to_sheet(this.Datas.pokemons) 

			// A workbook is the name given to an Excel file
			var wb = XLSX.utils.book_new() // make Workbook of Excel

			// add Worksheet to Workbook
			// Workbook contains one or more worksheets
			XLSX.utils.book_append_sheet(wb, template3, 'Template') // sheetAName is name of Worksheet
			XLSX.utils.book_append_sheet(wb, info, 'SeasonInfo')
			// export Excel file
			let eventName = this.event[0].eventName
			let seasonNumber = this.latestSeason
			XLSX.writeFile(wb, `${eventName}_Season_${this.season.seasonNumber}.xlsx`) // name of the file is 'book.xlsx'
		},
		getCourseActivities () {
			let course = this.$lodash.find(this.courses, c => {
			 	return c['.key'] === this.season.course
			})
			// console.log('course n com', course)
			this.courseActivities = course.activities
			
		},
		downloadTemplate () {
			this.$v.season.$touch()
			if (!this.$v.season.$error) {
				this.generateTemplate()
			}
		},
		inputFile(newFile, oldFile, prevent) {
      //  console.log(newFile, 'inputFile')
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true
        })
      }
      if (!newFile && oldFile) {
        this.edit = false
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      // console.log(newFile, 'inputFilter')
      if (newFile && !oldFile) {
        if (!/\.(xlsx|.xlsm|.xltx)$/i.test(newFile.name)) {
          this.alert('File is not an excel')
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
		},
		nextStep () {
			if (this.files[0]) {
		
				let file = this.files[0].file
				xlsxParser.onFileSelection(file)
					.then(data => {
						var parsedData = data;
						// console.log(parsedData, 'parsedData')
						let numberOfBatches = this.$lodash.maxBy(parsedData.Template, b => {
							if (b.Batch) {
								let tes = this.$store.getters['startUp/extractNumber'](b.Batch)
								return tes[0]
							}
						})
						
						let lastBatchNumber = this.$store.getters['startUp/extractNumber'](numberOfBatches.Batch)
						
						let temp = this.$lodash.take(parsedData.Template, lastBatchNumber)

						let seasonTemplate = this.$lodash.forEach(temp, b => {
							
							let keys = this.$lodash.keys(b)
							this.$lodash.forEach(keys, k => {
								if (k != 'Batch') {
									b[k] = getJsDateFromExcel(b[k]).toString()
								}
							})
					
						})

						console.log(seasonTemplate, 'temp')


						
						// console.log(keys, 'keys')



						this.$store.state.schedules.seasonTemplate = seasonTemplate
						this.$store.state.schedules.seasonInfo = parsedData.SeasonInfo
						this.$refs.stepper.next()
					})
					.catch(err => {
						console.log(err, 'err')
						this.$q.notify({
							message: `Invalid template`,
							type: 'negative',
							color: 'negative',
							textColor: 'white',
							icon: 'warning'
						})
					})
				
			}

		},
		// test () {
		// 	// console.log('event'	, this.event)
		// 	// console.log('courseActivities'	, this.courseActivities)
		// 	// console.log('excelData'	, this.excelData)
		// 	// console.log(this.files, 'files')
		// 	// console.log(this.seasonColor, 'seasonColor')
		// 	// this.importTemplate2()
		// 	// this.generateTemplate()
			
		// 	let animals = [
    //               {"name": "cat", "category": "animal"}
    //               ,{"name": "dog", "category": "animal"}
    //               ,{"name": "pig", "category": "animal"}
    //             ]
    //   let pokemon = [
    //               {"name": "pikachu", "category": "pokemon"}
    //               ,{"name": "Arbok", "category": "pokemon"}
    //               ,{"name": "Eevee", "category": "pokemon"}
    //             ]

		// 	var animalWS = XLSX.utils.json_to_sheet(animals) 
    //   var pokemonWS = XLSX.utils.json_to_sheet(pokemon) 

    //   // A workbook is the name given to an Excel file
    //   var wb = XLSX.utils.book_new() // make Workbook of Excel

    //   // add Worksheet to Workbook
    //   // Workbook contains one or more worksheets
    //   XLSX.utils.book_append_sheet(wb, animalWS, 'animals') // sheetAName is name of Worksheet
    //   XLSX.utils.book_append_sheet(wb, pokemonWS, 'pokemons')   

    //   // export Excel file
    //   XLSX.writeFile(wb, 'book.xlsx') // name of the file is 'book.xlsx'
			
		// },
		test () {
			
				console.log(this.$store.state.schedules.seasonTemplateID, 'seasonTemplateID')
		
		}
	}// end of methods
}
</script>
