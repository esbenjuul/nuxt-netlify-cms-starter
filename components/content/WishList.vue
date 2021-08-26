<template>
	<div class="wish-list">
		<div class="wish-list__overview" v-if="!isMobile">
			<div
				class="wish-list__overview__item"
				v-for="(item, index) in wishList"
				:key="'wishListItem' + index"
				:class="{ 'is-active': currentWishListIndex == index }"
			>
				<button
					v-if="item.assets && item.assets.length > 0"
					class="button activate"
					@click="overviewItemActivateHandler(index)"
				>
					<img :src="getImageUrl(index)" alt />
					<p>{{ item.name }}</p>
				</button>
				<button
					class="button remove"
					@click.stop="overviewItemRemoveHandler(index)"
				>
					<span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
							<path
								d="M15.7 15l7.8-7.8-.7-.7-7.8 7.8-7.8-7.8-.7.7 7.8 7.8-7.8 7.8.7.7 7.8-7.8 7.8 7.8.7-.7-7.8-7.8z"
							/>
						</svg>
					</span>
				</button>
			</div>
		</div>
		<transition name="fade" mode="in-out">
			<div class="wish-list__details" v-if="!isMobile">
				<div v-bar>
					<div class="inner" v-if="wishList.length < 1">
						<p>Your wish list is empty!</p>
					</div>
					<div
						class="inner"
						v-if="
							currentWishListItem &&
								currentWishListItem.assets &&
								currentWishListItem.assets.length > 0
						"
						:key="currentWishListIndex"
					>
						<single-image
							:asset="currentWishListItem.assets[0]"
							:parent-window-id="parentWindowId"
						/>

						<h3>{{ currentWishListItem.name }}</h3>
						<button class="button" @click="removeItemHandler">
							Remove from wishlist
						</button>

						<table>
							<tbody>
								<tr>
									<th>Name</th>
									<td>{{ currentWishListItem.name }}</td>
								</tr>
								<tr>
									<th>Color</th>
									<td>{{ currentWishListItem.colorNames }}</td>
								</tr>
								<tr>
									<th>Material</th>
									<td>{{ currentWishListItem.material }}</td>
								</tr>
								<tr>
									<th>Style #</th>
									<td>{{ currentWishListItem.styleId }}</td>
								</tr>
								<tr>
									<th>Program #</th>
									<td>{{ currentWishListItem.program }}</td>
								</tr>
								<tr>
									<th>Program name</th>
									<td>{{ currentWishListItem.programName }}</td>
								</tr>

								<tr>
									<th>&nbsp;</th>
									<td>&nbsp;</td>
								</tr>

								<tr v-if="SHOW_WHOLESALE_PRICE">
									<th>Wholesale price</th>
									<td>DKK {{ currentWishListItem.wholesalePriceDKK }}</td>
								</tr>
								<tr v-if="SHOW_WHOLESALE_PRICE">
									<th></th>
									<td>EUR {{ currentWishListItem.wholesalePriceEUR }}</td>
								</tr>
								<tr v-if="SHOW_WHOLESALE_PRICE">
									<th></th>
									<td>USD {{ currentWishListItem.wholesalePriceUSD }}</td>
								</tr>
								<tr
									v-if="
										currentWishListItem.wholesalePriceGBP &&
											SHOW_WHOLESALE_PRICE
									"
								>
									<th></th>
									<td>GBP {{ currentWishListItem.wholesalePriceGBP }}</td>
								</tr>

								<tr>
									<th>&nbsp;</th>
									<td>&nbsp;</td>
								</tr>

								<tr>
									<th>Suggested retail price</th>
									<td>DKK {{ currentWishListItem.retailPriceDKK }}</td>
								</tr>
								<tr>
									<th></th>
									<td>EUR {{ currentWishListItem.retailPriceEUR }}</td>
								</tr>
								<tr>
									<th></th>
									<td>USD {{ currentWishListItem.retailPriceUSD }}</td>
								</tr>
								<tr v-if="currentWishListItem.retailPriceGBP">
									<th></th>
									<td>GBP {{ currentWishListItem.retailPriceGBP }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</transition>
		<div v-if="isMobile">
			<wish-list-accordion
				v-for="(item, key) in wishList"
				:key="'wishListItem' + key"
				:wish-list-item="item"
			/>
		</div>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import { REMOVE_FROM_WISHLIST } from '~/model/constants'

import getCloudinaryUrl from '~/utils/get-cloudinary-url'

import SingleImage from '~/components/content/SingleImage.vue'
import WishListAccordion from '~/components/content/WishListAccordion.vue'
import ViewportSizes from '~/model/viewport-sizes'
import addMediaChangeListener from '~/utils/media-change'

import WindowContent from '~/components/framework/WindowContent.vue'

export default {
	extends: WindowContent,
	name: 'wish-list',
	components: {
		WishListAccordion,
		SingleImage
	},
	computed: {
		...mapState(['SHOW_WHOLESALE_PRICE']),
		...mapState('utils', ['isMobile']),
		...mapState('collection', ['wishList']),

		currentWishListItem() {
			if (this.wishList.length > 0)
				return this.wishList[this.currentWishListIndex]
			else this.currentWishListIndex = -1
			return {}
		}
	},
	data() {
		return {
			currentWishListIndex: 0,
			accordionStates: [],
			viewPortSize: ViewportSizes.SMALL
		}
	},
	methods: {
		...mapActions(['collection/' + REMOVE_FROM_WISHLIST.action]),
		overviewItemActivateHandler(key) {
			this.currentWishListIndex = key
		},
		overviewItemRemoveHandler(key) {
			let styleId = this.wishList[key].styleId
			this.currentWishListIndex = 0
			this['collection/' + REMOVE_FROM_WISHLIST.action](styleId)
		},

		removeItemHandler() {
			let styleId = this.currentWishListItem.styleId
			this.currentWishListIndex = 0
			this['collection/' + REMOVE_FROM_WISHLIST.action](styleId)
		},
		getImageUrl(index) {
			return getCloudinaryUrl(
				this.$cloudinary,
				this.wishList[index].assets[0],
				{ width: 30 }
			)
		}
	},
	mounted() {}
}
</script>
