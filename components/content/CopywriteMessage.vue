<template>
	<div class="copyright-message">
		<div class="window window--no-status window--tight">
			<header class="window__top">
				<span class="title">Important Info</span>
			</header>
			<div class="window__content">
				<span class="icon">
					<!-- <img src="/img/smiley-bw.png" /> -->

					<p>
						Hi, we hope you will enjoy your Ganni Space Virtual Showroom
						experience.<br /><br />
						Please note that all visual material and images are for internal use
						only and not to be distributed outside this platform.
					</p>
				</span>

				<slot></slot>

				<button class="button ok" @click="copyrightMessageClickHandler">
					Accept all
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex'
import { COPYRIGHT_ACCEPT, COOKIES_ACCEPT } from '~/model/constants'

export default {
	name: 'copywrite-message',
	methods: {
		...mapActions('user', [COPYRIGHT_ACCEPT.action, COOKIES_ACCEPT.action]),
		copyrightMessageClickHandler() {
			this[COPYRIGHT_ACCEPT.action](true)
			this[COOKIES_ACCEPT.action](true)
		}
	}
}
</script>
