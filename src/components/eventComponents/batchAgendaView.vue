<template>
	<div v-cloak>
		<q-btn label="test" @click="test()"/>
		<calendar></calendar>
	</div>
</template>
<script>

export default {
	components: {
	},
	data () {
		return {
			// calendar: Calendar.months()
		}
	},
	methods: {
		test () {
			let vm = this
			console.log(vm, 'calendar')
		}
	}
}
</script>