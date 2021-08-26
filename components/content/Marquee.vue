<template>
	<div ref="marquee" class="marquee" :class="{ paused: windowList.length }">
		<!-- loop a couple of times to make them fill the screen -->
		<p v-for="i in 5" :key="i">
			&nbsp;Welcome to the GANNI Space!&nbsp;&nbsp;&bull;&nbsp;
			<span v-for="link in marqueeLinks" :key="link.label">
				{{ link.text }}
				<button @click="openWindow(link)">{{ link.label }}</button>
				{{ link.textAfter }}
				&nbsp;&bull;&nbsp;
			</span>
		</p>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { OPEN_STYLE_CONTENT, OPEN_CONTENT } from '~/model/constants'
import ShortcutTypes from '~/model/shortcut-types'

export default {
	name: 'marquee',
	computed: {
		...mapState('shortcuts', ['list']),
		...mapState(['windowList']),
		marqueeLinks() {
			return this.list.filter(s => s.type === ShortcutTypes.MARQUEE)
		}
	},
	methods: {
		...mapActions([OPEN_STYLE_CONTENT.action, OPEN_CONTENT.action]),
		openWindow(link) {
			if (!link.windowContent) {
				this[OPEN_STYLE_CONTENT.action](link.actionParam)
			} else {
				if (link.actions) {
					for (var i = link.actions.length - 1; i >= 0; i--) {
						let action = link.actions[i]
						if (typeof action.param != 'undefined')
							this.$store.dispatch(action.name, action.param)
						else this.$store.dispatch(action.name)
					}

					//TODO: Fix race condition!!
					setTimeout(() => {
						this[OPEN_CONTENT.action]({ windowContent: link.windowContent })
					}, 500)
				} else {
					this[OPEN_CONTENT.action]({ windowContent: link.windowContent })
				}
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.amount =
				Math.ceil(
					window.innerWidth /
						parseInt(window.getComputedStyle(this.$refs.marquee).width)
				) *
					2 +
				1
		})
	}
}
</script>