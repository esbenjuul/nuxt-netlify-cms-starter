<template>
	<div :oncontextmenu="__prod__ ? `return false;` : ''">
		<!-- TO PREVENT DOWNLOADS -->
		<login v-if="!loggedIn" />
		<desktop v-else />

		<v-idle v-show="false" :duration="15000" @idle="onidle" />
		<screensaver v-if="idle" />

		<mobile-disclamer v-if="isMobile" />

		<cookie-banner v-if="!cookiesAccepted"></cookie-banner>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import addMediaChangeListener from '~/utils/media-change'
import ViewportSizes from '~/model/viewport-sizes'

import Login from '~/components/framework/Login.vue'
import Desktop from '~/components/framework/Desktop.vue'
import Screensaver from '~/components/framework/Screensaver.vue'
import CookieBanner from '~/components/framework/CookieBanner.vue'
import MobileDisclamer from '~/components/content/MobileDisclamer.vue'

import getShortUrl from '~/utils/get-short-url'

import {
	INDEX_COLLECTION_DATA,
	INIT_PROGRESS,
	IDLE,
	IS_MOBILE
} from '~/model/constants'

export default {
	components: {
		Login,
		Desktop,
		Screensaver,
		CookieBanner,
		MobileDisclamer
	},
	computed: {
		...mapState('user', ['loggedIn', 'cookiesAccepted', 'idle']),
		...mapState('utils', ['isMobile', '__prod__']),
		mobile() {
			return (this.viewPortSize = ViewportSizes.SMALL)
		}
	},
	head() {
		return {
			script: [
				{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' }
			],
			link: [
				{
					rel: 'stylesheet',
					type: 'text/css',
					href:
						'https://fonts.googleapis.com/css?family=Roboto:400,500,600&amp;subset=latin,latin-ext'
				}
			],
			title: 'GANNI Space'
		}
	},
	methods: {
		...mapActions('user', [IDLE.action]),
		...mapActions('utils', [IS_MOBILE.action]),
		toggleScreenSaver(idle) {
			if (this.idle) {
				this[IDLE.action](idle)
			}
		},
		onidle() {
			this[IDLE.action](true)
		},
		onMediaChange(isMobile) {
			this[IS_MOBILE.action](isMobile)
		}
	},
	mounted() {
		if (window.GS_LOGS) console.warn('MOUNTED INDEX - PERFORM INITIALISATIONS')

		this.$store.commit('collection/' + INDEX_COLLECTION_DATA.mutation)
		this.$store.commit('progressBar/' + INIT_PROGRESS.mutation)

		//add clear timeout listeners
		document.body.addEventListener(
			'click',
			this.toggleScreenSaver.bind(this, false)
		)
		document.body.addEventListener(
			'mousemove',
			this.toggleScreenSaver.bind(this, false)
		)

		this.onMediaChange(window.innerWidth <= 1024) // todo: ugly way of init
		addMediaChangeListener(
			this.onMediaChange.bind(null, true),
			this.onMediaChange.bind(null, false)
		)
	}
}
</script>
