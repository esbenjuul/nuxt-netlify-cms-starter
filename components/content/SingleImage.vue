<template>
	<div
		class="single-image"
		:class="{ 'is-interactive': belongsToStyle && inFocus }"
	>
		<loading />

		<transition name="fade">
			<img :src="assetUrl" alt="img" @click="clickHandler" />
		</transition>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'
import { OPEN_GALLERY } from '~/model/constants'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'

import WindowContent from '~/components/framework/WindowContent.vue'
import Loading from '~/components/content/Loading.vue'

export default {
	extends: WindowContent,
	components: { Loading },
	name: 'single-image',
	props: {
		asset: {
			type: Object,
			required: true
		}
	},
	computed: {
		belongsToStyle() {
			return this.asset.styleId ? true : false
		},
		assetUrl() {
			let transform = {}
			if (!this.asset.aspect || this.asset.aspect === 'portrait')
				transform = { width: 370, height: 563 }
			if (this.asset.aspect === 'landscape')
				transform = { width: 592, height: 390 }
			if (this.asset.aspect === 'square')
				transform = { width: 370, height: 370 }
			return getCloudinaryUrl(this.$cloudinary, this.asset, transform)
		}
	},
	methods: {
		...mapActions([OPEN_GALLERY.action]),
		clickHandler() {
			if (this.belongsToStyle && this.inFocus) {
				this[OPEN_GALLERY.action](this.asset)
			}
		}
	}
}
</script>