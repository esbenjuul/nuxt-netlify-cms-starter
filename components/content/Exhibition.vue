<template>
	<transition name="fade">
		<div class="exhibition">
			<button
				class="exhibition__item"
				v-for="(item, index) in list"
				:key="'lookbook' + index"
				@click.stop="itemClickHandler(item)"
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
					autoplay
				></video>
				<div>
					<p v-html="item.name" />
				</div>
			</button>
		</div>
	</transition>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import { OPEN_EXHIBITION_CONTENT } from '~/model/constants'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'
import WindowContent from '~/components/framework/WindowContent.vue'
import Loading from '~/components/content/Loading.vue'

export default {
	extends: WindowContent,
	name: 'exhibition',
	components: { Loading },
	computed: {
		...mapState('exhibition', ['list'])
	},
	methods: {
		...mapActions('exhibition', [OPEN_EXHIBITION_CONTENT.action]),
		getMediaUrl(type, cURL) {
			return getCloudinaryUrl(
				this.$cloudinary,
				{ type: type, cloudinaryUrl: cURL },
				{ width: 500 },
				2
			)
		},
		itemClickHandler(item) {
			this[OPEN_EXHIBITION_CONTENT.action](item.exhibitionId)
		}
	}
}
</script>