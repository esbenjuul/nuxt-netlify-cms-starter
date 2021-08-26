<template>
	<div class="fullpage-slide-show">
		<div class="col" v-for="(_, i) in [...Array(cols)]" :key="`col${i}`">
			<div
				v-for="(_, j) in [1, 2]"
				:key="`wrap-overlap${j}`"
				:style="{
					animationPlayState: animate ? 'running' : 'paused',
					animationDuration: `${columnContent(i).length * 10}s`
				}"
			>
				<div class="gap" />
				<div
					v-for="(asset, x) in columnContent(i)"
					:key="`introslideasset-${i}-${j}-${x}`"
					:class="{ withGap: randomNumbers[i + 1 * x] > 0.5 }"
				>
					<img
						v-if="asset.type === 'image'"
						:src="getMediaUrl(asset.type, asset.cloudinaryUrl)"
					/>
					<video
						v-if="asset.type === 'video'"
						:src="getMediaUrl(asset.type, asset.cloudinaryUrl)"
						preload
						loop
						muted
						autoplay
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'

export default {
	name: 'fullpage-slide-show',
	props: { animate: { type: Boolean, defaults: false, required: false } },
	data: () => ({ cols: 4 }),
	computed: {
		...mapState('assets', ['intro']),
		randomNumbers() {
			// first element always 0
			return [0, ...[...Array(200)].map(Math.random)]
		}
	},
	methods: {
		getMediaUrl(type, cloudinaryUrl) {
			return getCloudinaryUrl(
				this.$cloudinary,
				{ type, cloudinaryUrl },
				{ width: 200 },
				2
			)
		},

		columnContent(n) {
			return this.intro.filter(item => parseInt(item.column) === n + 1)
		}
	}
}
</script>