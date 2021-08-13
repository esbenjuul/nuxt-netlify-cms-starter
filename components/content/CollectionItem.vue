<template>
	<button
		class="collection-item"
		:class="{ 'multiple-assets': imageUrl2 }"
		@click.stop="onItemClick"
		ref="parent"
	>
		<img
			v-if="!this.isVideo(imageUrl.src)"
			v-lazy="imageUrl.src"
			:alt="`An closeup of ${imageName}`"
			class="fast-fade collection-item__main"
			ref="image"
		/>
		<video
			autoplay
			muted
			loop
			v-else
			:data-src="imageUrl.src"
			ref="video-1"
			class="collection-item__main"
		></video>

		<!-- visible when img[lazy="error"] -->
		<svg-icon name="no-photo" class="no-photo-icon" />

		<div v-if="imageUrl2" class="collection-item__extra">
			<img
				v-if="!this.isVideo(imageUrl2.src)"
				v-lazy="imageUrl2.src"
				:alt="imageName"
			/>
			<video
				autoplay
				muted
				loop
				v-else
				:data-src="imageUrl2.src"
				ref="video-2"
			></video>
		</div>

		<p>{{ imageName }}</p>

		<responsible-icon v-if="responsible === true || responsible === 'SAND'" />

		<span class="on-wishlist" v-if="onWishList">
			<svg-icon name="checkmark" />
		</span>
	</button>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { OPEN_STYLE_CONTENT } from '~/model/constants'
import CollectionItemModel from '~/model/collection-item'

import ResponsibleIcon from '~/components/content/ResponsibleIcon.vue'
import VideoPlayer from '~/components/content/VideoPlayer.vue'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import sendTracking from '~/utils/send-tracking'
import { transparentPixel } from '~/utils/placeholders'
import { isVideo } from '~/utils/is-video'

export default {
	name: 'collectionItem',
	components: { ResponsibleIcon, VideoPlayer },
	props: {
		...CollectionItemModel
	},
	data: () => ({
		transparentPixel,
		isHovered: false,
		isVideo
	}),
	computed: {
		...mapState('collection', ['wishList']),

		imageUrl() {
			if (!this.assets || !this.assets.length) {
				return ''
			}

			return this.makeImageObj(this.assets[0])
		},
		imageUrl2() {
			if (!this.assets || this.assets.length < 2) {
				return ''
			}

			return this.makeImageObj(this.assets[1])
		},
		imageName() {
			if (this.assets && this.assets[0]) return this.name
			return this.name + " | 0 assets, can't open"
		},
		onWishList() {
			return this.wishList.find(e => e.styleId === this.styleId)
		}
	},
	methods: {
		...mapActions([OPEN_STYLE_CONTENT.action]),
		onItemClick() {
			sendTracking('Product click', this.styleId)

			this[OPEN_STYLE_CONTENT.action](this.styleId)
		},
		makeImageObj(asset) {
			return {
				src: getCloudinaryUrl(
					this.$cloudinary,
					{
						cloudinaryUrl: asset,
						type: this.isVideo(asset) ? 'video' : 'image'
					},
					{
						width: window.innerWidth < 600 ? 120 : 360
					}
				),
				loading: this.transparentPixel
			}
		}
	},
	mounted() {
		const callback = ([entry], observer) => {
			if (entry.isIntersecting) {
				entry.target.src = entry.target.dataset.src
				observer.unobserve(entry.target)
			}
		}

		const videoRefs = ['video-1', 'video-2']

		videoRefs.forEach(ref => {
			if (this.$refs[ref]) {
				const observer = new IntersectionObserver(callback, { threshold: 0 })
				observer.observe(this.$refs[ref])
			}
		})
	}
}
</script>
