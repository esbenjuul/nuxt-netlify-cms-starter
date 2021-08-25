<template>
	<transition name="fade">
		<div class="lookbook-slideshow">
			<!-- <preload-images
				:srcs="[
					...content.map(i => getMediaUrl(i.type, i.cloudinaryUrl).src),
					...content.map(
						i => getMediaUrl(i.type, i.cloudinaryUrl, { thumbnail: true }).src
					)
				]"
			/> -->

			<div class="lookbook-slideshow__content">
				<transition name="fade--fast">
					<div
						v-if="!overview"
						class="lookbook-slideshow__standard"
						:class="activePage.length === 1 ? 'single' : 'double'"
					>
						<div
							v-for="(activeContent, i) in isMobile ? content : activePage"
							:key="`asgaf${i}`"
						>
							<img
								v-if="activeContent.type === 'image'"
								:src="
									getMediaUrl(activeContent.type, activeContent.cloudinaryUrl)
										.src
								"
								alt=""
								:key="activeContent.cloudinaryUrl[0]"
							/>
							<video
								v-if="activeContent.type === 'video'"
								:src="
									getMediaUrl(activeContent.type, activeContent.cloudinaryUrl)
										.src
								"
								preload
								:poster="transparentPixel"
								autoplay
								loop
							/>
						</div>
					</div>
				</transition>
				<transition name="fade--fast">
					<div
						v-if="overview && !isMobile"
						class="lookbook-slideshow__overview"
					>
						<div
							v-for="(item, i) in content"
							:key="'jhfjsdf' + i"
							@click="show(item)"
							:class="item.aspect"
						>
							<img
								v-if="item.type === 'image'"
								:src="
									getMediaUrl(item.type, item.cloudinaryUrl, {
										thumbnail: true
									}).src
								"
								alt=""
							/>
							<video
								v-if="item.type === 'video'"
								:src="
									getMediaUrl(item.type, item.cloudinaryUrl, {
										thumbnail: true
									}).src
								"
								preload
								muted
								autoplay
								loop
							/>
							<!-- :poster="transparentPixel" -->
						</div>
					</div>
				</transition>
			</div>

			<div class="lookbook-slideshow__ui" v-if="!isMobile">
				<button
					class="lookbook-slideshow__button"
					@click="change({ next: false })"
				>
					<svg-icon name="arrow--left" />
				</button>

				<p class="lookbook-slideshow__current">
					{{ idx + 1 }} / {{ pages.length }}
				</p>

				<button
					class="lookbook-slideshow__button"
					@click="change({ next: true })"
				>
					<svg-icon name="arrow--left" style="transform: scaleX(-1)" />
				</button>

				<button class="lookbook-slideshow__button" @click="toggleLayout">
					View all
				</button>
			</div>
		</div>
	</transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import WindowContent from '~/components/framework/WindowContent.vue'
import Loading from '~/components/content/Loading.vue'
import { nextIndex, prevIndex } from '~/utils/array-helpers'
import { transparentPixel } from '~/utils/placeholders'
import { DASHBOARD_DARK } from '~/model/constants'
import PreloadImages from './PreloadImages.vue'

export default {
	// extends: WindowContent,
	components: { Loading, PreloadImages },
	name: 'lookbook-slideshow',
	// props: {
	// 	contentId: { type: String, default: 'lookBook', required: true }
	// },
	data: () => ({
		idx: 0,
		overview: false,
		transparentPixel
	}),
	computed: {
		...mapState('assets', ['lookBook']),
		...mapState('user', ['keyPressed']),
		...mapState('utils', ['isMobile']),
		content() {
			return this.lookBook
		},
		activePage() {
			return this.pages[this.idx]
		},
		pages() {
			if (!this.content.every(x => x.aspect)) {
				console.log(
					`LookbookSlideshow:
						Every item should have an "aspect" key.
						Fallbacks to showing 2 items/slide
					`
				)

				return this.content.reduce((acc, cur) => {
					if (!acc[acc.length - 1] || acc[acc.length - 1].length > 1) {
						acc.push([])
					}
					acc[acc.length - 1].push(cur)
					return acc
				}, [])
			}

			return this.content
				.reduce((acc, cur) => {
					if (!cur.aspect || cur.aspect === 'portrait') {
						if (!acc[acc.length - 1] || acc[acc.length - 1].length > 1) {
							acc.push([])
						}

						acc[acc.length - 1].push(cur)
					} else {
						acc.push([cur, 'empty'])
					}

					return acc
				}, [])
				.map(x => x.filter(y => y !== 'empty'))
		}
	},
	watch: {
		keyPressed({ key }) {
			if (key === 'ArrowRight') {
				this.change({ next: true })
			}

			if (key === 'ArrowLeft') {
				this.change({ next: false })
			}
		}
	},
	methods: {
		...mapActions('utils', [DASHBOARD_DARK.action]),
		getMediaUrl(type, cloudinaryUrl, { thumbnail } = {}) {
			return {
				src: getCloudinaryUrl(
					this.$cloudinary,
					{ type, cloudinaryUrl },
					{ width: thumbnail ? 100 : window.innerWidth < 600 ? 200 : 400 }
				),
				loading: transparentPixel
			}
		},

		change({ next }) {
			this.overview = false

			this.idx = next
				? nextIndex(this.pages, this.idx)
				: prevIndex(this.pages, this.idx)
		},

		show(item) {
			this.overview = false
			this.idx = this.pages.findIndex(i =>
				i.find(x => x.cloudinaryUrl === item.cloudinaryUrl)
			)
		},

		toggleLayout() {
			this.overview = !this.overview
		}
	},

	mounted() {
		this[DASHBOARD_DARK.action](true)
	}

	// beforeDestroy() {
	// 	this[DASHBOARD_DARK.action](false)
	// },
}
</script>
