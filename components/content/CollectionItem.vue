<template>
	<button class="collection-item" @click.stop="onItemClick">
		<img v-lazy="imageUrl" alt="imageName" />
		<p>{{ imageName }}</p>

		<responsible-icon v-if="responsible" />

		<span class="on-wishlist" v-if="onWishList">
			<svg
				class="checkmark"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 78.4 78.4"
			>
				<path
					d="M78 19L29.5 67.6a1 1 0 01-1.6 0L.3 40a1 1 0 010-1.5L7 31.8c.5-.5 1.1-.5 1.6 0l20 20 41.2-41c.4-.5 1.1-.5 1.5 0l6.7 6.7a1 1 0 010 1.5z"
				/>
			</svg>
		</span>
	</button>
</template>


<script>
import { vuex, mapActions, mapState } from 'vuex'
import { OPEN_STYLE_CONTENT } from '~/model/constants'
import CollectionItemModel from '~/model/collection-item'
import capitalize from 'lodash/capitalize'

import ResponsibleIcon from '~/components/content/ResponsibleIcon.vue'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import sendTracking from '~/utils/send-tracking'

export default {
	name: 'collectionItem',
	components: { ResponsibleIcon },
	props: CollectionItemModel,
	computed: {
		...mapState({
			wishList: state => state.collection.wishList
		}),
		imageUrl() {
			if (!this.assets || !this.assets.length) {
				return ''
			}

			return {
				src: getCloudinaryUrl(this.$cloudinary, this.assets[0], { width: 310 }),
				loading: getCloudinaryUrl(this.$cloudinary, this.assets[0], {
					width: 10
				})
			}
		},
		imageName() {
			if (this.assets && this.assets[0]) return this.name
			return this.name + " | 0 assets, can't open"
		},
		onWishList() {
			return this.wishList.filter(e => e.styleId === this.styleId).length > 0
		}
	},
	methods: {
		...mapActions([OPEN_STYLE_CONTENT.action]),
		onItemClick() {
			sendTracking('Product click', this.styleId)

			this[OPEN_STYLE_CONTENT.action](this.styleId)
		}
	}
}
</script>