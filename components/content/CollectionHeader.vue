<template>
	<div class="collection-header">
		<div
			class="inner"
			@wheel="toggleImages"
			@touchmove="toggleImages"
			:class="{ 'show-images': showImages }"
		>
			<div class="text">
				<h1 v-if="group.headline">{{ group.headline }}</h1>
				<countdown
					v-if="group.countdown"
					:preText="'That is in '"
					:deadline="group.countdown"
					:slim="true"
				/>
				<p v-if="group.text" v-html="group.text" />
			</div>
			<div
				class="image"
				@click="showNextImage"
				:class="{ 'in-view': showImages }"
				ref="images"
				@mousemove="
					changeCursor(
						null,
						mousepos.x < screenSize.width / 2
							? 'gan_icon_left_arrow'
							: 'gan_icon_right_arrow'
					)
				"
				@mouseleave="changeCursor(null, null)"
			>
				<img
					v-for="(image, idx) in group.cloudinaryUrl"
					:key="image"
					:src="getImage(image).src"
					v-show="idx === activeIndex"
				/>

				<div
					class="timeline"
					v-if="group.cloudinaryUrl && group.cloudinaryUrl.length > 1"
					:style="{
						gridTemplateColumns: `repeat(${group.cloudinaryUrl.length}, 1fr)`
					}"
				>
					<div
						v-for="(x, idx) in group.cloudinaryUrl"
						:key="'jfdkdjfkdjfk' + x"
						class="line"
						:style="{
							'--progress':
								idx < activeIndex ? 1 : idx === activeIndex ? progress : 0
						}"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Countdown from '~/components/elements/Countdown.vue'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import { greyPixel } from '~/utils/placeholders'
import { nextIndex, prevIndex } from '~/utils/array-helpers'
import { TEXT_CURSOR } from '~/model/constants'

export default {
	name: 'collection-header',
	components: {
		Countdown
	},
	props: {
		// mode: {
		// 	type: String,
		// 	default: 'carousel',
		// },
		group: {
			type: Object,
			default: () => ({})
		}
	},
	data: () => ({
		speed: 300,
		greyPixel,
		loaded: 0,
		activeIndex: 0,
		progress: 1,
		showImages: false,

		scrolledAmount: 0
	}),
	computed: { ...mapState('user', ['mousepos', 'screenSize']) },
	methods: {
		...mapActions('utils', [TEXT_CURSOR.action]),
		getImage(src) {
			return {
				src: getCloudinaryUrl(
					this.$cloudinary,
					{ cloudinaryUrl: src },
					{
						width: 500,
						quality: 80
					}
				),
				loading: greyPixel
			}
		},
		isLoaded() {
			return this.loaded++
		},
		showNextImage(click) {
			this.activeIndex =
				click && this.mousepos.x < this.screenSize.width / 2
					? prevIndex(this.group.cloudinaryUrl, this.activeIndex)
					: nextIndex(this.group.cloudinaryUrl, this.activeIndex)
			this.progress = 1
		},
		tick() {
			requestAnimationFrame(this.tick)

			this.progress += 1 / this.speed

			if (this.progress > 1) {
				this.showNextImage()
			}
		},
		toggleImages(e) {
			this.scrolledAmount = Math.max(0, this.scrolledAmount + e.deltaY)

			if (this.scrolledAmount < window.innerHeight / 2 && e.deltaY > 0) {
				e.preventDefault()
			}

			this.showImages = e.deltaY < 0 ? false : true
		},
		changeCursor(str, icon) {
			this[TEXT_CURSOR.action]({ str, icon })
		}
	},
	mounted() {
		// if (this.group.cloudinaryUrl) {
		// 	this.tick()
		// }
	}
}
</script>
