<template>
	<span class="countdown">{{ preText }} {{ duration }} {{ postText }}</span>
</template>

<script>
import * as dateFns from 'date-fns'

export default {
	name: 'countdown',
	data: () => ({
		duration: '',
		durationRaw: {},
		secondTicker: -1,
		isFuture: true
	}),
	props: {
		preText: {
			type: String
		},
		postText: {
			type: String
		},
		deadline: {
			type: String,
			default: () => []
		},
		slim: { type: Boolean },
		customFormat: { type: Array }
	},
	methods: {
		updateDuration() {
			this.durationRaw = dateFns.intervalToDuration({
				start: new Date(),
				end: new Date(this.deadline)
			})

			this.secondTicker = dateFns.formatDuration(this.durationRaw, {
				format: ['seconds'],
				zero: true
			})

			this.duration = dateFns.formatDuration(this.durationRaw, {
				format:
					this.customFormat ||
					(this.slim
						? ['months', 'days', 'hours']
						: ['days', 'hours', 'minutes', 'seconds']),
				zero: true
			})
		},
		loop() {
			const tick = () => {
				requestAnimationFrame(tick)
				this.updateDuration()
			}
			tick()
		}
	},
	watch: {
		secondTicker() {
			this.$emit('is-future', dateFns.isFuture(new Date(this.deadline)))
		}
	},
	mounted() {
		this.updateDuration()
		this.loop()
	}
}
</script>
