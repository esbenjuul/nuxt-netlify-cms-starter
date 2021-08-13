<template>
	<div
		class="single-video"
		:class="{ 'is-interactive': belongsToStyle && inFocus }"
	>
		<transition name="fade">
			<div @click="clickHandler" style="height: 100%">
				<video-player
					:video-url="assetUrl"
					v-bind="{ ...computedVideoAttributes }"
				/>
			</div>
		</transition>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'
import { OPEN_GALLERY } from '~/model/constants'
import VideoPlayer from '~/components/content/VideoPlayer.vue'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import WindowContent from '~/components/framework/WindowContent.vue'

export default {
	extends: WindowContent,
	name: 'single-video',
	components: {
		VideoPlayer
	},
	props: {
		asset: {
			type: Object,
			required: true
		},
		videoAttributes: {
			type: Object,
			required: false
		}
	},
	computed: {
		belongsToStyle() {
			return this.asset.styleId ? true : false
		},
		assetUrl() {
			return getCloudinaryUrl(this.$cloudinary, this.asset, {}, 2)
		},
		computedVideoAttributes() {
			if (this.videoAttributes) return this.videoAttributes

			if (this.belongsToStyle) {
				return {
					autoPlay: true,
					muted: true,
					loop: true
				}
			} else {
				return {
					controls: true
				}
			}
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
	// mounted() {
	// 	console.log(this.asset, this)
	// },
}
</script>
