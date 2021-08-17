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
						:name="'RTW'"
						:is-big="true"
						:count="readyToWear.length"
						:filter-id="'RTW'"
					/>

					<filter-button
						:name="'SHOES'"
						:is-big="true"
						:count="shoes.length"
						:filter-id="'SHOES'"
					/>

					<filter-button
						:name="'ACC'"
						:is-big="true"
						:count="accessories.length"
						:filter-id="'ACC'"
					/>

					<filter-button
						v-for="item in currentFilters"
						:key="item.filter.filterId"
						:name="item.filter.name"
						:count="item.styles.length"
						:filter-id="item.filter.filterId"
					/>
					<span class="filter-button" v-if="currentFilters.length % 2 === 0">
						&nbsp;
					</span>
				</div>
			</div>
		</div>

		<div class="assistant__ctas">
			<button class="button view-wishlist button--half" @click="viewWishList">
				<p>{{ viewWishListButtonLabel }}</p>
			</button>

			<a
				class="button download-collection button--half"
				:class="{ 'is-animating': downloadPreparing }"
				@click="downloadCollection"
				:href="__prod__ ? `${pdfDownloadLink}&url=${collectionUrl}` : '#'"
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
		...mapState('utils', ['isMobile', 'downloadPreparing', '__prod__']),
		...mapState('assistant', ['expanded', 'pdfDownloadLink', 'texts']),
		...mapState('collection', ['activeGroup', 'activeFilter']),
		...mapGetters('assistant', ['viewWishListButtonLabel']),
		...mapGetters('collection', [
			'readyToWear',
			'accessories',
			'shoes',
			'groups',
			'allStylesWithFilter'
		]),

		downloadCollectionButtonLabel() {
			if (this.activeFilter && this.activeFilter.filterId) {
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
				return `${window.location.origin}/export/?${filterParam}${delimiter}${groupParam}`
			}
			// /export with no params shows all styles
			return `${window.location.origin}/export`
		},

		currentFilters() {
			const currentFilter = this.activeGroup
				? this.groups[this.activeGroup.groupId].filters
				: this.allStylesWithFilter

			return currentFilter
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
