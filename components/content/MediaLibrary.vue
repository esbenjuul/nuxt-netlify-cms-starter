<template>
	<div class="media-library" @mouseleave="close">
		<a
			v-for="item in downloads"
			:key="item.name"
			:href="item.file"
			target="_blank"
			download
			class="media-library__item"
			>{{ item.name }}</a
		>
		<button class="media-library__item" @click="refresh">Refresh page</button>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { MENU_SHOW, RESET_STATE } from '~/model/constants'

export default {
	name: 'media-library',
	computed: {
		...mapState('assets', ['downloads'])
	},
	methods: {
		...mapActions([RESET_STATE.action]),
		...mapActions('utils', [MENU_SHOW.action]),
		close() {
			setTimeout(() => this[MENU_SHOW.action](false), 500)
		},
		refresh(event) {
			this[RESET_STATE.action](event)
			window.location.reload()
			window.location = '/'
		}
	},
	mounted() {
		console.log(window.location)
	}
}
</script>
