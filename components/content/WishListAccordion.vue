<template>
	<div
		class="wish-list__accordion"
		style="page-break-after: avoid;"
		:class="{ 'is-active': isActive }"
	>
		<button class="trigger" @click="triggerHandler">
			<img :src="imageUrl" alt />
			<span>
				<p>{{ wishListItem.name }}</p>
				<em>{{ wishListItem.styleId }}</em>
			</span>
			<span class="icon" v-if="isActive">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
					<path d="M22.6 19.8L15 12.1l-7.6 7.7-.7-.7 8.3-8.4 8.4 8.4z" />
				</svg>
			</span>
			<span class="icon" v-if="!isActive">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
					<path d="M15 20.2l-8.4-8.4.8-.7 7.6 7.7 7.6-7.7.7.7z" />
				</svg>
			</span>
		</button>

		<div class="content" :key="isActive">
			<div class="inner">
				<button class="button" @click="removeItemHandler">
					Remove from wishlist
				</button>

				<style-info :item="wishListItem" :full-height="true" />
			</div>
		</div>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'
import { REMOVE_FROM_WISHLIST } from '~/model/constants'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import StyleInfo from '~/components/content/StyleInfo.vue'

export default {
	name: 'wish-list-accordion',
	components: {
		StyleInfo
	},
	props: {
		wishListItem: {
			type: Object,
			default: ''
		},
		largeImages: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			isActive: false
		}
	},
	computed: {
		imageUrl() {
			console.log(this.wishListItem)
			return getCloudinaryUrl(
				this.$cloudinary,
				{ cloudinaryUrl: this.wishListItem.assets[0] },
				!this.largeImages ? { width: 30 } : {}
			)
		}
	},
	methods: {
		...mapActions(['collection/' + REMOVE_FROM_WISHLIST.action]),
		removeItemHandler() {
			this['collection/' + REMOVE_FROM_WISHLIST.action](this.wishListItem)
		},
		triggerHandler() {
			this.isActive = !this.isActive
		}
	}
}
</script>
