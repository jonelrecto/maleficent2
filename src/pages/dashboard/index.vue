  <template>
  <div>
      <div class="container flex q-mt-xl" >
        <div class="row">
        <!-- <q-btn label="test" @click="test" /> -->
        <!-- registrants chart-->
        <div class="">
        <q-card inline class="q-ma-sm col-md-4 col-sm-6 col-12-xs" style="border-radius: 20px;">
          <q-card-title class="relative-position">
            <q-btn fab color="primary" icon="how_to_vote" class="absolute" style="top: 0; right: 8px; transform: translateY(-50%);" />
            <div class="ellipsis">
              <p class="q-headline">Registrants</p>
            </div>
          </q-card-title>
          <q-card-main>
             <apexcharts height="200" width="400" type="line" :options="registrantsLineData.chartOpt" :series="registrantsLineData.series" style="min-width: 250px; "></apexcharts>
          </q-card-main>
          <q-card-separator />
          <q-card-actions class="q-pa-md bg-primary">
           <p class="q-title text-white">No. of Registrants: {{totalRegistrants}}</p>
          </q-card-actions>
        </q-card>
        </div>
        <div class="">
          <!-- hit rate chart-->
        <q-card inline class="q-ma-sm col-md-4 col-sm-6 col-12-xs "  style="border-radius: 20px;">
          <q-card-title class="relative-position">
            <q-btn fab color="amber" icon="timeline" class="absolute" style="top: 0; right: 8px; transform: translateY(-50%);" />
            <div class="ellipsis">
              <p class="q-headline">Hit Rate</p>
            </div>
          </q-card-title>
          <q-card-main>
             <apexcharts width="400" height="200" type="line" :options="getHitRateLineData.chartOpt" :series="getHitRateLineData.series" style="min-width: 250px;"></apexcharts>
          </q-card-main>
          <q-card-separator />
          <q-card-actions class="q-pa-md bg-amber">
           <p class="q-title text-white">Hit Rate % of Signed Models: {{getHitSigned}}%</p>
          </q-card-actions>
        </q-card>
          </div>
          <div class="">
        <q-card inline class="q-ma-sm col-md-4 col-sm-6 col-12-xs"  style="border-radius: 20px;">
          <!-- sales chart -->
          <q-card-title class="relative-position">
              <q-btn fab color="positive" icon="attach_money" class="absolute" style="top: 0; right: 8px; transform: translateY(-50%);" />
              <div class="ellipsis">
                <p class="q-headline">Sales</p>
              </div>
            </q-card-title>
            <q-card-main>
              <apexcharts width="400" height="200" type="line" :options="getSalesChartData.chartOpt" :series="getSalesChartData.series" style="min-width: 250px;"></apexcharts>
            </q-card-main>
            <q-card-separator />
            <q-card-actions class="q-pa-md bg-positive">
             <p class="q-title text-white">Sales Percent (%): {{getSalesPercent}}%</p>
            </q-card-actions>
          </q-card>
      </div>
        <div class="col-6 q-pa-sm">
          <q-table
           style="border-radius: 20px;"
            title="Upcoming Event"
            :data="getUpcomingSchedules"
            :columns="columns2"
            :pagination.sync="pagination"
            row-key="name"
          >
            <q-td slot="body-cell-date" slot-scope="props" :props="props">
              <p>{{$moment(props.row.startDate).format('ll')}}</p>
            </q-td>
            <q-td slot="body-cell-time" slot-scope="props" :props="props">
              <p>{{$moment(props.row.startDate).format('LT')}}</p>
            </q-td>
          </q-table>
        </div>
          <div class="col-6 q-pa-sm">
          <q-table
           style="border-radius: 20px;"
            title="Top Events"
            :data="topEventTable"
            :columns="columns"
            row-key="name"
            hide-header
            hide-bottom
          >
            <q-td slot="body-cell-index" slot-scope="props" :props="props">
              <p>{{props.row.__index+1}}</p>
            </q-td>
          </q-table>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import VueChart from 'vue-chart-js'


export default {
  name: 'activity',
  components: {
   VueChart,
   apexcharts: VueApexCharts,
  },
  mounted () {
    this.$bindAsArray('contractSigned', this.$database.ref('contractSigned'))
    this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
    this.$bindAsArray('models', this.$database.ref('models'))
    this.$bindAsArray('showUps', this.$database.ref('showUpModels'))
    this.$bindAsArray('payments', this.$database.ref('payment_transactions'))
  },
  computed: {
    userAccess () {
      // try {
      //   return this.$store.state.startUp.userLoggedIn.userAccess
      // } catch {
      //   return {}
      // }
    },
    getUpcomingSchedules () {
      // console.log('schedules', this.schedules)
      let allAct = new Array()
      this.$lodash.forEach(this.schedules, sc => {
        this.$lodash.forEach(sc.activities, act => {
          let today = new Date()
          var dif =  this.$mathMixin.dayDiff(today, new Date(act.startDate))
          if (dif >= 0 && act.type !== 'payment') {
            allAct.push(act)
          }
        })
      })
      // console.log('allAct', )
      return this.$lodash.orderBy(allAct, function (value) {return new Date(value.startDate)}, 'asc')
    },
    topEventTable () {
      let groupByEvent = this.$lodash.groupBy(this.contractSigned, 'eventName')
      let dataMap = this.$lodash.map(groupByEvent, (value, key, obj) => {
        var ret = {
          models: obj[key].length,
          eventName: key
        }
        return ret
      })
      return this.$lodash.orderBy(dataMap, 'models', 'desc')
    },
    getSalesChartData () {
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
      console.log('salesChartData', salesChartData)
      return salesChartData
    },
    getSalesPercent () {
      // console.log('payments', this.payments)
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
    },
    getHitRateLineData () {
      try {
        let hitRate = this.getHitMonth
        let months = this.$lodash.keys(hitRate)
        console.log('hit rate', hitRate)
        let dataCollected = this.$lodash.map(hitRate, (value, key, obj) => {
          obj[key] = obj[key]
          return obj[key]
        })
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
        let hitChartData = {
          chartOpt: chartOpt,
          series : series
        }
        // console.log('hit chart date', hitChartData)
        return hitChartData
      } catch {
        return []
      }
    },
    getHitMonth () {
      try {
        let reg = [...this.contractSigned]

        this.$lodash.map(reg, r => {
          var dateMonthAdded = this.$moment(new Date(r.dateAdded), 'YYYY-MM-DD').format('MMMM')
          r.dateMonthAdded = dateMonthAdded
          return r
        })
        let contractSigned = this.$lodash.groupBy(reg, 'dateMonthAdded')
        // showup
        let showUP = [...this.showUps]
        this.$lodash.map(showUP, r => {
          var dateMonthAdded = this.$moment(new Date(r.dateAdded), 'YYYY-MM-DD').format('MMMM')
          r.dateMonthAdded = dateMonthAdded
          return r
        })
        let showUps2 = this.$lodash.groupBy(showUP, 'dateMonthAdded')
        console.log('getHitMonth contractSigned', contractSigned)
        let hitRateMonth = this.$lodash.map(contractSigned, (value, key, obj) => {
          // obj[key]
          var getHitSigned = parseFloat(contractSigned[key].length) / parseFloat((showUps2[key].length + contractSigned[key].length))
          var toPercent = getHitSigned * 100 || 0
          obj[key] = toPercent.toFixed(2)
          console.log('hitratemonth obj', obj)
          return obj
        })[0]
        console.log('hitRateMonth', hitRateMonth)
        return hitRateMonth
      } catch {
        return []
      }
    },
    getHitSigned () {
      try {
        let signed = this.contractSigned.length
        let showUp = parseInt(this.showUps.length)+ parseInt(this.contractSigned.length)
        let hitrateSigned = parseFloat(signed) / parseFloat(showUp)
        let getTotal = hitrateSigned * 100 || 0
        return getTotal.toFixed(2)
      } catch {
        return 0
      }
    },
    registrantsLineData () {
      let registrants = this.getRegistranstByMonth
      let months = this.$lodash.keys(registrants)
      let dataCollected = this.$lodash.map(registrants, (value, key, obj) => {
        obj[key] = obj[key].length
        return obj[key]
      })
      let chartOpt = {
        chart: {
          id: 'registrantChart'
        },
        xaxis: {
          categories: months
        }
      }
      let series = [{
        name: 'Registrants',
        data: [...dataCollected]
      }]
      let lineChartData = {
        chartOpt: chartOpt,
        series : series
      }
      // console.log('lineChartData', lineChartData)
      return lineChartData
    },
    getRegistranstByMonth () {
      let reg = this.registrants
      // console.log('registrants', this.registrants)
      let changeDate = this.$lodash.map(reg, r => {
        var dateMonthAdded = this.$moment(new Date(r.dateCreated), 'YYYY-MM-DD').format('MMMM')
        r.dateMonthAdded = dateMonthAdded
        return r
      })
      let registrantsByMonth = this.$lodash.groupBy(changeDate, 'dateMonthAdded')
      // console.log('registrantsByMonth', registrantsByMonth)
      return registrantsByMonth
    },
    registrants () {
      let regArrays = new Array()
      regArrays.push(this.showUps)
      regArrays.push(this.models)
      regArrays.push(this.contractSigned)
      let registrants = this.$lodash.spread(this.$lodash.union)(regArrays)
      return registrants
    },
    totalRegistrants () {
      return this.registrants.length
    }
  },
  data () {
  	return {
      schedules: [],
      payments: [],
      chartOptions2: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
      },
      series: [{
        name: 'Registrants',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }],
      showUps: [],
      models: [],
      contractSigned: [],
      chartOptions: {responsive: true, maintainAspectRatio: true},
      chartData: {
        labels: ['January', 'February', 'march', 'april'],
        datasets: [
          {
            label: 'Registrants',
            backgroundColor: '#027be3',
            data: [40, 20,30, 50]
          }
        ]
      },
      // table
      columns: [
        {
          name: 'index',
          required: true,
          align: 'left',
          field: '__index',
          sortable: true,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'eventName',
          required: true,
          align: 'left',
          field: 'eventName',
          sortable: true
        },
        {
          name: 'models',
          required: true,
          align: 'center',
          field: 'models',
          sortable: true
        }
      ],
      columns2: [
        {
          name: 'title',
          required: true,
          align: 'left',
          label: 'Event Name',
          field: 'id',
        },
        {
          name: 'date',
          required: true,
          align: 'center',
          label: 'Date',
          sortable: true
        },
        {
          name: 'time',
          required: true,
          align: 'center',
          label: 'Time',
          field: 'startDate',
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
        }
      ],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 5 // current rows per page being displayed
      }
  	}
  },
  methods: {
    test () {
      // console.log('schedules', this.models)
      // let allAct = new Array()
      // this.$lodash.forEach(this.schedules, sc => {
      //   this.$lodash.forEach(sc.activities, act => {
      //     let today = new Date()
      //     var dif =  this.$mathMixin.dayDiff(today, new Date(act.startDate))
      //     if (dif >= 0 && act.type !== 'payment') {
      //       allAct.push(act)
      //     }
      //   })
      // })
      // // console.log('allAct', )
      // return this.$lodash.orderBy(allAct, function (value) {return new Date(value.startDate)}, 'asc')
    }
  }
}
</script>

<style>
</style>
