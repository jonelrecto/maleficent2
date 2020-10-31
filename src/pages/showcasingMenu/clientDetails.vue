<template>
	<q-page>
		<div class="q-ma-md">
			<q-table
            title="Client Details"
		    :data="getClientDetails"
        :loading="tableLoading"
		    :columns="columns"
        :filter="filter"
        no-data-label="No Show Data"
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
          <q-td slot="body-cell-models" slot-scope="props" :props="props">
          <q-btn icon="account_box" label="Portfolios Sent" rounded size="sm" color="dark" @click="seeModels(props.row)"/>
          </q-td>
            <q-td slot="body-cell-selected" slot-scope="props" :props="props">
          <q-btn icon="check_box" label="Selected Models" rounded size="sm" color="teal" @click="seeSelected(props.row)"/>
          </q-td>
		  	<!-- click row -->
		  	<!-- <q-tr slot="body" slot-scope="props" :props="props" @click.native="rowClick(props.row)" class="cursor-pointer">
	        <q-td v-for="col in props.cols" :key="col.name" :props="props">
	          {{ col.value }}
	        </q-td>
	      </q-tr> -->
      <!-- action button -->
       <!--  <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn v-if="isOngoing(props)" icon="edit" @click="showEvent(props)" />
          <q-btn v-if="isOngoing(props)" color='negative' icon="delete" @click="deleteEvent(props)" />
        </q-td> -->
      </q-table>
    </div>

    <q-modal v-model="portfolioSent" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="portfolioSent">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              {{selectedClient.clientName}}
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
          <q-search icon="search" inverted color="faded" class="text-white" v-model="nameSearch" clearable placeholder="Search name" />
          <q-scroll-area style="width: 100%; height: 85vh;">
                    <q-list  link dense v-for="s in filteredConfirm" :key="s['.key']">
                <q-item>
                  <q-item-side icon="check_box" color="faded"/>
                  <q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
                  <!-- <q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="getConfirmationBack(s)"/></q-item-side> -->
                </q-item>               
                </q-list>
                <!-- <div v-if="getPresentCount===0" class="text-center text-faded q-display-1 fixed-center">No Models Listed</div> -->
          </q-scroll-area>
        </q-modal-layout>
      </q-modal>

        <q-modal v-model="selectedModels" :content-css="{minWidth: '35vw', minHeight: '95vh'}" v-if="selectedModels">
        <q-modal-layout>
          <q-toolbar class="bg-dark full-width">
            <q-toolbar-title>
              {{selectedClient.clientName}}
            </q-toolbar-title>
            <!-- <q-btn color="primary" icon="check" size="md" :label="'Confirm Attendance('+getSelectedRowCount+')'" class="q-pa-sm" @click="setSelectedPresent"/> -->
          </q-toolbar>
          <q-search icon="search" inverted color="faded" class="text-white" v-model="selectedSearch" clearable placeholder="Search name" />
          <q-scroll-area style="width: 100%; height: 85vh;">
                    <q-list  link dense v-for="s in filteredSelected" :key="s['.key']">
                <q-item>
                  <q-item-side icon="check_box" color="faded"/>
                  <q-item-main class="capitalize q-body-1">{{s.firstName}} {{s.middleInitial}}. {{s.lastName}}</q-item-main>
                  <!-- <q-item-side><q-btn icon="close" outline color="red" push rounded size="sm" @click="getConfirmationBack(s)"/></q-item-side> -->
                </q-item>               
                </q-list>
                <!-- <div v-if="getPresentCount===0" class="text-center text-faded q-display-1 fixed-center">No Models Listed</div> -->
          </q-scroll-area>
        </q-modal-layout>
      </q-modal>
	</q-page>
</template>
<script>
export default {
  mounted () {
    this.$bindAsArray('models', this.$database.ref('models'))
    this.$bindAsArray('showcasing', this.$database.ref('showcasing'))
  },
	computed: {
        filteredConfirm: function(){
        return this.selectedClient.models.filter((s) => {
          var reg = new RegExp(this.nameSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
    filteredSelected: function(){
        return this.selectedClient.selected.filter((s) => {
          var reg = new RegExp(this.selectedSearch, "i")
          var string = s.firstName +' '+ s.lastName
          return string.match(reg)
        })
      },
        getClientDetails () {
            let clients = this.$lodash.filter(this.showcasing, e=> {
                return e
            })

            return clients
        }
	},
	data () {
		return {
      models: [],
            portfolioSent: false,
            nameSearch: '',
            selectedSearch: '',
            selectedModels: false,
            selectedClient: {},
            filter: '',
            showcasing: [],
			tableLoading: false,
			columns: [
        {
          name: 'clientName',
          required: true,
          label: 'Client Name',
          align: 'left',
          field: 'clientName',
          sortable: true
        },
        {
          name: 'accessCode',
          required: true,
          label: 'access Code',
          align: 'left',
          field: 'id',
          sortable: true
        },
        {
          name: 'link',
          required: true,
          label: 'link',
          align: 'left',
          field: 'link',
          sortable: true
        },
        {
          name: 'models',
          required: true,
          label: 'Porfolios Sent',
          align: 'left',
        //   field: 'seasonName',
        //   sortable: true
        },
        {
          name: 'selected',
          required: true,
          label: 'Selected By Client',
          align: 'left',
        //   field: 'gender',
        //   sortable: true
        }
      ],
      pagination: {
        sortBy: null, // String, column "name" property value
        descending: false,
        page: 1,
        rowsPerPage: 10 // current rows per page being displayed
      }
		}
	},
  // end of data
  methods: {
    test () {
      console.log('models', this.models)
    },
    seeModels (e) {
        this.selectedClient = e
        this.portfolioSent = true
    },
    seeSelected (e) {
        try{
            this.selectedClient = e
            this.selectedModels = true
            if(e.selected.length === 0) {
                this.$q.notify({
                    message: `No Models Selected Yet`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'info'
                  })
            } else {
                
            }
        } catch (err) {
                this.$q.notify({
                    message: `No Models Selected Yet`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'info'
                  })
        }
    }
  }
}
</script>