<template>
  <q-page>
    <div class="q-ma-md">
      <q-table
        title="Show Up Models"
        :data="showUpModels"
        :loading="tableLoading"
        :columns="columns"
        :filter="filter"
        no-data-label="No Show Up Models"
        :pagination.sync="pagination"
        row-key="code">

        <!-- search -->
        <template slot="top-right" slot-scope="props">
          <q-search
            color="secondary"
            v-model="filter"
            class="col-10"
          />
        </template>

        <!-- click row -->
        <q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row)" class="cursor-pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>

      
      <!-- batch -->
        <q-td slot="body-cell-batch" slot-scope="props" :props="props">
          <p>{{getBatch(props)}}</p>
        </q-td>
      <!-- action button -->
       <!--  <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn v-if="isOngoing(props)" icon="edit" @click="showEvent(props)" />
          <q-btn v-if="isOngoing(props)" color='negative' icon="delete" @click="deleteEvent(props)" />
        </q-td> -->
      </q-table>
    </div>
      <!-- modal -->
    <q-modal v-model="viewModelModal" :content-css="{minWidth: '80vh', minHeight: '95vh'}"  @hide="isEdit = false">
      <q-modal-layout>
        <q-toolbar slot="header" color="faded">
                  <q-btn v-if="!isEdit" rounded color="secondary" size="sm" label="Edit" icon="edit" @click="isEdit = true"/>
          <q-toolbar-title>
            {{model.firstName}} {{model.middleInitial}}. {{model.lastName}}
             <span slot="subtitle">
              Date Added: {{$moment(model.dateAdded).format('ll')}}
            </span>
          </q-toolbar-title>

                    <q-btn
            flat
            round
            dense
            v-close-overlay
            icon="close"
          />
        </q-toolbar>

        <div v-if="isEdit" class="row" slot="footer">
          <q-btn class="full-width col" color="positive" label="Save" icon="save" @click="saveChange()"/>
          <q-btn class="full-width col" color="negative" label="Cancel" icon="cancel" @click="isEdit = false"/>
        </div>

        <div class="q-ma-md">

          <div>
            <div class="flex flex-center col-md col">
              <div class="q-ma-md" :style='"border-radius:15px; width: 320px;height:225px;background-position: center;background-image: url("+model.photo+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>

              <div v-if="model.photo2" class="" :style='"border-radius:15px; width: 320px;height:225px;background-position: center;background-image: url("+model.photo2+");background-repeat: no-repeat;background-size: cover;border: 2px solid black;"'></div>
            </div>
          </div>
          <q-tabs color="dark">
            <!-- Tabs - notice slot="title" -->
            <q-tab default slot="title" name="tab-1" label="Personal Information" />
            <!-- Targets -->
            <q-tab-pane name="tab-1">
                                 <q-chip class="q-body-1 q-mb-sm q-pa-sm" color="info">{{model.eventName}} - {{model.seasonName}} - Batch {{getModelBatch}} <q-btn v-if="!isEdit" color="dark" rounded icon="edit" size="xs" label="Change Event" class="q-ml-md"/></q-chip>
                <div class="row q-ma-md">
                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.lastName" stack-label="Last Name" />

                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.firstName" stack-label="First Name" />

                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.middleInitial" stack-label="Middle Name" />
              </div>

              <div class="row q-ma-md">
                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.age" stack-label="Age" />

                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.gender" stack-label="Gender" /> 
              </div>
              
              <q-input :readonly="!isEdit" class="q-mx-md" type="textarea" v-model="model.address" stack-label="Address"  :max-height="100" rows="5" />

              <div class="row q-my-md">
                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.telNumber" stack-label="Telephone" />
                <q-input :readonly="!isEdit" class="col q-mx-md" v-model="model.email" stack-label="Facebook Email" />
              </div>
              <div class="row">
                <q-input :readonly="!isEdit" class="col-5 q-mx-md" v-model="model.mobileNumber" stack-label="Mobile Number" />
              </div>

              <div>
                <q-input :readonly="!isEdit" class="q-ma-md" type="textarea" v-model="model.pastModelExp"  :max-height="100" rows="5" stack-label="Past Modeling Experience"/>
              </div>
            </q-tab-pane>
          </q-tabs>

            



        </div>
      </q-modal-layout>
    </q-modal>
  </q-page>
</template>
<script>
export default{
  name: 'ShowupModels',
  mounted () {
    this.$bindAsArray('showUpModels', this.$database.ref('showUpModels'))
  },
  data () {
    return {
      showUpModels: [],
      showUps: [],
      filter: '',
      tableLoading: false,
      isEdit: false,
      model: {
        ratings: {
          commercial: 0,
          photoshoot: 0,
          runway: 0
        }
      },
      viewModelModal: false,
      columns: [
        {
          name: 'lName',
          required: true,
          label: 'Last Name',
          align: 'left',
          field: 'lastName',
          sortable: true
        },
        {
          name: 'fName',
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
          field: 'eventName',
          sortable: true
        },
        {
          name: 'season',
          required: true,
          label: 'Season',
          align: 'left',
          field: 'seasonName',
          sortable: true
        },
        {
          name: 'gender',
          required: true,
          label: 'Gender',
          align: 'left',
          field: 'gender',
          sortable: true
        },
        {
          name: 'mobile',
          required: true,
          label: 'Mobile Number',
          align: 'left',
          field: 'mobileNumber',
          sortable: true
        },
      ],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
    }
  },
  computed: {
      getModelBatch () {
        try {
          let batch = this.$lodash.filter(this.schedules, s => {
            return s['.key'] === this.model.batchKey
          })[0]
          return batch.batchNumber
        } catch {
          return ''
        } 
      }
  },
  methods: {
    test () {},
    rowClick (p) {
      // console.log('model', p)
      this.model = p
      console.log('p',this.model)
      this.viewModelModal = !this.viewModelModal
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
          this.$database.ref('showUpModels').child(key).update(modelToSave)
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
  }
}
</script>