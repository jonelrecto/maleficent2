<template>
	<q-page>
		<!-- <q-btn label="test" @click="test"/> -->
		<!-- data table -->
		<div class="q-ma-md">
			<q-table
		    :data="inHouse"
        :loading="tableLoading"
		    :columns="columns"
        :filter="filter"
        :pagination.sync="pagination"
		    row-key="code"
		  >
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
	          <!-- <p v-if="col.name === 'batch'">{{getBatchNumber(props)}}</p> -->
	          <!-- <div v-if="col.name === 'actions'">
	          	<q-btn label="Copy To InHouse" rounded color="positive" size="sm" icon="file_copy" @click="" />
	          </div> -->
	        </q-td>
	      </q-tr>

      </q-table>
		</div>
	</q-page>
</template>
<script>
export default {
	mounted () {
		this.$bindAsArray('inHouse', this.$database.ref('inhouseModels'))
	},
	data () {
		return {
			filter: '',
			tableLoading: false,
			inHouse: [],
			columns: [
				{
          name: 'accntNumber',
          required: true,
          label: 'Account Number',
          align: 'left',
          field: 'accountNumber',
          sortable: true
        },
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
          name: 'batch',
          required: true,
          label: 'Batch',
          align: 'left',
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
          name: 'fbEmail',
          required: true,
          label: 'Facebook Email',
          align: 'left',
          field: 'email',
          sortable: true
        },
        {
          name: 'actions',
          label: 'Actions',
          align: 'center',
          sortable: false
        }
      ],
		}
	},
	methods: {
		test () {}
	}
}
</script>