<template>
	<transition name="startup-transition" mode="out-in">
		<div
			class="desktop"
			:class="idle && 'screensaver-running'"
			:style="{
				backgroundSize: webcamImage && '400px'
			}"
		>
			<background-image />

			<div
				:class="{
					desktop__shortcuts: !textStyledWithoutIcon,
					dashboard__shortcuts: textStyledWithoutIcon
				}"
			>
				<shortcut
					v-for="(item, nthChild) in desktopIcons"
					:textLayout="textStyledWithoutIcon"
					:key="item.shortcutId"
					:type="item.type"
					:position-h="item.posH"
					:position-v="item.posV"
					:icon="item.icon"
					:label="item.label"
					:shortcut-id="item.shortcutId"
					:actions="item.actions"
					:window-content="item.windowContent"
					:href="item.href"
					:nth-child="nthChild"
				/>
			</div>

			<shortcut
				:class="'shortcut__badge'"
				v-for="(item, i) in badgeShortcuts"
				:key="`badge-${i}`"
				v-bind="item"
			/>

			<div class="desktop__windows">
				<transition-group
					tag="div"
					name="window-animation"
					@before-enter="setTransformOrigin"
				>
					<window
						v-for="(item, index) in windowList"
						:key="item.windowId"
						v-bind="item.windowProps"
						:position-z="item.positionZ"
						:window-id="item.windowId"
						:content-type="item.contentType"
						:content-name="item.contentName"
						:content-component="item.contentComponent"
						:status-component="item.statusComponent"
						:content-component-props="item.contentComponentProps"
						:group-id="item.groupId"
						:status-component-props="item.statusComponentProps"
						:window-info="item.customAssistantText"
						:title="item.title"
						:content-id="item.contentId"
						:data-index="index"
					/>
				</transition-group>

				<assistant />
				<!-- <support /> -->
			</div>

			<marquee v-show="!isMobile" />

			<div class="clipboard-message" v-if="showClipboardMessage">
				<p>Copied to clipboard</p>
			</div>

			<div class="download-message" v-if="showDownloadMessage">
				<div class="window window--no-status window--tight">
					<header class="window__top">
						<span class="title">Please wait</span>
					</header>
					<div class="window__content">
						<img src="/img/ganni_popcorn_animation.gif" alt />
						<p>Your download is being prepared...</p>
					</div>
				</div>
			</div>

			<div class="copyright-message" v-if="!copyrightAccepted">
				<transition
					@before-appear="copyrightBeforeAnimateIn"
					@appear="copyrightAnimateIn"
				>
					<div class="window window--no-status window--tight">
						<header class="window__top">
							<span class="title">Important Info</span>
						</header>
						<div class="window__content">
							<span class="icon">
								<img src="/img/smiley-bw.png" />

								<p>
									Hi, we hope you will enjoy your Ganni Space Virtual Showroom
									experience.<br /><br />
									Please note that all visual material and images are for
									internal use only and not to be distributed outside this
									platform.
								</p>
							</span>
							<button class="button ok" @click="copyrightMessageClickHandler">
								OK
							</button>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</transition>
</template>

<script>
import { vuex, mapActions, mapState, mapGetters } from 'vuex'

import {
	COPYRIGHT_ACCEPT,
	RESET_STATE,
	KEYPRESS,
	MOUSEMOVE,
	CLIPBOARD_COPY,
	DOWNLOAD_PREPARING,
	OPEN_CONTENT,
	AUTHORIZE_GROUPS,
	CONNECT_EXHIBITION_ASSETS
} from '~/model/constants'

import VueDraggableResizable from 'vue-draggable-resizable'

import ShortcutTypes from '~/model/shortcut-types'

import ProgressBar from '~/components/framework/ProgressBar.vue'
import Shortcut from '~/components/framework/Shortcut.vue'
import Window from '~/components/framework/Window.vue'
import Assistant from '~/components/framework/Assistant.vue'
import Support from '~/components/framework/Support.vue'
import Marquee from '~/components/content/Marquee.vue'
import BackgroundImage from '~/components/content/BackgroundImage.vue'

import ContentTypes from '~/model/content-types'

import { getRandomInt } from '~/utils/get-random-int'

export default {
	name: 'desktop',
	components: {
		ProgressBar,
		Shortcut,
		Window,
		Marquee,
		Assistant,
		Support,
		VueDraggableResizable,
		BackgroundImage
	},
	computed: {
		...mapState(['wallpaperIndex', 'windowList']),
		...mapState('collage', ['webcamImage']),
		...mapState('shortcuts', ['list', 'textStyledWithoutIcon']),
		...mapState('user', ['copyrightAccepted', 'mousepos', 'idle']),
		...mapState('utils', [
			'downloadPreparing',
			'clipBoardCopyComplete',
			'isMobile'
		]),

		...mapGetters('shortcuts', ['authorizedShortcuts']),

		desktopIcons() {
			return this.authorizedShortcuts.filter(
				s => s.type == ShortcutTypes.WINDOW || s.type == ShortcutTypes.URL
			)
		},
		marqueeLinks() {
			return this.list.filter(s => s.type == ShortcutTypes.MARQUEE)
		},

		badgeShortcuts() {
			return this.list.filter(s => s.type == ShortcutTypes.BADGE)
		},

		backgroundImage() {
			// return {
			// 	src: `/img/wallpapers/wallpaper3.jpg`
			// }
			// src: `/img/wallpapers/wallpaper${getRandomInt(1,this.wallpaperCount)}.jpg`
			// loading: '/img/login-slide.jpg'
		}
	},
	watch: {
		clipBoardCopyComplete(newVal) {
			if (newVal) {
				this.showClipboardMessage = true
				this.startClipboardTimeout()
			} else {
				this.showClipboardMessage = false
			}
		},
		downloadPreparing(newVal) {
			if (newVal) {
				this.showDownloadMessage = true
				this.startDownloadTimeout()
			} else {
				this.showDownloadMessage = false
			}
		}
	},
	data() {
		return {
			showClipboardMessage: false,
			showDownloadMessage: false,
			wallpaperCount: 6,
			backgrounds: []
		}
	},
	methods: {
		...mapActions([RESET_STATE.action, OPEN_CONTENT.action]),
		...mapActions('exhibition', [CONNECT_EXHIBITION_ASSETS.action]),
		...mapActions('collection', [AUTHORIZE_GROUPS.action]),
		...mapActions('utils', [CLIPBOARD_COPY.action, DOWNLOAD_PREPARING.action]),
		...mapActions('user', [
			COPYRIGHT_ACCEPT.action,
			KEYPRESS.action,
			MOUSEMOVE.action
		]),
		startClipboardTimeout() {
			setTimeout(() => {
				this[CLIPBOARD_COPY.action](false)
			}, 3000)
		},
		startDownloadTimeout() {
			setTimeout(() => {
				this[DOWNLOAD_PREPARING.action](false)
			}, 3000)
		},

		setTransformOrigin(el) {
			el.style.transformOrigin = `${this.mousepos.x}px ${this.mousepos.y}px`
			el.style.transitionDelay = `${el.dataset.index * 0.05 - 0.05}s`
		},

		copyrightMessageClickHandler() {
			this[COPYRIGHT_ACCEPT.action](true)
		},
		copyrightBeforeAnimateIn(el) {
			TweenLite.set(el, { scale: 0, opacity: 0 })
		},
		copyrightAnimateIn(el) {
			TweenLite.to(el, 0.3, {
				delay: 2,
				scale: 1,
				opacity: 1,
				ease: 'power4.inOut'
			})
		}
	},
	mounted() {
		window.addEventListener('keyup', event => {
			this[KEYPRESS.action](event)
		})
		window.addEventListener('keydown', event => {
			if (event.ctrlKey && event.altKey && event.code === 'KeyR') {
				this[RESET_STATE.action](event)
			}
		})

		let timeout = null
		window.addEventListener('mousemove', event => {
			const debounce = (func, wait, immediate) => {
				var later = () => {
					timeout = null
					func.apply(this)
				}

				clearTimeout(timeout)
				timeout = setTimeout(later, immediate ? 0 : wait)
			}

			debounce(() => this[MOUSEMOVE.action](event), 200)
		})

		this[AUTHORIZE_GROUPS.action]()
		this[CONNECT_EXHIBITION_ASSETS.action]()

		// this.$store.commit('collection/isOnWishList')
	},

	created() {}
}
</script>
