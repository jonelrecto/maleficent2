<template>
	<div class="layout-padding">
		<div>
			<p class="caption">Header</p>
			<q-editor v-model="page.header"/>
			<p class="caption">Content</p>
			<q-editor v-model="page.content"/>
			<p class="caption">Footer</p>
			<q-editor v-model="page.footer"/>
			<q-btn
        class="full-width textbox"
        color="primary"
        @click="savePageData"
        label="Save"
      />
		</div>
	</div>
</template>
<script>
	export default {
		props: {
			data: {
				event: Object
			}
		},
		mounted () {
			console.log('data in pagemodal', this.event)
		},
		computed: {
			events () {
				return this.$store.getters['users/getEvents']
			},
			page () {
				return this.$store.getters['users/getPages']
			},
			modalState () {
				if (!this.$store.state.users.eventPageModal) {
					console.log('modal is close')
					this.clearData()
				}
			}
		},
		data: () => ({
			// page: {
			// 	header: '',
			// 	content: '',
			// 	footer: ''
			// }
		}),
		methods: {
			clearData () {
				this.page.header = ''
				this.page.content = ''
				this.page.footer = ''
			},
			savePageData () {
				console.log('page in header', this.page)
				let what = this.$firebase.database()
				this.$store.dispatch('users/addEventPage', {payload: this.data, pageData: this.page, whatThis: what, quasu: this.$q})
			}
		}
	}
</script>