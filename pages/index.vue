<template>
	<div style="background-color: var(--color-secondary)">
		<!-- <preload-images :srcs="[various.dashboardBackground[0]]" /> -->

		<desktop />

		<!-- <auth-popup v-if="!hasAuthenticated" /> -->
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import Desktop from '~/components/framework/Desktop.vue'
import PreloadImages from '~/components/content/PreloadImages.vue'
import { ASSISTANT_MODE } from '~/model/constants'
import AssistantModes from '~/model/assistant-modes'

export default {
	components: {
		Desktop,
		PreloadImages
	},
	computed: {
		...mapState('user', ['hasAuthenticated']),
		...mapState('utils', ['various'])
	},
	methods: {
		// onQuizDone() {
		// 	this[HAS_DONE_QUIZ.action](true)
		// }
		...mapActions('assistant', [ASSISTANT_MODE.action])
	},
	mounted() {
		if (window.GS_LOGS) console.warn('MOUNTED INDEX - PERFORM INITIALISATIONS')

		this[ASSISTANT_MODE.action](AssistantModes.WELCOME)
	}
}
</script>
