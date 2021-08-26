<template>
	<nuxt v-if="rehydrated" />
</template>


<script>
import { mapState } from 'vuex'

export default {
	name: 'default',
	computed: {
		...mapState(['rehydrated'])
	},
	mounted() {
		window.$gtm = this.$gtm

		if (window.location.href.indexOf('localhost') > -1) window.GS_LOGS = false // true
	}
}
</script>