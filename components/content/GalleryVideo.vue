<template>
	<div class="gallery-video">
		<loading />
		<video-player
			:video-url="assetUrl"
			:controls="false"
			:muted="true"
			:autoPlay="true"
		/>
	</div>
</template>

<script>
import VideoPlayer from '~/components/content/VideoPlayer.vue'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import Loading from '~/components/content/Loading.vue'

export default {
	name: 'gallery-video',
	components: {
		VideoPlayer,
		Loading
	},
	props: {
		asset: {
			type: Object,
			required: true
		},
		focused: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		assetUrl() {
			return getCloudinaryUrl(this.$cloudinary, this.asset, { width: 700 }, 2)
		}
	},
	mounted() {
		if (this.focused) {
			setTimeout(() => this.$el.scrollIntoView({ behavior: 'smooth' }), 500)
		}
	}
}
</script>