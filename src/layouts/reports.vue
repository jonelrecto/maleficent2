<template>
	<q-page>
		<q-toolbar color="tertiary">
		  <q-toolbar-title>
		    Reports
		  </q-toolbar-title>
		  <!-- <span class="q-caption">View Mode: </span>
		  <q-btn-group push rounded>
			  <q-btn size="sm" color="secondary" label="Grid" @click=""/>
			  <q-btn size="sm" color="secondary" label="Table" @click=""/>
			</q-btn-group> -->
		</q-toolbar>
		  <!-- <q-page-container> -->
				<!-- <q-btn @click="startUpConfig" /> -->
				<router-view />
			<!-- </q-page-container> -->
	</q-page>
</template>
<script>
export default {
}
</script>