<template>
	<div>
		<collection />
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Collection from '~/components/content/Collection.vue'
import AssistantModes from '~/model/assistant-modes'
import {
	SET_CURRENT_FILTER,
	SET_GROUP_BY_INDEX,
	ASSISTANT_MODE,
	OPEN_STYLE_CONTENT,
	TOPMOST_WINDOW,
	ASSISTANT_TEXT,
	OPEN_GALLERY
} from '~/model/constants'

export default {
	name: 'collection-page',
	components: {
		Collection
	},
	computed: {
		...mapState('collection', ['allStyles']),
		...mapState('utils', ['isMobile'])
	},
	methods: {
		...mapActions([
			OPEN_STYLE_CONTENT.action,
			TOPMOST_WINDOW.action,
			OPEN_GALLERY.action
		]),
		...mapActions('collection', [
			SET_GROUP_BY_INDEX.action,
			SET_CURRENT_FILTER.action
		]),
		...mapActions('assistant', [ASSISTANT_MODE.action, ASSISTANT_TEXT.action])
	},
	mounted() {
		this[SET_GROUP_BY_INDEX.action](-1)
		this[SET_CURRENT_FILTER.action]('')

		/**
		 * Parse url query and open corresponding style, if it exists
		 */
		if (this.$route.query.q) {
			const styleToOpen = this.allStyles.find(
				style => style.styleId === this.$route.query.q
			)
			if (styleToOpen) {
				this[OPEN_STYLE_CONTENT.action](this.$route.query.q)
				this[ASSISTANT_MODE.action](AssistantModes.STYLE_DETAILS)
			} else {
				this[ASSISTANT_MODE.action](AssistantModes.FILTER_COLLECTION)
				this[ASSISTANT_TEXT.action]('collection')
			}
		}
	},

	beforeDestroy() {
		this[TOPMOST_WINDOW.action](null)
	}
}
</script>
