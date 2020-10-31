<template>
	<div>
		<li class="list-item">{{item}}</li>
	</div>
</template>
<script>
import { ElementMixin } from 'vue-slicksort';

	export default {
		mixins: [ElementMixin],
  	props: ['item'],
	}
</script>