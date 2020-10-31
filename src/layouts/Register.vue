
<template>
  <div padding class="row justify-center" style="height: 100%;">
    <q-btn label="test button" @click="test"/>
  <div style="height: 100%;" class="mainContainer q-pa-sm">
    <div style="text-align:center;height: 100%;" class="q-pa-md"><h4>MODELS APPLICATION FORM</h4></div>
          <q-stepper flat ref="stepper" color="black" :alternative-labels="alt" :contractable="true" >
          <q-step default title="Event &amp; Courses">
                  <h6>Choose the event / course you want to join: </h6>
          <br>
          <div class="container event-cards items-start row" >
            <div v-for="event in events" :key="event['.key']" class="col-md-3 col-xs-6 q-pa-sm" id="card-wrapper"  @click="getEvent(event), $refs.stepper.next()" v-show="isHasBatch(event)">
              <q-card>
                <q-card-media id="news">
                  <div class="image-holder" v-ripple>
                  <img :src="event.pagePhotos.eventLogoUrl">
                  </div>
                </q-card-media>
              </q-card>
            </div>
          </div>
     <q-stepper-navigation class="q-pa-md float-right q-my-sm">
        <!-- <q-btn class="q-ml-sm q-mb-xl" icon-right="send" color="black" @click="$refs.stepper.next()">Next Step</q-btn> -->
      </q-stepper-navigation>
    </q-step>

<!-- 2nd Step Information -->
      <q-step title="Model Information">
        <div class="">
        <p>Please fill out completely all the fields below.</p>
         <q-icon name="person" class="text-primary" style="font-size:20px;"/><small class="text-dark"> Personal Details</small><br>
        <div class="container row q-py-sm">
          <div class="col-md-4  col-xs-12 q-px-sm">
            <q-input float-label="First Name" value="" v-model="newModel.firstName"/>
          </div>
           <div class="col-md-5 col-xs-12 q-px-sm">
            <q-input float-label="Last Name" value="" v-model="newModel.lastName"/>
          </div>
           <div class="col-md-3  col-xs-12 q-px-sm">
            <q-input float-label="Middle Initial" value="" v-model="newModel.middleInitial"/>
          </div>
        </div>
        <div class="container row  q-py-sm">
          <!-- is below 4yrs old -->
          <div v-if="isBelow4" class="col-md-3 col-xs-12 q-px-sm" >
            <q-select
              v-model="newModel.age"
              float-label="Age"
              radio
             :options="isInfant"
            />
          </div>
          <!-- is above 4yrs old -->
          <div v-if="!isBelow4" class="col-md-2 col-xs-12 q-px-sm">
            <q-input  type="number" float-label="Age" value="" v-model="newModel.age" @blur="$v.newModel.age.$touch" :error="$v.newModel.age.$error"/>
          </div>
          <!-- <div class="col-md-5 col-xs-12 q-px-sm">
             <q-datetime  float-label="Birthdate" type="date" value="" v-model="newModel.birthdate"/>
          </div> -->
           <div class="col-md-4 col-xs-12 q-px-sm">
              <q-select float-label="Gender" :options="genders" value="" v-model="newModel.gender"/>
          </div>
        </div>
        <div class="container row  q-py-sm">
          <q-input type="textarea" float-label="Complete Address" :max-height="100" rows="" class="col-12" value="" v-model="newModel.address"/>
        </div><br>
        <q-icon name="phone" class="text-primary" style="font-size:20px;"/><small class="text-dark" value=""> Contact Details</small>
        <small class="text-warning float-right" value=""> <q-icon name="warning" style="font-size:20px;"/> Minors should put the contact details of their parent/guardian </small><br>
        <div class="container row q-py-sm full-width">
          <div class="col-md-6 col-xs-12 q-px-sm">
            <q-input type="number" float-label="Telephone Number" prefix="(02)" value="" v-model="newModel.telNumber"/>
          </div>
          <div class="col-md-6 col-xs-12 q-px-sm">
           <q-input type="email" float-label="Facebook Email Address" suffix="@example.com" value="" v-model="newModel.email"/>
          </div>
          <div class="col-md-6 col-xs-12 q-px-sm">
           <q-input type="number" float-label="Mobile Number" prefix="+63" value="" v-model="newModel.mobileNumber"/>
          </div>
        </div><br>
        </div>

        <q-stepper-navigation class="float-right q-pa-md q-my-sm">
          <q-btn class="q-mr-sm" color="black" flat @click="$refs.stepper.previous()">Back</q-btn>
          <q-btn color="black" icon-right="send" @click="$refs.stepper.next()">Next</q-btn>
          <!-- @click="$refs.stepper.next()"" -->
        </q-stepper-navigation>
        <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
          </transition>
          <q-inner-loading :visible="visible2">
            <q-spinner-cube size="50px" color="purple" />
          </q-inner-loading>
      </q-step>

<!-- 3rd Step -->
    <q-step title="Model Porfolio">
        <q-icon name="format_list_bulleted" class="text-primary" style="font-size:20px;"/><small class="text-dark"> More about you</small><br>
         <div class="container row  q-py-sm">
          <q-input type="textarea" float-label="Past Modelling Experience" :max-height="100" rows="3" class="col-12" value="" v-model="newModel.pastModelExp"/>
        </div><br>
         <q-icon name="photo" class="text-primary" style="font-size:20px;"/><small class="text-dark"> Upload your photos</small><br><br>
        <div class="container row q-py-sm">
          <q-uploader
            class="col-12 q-pa-sm"
            :url="newModel.photo"
            name="modelPic1"
            hide-upload-progress
            float-label="Model Portfolio 1"
            hide-upload-button
            auto-expand
            @add="(photoAdded)"
            @remove="(photoRemoved)"
            ref="upld"
            extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'"
          />
          <q-uploader
            class="col-12 q-pa-sm"
            :url="newModel.photo2"
            name="modelPic2"
            hide-upload-progress
            float-label="Model Portfolio 2"
            hide-upload-button
            auto-expand
            @add="(photoAdded2)"
            @remove="(photoRemoved2)"
            ref="upld2"
            extensions="'.gif,.GIF,.jpg,.JPG,.jpeg,.JPEG,.png,.PNG'"
          />
        </div><br>
        <div class="container row q-py-sm">
        <q-checkbox v-model="check1" @input="opened = true" color="primary" class="q-body-1" label="I have read and agree to the <a href=''>user agreement</a>.<br>View our <a href=''>privacy policy</a>." />

        </div>
        <q-stepper-navigation class="float-right q-pa-md q-my-sm">
          <q-btn class="q-mr-sm" color="black" flat @click="$refs.stepper.previous()">Back</q-btn>
          <q-btn color="black" icon-right="send" v-on:click="$refs.stepper.next(), posting()">Submit</q-btn>
          <!-- @click="$refs.stepper.next()"" -->
        </q-stepper-navigation>
        <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
          </transition>
          <q-inner-loading :visible="visible2">
            <q-spinner-cube size="50px" color="purple" />
          </q-inner-loading>
      </q-step>

<!-- Verification 4th Step -->
      <q-step title="Verification">
        <div v-show="showCodeInput">
        <q-input  type="number" float-label="Enter Code" value="" v-model="verificationCode"/>
        <small class="text-faded">
         A code has been sent to your device via SMS. You may request another code after one minute.
        </small>
        </div>
              <div v-show="showVerificationText" class="text-center">
                <br><br>
                <q-icon name="portrait" style="font-size:150px;" /><br>
                <h4><b>
                We have verified your mobile number.<br>
                Please wait while your profile undergo online screening.</b>
                </h4>
              </div>
          <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >

          </transition>
          <q-inner-loading :visible="visible">
            <q-spinner-cube size="50px" color="purple" />
          </q-inner-loading>

        <q-stepper-navigation class="float-right q-pa-md">
          <q-btn class="q-ml-sm" color="black" flat @click="posting()" v-show="showCodeInput">Resend</q-btn>
          <q-btn color="black" @click="verifyCode" v-show="showCodeInput">Verify</q-btn>
        </q-stepper-navigation>
      </q-step>

      <q-step title="Done!" style="">
        <div class="text-center full-width qStepFinal" style="">
        <span class="headerText"><b>Congratulations!</b><span class="text-dark"> {{newModel.firstName}}</span></span><br>
        <span class="doneText">for passing our online screening for</span>
            <div class="image-holder" v-ripple>
              <img :src="eventPagePhoto" class="eventPagePhoto" style="width:350px; height:auto;">
            </div>
        <span class="doneText">We are inviting you to attend our orientation to be official candidate</span><br><br>
        <span class="q-caption text-orange">Screenshot this section below for your reference</span>
        <br>
        <div class="container row full-width bg-info text-white locatorDiv" style="">
          <div class="col-12 q-pa-sm">
            <q-icon name="access_time" class="scheduleIcon" /> <span class="scheduleText text-weight-bolder">  {{$moment(orientationFilter.startDate).format('LLLL')}} </span>
            <!-- SEPTEMBER 09, 2018, SUNDAY 8AM -->
          </div>
          <div class="col-12 q-pa-sm">
            <q-icon name="location_on" class="scheduleIcon" /> <span class="scheduleText text-weight-bolder"> 3RD FLOOR, FORAB BLDG. 121 KAMUNING ROAD, QUEZON CITY</span>
          </div>
          <div class="mapouter col-12 q-pa-sm">
                <div class="gmap_canvas">
                  <iframe width="800" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=Forab%20Building%20Kamuning%20Quezon%20City%2C%20Philippines&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                  <a href="https://www.embedgooglemap.net"></a>
              </div></div>
        </div><br>
          <div class="q-pa-sm">
            <q-icon name="commute" class="scheduleIcon" /><span class="doneText"> HOW TO GO: </span>
           <p class="q-body-1"><br><q-icon name="near_me"/> From <b>North Edsa</b>, Ride a bus going to Cubao,
              then ask the driver if they can drop you off at EDSA KAMUNING then if yes,
              tell them to drop you off at Edsa Kamuning Mercury Drug store from there
              you can just walk towards Forab building (you may ask someone for directions).
              <br><br>  <q-icon name="near_me"/> From Edsa Cubao, Just ride a bus going to Fairview then ask the driver
              to drop you off at Edsa Kamias/Kamuning. You may ride a jeepney passing tru EDSA.
              Just ask the driver to drop you off at Forab Building. </p>
          </div>
          <br>
          <div class="row bg-red-5 text-white" style="border-radius: 30px;">
          <div class="col-12 q-pa-sm">
            <q-icon name="error" class="scheduleIcon" /> <span class="scheduleText text-weight-bolder"> REMINDERS</span>
            <p class="q-body-1"><br><q-icon name="label_important"/>  All Participant below 20 years old must be accompanied by their parent. This is mandatory.</p>
            <p class="q-body-1"><br><q-icon name="label_important"/>  Bring any of the following if available :<br><br>
            <ul ><li>NSO birth certificate of the model</li>
            <li>Xerox Copy of 1 Valid ID</li> </ul></p>
          </div>
        </div>
        <br>
        <div class="">
          <p class="q-title text-primary">We accept a very <b>LIMITED</b> numbers of candidates for this event so get your slot now!</p>
          <p class="headerText text-weight-bolder text-dark q-mb-xl">SEE YOU ! <q-icon name="mood" /></p>
        </div>
        </div>

        <q-stepper-navigation class="q-pa-md float-right">
          <!-- <q-btn color="red-14">Restart Form</q-btn> -->
        </q-stepper-navigation>
      </q-step>

      <q-stepper-navigation>
      </q-stepper-navigation>

    </q-stepper>
                       <q-modal minimized v-model="opened" :content-css="{width: '50vw', minHeight: '85vh', maxWidth: '95vw', height: '95vh'}" class="modalMobile">
                <div class=" q-pa-md full-width container">
                    <br>
                <h4><q-icon name="label_important" class="text-primary"/> User Agreement</h4>
                <p>Lorem ipsum dolor sit amet, mea laoreet posidonium ea. Eu mea alienum concludaturque, natum falli essent vel ad. Ei pri veritus verterem, ea congue sanctus ponderum eos, ut vidisse aperiri quo. Ut eam falli tollit blandit, everti invidunt an vel. Cum tollit sanctus probatus eu.
Ut labores constituto duo, quo magna gubergren ut. Ei quo explicari patrioque intellegebat, ad vix meliore qualisque. Ex meliore corrumpit quo. Doming tractatos ut vix, clita definitiones reprehendunt mea ei. Esse sonet tractatos ei per, his semper appellantur interpretaris ei, ea probo perpetua pro. Cu nullam dicunt mei.
Novum delicatissimi te mei, molestie necessitatibus ei eos. Ne ius agam prodesset vulputate, ad eum dicit graece.
                </p>
                <h4><q-icon name="label_important" class="text-primary"/> Privacy Policy</h4>
                <p>Lorem ipsum dolor sit amet, mea laoreet posidonium ea. Eu mea alienum concludaturque, natum falli essent vel ad. Ei pri veritus verterem, ea congue sanctus ponderum eos, ut vidisse aperiri quo. Ut eam falli tollit blandit, everti invidunt an vel. Cum tollit sanctus probatus eu.
Ut labores constituto duo, quo magna gubergren ut. Ei quo explicari patrioque intellegebat, ad vix meliore qualisque. Ex meliore corrumpit quo. Doming tractatos ut vix, clita definitiones reprehendunt mea ei. Esse sonet tractatos ei per, his semper appellantur interpretaris ei, ea probo perpetua pro. Cu nullam dicunt mei.
Novum delicatissimi te mei, molestie necessitatibus ei eos. Ne ius agam prodesset vulputate, ad eum dicit graece. In dolorem menandri sit, eu eos nisl qualisque. Justo verterem pro cu, atqui dolorum vis ad. Et his movet epicurei, eum autem dicit inermis at, in has labitur bonorum.
Ut vel graeco fuisset tibique, pertinacia theophrastus cum id, est inani ceteros vulputate ad. Cu ferri prompta electram sed. Mei laboramus reprehendunt ei, eam an tibique iracundia. Placerat lucilius ius ex, in sonet verterem gloriatur sit.
Cu per admodum scriptorem. Scripta aperiam in pro, et congue feugiat iracundia vel. Quas labore est no, quo ne paulo offendit conceptam, an nec rebum scaevola. Pri id iriure expetendis, postulant signiferumque ne duo, eos elit mundi melius at.

                </p>
                <q-btn
                color="primary"
                @click="opened = false"
                label="Read and Agreed"
                /><br>
                </div>
            </q-modal>

  </div>
  </div>
</template>
<style>
.selectedEvent{
  border-style: solid;
  border-color: crimson;
  border-width: 2px;
}

.mainContainer{
  width: 800px;
  max-width: 90vw;
}
.mapouter{
  text-align:center;height:500px;width:100%;
}
.gmap_canvas {
  overflow:hidden;background:none!important;height:400px;width:100%;
}

.event-cards .q-card{
    border-radius: 30px;
    max-width: 145px;
    min-width: 80px;
    max-height: 100px;
    min-height: 55px;
    border-color: crimson;
    border-width: 30px;
}

.locatorDiv{
  border-radius: 30px;
  padding: 10px;
}

.event-cards .q-card:hover{
  background-color: rgba(0, 0, 0, 0.089);
}

.event-cards img{
      max-width: 100%;
      max-height: 100%;
}

.headerText{
  font-size: 30px;
  font-style: oblique;
}

.doneText{
  font-size: 25px;
}
.scheduleText{
  font-size: 15px;
}
.scheduleIcon{
  font-size: 50px;
}

@media (max-width: 960px){
.qStepFinal{
  height: 1588px;
}
.qStep2nd{
  height: 1588px;
}
.mainContainer{
  max-width: 95vw;
  max-height: 100%;
  height: 100%;
}
.locatorDiv{
  border-radius: 10px;
  padding: 0;
}
.eventPagePhoto{
  max-width: 200px;

}
.mapouter{
  text-align:right;height:350px;width:auto;
}
.gmap_canvas {
  overflow:hidden;background:none!important;height:350px;width:auto;
}

.headerText{
  font-size: 25px;
  font-style: oblique;
}
.doneText{
  font-size: 20px;
}

.scheduleText{
  font-size: 15px;
}

.scheduleIcon{
  font-size: 30px;
}

}

</style>
<script>
import axios from 'axios'
import { between } from 'vuelidate/lib/validators'
import { date } from 'quasar'
// code = String(code)
// console.log(code)

function generateToken (n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var token = ''
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)]
  }
  return token
}
var randomToken = generateToken(15)

export default {
  mounted () {
    this.$bindAsArray('events', this.$database.ref('events'))
    this.$bindAsArray('schedules', this.$database.ref('event_schedules'))
    this.$bindAsArray('models', this.$database.ref('models'))
    this.storageRef = this.$firebase.storage().ref()
  },
  created () {
    let show = this.getCode()
    console.log(show)
  },
  validations () {
    return {
      newModel: {
        age: {
          between: between(this.getMinAge, this.getMaxAge)
        }
      }
    }
  },
  watch: {
    eventSelected () {
      if (this.eventSelected.ageRange.infant) {
        this.isBelow4 = true
      } else {
        this.newModel.age = ''
        this.isBelow4 = false
      }
    }
  },
  computed: {
    isInfant () {
      if (this.eventSelected.ageRange.type === 'todler') {
        return this.ageWordsTodlerYrOpt
      } else {
        return this.ageWordsBabyOpt
      }
    }
    // getMinAge () {
    //   console.log('event selected', this.eventSelected)
    //   return 20
    // }
    // getCode () {
    //   let mcode = Math.floor(1000 + Math.random() * 9000)
    //   let code = String(mcode)
    //   console.log(code)
    //   return code
    // }
  },
  data () {
    return {
      ageYearOpt: [],
      ageWordsBabyOpt: this.getDateWords(1, 17),
      ageWordsTodlerYrOpt: this.getDateWords(17, 48),
      isBelow4: false,
      code: '',
      opened: false,
      orientationFilter: {},
      selected: '',
      visible: false,
      visible2: false,
      showCodeInput: true,
      showVerificationText: false,
      verificationCode: '',
      getMinAge: 0,
      getMaxAge: 0,
      models: [],
      events: [],
      eventSelected: {},
      schedules: [],
      selectedEvent: [],
      eventPagePhoto: '',
      storageRef: null,
      uploadedPhoto: null,
      uploadedPhoto2: null,
      alt: '',
      step: '',
      url: 'http://1.1.1.195/upload.php',
      genders: [
        {
          label: 'Male',
          value: 'Male'
        },
        {
          label: 'Female',
          value: 'Female'
        }
      ],
      check1: false,
      newModel: {
        firstName: '',
        lastName: '',
        middleInitial: '',
        age: '',
        birthdate: '',
        gender: '',
        address: '',
        telNumber: '',
        mobileNumber: '',
        mobile_code: '',
        mobileVerification: false,
        email: '',
        pastModelExp: '',
        photo: '',
        photo2: '',
        eventName: '',
        eventKey: '',
        seasonName: '',
        batchKey: '',
        accountNumber: '',
        password: '',
        balance: 0,
        payments: [],
        activitiesAttended: [],
        emailVerification: false,
        emailToken: String(randomToken),
        contractSign: false
      }
    }
    // data structure newModel()
  },
  methods: {
    photoAdded (p) {
      this.uploadedPhoto = p
    },
    getWords (monthCount) {
      function getPlural(number, word) {
        return number === 1 && word.one || word.other
      }
      var months = { one: 'month', other: 'months' },
        years = { one: 'yr', other: 'yrs' },
        m = monthCount % 12,
        y = Math.floor(monthCount / 12),
         result = []
        y && result.push(y + ' ' + getPlural(y, years))
        m && result.push(m + ' ' + getPlural(m, months))
        return result.join(' & ')
    },
    photoAdded (p) {
      var photo = this.$refs.upld.files[0]
      this.uploadedPhoto = photo
    },
    photoRemove () {
      this.uploadedPhoto = null
    },
    photoAdded2 (p) {
      var photo2 = this.$refs.upld2.files[0]
      this.uploadedPhoto2 = photo2
    },
    photoRemove2 () {
      this.uploadedPhoto2 = null
    },
    isHasBatch (e) {
      let seasons = this.$lodash.filter(e.seasons, a => {
        return a
      })
      // console.log('season', seasons)
      let seasonOpen = []
      let seasonStandby = []
      for (var x = 0; x < seasons.length; x++) {
        var s = Object.assign([], seasons[x])
        if (seasons[x].status === 'open') {
          seasonOpen.push(Object.assign({}, s))
        } else {
          seasonStandby.push(Object.assign({}, s))
        }
      }
      // console.log('standby', seasonStandby)
      // console.log('open', seasonOpen)
      let eventBatches = this.$lodash.filter(this.schedules, s => {
        return e['.key'] === s.eventKey
      })
      // console.log('withBatch', eventBatches)
      if (eventBatches.length !== 0 && seasonOpen.length !== 0) {
        return true
      } else {
        return false
      }
    },
    mapOrientation () {
      console.log('asd', this.orientationFilter)
      for (var i = 0; i < this.selectedEvent.activities.length; i++) {
        if (this.selectedEvent.activities[i].type === 'orientation') {
          this.orientationFilter = this.selectedEvent.activities[i]
        }
      }
      console.log('orientationSched sa method', this.orientationFilter)
    },
    getEvent (e) {
      // this.selectedEvent = e
      this.eventPagePhoto = e.pagePhotos.eventLogoUrl
      let testDate = new Date()
      // console.log('test date', testDate)
      let eventBatches = this.$lodash.filter(this.schedules, s => {
        return e['.key'] === s.eventKey
      })
      let batch = {}
      console.log('batches', eventBatches)
      for (var i = 0; i < eventBatches.length; i++) {
        let batchDateDiff = date.getDateDiff(new Date(eventBatches[i].batchStart), testDate, 'days')
        console.log('batch date', batchDateDiff)
        if (batchDateDiff > 0) {
          batch = eventBatches[i]
          console.log('fouund', batch)
          i = eventBatches.length
        }
      }
      this.selectedEvent = batch
      this.eventSelected = e
      let min = parseInt(this.eventSelected.ageRange.min, 10)
      let max = parseInt(this.eventSelected.ageRange.max, 10)
      this.getMinAge = min
      this.getMaxAge = max
      this.mapOrientation()
      // console.log('batch date', batch)
      console.log('event', e)
      // console.log('orientationSched', this.orientationFilter)
      // console.log('eventBatches', eventBatches)
      // console.log('schedules', this.schedules)

    },
    submit () {
      this.visible2 = true
      console.log('selected', this.selectedEvent)
      let index = this.$lodash.findIndex(this.events, e => {
        return e['.key'] === this.selectedEvent.eventKey
      })
      console.log('index', index)
      console.log('event', this.events)
      this.newModel.eventKey = this.selectedEvent.eventKey
      this.newModel.eventName = this.events[index].eventName
      this.newModel.seasonName = this.events[index].seasons[0].seasonName
      this.newModel.balance = parseFloat(this.events[index].seasons[0].totalAmount)
      // this.newModel.mobile_code = this.getCode()
      console.log('mobile_code', this.newModel.mobile_code)
      let act = []
      let act2 = this.$lodash.map(this.selectedEvent.activities, a => {
        if (a.type !== 'payment') {
          a.status = false
          act.push(a)
        }
        return a
      })
      // for (var i = 0; i < this.selectedEvent.activities.length; i++) {
      //   if (this.selectedEvent.activities[i].type != 'payment') {
      //     act.push({[this.selectedEvent.activities[i].type =]})
      //   }
      // }
      this.newModel.activitiesAttended = act
      console.log('act', act)
      console.log('act', act2)
      // let batch = this.$lodash.filter(this.schedules, s => {
      //   return s.eventKey === this.selectedEvent['.key']
      // })
      this.newModel.batchKey = this.selectedEvent['.key']
      console.log('upld1', this.$refs.upld.files[0])
      // console.log('upld2', this.$refs.upld2.files[0])
      // this.uploadedPhoto = this.$refs.upld.files[0]
      // if (this.$refs.upld2.files[0]) {
      //   this.uploadedPhoto2 = this.$refs.upld2.files[0]  
      // }
      console.log('new model', this.newModel)
      console.log('event', this.selectedEvent)
      console.log('events', this.events[index])
      // console.log('batch schedule', batch[0])
      // console.log('uploaded photo', this.uploadedPhoto)
      // let vm = this
      // let uploadTask = this.storageRef.child(`modelPhotos/${this.newModel.lastName}${this.newModel.mobile_code}_${this.$refs.upld.name}`).put(this.uploadedPhoto)
      // uploadTask.on('state_changed', function (snapshot) {
      // }, function (error) {
      //   // Handle unsuccessful uploads
      //   this.$q.notify({
      //     message: `An error occur`,
      //     type: 'negative',
      //     color: 'negative',
      //     textColor: 'white',
      //     icon: 'warning'
      //   })
      //   console.log('error occur', error)
      // }, function () {
      //   uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
      //     vm.newModel.photo = downloadURL
      //     // second Upload
      //     if (vm.uploadedPhoto2) {
      //       vm.uploadSecondPic()  
      //     }
      //     vm.$database.ref('models').push(vm.newModel)
      //       .then(() => {
      //         vm.$q.notify({
      //           message: `model has been added`,
      //           type: 'positive',
      //           color: 'positive',
      //           textColor: 'white',
      //           icon: 'positive'
      //         })
      //       })
      //     vm.posting()
      //     vm.visible2 = false
      //     vm.$refs.stepper.next()
      //     // second Upload
      //     console.log('url photo', vm.newModel.photo)
      //     // // for dummy accounts
      //     // for (var x = 0; x < 4; x++) {
      //     //   vm.$database.ref('models').push(vm.newModel)
      //     // }
          
      //   })
      // })
    },
    uploadSecondPic () {
      this.uploadedPhoto2 = this.$refs.upld2.files[0]
      let vm = this
      let uploadTask2 = this.storageRef.child(`modelPhotos/${this.newModel.lastName}${this.newModel.mobile_code}_${this.$refs.upld2.name}`).put(this.uploadedPhoto2)
      uploadTask2.on('state_changed', function (snapshot) {
      }, function (error) {
        // Handle unsuccessful uploads
        this.$q.notify({
          message: `An error occur`,
          type: 'negative',
          color: 'negative',
          textColor: 'white',
          icon: 'warning'
        })
        console.log('error occur', error)
      }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask2.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          vm.newModel.photo2 = downloadURL
        })
      })
    },
    submit2 () {
      // console.log('v', this)
      this.$v.newModel.$touch()
      if (this.$v.newModel.$error) {
        this.$q.notify('Please review fields again.')
        // return
      }
    },
    posting () {
      this.newModel.mobile_code = this.getCode()
      const SMS = {
        mobile_number: '0' + this.newModel.mobileNumber
      }
      var data = 'mobile_number=' + SMS.mobile_number + '&' + 'mobile_code=' + this.newModel.mobile_code
      console.log(data)
      // https://maleficent-sms.000webhostapp.com/index.php
      axios.post('https://maleficent-sms.000webhostapp.com/index.php', data)
        .then(response => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    emailer () {
      const EMAIL = {
        email: this.email + '@gmail.com',
        first_name: this.firstName,
        last_name: this.lastName,
        token: this.newModel.emailToken
      }
      var data = 'email=' + EMAIL.email + '&' + 'token=' + EMAIL.token + '&' + 'first_name=' + EMAIL.first_name + '&' + 'last_name=' + EMAIL.last_name
      console.log(data)
      axios.post('https://maleficent-sms.000webhostapp.com/email.php', data)
        .then(response => {
          console.log(response)
        })
        .catch((error) => {
          console.log(error.response)
        })
    },
    verifyCode () {
      let emailToken = this.newModel.emailToken
      let index = this.$lodash.findIndex(this.models, m => {
        return emailToken === m.emailToken
      })
      console.log('found model', this.models[index])
      let model = {...this.models[index]} // Object.assign({}, this.models[index])
      if (this.newModel.mobile_code === this.verificationCode.toString()) {
        this.submit()
      }
      // if (model.mobile_code === this.verificationCode.toString()) {
      //   model.mobileVerification = true
      //   let key = model['.key']
      //   delete model['.key']
      //   this.$database.ref(`models/${key}`).update(model)
      //     .then(() => {
      //       console.log('model verified')
      //     })
      //     .catch((err) => {
      //       console.log('err', err)
      //     })
      //   // this.$refs.stepper.next()
      //   this.showTextLoading()
      // } 
      else {
        this.$q.notify({
          message: `Invalid Code`,
          type: 'negative',
          color: 'negative',
          textColor: 'white',
          icon: 'negative'
        })
      }
    }, // inner loading
    showTextLoading () {
      this.showVerificationText = true
      this.showCodeInput = false
      this.show()
      // this.verifyCode()
    },
    show () {
      this.visible = true
      setTimeout(() => {
        this.visible = false
        // this.showSimulatedReturnData = true
        this.showVerificationText = false
        this.$refs.stepper.next()
      }, 10000)
    },
    submitLoading () {
      this.submitShow()
      // this.verifyCode()
    },
    submitShow () {
      this.visible = true
      setTimeout(() => {
        this.visible = false
        this.$refs.stepper.next()
      }, 10000)
    },
    getCode () {
      let mcode = Math.floor(1000 + Math.random() * 9000)
      let code = String(mcode)
      return code
    },
    getDateWords (to,from) {
      let ageWords = []
      for (var i = to; i < from; i++) {
        // console.log(this.getWords(i))
        ageWords.push({label: this.getWords(i), value: this.getWords(i)})
      }
      console.log('getwords', ageWords)
      return ageWords
    },
    test () {
      console.log('upld', this.$refs.upld.files[0])
      console.log('upld', this.$refs.upld2.files[0])
      console.log('upld1', this.uploadedPhoto)
      console.log('upld1', this.uploadedPhoto2)
      if (typeof this.$refs.upld.files[0] != 'undefined') {
        console.log('has second photo')
      } else {
        console.log('no second photo')
      }
    }
  }
}
</script>
