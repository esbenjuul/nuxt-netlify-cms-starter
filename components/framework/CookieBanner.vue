<template>
	<div :class="{ 'cookie-banner': !unStyled }">
		<div>
			<h3>GANNI SPACE uses cookies</h3>
			<p>
				We use cookies to analyse how our website is used and to simplify and
				improve your visit. If you continue to browse our website, you accept
				our use of cookies, in accordance with our
				<a href="/cookies" target="_blank">Cookie Policy</a>.
			</p>
		</div>

		<!-- <button class="button accept" @click="acceptHandler">Accept all</button> -->
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import { COOKIES_ACCEPT } from '~/model/constants'

export default {
	name: 'cookie-banner',
	props: {
		unStyled: { type: Boolean }
	},
	methods: {
		...mapActions('user', [COOKIES_ACCEPT.action]),
		acceptHandler() {
			this[COOKIES_ACCEPT.action](true)
		}
	}
}
</script>
