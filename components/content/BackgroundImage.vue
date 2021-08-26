<template>
	<div
		class="background-image"
		:style="{ backgroundColor: desktopBackgroundColor }"
	>
		<img
			v-for="(background, i) in backgrounds"
			v-show="i === desktopBackground"
			:key="'sfgsdfgsdfg' + i"
			:src="background.image"
		/>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'

export default {
	name: 'background-image',
	data: () => ({ backgrounds: [] }),
	computed: {
		...mapState('assets', [
			'desktop',
			'desktopBackground',
			'desktopBackgroundColor'
		])
	},

	mounted() {
		this.backgrounds = this.desktop.map(x => ({
			...x,
			image: getCloudinaryUrl(
				this.$cloudinary,
				{
					cloudinaryUrl: x.image,
					asset: 'image'
				},
				{
					width: 1600,
					quality: 90
				}
			)
		}))
	}
}
</script>