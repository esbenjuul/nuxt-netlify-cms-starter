<template>
	<transition name="fade">
		<div class="look-book">
			<div
				class="look-book__item"
				v-for="(item, index) in content"
				:key="'lookbook' + index"
			>
				<loading />

				<img
					v-if="item.type === 'image'"
					v-lazy="getMediaUrl(item.type, item.cloudinaryUrl)"
					alt=""
				/>
				<video
					v-if="item.type === 'video'"
					:src="getMediaUrl(item.type, item.cloudinaryUrl)"
					preload
					muted
					controls
				/>
			</div>
		</div>
	</transition>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import WindowContent from '~/components/framework/WindowContent.vue'
import Loading from '~/components/content/Loading.vue'

export default {
	extends: WindowContent,
	components: { Loading },
	name: 'look-book',
	props: {
		contentId: { type: String, default: 'lookBook', required: true }
	},
	computed: {
		// weird syntax to get state dynamically based on props.contentId
		content() {
			return this.$store.state.assets[this.contentId]
		}
	},
	methods: {
		getMediaUrl(type, cURL) {
			return getCloudinaryUrl(
				this.$cloudinary,
				{ type: type, cloudinaryUrl: cURL },
				{ width: 500 },
				2
			)
		}
	}
}
</script>