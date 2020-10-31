<template>
	<q-page>
		<q-btn label="test" @click="test"/>
		<div class="q-ma-md">
			<q-table
		    :data="noShowModels"
        :loading="tableLoading"
		    :columns="columns"
        :filter="filter"
        no-data-label="No Show Data"
        :pagination.sync="pagination"
		    row-key="code">

        <!-- filter model -->
        <template slot="top-left" slot-scope="props">
           <q-select
              v-model="filter"
             :options="eventCategoryOpt"
            />
        </template>
        
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
      <!-- action button -->
       <!--  <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn v-if="isOngoing(props)" icon="edit" @click="showEvent(props)" />
          <q-btn v-if="isOngoing(props)" color='negative' icon="delete" @click="deleteEvent(props)" />
        </q-td> -->
      </q-table>
    </div>
	</q-page>
</template>
<script>
export default {
  mounted () {
    this.$bindAsArray('models', this.$database.ref('models'))
  },
	computed: {
		noShowModels () {
			return []
		}
	},
	data () {
		return {
      models: [],
			filter: '',
			tableLoading: false,
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
  // end of data
  methods: {
    test () {
      console.log('models', this.models)
    }
  }
}
</script>