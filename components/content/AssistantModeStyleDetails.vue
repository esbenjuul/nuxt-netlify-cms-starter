<template>
	<div>
		<div
			class="assistant__content"
			:class="{
				'is-collapsed': isMobile && !expanded,
			}"
		>
			<div class="assistant__product-details">
				<span v-if="currentStyle.responsible" class="responsible">
					<div>I am a certified responsible material —&nbsp;</div>
					<div>I am a certified responsible material —&nbsp;</div>
					<div>I am a certified responsible material —&nbsp;</div>
				</span>

				<table>
					<tbody>
						<tr>
							<th>Color</th>
							<td>{{ currentStyle.colorNames }}</td>
						</tr>

						<tr>
							<th>&nbsp;</th>
							<td>&nbsp;</td>
						</tr>

						<tr>
							<th>Material</th>
							<td>{{ currentStyle.material }}</td>
						</tr>
						<tr>
							<th>Style #</th>
							<td>{{ currentStyle.styleId }}</td>
						</tr>
						<tr>
							<th>Program #</th>
							<td>{{ currentStyle.program }}</td>
						</tr>
						<tr>
							<th>Program name</th>
							<td>{{ currentStyle.programName }}</td>
						</tr>

						<tr>
							<th>&nbsp;</th>
							<td>&nbsp;</td>
						</tr>

						<tr v-if="SHOW_WHOLESALE_PRICE">
							<th>Wholesale price</th>
							<td>DKK {{ currentStyle.wholesalePriceDKK }}</td>
						</tr>
						<tr v-if="SHOW_WHOLESALE_PRICE">
							<th></th>
							<td>EUR {{ currentStyle.wholesalePriceEUR }}</td>
						</tr>
						<tr v-if="SHOW_WHOLESALE_PRICE">
							<th></th>
							<td>USD {{ currentStyle.wholesalePriceUSD }}</td>
						</tr>
						<tr v-if="currentStyle.wholesalePriceGBP && SHOW_WHOLESALE_PRICE">
							<th></th>
							<td>GBP {{ currentStyle.wholesalePriceGBP }}</td>
						</tr>

						<tr>
							<th>&nbsp;</th>
							<td>&nbsp;</td>
						</tr>

						<tr>
							<th>Suggested retail price</th>
							<td>DKK {{ currentStyle.retailPriceDKK }}</td>
						</tr>
						<tr>
							<th></th>
							<td>EUR {{ currentStyle.retailPriceEUR }}</td>
						</tr>
						<tr>
							<th></th>
							<td>USD {{ currentStyle.retailPriceUSD }}</td>
						</tr>
						<tr v-if="currentStyle.retailPriceGBP">
							<th></th>
							<td>GBP {{ currentStyle.retailPriceGBP }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>

		<div class="assistant__ctas">
			<button
				class="button show-variants"
				v-if="hasHiddenAssets"
				@click="showAllVariantsClickHandler"
			>
				<span class="icon">
					<img src="/img/gan_color_wheel.png" alt />
				</span>
				<p>Show all variants</p>
			</button>
			<button
				class="button add-to-wishlist button--half"
				:class="{
					'is-active': styleOnWishList,
					'is-animating': styleHasBeenAdded,
				}"
				@click="addToWishListClickHandler"
			>
				<span class="icon">
					<svg
						class="checkmark"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 78.4 78.4"
					>
						<path
							d="M78 19L29.5 67.6a1 1 0 01-1.6 0L.3 40a1 1 0 010-1.5L7 31.8c.5-.5 1.1-.5 1.6 0l20 20 41.2-41c.4-.5 1.1-.5 1.5 0l6.7 6.7a1 1 0 010 1.5z"
						/>
					</svg>
				</span>
				<p>{{ addToWishListButtonLabel }}</p>
			</button>
			<button
				class="button view-wishlist button--half"
				@click="viewWishListClickHandler"
			>
				<p>{{ viewWishListButtonLabel }}</p>
			</button>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import {
	ALL_ASSETS_VISIBLE,
	ADD_TO_WISHLIST,
	OPEN_CONTENT,
	OPEN_WISH_LIST,
	SHOW_NEW_STYLE,
	// SHOW_NEXT_STYLE,
	SET_HIDDEN_ASSETS,
} from '~/model/constants'
import sendTracking from '~/utils/send-tracking'

export default {
	name: 'assistant-mode-style-details',
	data: () => ({ styleHasBeenAdded: false }),
	computed: {
		...mapState(['SHOW_WHOLESALE_PRICE']),
		...mapState('utils', ['isMobile']),
		...mapState('user', ['keyPressed']),
		...mapState('assistant', ['assistantMode', 'expanded']),
		...mapState('collection', [
			'currentStyle',
			'wishList',
			'hiddenAssetContent',
		]),
		...mapGetters('assistant', ['viewWishListButtonLabel']),
		hasHiddenAssets() {
			return this.hiddenAssetContent.length > 0
		},
		styleOnWishList() {
			return this.wishList.find((s) => s.styleId === this.currentStyle.styleId)
		},
		addToWishListButtonLabel() {
			if (this.styleOnWishList) return 'Added to wishlist'
			return 'Add to wishlist'
		},
	},
	watch: {
		keyPressed(event) {
			if (event.key === 'ArrowLeft') {
				// this.previousStyleHandler()
				this[SHOW_NEW_STYLE.action]({
					styleId: this.currentStyle.styleId,
					previous: true,
				})
			}

			if (event.key === 'ArrowRight') {
				// this.nextStyleHandler()
				this[SHOW_NEW_STYLE.action]({
					styleId: this.currentStyle.styleId,
					next: true,
				})
			}

			if (event.code === 'Space') {
				this.addToWishListClickHandler()
			}
		},
	},
	methods: {
		...mapActions([OPEN_WISH_LIST.action]),
		...mapActions('collection', [
			OPEN_CONTENT.action,
			ALL_ASSETS_VISIBLE.action,
			SHOW_NEW_STYLE.action,
			// SHOW_NEXT_STYLE.action,
			ADD_TO_WISHLIST.action,
			SET_HIDDEN_ASSETS.action,
		]),
		showAllVariantsClickHandler() {
			this[ALL_ASSETS_VISIBLE.action](this.currentStyle)
			this[OPEN_CONTENT.action]({
				windowContent: this.hiddenAssetContent,
				addToGroupId: this.topMostWindow.groupId,
			})
			this[SET_HIDDEN_ASSETS.action](false)
		},
		addToWishListClickHandler() {
			if (!this.styleOnWishList) {
				this[ADD_TO_WISHLIST.action](this.currentStyle.styleId)

				this.styleHasBeenAdded = true
				setTimeout(() => {
					this.styleHasBeenAdded = false
				}, 4000)

				sendTracking('Add to wish list', this.currentStyle.styleId)
			}
		},
		previousStyleHandler() {},
		nextStyleHandler() {},
		viewWishListClickHandler() {
			this[OPEN_WISH_LIST.action]()
		},
	},
}
</script>