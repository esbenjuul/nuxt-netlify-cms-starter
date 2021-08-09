<template>
	<div
		class="countup"
		:style="{
			'--progress': `${100 - (currentCount / maxCount) * 100}%`,
			pointerEvents: 'none'
		}"
	>
		<div class="countup__title">Going up!</div>
		<div ref="count" class="countup__count">{{ currentCount }}</div>
	</div>
</template>

<script>
import BezierEasing from 'bezier-easing'

export default {
	name: 'countup',
	data: () => ({
		progress: 0,
		maxCount: 124,
		ease: BezierEasing(1, 0, 0.5, 1),
		speed: 300
	}),
	computed: {
		currentCount() {
			const { progress, maxCount } = this
			return Math.ceil(Math.min(this.ease(progress) * maxCount, maxCount))
		}
	},
	methods: {
		doCount() {
			// main base case
			if (this.progress >= 1) {
				this.$emit('done')
				return
			}

			window.requestAnimationFrame(this.doCount)
			this.progress += 1 / this.speed
			this.$emit('progress', this.currentCount / this.maxCount)
		}
	},
	mounted() {
		setTimeout(() => {
			requestAnimationFrame(this.doCount)
		}, 3000)
	}
}
</script>
