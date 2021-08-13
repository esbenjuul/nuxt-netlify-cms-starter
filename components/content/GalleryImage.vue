<template>
	<div class="gallery-image">
		<!-- <loading /> -->
		<img v-lazy="imageUrl" alt="img" />
	</div>
</template>

<script>
import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import Loading from '~/components/content/Loading.vue'

export default {
	name: 'gallery-image',
	components: { Loading },
	props: {
		asset: {
			type: String,
			required: true
		},
		focused: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		imageUrl() {
			return getCloudinaryUrl(
				this.$cloudinary,
				{ cloudinaryUrl: this.asset },
				{ width: 1200 }
			)
		}
	},
	mounted() {
		if (this.focused) {
			setTimeout(() => this.$el.scrollIntoView({ behavior: 'smooth' }), 500)
		}
	}
}
</script>
