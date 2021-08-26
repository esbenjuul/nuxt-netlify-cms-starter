<template>
	<div class="gallery">
		<gallery-image
			class="gallery__item"
			v-for="(asset, key) in images"
			:key="'galleryImage' + key"
			:asset="asset"
			:focused="focusedAssetId === asset.assetId"
		/>
		<gallery-video
			class="gallery__item"
			v-for="(asset, key) in videos"
			:key="'galleryVideo' + key"
			:asset="asset"
			:focused="focusedAssetId === asset.assetId"
		/>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import getAssetType from '~/utils/asset-type'
import GalleryImage from '~/components/content/GalleryImage.vue'
import GalleryVideo from '~/components/content/GalleryVideo.vue'

import WindowContent from '~/components/framework/WindowContent.vue'
import { CLOSE_WINDOW } from '~/model/constants'

export default {
	extends: WindowContent,
	name: 'gallery',
	components: {
		GalleryImage,
		GalleryVideo
	},
	props: {
		parentWindowId: {
			type: String,
			default: '',
			required: true
		},
		contentId: {
			type: String,
			default: '',
			required: true
		},
		styleId: {
			type: String,
			default: '',
			required: true
		},
		focusedAssetId: {
			type: String,
			default: '',
			required: true
		}
	},
	computed: {
		...mapState('collection', ['allStyles', 'currentStyle']),
		assets() {
			let styleRef = this.allStyles.filter(e => e.styleId === this.styleId)[0]
			if (styleRef.assets) return styleRef.assets
			return []
		},
		images() {
			return this.assets.filter(asset => asset.type === 'image')
		},
		videos() {
			return this.assets.filter(asset => asset.type === 'video')
		}
	},
	watch: {
		currentStyle: {
			deep: true,
			handler() {
				this[CLOSE_WINDOW.action]({
					windowId: this.parentWindowId,
					contentId: this.contentId
				})
			}
		}
	},
	methods: {
		...mapActions([CLOSE_WINDOW.action])
	}
}
</script>
