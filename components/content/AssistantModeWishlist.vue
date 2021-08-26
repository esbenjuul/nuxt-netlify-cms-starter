<template>
	<div>
		<div class="assistant__content">
			<div class="assistant__text">
				<p>
					You know the drill. Add your favourites to your wishlist. When you’re
					done you can download to see your favorites or share with your team
				</p>
			</div>
			<div
				class="assistant__text"
				v-if="shortenedReceiptUrl && wishList.length"
			>
				<p>Your Wishlist link</p>
				<strong @click="shareUrlClickHandler">{{ shortenedReceiptUrl }}</strong>
			</div>
		</div>

		<div class="assistant__ctas" v-if="wishList.length">
			<a
				class="button download-wishlist button--half"
				:href="`${pdfDownloadLink}&url=${encodeURIComponent(wishListUrl)}`"
				@click="downloadWishListClickHandler"
			>
				<!-- :href="pdfDownloadLink" -->
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
						<path
							d="M8.4 5.4v-.9L5.3 7.2V.6h-.6v6.6L1.6 4.5v.9l3.4 3zM1 9.4h8v.6H1z"
						/>
					</svg>
				</span>
				<p>Download wishlist</p>
			</a>

			<button
				@click="shareWishListClickHandler"
				class="button share-wishlist button--half"
			>
				<p v-if="!showClipboardMessage">Share wishlist</p>
				<p
					v-if="showClipboardMessage"
					:style="{ color: '#1DD000', textDecoration: 'none' }"
				>
					Link copied
				</p>
			</button>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import {
	DOWNLOAD_PREPARING,
	CLIPBOARD_COPY,
	SHORTENED_URL
} from '~/model/constants'
import getShortUrl from '~/utils/get-short-url'
import copyToClipboard from '~/utils/copy-to-clipboard'
import sendTracking from '~/utils/send-tracking'
import selectText from '~/utils/select-text'

export default {
	name: 'assistant-mode-wishlist',
	data: () => ({
		showClipboardMessage: false
	}),
	computed: {
		...mapState('assistant', ['pdfDownloadLink']),
		...mapState('utils', ['clipBoardCopyComplete', 'shortenedReceiptUrl']),
		...mapState('collection', ['wishList']),

		...mapGetters('collection', ['wishListUrl'])
	},
	watch: {
		clipBoardCopyComplete(newVal) {
			this.showClipboardMessage = newVal
		}
	},
	methods: {
		...mapActions('utils', [
			DOWNLOAD_PREPARING.action,
			CLIPBOARD_COPY.action,
			SHORTENED_URL.action
		]),

		downloadWishListClickHandler(url) {
			if (window.GS_LOGS) console.log('Download wishlist')
			this[DOWNLOAD_PREPARING.action](true)
		},
		shareWishListClickHandler() {
			if (window.GS_LOGS) console.log('Share wishlist', this.wishListUrl)

			copyToClipboard(this.wishListUrl, this.copyToClipboardComplete.bind(this))
			let wLS = this.wishList.map(style => style.styleId).join(',')
			sendTracking('Share wish list', wLS)

			// getShortUrl(this.wishListUrl).then(shortenedUrl => {
			// 	console.log(shortenedUrl)
			// 	if (window.GS_LOGS) console.log('shortenedUrl', shortenedUrl)
			// 	if (typeof shortenedUrl !== 'string' || shortenedUrl === '') {
			// 		return
			// 	}

			// 	this[SHORTENED_URL.action](shortenedUrl).then(() => {
			// 	})
			// })
		},
		copyToClipboardComplete(success) {
			if (window.GS_LOGS)
				console.log('copyToClipboardComplete. success?', success)
			// this.shareUrl = this.wishListUrl
			this[CLIPBOARD_COPY.action](success)
		},
		shareUrlClickHandler(event) {
			selectText(event)
		}
	}
}
</script>