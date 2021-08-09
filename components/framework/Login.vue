<template>
	<div
		class="login"
		:class="{
			'login--background': currentStep < 2,
			pointerEvents: currentStep === 3 ? 'none' : 'auto'
		}"
	>
		<!-- <div
			style="position: fixed; top: 0; right: 0; z-index: 2; background: blue"
		>
			{{ currentStep }}
			<button @click="() => (currentStep = Math.max(currentStep - 1, 0))">
				←
			</button>
			<button @click="() => (currentStep = Math.min(currentStep + 1, 2))">
				→
			</button>
		</div> -->

		<transition name="fade">
			<intro-copenhill v-if="currentStep === 0" @done="onIntroDone" />
			<login-input v-if="currentStep === 1" @submit="onSubmit" />
			<countup
				v-if="currentStep === 2"
				@done="onCountDone"
				@progress="onProgress"
			/>
			<p :style="{ pointerEvents: 'none' }" v-if="currentStep === 3">
				Meters in the sky!
			</p>
		</transition>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoginInput from '~/components/content/LoginInput.vue'
import Countup from '~/components/content/Countup.vue'
import IntroCopenhill from '~/components/content/IntroCopenhill.vue'
import { LOGIN } from '~/model/constants'

export default {
	name: 'login',
	components: {
		LoginInput,
		Countup,
		IntroCopenhill
	},
	data() {
		return {
			muted: true,
			showInputField: false,
			authorized: null,
			currentStep: 0
		}
	},
	computed: {
		...mapState('utils', ['various']),
		...mapState('user', ['loggedIn'])
	},
	watch: {
		currentStep() {
			this.$emit('step', this.currentStep)
		}
	},
	methods: {
		...mapActions('user', [LOGIN.action]),
		toggleMute() {
			if (this.muted) {
				this.$refs.player.unmute()
			} else {
				this.$refs.player.mute()
			}
			this.muted = !this.muted
		},
		onIntroDone() {
			this.currentStep = 1
		},
		onSubmit(authorized) {
			if (authorized) {
				this.authorized = authorized
				this.currentStep = 2
			}
		},
		onCountDone() {
			this.currentStep = 3
			setTimeout(() => {
				this[LOGIN.action](this.authorized)
			}, 2000)
		},
		onProgress(progress) {
			this.$emit('slide', progress)
		}
	}
}
</script>
