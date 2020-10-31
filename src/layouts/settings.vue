<template>
	<div>
		<q-toolbar color="faded">
			<q-toolbar-title>
				Settings
			</q-toolbar-title>
		</q-toolbar>
		<q-tabs class="full-width row shadow-2" color="teal">
        <q-route-tab
			    icon="mail"
			    label="Course List"
			    to="/coursesSettings"
			    exact
			    slot="title"
			  />
			    <q-route-tab
			    icon="textsms"
			    label="SMS Settings"
			    to="/smsSettings"
			    exact
			    slot="title"
			  />
			  <!-- <q-route-tab
			    icon="alarm"
			    label="Activity List"
			    to="/activitySettings"
			    exact
			    slot="title"
			  /> -->
      </q-tabs>
		<router-view />
	</div>
</template>
<script>
export default {
}
</script>
