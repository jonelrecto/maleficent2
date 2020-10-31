<template>
	<q-page class=""> 
<div class="col-12 inhouseModelsFonts">
        <q-table
          grid
          hide-header
          :rows-per-page-options="[8,12,20,32,40]"
          :pagination.sync="pagination"
          :columns="columns"
          :data="getInhouseSorted"
          :filter="filter"
          :selection="selection"
          :selected.sync="selected"
          row-key=".key"
        >
          <template slot="top-right" slot-scope="props">
            <q-btn rounded color="secondary" icon="check_box" class="animate-pop q-mr-sm hide-mobile" @click="openModelSelectedModal"><span class="q-ml-sm" style="font-size: 9px" >Selected Models</span>
               <q-chip floating color="red" v-if="getSelectedRowCount">{{getSelectedRowCount}}</q-chip>
            </q-btn>
            <q-search hide-underline inverted color="dark" v-model="filter" />
          </template>
            <template slot="top-left" slot-scope="props">
            <q-select
                inverted
                color="dark"
                class="text-white"
                v-model="porfolioSorter"
                :options="options"
                stack-label="Sort Options"
                style="min-width: 200px"
                clearable
                clear-value=""
              />
          </template>

          <div
            slot="item"
            slot-scope="props"
            class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 transition-generic q-my-sm"
            :style="props.selected ? 'transform: scale(0.95);' : ''"
            style="min-width: 200px; min-height: 220px; max-height: auto; max-width: 350px;"
          >
            <q-card class="transition-generic cursor-pointer q-ma-sm"
          :class="props.selected ? 'bg-teal' : ''" color="dark"
           style="border-radius:15px;min-width: 200px; min-height: 220px; max-height:auto; max-width: 350px;"
          @click.native="props.selected = !props.selected">
          <q-card-media overlay-position="bottom"  :style='"background-position: center;background-image: url("+props.row.photo+");background-repeat: no-repeat;background-size: cover;"' style="min-width: 200px; min-height: 220px; max-height: 220px; max-width: 350px;">
          <q-card-title slot="overlay">
             <q-checkbox v-model="props.selected" color="white" />
             <span class="capitalize">{{ props.row.firstName}} {{ props.row.lastName}}</span>
             <q-btn round color="white" size="sm" class="text-dark float-right" icon="account_box" style="z-index: 1000;" @click="showPorfolio(props.row)"></q-btn>
          </q-card-title>
        </q-card-media>
        <q-card-actions>
        	<div class="container row q-caption text-white q-my-sm">
        	<div class="col-6 q-mx-sm">
        		Height<span class="float-right">{{props.row.height}}</span><br>
        		Vital Stats<span class="float-right">{{props.row.chest}} - {{props.row.waist}} - {{props.row.hips}}</span><br>
        		Complexion<span class="float-right">{{props.row.complexion}}</span>
        	</div>
        	 <div class="col-4 q-mx-sm">
        		Age<span class="float-right">{{props.row.age}}</span><br>
        		Shoe Size<span class="float-right">{{props.row.shoeSize}}</span><br>
        		Shirt Size<span class="float-right">{{props.row.shirtSize}}</span>
        	</div>
        	<div class="col-12 q-my-sm">
					 <q-chip dense color="white" class="text-dark q-ma-xs">
					   Runway {{ props.row.ratings.runway}}<q-icon name="star" color=""/>
					</q-chip>
					<q-chip dense color="white" class="text-dark">
					   Commercial {{ props.row.ratings.commercial}}<q-icon name="star"/>
					</q-chip> 
					<q-chip dense color="white" class="text-dark q-ma-xs">
					   Photoshoot {{ props.row.ratings.photoshoot}}<q-icon name="star"/>
					</q-chip>        		
        	</div>
        </div>
        </q-card-actions>
            </q-card>
          </div>
        </q-table>
    </div>  

		<!-- sticky button -->
<!-- 		<q-page-sticky position="bottom-right" :offset="[60, 18]">
		  <q-btn
		    round
		    size="lg"
		    color="primary"
		    @click=""
		    icon="event"
		  />
		</q-page-sticky> -->

 <!-- scheduleModal -->
  <q-modal v-model="setCardModal" :content-css="{minWidth: '100vw', minHeight: '100vh'}" class="inhouseModelsFonts">
    <q-modal-layout class="text-center bg-light" >
      <q-toolbar
        color="dark"
        class="hide-desktop"
      >
        <q-toolbar-title class="absolute-center">
         <img id="logo_memp" alt="Maleficent Models Academy" src="~assets/memp.png">
        </q-toolbar-title>
                        <q-btn
                  flat
                  round
                  dense
                  @click="setCardModal = false"
                  icon="clear"
                  class="float-right vertical-middle"
                />
      </q-toolbar>
  <q-toolbar color="black" text-color="faded" style="height:60px; opacity:.8;" class="hide-mobile">
        <div class ="container row full-width">
            <div class="col-6">
                <q-toolbar-title>
                <q-btn flat style="color: #FFFFFF; text-align:center;" class=" q-ml-xl float-left"  @click="$router.push('/')">
                <img id="logo_memp" alt="Maleficent Models Academy" src="~assets/memp.png" class=" vertical-middle" >
                </q-btn>
                </q-toolbar-title>
            </div>
            <div class="col-6 row" style="height:100%;">
                <div class="col-3 q-pt-sm">
 <!--                <q-btn flat label=" ABOUT US " style="color: #FFFFFF; text-align:center;" class="text-weight-bold q-pa-xs q-mx-lg"/> -->
                </div>
                <div class="col-3 q-pt-sm">
                <!-- <q-btn flat label=" EVENTS &amp; COURSES " style="color: #FFFFFF; text-align:center;" class="text-weight-bold q-pa-xs q-mx-xs"/> -->
                </div>
                <div class="col-3 q-pt-sm">
                <!-- <q-btn flat label=" LASTEST NEWS " style="color: #FFFFFF; text-align:center;" class="text-weight-bold q-pa-xs q-mx-lg"/> -->
                </div>
                <div class="col-3 q-pt-sm">
                <q-btn
                  flat
                  round
                  dense
                  @click="setCardModal = false"
                  icon="clear"
                  class="float-right vertical-middle"
                />
                <!-- <q-btn outline rounded label=" SIGN-IN " icon-right="account_box" color="white" style=" text-align:center;" class="text-weight-bold q-pa-xs q-mx-lg" @click="$router.push('/signin')"/> -->
                </div>
            </div>
        </div>
    </q-toolbar>

    <!-- for mobile -->
     <div class="absolute-center text-center hide-desktop">
       <div class=" container row q-ma-sm" style="background-color: rgba(255, 255, 255,0.8); margin-top:70px;border-radius: 25px; height: auto; width:90vw">
      <div class="col-12">
          <h3 class="q-ma-lg">{{getPhotoGallerySelected.firstName}} {{getPhotoGallerySelected.lastName}}, {{getPhotoGallerySelected.age}}</h3>
                  <q-carousel class="text-white"  color="white" quick-nav arrows >
                    <q-carousel-slide v-for="pic,i in getPhotoGallery" :key="i" :style='"background-position: center;background-image: url("+pic.photo+");background-repeat: no-repeat;background-size: cover;"' style="width: 150px; height: 350px;" v-if="getPhotoGallerySelected !== null">
                    </q-carousel-slide>
                  </q-carousel>         
        </div>
      <div class="col-12 full-width text-left">
        <div class="q-title q-my-md q-mx-xl">
            Height<span class="float-right">{{getPhotoGallerySelected.height}}</span><br>
            Vital Stats<span class="float-right">{{getPhotoGallerySelected.chest}} - {{getPhotoGallerySelected.waist}} - {{getPhotoGallerySelected.hips}}</span><br>
            Complexion<span class="float-right">{{getPhotoGallerySelected.complexion}}</span><br>
            Shoe Size<span class="float-right">{{getPhotoGallerySelected.shoeSize}}</span><br>
            Shirt Size<span class="float-right">{{getPhotoGallerySelected.shirtSize}}</span>
        </div>
      </div>
     
      </div>
      </div>
 <!-- for mobile -->
      <div class="absolute-center row modal_size text-center q-ma-md hide-mobile q-mt-lg" >
              <div class=" container row q-ma-md " style="background-color: rgba(255, 255, 255,0.8); border-radius: 25px; height: 85vh; width:70vw">
              <div class="col-7 q-pa-md">
            <q-carousel class="text-white" style="border-radius:15px;"  color="white"  infinite autoplay>
              <q-carousel-slide :style='"background-position: center;background-image: url("+getSelectedGallery+");background-repeat: no-repeat;background-size: cover;"' style="width: 300px; height: 380px;" v-if="getSelectedGallery !== []">
              </q-carousel-slide>
            </q-carousel>
                        <h3 class="q-ma-lg">{{getPhotoGallerySelected.firstName}} {{getPhotoGallerySelected.lastName}}, {{getPhotoGallerySelected.age}}</h3>
          </div>
          <div class="col-5 q-pa-md bg-white row" style="border-radius: 25px;">
            <div class="col-12">
                <q-table
          grid
          hide-header
          :rows-per-page-options="[4]"
          :columns="galleryColumns"
          :data="getPhotoGallery"
           :pagination.sync="Modelpagination"
          :filter="filter"
          :selection="selectionGallery"
          :selected.sync="selectedGallery"
          row-key="name"
          class=""
        >

          <div
            slot="item"
            slot-scope="props"
            class="q-pa-xs col-xs-6  transition-generic"
            :style="props.selected ? 'transform: scale(0.90);': ''"
          >
          <q-card class="transition-generic cursor-pointer"
          :class="props.selected ? 'bg-grey-2 shadow-12' : ''"
           style="border-radius:10px;"
          @click.native="props.selected = !props.selected" >
          <q-card-media overlay-position="bottom"  :style='"background-position: center;background-image: url("+props.row.photo+");background-repeat: no-repeat;background-size: cover;"' style="min-width: 100px; min-height: 150px; max-height: 100px;">
        </q-card-media>
            </q-card>
          </div>
           <div slot="bottom" slot-scope="props" class="row flex-center fit">
        <q-btn
          round dense icon="chevron_left" color="dark" class="q-mr-md"
          :disable="props.isFirstPage"
          @click="props.prevPage"
        />
        <q-btn
          round dense icon="chevron_right" color="dark"
          :disable="props.isLastPage"
          @click="props.nextPage"
        />
      </div>
        </q-table>
      </div>
      <div class="col-12 full-width text-left">
      	<div class="q-mx-xl">
        		Height<span class="float-right">{{getPhotoGallerySelected.height}}</span><br>
        		Vital Stats<span class="float-right">{{getPhotoGallerySelected.chest}} - {{getPhotoGallerySelected.waist}} - {{getPhotoGallerySelected.hips}}</span><br>
        		Complexion<span class="float-right">{{getPhotoGallerySelected.complexion}}</span><br>
        		Shoe Size<span class="float-right">{{getPhotoGallerySelected.shoeSize}}</span><br>
        		Shirt Size<span class="float-right">{{getPhotoGallerySelected.shirtSize}}</span>
        </div>
      </div>
          </div>
        </div>
      </div>
      </q-modal-layout>
  </q-modal>
<!--   selectedModelsModal -->
        <q-modal v-model="selectedModelsModal" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="selectedModelsModal">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
                Model Porfolio/s to Send
            </q-toolbar-title>
                  <q-btn
                  flat
                  round
                  dense
                  @click="selectedModelsModal = false"
                  icon="clear"
                  class="float-right vertical-middle"
                />
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
          <div class="full-width q-mt-sm">
              <q-field
                  icon="perm_contact_calendar"
                  label="Showcasing Details"
                  label-width="12"
                  class="q-mx-lg"
                >
            <q-input class="col q-my-sm" color="teal" v-model="newShowcasing.clientName" stack-label="Client Name" />
            <q-input class="col q-my-sm q-caption" color="teal"  v-model="newShowcasing.link" stack-label="Link To Access" />
                <q-datetime
                  class="col q-my-sm"
                  format="MMM-DD-YYYY"
                  v-model="newShowcasing.dateExpires"
                  stack-label="Link Expiry Date"
                   :min="getToday"
                />
          </q-field>
        </div>
          <q-field
                  icon="dashboard"
                  label="Selected Models"
                  label-width="12"
                  class="q-mx-lg q-mt-md"
                >
          <q-search icon="search" inverted color="faded" class="text-white" v-model="selectSearch" clearable placeholder="Search name" />
          <q-scroll-area style="width: 100%; height: 85vh;">
                    <q-list  link dense v-for="s in filteredSelect" :key="s['.key']">
                <q-item>
                  <q-item-side icon="label" color="faded"/>
                  <q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
                  <q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="UnSelect(s)"/></q-item-side>
                </q-item>
                </q-list>
                <div v-if="getSelectedRowCount===0" class="text-center text-faded q-display-1 q-my-lg">No Models Listed</div>
          </q-scroll-area>
        </q-field>
          <div slot="footer">
             <q-btn  :label="'Confirm Selected Models ('+getSelectedRowCount+')'" color="teal" class="full-width" size="lg" @click="confirmPortfolio" :loading="loading"/>
          </div>
        </q-modal-layout>
      </q-modal>
	</q-page>
</template>
<script>
let sri = require('simple-random-id')
export default {
	name: 'InhouseModels',
	mounted () {
		this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
		this.$bindAsArray('paymentRecords', this.$database.ref('payment_transactions'))
		this.$bindAsArray('attendance', this.$database.ref('attendance'))
		this.$bindAsArray('inHouseModels', this.$database.ref('inhouseModels'))
		this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
	},
	computed: {
    filteredSelect: function(){
        return this.selected.filter((s) => {
          var reg = new RegExp(this.selectSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
		 getModelInfo () {
      try {
            let modelList = this.$lodash.filter(this.contractsigned, c => {
            return c.accountNumber === model.accountNumber
          })
          // console.log('model Info', modelList[0])
          return modelList[0]
      } catch (err) {
        return []
      }
    },
    getToday () {
      let date = this.$moment(new Date ()).format("MMM-DD-YYYY"); 
      console.log('getToday',date.toString())
      return date.toString()
    },
    getInhouseSorted () {
      try{
        let inhouse = this.$lodash.map(this.inHouseModels, as=> {
            as.shoeSizeSearch = as.shoeSize+' shoe size'
            as.shirtSizeSearch = as.shirtSize+' shirt size'
            as.vitalStats = as.chest+'-'+as.waist+'-'+as.hips
            as.runwaySearch = as.ratings.runway+' runway'
            as.commercialSearch = as.ratings.commercial+' commercial'
            as.photoshootSearch = as.ratings.photoshoot+' photoshoot'
            return as
        })
        if(this.porfolioSorter === null){
          return inhouse
        } else if (this.porfolioSorter === 'height_asc' || this.porfolioSorter === 'height_desc'){
          let heightGet = this.returnSortedHeight(inhouse)
          return heightGet
        } else if (this.porfolioSorter === 'age_asc' || this.porfolioSorter === 'age_desc'){
          let ageGet = this.returnSortedAge(inhouse)
          return ageGet
        } else if (this.porfolioSorter === 'runway_top' || this.porfolioSorter === 'commercial_top' || this.porfolioSorter === 'photoshoot_top'){
          let ratingsTop = this.returnSortedRatings(inhouse)
          return ratingsTop
        } else {
          return inhouse
        }
      } catch (err) {
        return []
      }
    },
     getModelInfo2 () {
      try {
        let modelList = this.$lodash.filter(this.contractSigned, c => {
          c.name = c.firstName
          return c
        })
        console.log(modelList)
        return modelList
      } catch (error) {
        return 0
      }
    },
		modelActivityAttended () {
			let actAttendance = new Array ()
			this.$lodash.map(this.attendance, a => {
				this.$lodash.map(a, (value, key, obj) => {
					if (key !== '.key') {
						var toPush = {
							['.key']: key,
							models: a[key].present
						}
						actAttendance.push(toPush)
					}
				})
			})
			// just change the models to presnt for the actual attendance
			// console.log('actAttendance', actAttendance)

			let modelKey = this.model['.key']
			let actAttended = new Array()
			for (var i = 0; i < actAttendance.length; i++) {
				let presentKeys = this.$lodash.keys(actAttendance[i].models)
				// console.log('present', presentKeys)
				for (var j = 0; j < presentKeys.length; j++) {
					// console.log('present key', presentKeys[j])
					if (modelKey === presentKeys[j]) {
						actAttended.push(actAttendance[i])	
					}
				}
			}
			let map = this.$lodash.map(actAttended, e=> {
					e.startDate = this.getActSchedule(e['.key']).startDate
					return e
			})
      let sorted = this.$lodash.orderBy(map,function(value) {return new Date(value.startDate)},'asc')
      // console.log('sorted',sorted)
      return sorted
		},
		isAlreadyInhouse () {
			var i = this.$lodash.findIndex(this.inHouseModels, im => {
				return im['.key'] === this.model['.key']
			})
			if (i <= -1) {
				return false
			} else {
				return true
			}
		},
		getAttendancePresents () {
			let att = this.attendance
			let presentModels = new Array()
			for (var i = 0; i < att.length; i++) {
				let keys = this.$lodash.keys(att[i])
				// console.log('keys', keys)
				for (var j = 0; j < keys.length; j++) {
					presentModels.push(att[i][keys[j]].present)
				}
			}
			return this.$lodash.compact(presentModels)
		},
		 getSelectedRowCount () {
        console.log('selectedL',this.selected.length)
        console.log('selectedL',this.selected)
        console.log(this.selectedGallery)
        return this.selected.length
      },
      get1st () {
      try {
        let modelList = this.$lodash.filter(this.inHouseModels, c => {
          c.name = c.firstName
          return c
        })
        console.log(modelList)
        return modelList[0]['.key']
      } catch (error) {
        return 0
      }
    },
		getModelBatch () {
			try {
				let batch = this.$lodash.filter(this.schedules, s => {
					return s['.key'] === this.model.batchKey
				})[0]
				return batch.batchNumber
			} catch (err) {
				return ''
			}	
		},
    getPhotoGallerySelected () {
      try {
        let model = this.selectedModel
        console.log('model',this.selectedModel)
        let gallery = this.$lodash.filter(this.inHouseModels, e=>{
          return e['.key'] === model['.key']
        })

        let photos = []
        this.$lodash.forEach(gallery[0].photoGallery, s=> {
          photos.push(s)
        })
        console.log('s',gallery)
        return gallery[0]

      } catch (err) {
        return []
      }
    },
    getPhotoGallery () {
      try {
        let model = this.selectedModel
        console.log('model',this.selectedModel)
        let gallery = this.$lodash.filter(this.inHouseModels, e=>{
          return e['.key'] === model['.key']
        })

        let photos = []
        this.$lodash.forEach(gallery[0].photoGallery, s=> {
          photos.push(s)
        })
        console.log('s',gallery)
        return photos

      } catch (err) {
        return []
      }
    },
    getSelectedGallery() {
      try {
          if(this.selectedGallery === []) {
            return 'assets/gallerydefault.png'
          } else {
            return this.selectedGallery[0].photo
          }
      } catch (err) {
        return 'assets/gallerydefault.png'
      }
    }
	},
	data () {
		return {
      loading: false,
      selectSearch: '',
      selectedModelsModal: false,
			  selectedGallery: [],
			   Modelpagination: {
          sortBy: null, // String, column "name" property value
          descending: false,
          page: 1,
          rowsPerPage: 4 // current rows per page being displayed
        },
      newShowcasing: {
        clientName: '',
        dateExpires: '',
        link: '',
        models: [],
        selected: [],
        id: ''
      },
			 selection: 'multiple',
       selectionGallery: 'single',
      selected: [],
			schedules: [],
			inHouseModels: [],
			attendance: [],
			paymentRecords: [],
			isEdit: false,
		setCardModal: false,
      selectedModel: {},
			model: {
				ratings: {
					commercial: 0,
					photoshoot: 0,
					runway: 0
				}
			},
			viewModelModal: false,
			schedules: [],
			contractSigned: [],
			filter: '',
			tableLoading: false,
        galleryColumns: [
        {
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: true
        },
        {
          name: 'photo',
          required: true,
          label: 'photo',
          align: 'left',
          field: 'photo',
        }
      ],
			columns: [
        {
          name: 'lastName',
          required: true,
          label: 'Last Name',
          align: 'left',
          field: 'lastName',
          sortable: true
        },
        {
          name: 'firstName',
          required: true,
          label: 'First Name',
          align: 'left',
          field: 'firstName',
          sortable: true
        },
        {
          name: 'event',
          required: true,
          label: 'Event',
          align: 'left',
          field: 'age',
          sortable: true
        },
        {
          name: 'season',
          required: true,
          label: 'Season',
          align: 'left',
          field: 'shirtSizeSearch',
          sortable: true
        },
        {
          name: 'batch',
          required: true,
          label: 'Batch',
          align: 'left',
          field: 'vitalStats',
          sortable: true
        },
        {
          name: 'gender',
          required: true,
          label: 'Gender',
          align: 'left',
          field: 'height',
          sortable: true
        },
        {
          name: 'fbEmail',
          required: true,
          label: 'Facebook Email',
          align: 'left',
          field: 'complexion',
          sortable: true
        },
        {
          name: 'fbEmqwail',
          required: true,
          label: 'Faceboqwok Email',
          align: 'left',
          field: 'shoeSizeSearch',
          sortable: true
        },
        {
          name: 'runwaySearch',
          required: true,
          label: 'runwaySearch Email',
          align: 'left',
          field: 'runwaySearch',
          sortable: true
        },
        {
          name: 'commercialSearch',
          required: true,
          label: 'commercialSearch Email',
          align: 'left',
          field: 'commercialSearch',
          sortable: true
        },
        {
          name: 'photoshootSearch',
          required: true,
          label: 'photoshootSearch Email',
          align: 'left',
          field: 'photoshootSearch',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'center',
          sortable: false
        }
      ],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 8 // current rows per page being displayed
      },
      porfolioSorter: '',
      options: [
        {
          label: 'Height (ASC)',
          value: 'height_asc'
        },
        {
          label: 'Height (DESC)',
          value: 'height_desc'
        },
        {
          label: 'Age (ASC)',
          value: 'age_asc'
        },
        {
          label: 'Age (DESC)',
          value: 'age_desc'
        },
        {
          label: 'Highest to Lowest (Runway)',
          value: 'runway_top'
        },
        {
          label: 'Highest to Lowest (Commercial)',
          value: 'commercial_top'
        },
        {
          label: 'Highest to Lowest (Photoshoot)',
          value: 'photoshoot_top'
        }
      ],
		}
	},
	methods: {
		rowClick (p) {
			// console.log('model', p)
			this.model = p
			console.log('p',this.model)
			this.viewModelModal = !this.viewModelModal
		},
		getBatchNumber (p) {
			// console.log('p', p)
			try {
				let batchKey = p.row.batchKey
				let batch = this.$lodash.filter(this.schedules, s => {
					return s['.key'] === batchKey
				})[0]
				// console.log('batch', batch)
				return batch.batchNumber
			} catch {
				return ''
			}
			
		},
		saveChange () {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to save change?',
			  ok: 'Save',
			  cancel: 'Cancel'
			}).then(() => {
				  let modelToSave = {...this.model}
					var key = modelToSave['.key']
					delete modelToSave['.key']
					this.$database.ref('contractSigned').child(key).update(modelToSave)
						.then(() => {
							this.$q.notify({
								message: 'Model Successfully change',
								type: 'positive'
							})
							this.isEdit = false
						})
						.catch(err => {
							this.$q.notify({
								message: `An error found, ${err}`,
								type: 'negative'
							})
							 this.isEdit = false
						})
				})
				.catch(() => {})
		},
		copyToInhouse () {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to copy in Inhouse models?',
			  ok: 'Save',
			  cancel: 'Cancel'
			}).then(() => {
				var toInhouse = {...this.model}
				var key = toInhouse['.key']
				delete toInhouse['.key']
				this.$database.ref('inhouseModels').child(key).set(toInhouse)
					.then(() => {
						this.$q.notify({
							message: 'Model Successfully copy to inhouse',
							type: 'positive'
						})
					})
					.catch(err => {
						this.$q.notify({
							message: 'An error occur' + err,
							type: 'negative'
						})
					})
				})
				.catch(() => {})
		},
		getActSchedule (actID) {
			// console.log('modelActivityAttended', this.modelActivityAttended)
			// var testVar = 'TS(1)_batch(1)_General Rehersal't
			for (var i = 0; i < this.schedules.length; i++) {
				for (var j = 0; j < this.schedules[i].activities.length; j++) {
					if (this.schedules[i].activities[j].id === actID) {
						return this.schedules[i].activities[j]
					}
				}
			}
		},
		test () {
      try {
        let model = this.selectedModel
        console.log('model',this.selectedModel)
        let gallery = this.$lodash.filter(this.inHouseModels, e=>{
          return e['.key'] === model['.key']
        })

        let photos = []
        this.$lodash.forEach(gallery[0].photoGallery, s=> {
          photos.push(s)
        })
        console.log('s',gallery)
        return gallery

      } catch (err) {
        return []
      }
		},
		getModelsPaymentTransactions (k) {
      try {
      	let model = k
        let payments = this.$lodash.filter(this.paymentRecords, p=> {
          return p.modelKey === model['.key']
        })
        console.log('modelpayments',payments)
        return payments       
      } catch (err) {
        console.log('error',err)
        return []
      }
    },
     showPorfolio (e){
        this.setCardModal = true
        this.selectedModel = e
        this.selectedGallery = [this.getPhotoGallery[0]]
        console.log('view',this.selectedModel)
    },
    returnSortedHeight(data) {
      try {
        if(this.porfolioSorter === 'height_asc'){
          let sorted = this.$lodash.orderBy(data, 'height','asc')
          console.log('height_asc',sorted)
          return sorted
        } else {
          let sorted = this.$lodash.orderBy(data, 'height','desc')
          console.log('height_desc',sorted)
          return sorted
        }
      } catch (err) {
        return []
      }
    },
    returnSortedAge(data) {
      try {
        if(this.porfolioSorter === 'age_asc'){
          let sorted = this.$lodash.orderBy(data, 'age','asc')
          console.log('age_asc',sorted)
          return sorted
        } else {
          let sorted = this.$lodash.orderBy(data, 'age','desc')
          console.log('age_desc',sorted)
          return sorted
        }
      } catch (err) {
        return []
      }
    },
    returnSortedRatings(data) {
      try {
        if(this.porfolioSorter === 'runway_top'){
          let sorted = this.$lodash.orderBy(data, 'ratings.runway','desc')
          console.log('runway_top',sorted)
          return sorted
        } else if (this.porfolioSorter === 'commercial_top'){
          let sorted = this.$lodash.orderBy(data, 'ratings.commercial','desc')
          console.log('commercial_top',sorted)
          return sorted
        } else {
          let sorted = this.$lodash.orderBy(data, 'ratings.photoshoot','desc')
          console.log('photoshoot_top',sorted)
          return sorted
        }
      } catch (err) {
        return []
      }
    },
    openModelSelectedModal() {
      this.selectedModelsModal = true
      let id = sri(5)
      this.newShowcasing.link = 'https://maleficentfrontpage.000webhostapp.com/#/porfolio/'+id
      this.newShowcasing.id= id
    },
    UnSelect(e) {
        let un = e
        let update = this.$lodash.filter(this.selected, no =>{
          if (no['.key'] !== un['.key']) {
            return no
          }
        })
        this.selected = update
    },
    confirmPortfolio () {
      try {
        this.loading = true
          if(this.selected.length === 0) {
              this.$q.notify({
                    message: `No Model Selected`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
            })
          } else {
            let porfolio = this.$lodash.map(this.selected, e=>{
                e.modelKey = e['.key']
                delete e['.key']
                return e
            })
            this.newShowcasing.models = porfolio
            console.log('showcasing',this.newShowcasing)
            this.$database.ref('showcasing').push(this.newShowcasing)
          .then(()=>{
               this.$q.notify({
                message: `Showcasing Details Saved`,
                type: 'positive',
                color: 'positive',
                textColor: 'white',
                icon: 'info'
              })
              this.loading = false
              this.selectedModelsModal = false
              this.newShowcasing.link = ''
              this.newShowcasing.clientName = ''
              this.newShowcasing.models = []
          })
          .catch((err)=> {
            console.log(err)
            this.$q.notify({
                message: `Showcasing Details Error on Saving`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                icon: 'warning'
              })
            this.loading = false
          })
          }        
        } catch (err) {
          console.log(err)
              this.$q.notify({
                    message: `Error Occured ${err}`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
            })
                this.loading = false
        }

    }
    //end of methods
	}
}
</script>
<style type="text/css">
.bgimg{
  background:
    linear-gradient(
      rgba(255, 255, 255, 0.911),
      rgba(255, 255, 255, 0.658)
    ),
    url("~/statics/skyscraper.jpg");
    background-repeat: repeat;
}
.inhouseModelsFonts{
  font-family: 'Raleway', sans-serif;
  margin: 0; padding: 0;
  box-sizing: border-box;
  }

.hide-desktop{
        display: none;
}

#logo_memp{
  max-height: 50px;
}
a{
text-decoration: none;
}
a:link {
    color:#929293;
}

/* visited link */
a:visited {
    color:#929293;
}

/* mouse over link */
a:hover {
    color: rgb(247, 0, 255);
}

/* selected link */
a:active {
    color: crimson;
}
.q-layout-footer .q-icon{
  font-size: 40px;
  padding: 10px;
}

@media (max-width: 960px){
  #sitemap{
    display: none;
  }
  #location{
    display: none;
  }

  #social{
    width: 100%;
  }

  .hide-mobile{
        display: none;
  }

  .hide-desktop{
     display: block;
  }

}	
</style>
