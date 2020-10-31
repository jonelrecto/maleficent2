<template>
	<q-page>
		<q-toolbar color="faded" class="q-py-none">
			<q-icon name="money" />
        <q-toolbar-title shrink>
        	<span class="text-white">Payments Reports</span>
        </q-toolbar-title>
        <q-tabs color="faded" animated swipeable align="justify" class="text-white row">
            <q-route-tab default
					    label="All Payments"
					    to="/paymentReports"
					    exact
					    slot="title"
					   />

				    <q-route-tab
			      	default
					    label="Full Paid"
					    to="/fullPaymentReports"
					    exact
					    slot="title"
					  />
					  <q-route-tab
			      	default
					    label="Installments"
					    to="/installmentPaymentReports"
					    exact
					    slot="title"
					  />
					  <q-route-tab
			      	default
					    label="Not Paid"
					    to="/notPaidPaymentReports"
					    exact
					    slot="title"
					  />
					  <q-route-tab
			      	default
					    label="Back Out"
					    to="/backOutPaymentReports"
					    exact
					    slot="title"
					  />
        </q-tabs>
    </q-toolbar>
    <router-view :key="$route.fullPath"></router-view>
	</q-page>
</template>
<script>
export default {
}
</script>