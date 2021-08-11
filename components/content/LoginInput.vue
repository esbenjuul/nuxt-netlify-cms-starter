<template>
	<div class="login-input">
		<div class="login-input__background"></div>
		<div class="login-input__welcome">
			<p>Welcome</p>
		</div>

		<div class="login-input__all">
			<form ref="form" @submit.prevent="loginInput(true)" class="form">
				<!-- :style="{ opacity: !showMessage && !pwd ? '1' : '0' }" -->
				<input
					:class="{ 'is-invalid': showErrorMessage }"
					@input="loginInput(false)"
					@blur="isBlur"
					@focus="isFocus = true"
					autocomplete="off"
					class="form__input"
					id="password"
					name="password"
					type="password"
					v-model="pwd"
					ref="passwordInput"
				/>
				<!-- <button
				:class="{
					'is-active': pwd.length > 0,
					'is-invalid': showErrorMessage,
				}"
				class="submit"
				@click.prevent="submitClickHandler"
			>
				{{ showErrorMessage ? 'Wrong password' : 'Enter' }}
			</button> -->
			</form>

			<div class="login-input__message">
				<p v-show="showMessage && !pwd">Please type password</p>
				<span v-show="!showMessage && !pwd">|</span>
			</div>

			<div
				class="login-input__canvas"
				:style="{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: '100%',
					zIndex: '-1'
				}"
			>
				<login-asterixes
					:shake="showErrorMessage"
					:amount="pwd.length"
					:start="valid ? true : false"
				/>
			</div>
		</div>

		<!-- <div class="error-message" v-if="showErrorMessage">
			<p>Wrong password</p>
		</div> -->
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { LOGIN, HAS_AUTHENTICATED } from '~/model/constants'
import hash from 'hash.js'
import FullpageSlideShow from '~/components/content/FullpageSlideShow.vue'
import LoginAsterixes from '~/components/content/LoginAsterixes.vue'

export default {
	name: 'login',
	components: {
		FullpageSlideShow,
		LoginAsterixes
	},
	data() {
		return {
			pwd: '',
			valid: false,
			isFocus: false,
			showErrorMessage: false,
			showMessage: false,
			welcome: true
		}
	},
	computed: {
		...mapState('user', ['loggedIn', 'passwords', 'cookiesAccepted'])
	},
	methods: {
		...mapActions('user', [
			LOGIN.action
			// HAS_AUTHENTICATED.action
		]),

		updateValidState() {
			const passwordUsed = hash
				.sha256()
				.update(this.pwd)
				.digest('hex')

			const authorized = this.passwords.find(
				pw => pw.hash.toLowerCase() === passwordUsed.toLowerCase()
			)

			setTimeout(() => {
				this.$emit('submit', authorized)

				/**
				 * Temporary double-authentication,
				 * There was an old password still running on PS22 and
				 * in order to force users to logout this was added:
				 */
				// this[HAS_AUTHENTICATED.action](authorized)
			}, 3000)

			this.valid = authorized
		},

		loginInput(wasSubmitted) {
			this.updateValidState()
			// this.showErrorMessage = false
			this.$nextTick(() => {
				if (!this.valid && wasSubmitted) this.showErrorMessage = true
			})

			setTimeout(() => {
				this.showErrorMessage = false
			}, 1000)
		},

		submitClickHandler() {
			this.updateValidState()
			if (!this.valid) this.showErrorMessage = true
		},

		isBlur(e) {
			if (this.loggedIn) return
			// this.valid = true

			if (!this.pwd) {
				this.isFocus = false
			}
		},

		// playSound() {
		// 	const audio = new Audio('/audio/ganni_boot.mp3')
		// 	audio.addEventListener('loadeddata', () => {
		// 		audio.volume = 0.4
		// 		audio.play()
		// 	})
		// },

		initMessage() {
			setTimeout(() => {
				this.showMessage = !this.showMessage
				this.initMessage()
			}, 4000)
		},

		giveFocus() {
			this.$refs.passwordInput && this.$refs.passwordInput.focus()
		}
	},
	mounted() {
		this.$refs.passwordInput.focus()
		this.initMessage()
		document.body.addEventListener('click', this.giveFocus.bind(this))
	},
	beforeDestroy() {
		document.body.removeEventListener('click', this.giveFocus.bind(this))
	}
}
</script>
