<template>
	<div>
		<div
			class="assistant__content"
			:class="{
				'is-collapsed': isMobile && !expanded
			}"
		>
			<div class="assistant__filters">
				<h3>{{ texts.collection.headline }}</h3>
				<p>{{ texts.collection.bodyText }}</p>
				<div class="assistant__filters__list">
					<filter-button
						v-for="(item, key) in groupFilters"
						:key="key"
						:name="item.name"
						:count="item.styleIds.length"
						:filter-id="item.filterId"
					/>
					<span class="filter-button" v-if="groupFilters.length % 2 > 0"
						>&nbsp;</span
					>
				</div>
			</div>
		</div>

		<div class="assistant__ctas">
			<button class="button view-wishlist button--half" @click="viewWishList">
				<p>{{ viewWishListButtonLabel }}</p>
			</button>

			<a
				class="button download-collection button--half"
				@click="downloadCollection"
				:href="`${pdfDownloadLink}&url=${encodeURIComponent(collectionUrl)}`"
			>
				<!-- :href="pdfDownloadLink" -->
				<p>{{ downloadCollectionButtonLabel }}</p>
			</a>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import {
	OPEN_WISH_LIST,
	DOWNLOAD_PREPARING,
	SET_PREVIOUS_GROUP,
	SET_NEXT_GROUP
} from '~/model/constants'
import FilterButton from '~/components/content/FilterButton.vue'

export default {
	name: 'assistant-mode-filter-collection',
	components: {
		FilterButton
	},
	computed: {
		// ...mapState('user', ['keyPressed']),
		...mapState('utils', ['isMobile']),
		...mapState('assistant', ['expanded', 'pdfDownloadLink', 'texts']),
		...mapState('collection', ['groupFilters', 'activeGroup', 'activeFilter']),
		...mapGetters('assistant', ['viewWishListButtonLabel']),
		downloadCollectionButtonLabel() {
			if (this.activeFilter.filterId) {
				return 'Download ' + this.activeFilter.name
			}
			return 'Download all'
		},
		collectionUrl() {
			const filterParam = this.activeFilter.filterId
				? 'filter=' + this.activeFilter.filterId
				: ''
			const groupParam = this.activeGroup
				? 'group=' + this.activeGroup.groupId
				: ''
			const delimiter = filterParam && groupParam ? '&' : ''

			if (filterParam || groupParam) {
				return `${window.location}export/?${filterParam}${delimiter}${groupParam}`
			}
			// /export with no params shows all styles
			return `${window.location}export`
		}
	},
	watch: {
		// keyPressed(event) {
		// 	if (event.key === 'ArrowLeft') {
		// 		this.previousGroupHandler()
		// 	}
		// 	if (event.key === 'ArrowRight') {
		// 		this.nextGroupHandler()
		// 	}
		// }
	},
	methods: {
		...mapActions([OPEN_WISH_LIST.action]),
		...mapActions('collection', [
			SET_PREVIOUS_GROUP.action,
			SET_NEXT_GROUP.action
		]),
		...mapActions('utils', [DOWNLOAD_PREPARING.action]),
		viewWishList() {
			this[OPEN_WISH_LIST.action]()
		},
		downloadCollection() {
			if (window.GS_LOGS) console.log('Download collection')
			// history.pushState({}, '', this.collectionUrl)
			// setTimeout(() => history.back(), 30000) // revert url after 30 sec
			this[DOWNLOAD_PREPARING.action](true)
		},
		previousGroupHandler() {
			this[SET_PREVIOUS_GROUP.action]()
		},
		nextGroupHandler() {
			this[SET_NEXT_GROUP.action]()
		}
	}
}
</script>