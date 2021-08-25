<template>
	<div class="green-room">
		<div
			class="green-room__item"
			v-for="(item, idx) in items"
			:key="item.text + '' + idx"
			:data-order="idx"
			ref="items"
			:class="{
				fixed: item.fixed,
				'enter-left': idx < items.length / 2,
				'is-link': item.link
			}"
			:style="{
				'--enter-duration': 2 + 's',
				'--enter-delay': idx / 10 + 's'
			}"
		>
			<!-- zIndex: items.length - idx, -->
			<img
				v-lazy="imageUrl(item.cloudinaryUrl[0])"
				v-if="!item.link"
				class="fade"
			/>

			<a
				v-else
				:href="item.link"
				target="_blank"
				@mouseenter="changeCursor('Read more', 'external')"
				@mouseleave="changeCursor('')"
			>
				<img v-lazy="imageUrl(item.cloudinaryUrl[0])" class="fade" />
			</a>
			<transition name="fade" appear>
				<div class="green-room__text" v-if="item.popup">
					<p v-html="item.popup" />
				</div>
			</transition>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { TEXT_CURSOR } from '~/model/constants'
import getCloudinaryUrl from '~/utils/get-cloudinary-url'

export default {
	name: 'green-room',
	data: () => ({}),
	computed: {
		...mapState('greenRoom', ['items'])
	},
	methods: {
		...mapActions('utils', [TEXT_CURSOR.action]),
		changeCursor(str, icon) {
			this[TEXT_CURSOR.action]({ str, icon })
		},
		imageUrl(asset) {
			return getCloudinaryUrl(
				this.$cloudinary,
				{ cloudinaryUrl: asset },
				{ width: 600 }
			)
		}
	},
	mounted() {},
	beforeDestroy() {
		this.changeCursor('')
	}
}
</script>
