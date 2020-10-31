<template>
	<div>
		<ul class="list">
      <slot />
    </ul>
	</div>
</template>
<script>
import { ContainerMixin } from 'vue-slicksort';

	export default {
		mixins: [ContainerMixin]
	}
</script>