<template>
	<div class="video-player">
		<video ref="videoElement" :src="videoUrl" v-bind="videoAttributes"></video>

		<div class="poster" v-if="!loaded">
			<img :src="poster" alt="poster" />
			<em></em>
			<span class="loader"></span>
		</div>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'
import { FORCE_STOP_MUSIC } from '~/model/constants'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'

export default {
	name: 'video-player',
	components: {},
	props: {
		videoUrl: {
			type: String,
			required: true
		},
		poster: {
			type: String,
			required: false,
			default: null
		},
		autoPlay: {
			type: Boolean,
			required: false,
			default: false
		},
		muted: {
			type: Boolean,
			required: false,
			default: false
		},
		playsInline: {
			type: Boolean,
			required: false,
			default: true
		},
		preload: {
			type: Boolean,
			required: false,
			default: true
		},
		controls: {
			type: Boolean,
			required: false,
			default: false
		},
		loop: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	data() {
		return {
			videoRef: null,
			loaded: false
		}
	},
	computed: {
		videoAttributes() {
			let attr = {}
			if (this.autoPlay) attr.autoplay = 'autoplay'
			if (this.controls) attr.controls = 'controls'
			if (this.loop) attr.loop = 'loop'
			if (this.muted) attr.muted = 'muted'
			if (this.preload) attr.preload = 'auto'
			if (this.playsInline) attr.playsinline = 'playsinline'
			if (this.poster) attr.poster = this.poster
			return attr
		}
	},
	methods: {
		...mapActions('ganniFm', [FORCE_STOP_MUSIC.action]),
		videoDataHandler() {
			if (this.videoRef.readyState >= 2) {
				this.loaded = true
			}
		}
	},
	mounted() {
		if (!this.muted) this[FORCE_STOP_MUSIC.action]()

		this.videoRef = this.$refs['videoElement']
		if (this.videoRef instanceof HTMLElement) {
			this.videoRef.addEventListener(
				'loadeddata',
				this.videoDataHandler.bind(this)
			)
		}
	}
}
</script>