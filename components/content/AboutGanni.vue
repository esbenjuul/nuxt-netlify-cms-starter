<template>
	<div class="about-ganni">
		<div
			v-for="(item, index) in items"
			:key="index"
			class="about-ganni__item"
			ref="items"
		>
			<div
				v-if="item.headline"
				class="about-ganni__headline"
				v-html="item.headline"
			></div>
			<!-- <div
				class="about-ganni__bodyText"
				v-if="item.bodyText"
				v-html="item.bodyText"
			></div> -->
			<img class="about-ganni__image" :src="getImage(item.cloudinaryUrl).src" />
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { AUDIOPLAYER_DARK, ASSISTANT_TOGGLE } from '~/model/constants'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import { greyPixel } from '~/utils/placeholders'
import { gsap } from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

export default {
	name: 'about-ganni',
	components: {},
	computed: {
		...mapState('aboutGanni', ['items'])
	},
	methods: {
		...mapActions('assistant', [ASSISTANT_TOGGLE.action]),
		...mapActions('utils', [AUDIOPLAYER_DARK.action]),
		getImage(src) {
			return {
				src: getCloudinaryUrl(
					this.$cloudinary,
					{ cloudinaryUrl: src },
					{ quality: 70, width: 800 }
				),
				loading: greyPixel
			}
		},

		itemClass(item) {
			return {
				'about-ganni__item': true,
				'about-ganni__item-media': item.type === 'image',
				'about-ganni__item-text': item.type === 'text'
			}
		}
	},
	mounted() {
		gsap.registerPlugin(ScrollTrigger)
		this[AUDIOPLAYER_DARK.action](true)
		this[ASSISTANT_TOGGLE.action](true)

		this.$refs['items'].forEach(scrollElement => {
			const image = scrollElement.querySelector('.about-ganni__image')
			gsap.set(image, { y: '-15%' })
			ScrollTrigger.create({
				trigger: scrollElement,
				start: 'top bottom',
				end: 'bottom top',
				// markers: true, //debug
				scrub: 0.4,
				animation: gsap.fromTo(image, { duration: 0.2, y: '-15%' }, { y: '0%' })
			})
		})
	},
	beforeDestroy() {
		this[AUDIOPLAYER_DARK.action](false)
	}
}
</script>
