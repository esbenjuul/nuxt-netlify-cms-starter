<template>
	<div
		v-if="rehydrated"
		:oncontextmenu="__prod__ ? `return false;` : ''"
		class="layout"
		:class="{ 'screensaver-running': idle, dark: dashboardDark }"
	>
		<text-cursor />

		<transition name="fade" appear>
			<login v-if="!loggedIn" @step="onIntroStep" @slide="onIntroSlide" />
		</transition>

		<div
			class="content"
			v-if="loggedIn || introStep >= 2"
			:style="{ transform }"
		>
			<nuxt />
			<bottombar />

			<!-- fixed elements -->
			<assistant />
			<clipboard-message v-if="showClipboardMessage" />

			<copywrite-message v-if="!copyrightAccepted">
				<cookie-banner v-if="!cookiesAccepted" :un-styled="true" />
			</copywrite-message>

			<!-- <v-idle v-show="false" :duration="15000" @idle="onidle" /> -->
			<screensaver v-if="idle" />

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
			</div>
		</div>

		<music-player
			v-if="!isMobile && !['warm-up', 'higher-love-tv'].includes($route.name)"
			:showAudioVisualizer="false"
		/>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Bottombar from '~/components/framework/Bottombar.vue'
import Assistant from '~/components/framework/Assistant.vue'
import addMediaChangeListener from '~/utils/media-change'
import {
	IDLE,
	IS_MOBILE,
	KEYPRESS,
	MOUSEMOVE,
	RESET_STATE,
	USER_HAS_INTERACTED,
	CURRENT_SCROLL,
	SCREEN_SIZE,
	AUTHORIZE_GROUPS
} from '~/model/constants'
import MusicPlayer from '~/components/content/MusicPlayer.vue'
import TextCursor from '~/components/elements/TextCursor.vue'
import ClipboardMessage from '~/components/content/ClipboardMessage.vue'
import CopywriteMessage from '~/components/content/CopywriteMessage.vue'
import Screensaver from '~/components/framework/Screensaver.vue'
import Login from '~/components/framework/Login.vue'
import CookieBanner from '~/components/framework/CookieBanner.vue'
import Window from '~/components/framework/Window.vue'

export default {
	name: 'default',
	components: {
		Assistant,
		Bottombar,
		MusicPlayer,
		TextCursor,
		ClipboardMessage,
		CopywriteMessage,
		Screensaver,
		Login,
		CookieBanner,
		Window
	},
	head() {
		return {
			script: [
				{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
			],
			title: 'GANNI Space'
		}
	},
	data: () => ({
		currentAudioIdx: 0,
		pageClicked: 0,
		showClipboardMessage: false,
		introStep: -1,
		introSlide: -1
	}),
	computed: {
		...mapState(['rehydrated', 'windowList']),
		...mapState('user', [
			'loggedIn',
			'copyrightAccepted',
			'idle',
			'mousepos',
			'cookiesAccepted'
		]),
		...mapState('utils', [
			'isMobile',
			'downloadPreparing',
			'clipBoardCopyComplete',
			'dashboardDark',
			'__prod__'
		]),
		transform() {
			const transformValue = 10 - this.introSlide * 10
			return this.introSlide > -0.5 && this.introSlide !== 1
				? `translateY(${transformValue}vh)`
				: ''
		}
	},
	methods: {
		...mapActions([RESET_STATE.action]),
		// ...mapState('ganniFm', ['songs']),
		...mapActions('user', [
			KEYPRESS.action,
			IDLE.action,
			MOUSEMOVE.action,
			USER_HAS_INTERACTED.action,
			CURRENT_SCROLL.action,
			SCREEN_SIZE.action
		]),
		...mapActions('utils', [IS_MOBILE.action]),
		...mapActions('collection', [AUTHORIZE_GROUPS.action]),

		onidle() {
			this[IDLE.action](true)
		},
		nonidle() {
			if (this.idle) {
				this[IDLE.action](false)
			}
		},

		onMediaChange(isMobile) {
			this[IS_MOBILE.action](isMobile)
		},

		setTransformOrigin(el) {
			el.style.transformOrigin = `${this.mousepos.x}px ${this.mousepos.y}px`
			el.style.transitionDelay = `${el.dataset.index * 0.05 - 0.05}s`
		},

		onIntroStep(step) {
			this.introStep = step
		},

		onIntroSlide(progress) {
			this.introSlide = progress
		}

		// nextSong() {
		// 	this.currentAudioIdx = nextIndex(this.songs, this.currentAudioIdx)
		// }
	},
	mounted() {
		window.$gtm = this.$gtm

		window.GS_LOGS = false // window.location.href.includes('localhost')

		// this.$store.commit('collection/' + INDEX_COLLECTION_DATA.mutation)

		this.onMediaChange(window.innerWidth <= 768) // todo: ugly way of init
		addMediaChangeListener(
			this.onMediaChange.bind(null, true),
			this.onMediaChange.bind(null, false)
		)

		window.addEventListener('keyup', this[KEYPRESS.action])
		window.addEventListener('keydown', event => {
			if (event.ctrlKey && event.altKey && event.code === 'KeyR') {
				this[RESET_STATE.action](event)
			}
		})
		document.body.addEventListener('click', () => {
			this.nonidle()
		})
		document.body.addEventListener(
			'mousemove',
			() => {
				setTimeout(this[USER_HAS_INTERACTED.action], 2000)
			},
			{ once: true }
		)

		// document.body.addEventListener('mousemove', this.nonidle.bind(this))

		window.addEventListener('mousemove', event => {
			// debounce(() => {
			this.nonidle()
			this[MOUSEMOVE.action](event)
			// }, 200)
		})

		// TODO : add some throttle/debounce
		this[CURRENT_SCROLL.action](window.pageYOffset)
		window.addEventListener('scroll', () => {
			this[CURRENT_SCROLL.action](window.pageYOffset)
		})
		const setScreenSize = () => {
			this[SCREEN_SIZE.action]({
				width: window.innerWidth,
				height: window.innerHeight
			})
		}
		setScreenSize()
		window.addEventListener('resize', setScreenSize)

		if (
			navigator.userAgent.indexOf('Safari') != -1 &&
			navigator.userAgent.indexOf('Chrome') == -1
		) {
			document.body.classList.add('safari')
		}

		this[AUTHORIZE_GROUPS.action]()

		// console.log(this.$route)
	}
}
</script>
