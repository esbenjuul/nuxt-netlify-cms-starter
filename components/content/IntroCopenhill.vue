<template>
	<div
		class="intro-copenhill"
		@click="onClick"
		:class="{ outro: isLeaving }"
		:style="{ cursor: !deadlinePassed ? 'default' : 'pointer' }"
	>
		<img
			class="intro-copenhill__background fade"
			alt="The Copenhill plant"
			v-lazy="various.loginBackground[0]"
		/>
		<div class="intro-copenhill__text">
			<span class="higher">
				<span class="higher--animation">
					<span class="higher--translate">
						<span class="higher--rotate">HIGHER</span>
					</span>
				</span>
			</span>
			<span class="love">
				<span class="love--animation">
					<span class="love--translate">
						LOVE
					</span>
				</span>
			</span>
			<span class="ganni">
				<span class="ganni--animation">
					<span class="ganni--translate">
						GANNI
					</span>
				</span>
			</span>
			<span class="ss22">
				<span class="ss22--animation">
					<span class="ss22--translate">
						<span class="ss22--rotate"> <span class="small">ss</span>22 </span>
					</span>
				</span>
			</span>
		</div>

		<marquee :deadline="various.releaseDate" @timeupdate="onTimeupdate" />
	</div>
</template>

<script>
import Marquee from '~/components/content/Marquee.vue'
import { mapState, mapActions } from 'vuex'
import { TEXT_CURSOR } from '~/model/constants'

export default {
	name: 'intro-copenhill',
	components: {
		Marquee
	},
	data: () => ({
		isLeaving: false,
		deadlinePassed: false
	}),
	computed: {
		...mapState('utils', ['various'])
	},
	methods: {
		...mapActions('utils', [TEXT_CURSOR.action]),
		onClick() {
			if (
				!this.deadlinePassed &&
				!window.location.href.includes('localhost') &&
				this.$route.hash !== '#dev'
			)
				return

			this.isLeaving = true

			setTimeout(() => {
				this.$emit('done')
			}, 2000)
		},
		onTimeupdate(isFuture) {
			this.deadlinePassed = !isFuture

			if (this.deadlinePassed) {
				this[TEXT_CURSOR.action]({ str: 'Click to login' })
			}
		}
	},
	beforeDestroy() {
		this[TEXT_CURSOR.action]({ str: '' })
	}
}
</script>
