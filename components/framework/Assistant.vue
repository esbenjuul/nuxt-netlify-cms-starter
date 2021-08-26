<template>
	<section
		class="window window--tight window--assistant"
		:class="'assistant-mode--' + assistantMode"
	>
		<div class="window__top">
			<span class="title">Ganni space assistant</span>
		</div>

		<!-- ####################### STATUS ####################### -->

		<div class="window__status" v-if="assistantMode == 1 && isMobile">
			<button class="button expand" @click="toggleContentHandler">
				<span v-if="!expanded" class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M7 8v7h1V8h7V7H8V0H7v7H0v1h7z"
						/>
					</svg>
				</span>
				<span v-if="expanded" class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
						<path d="M0 7h15v1H0V7z" />
					</svg>
				</span>
				<p>{{ filterStatusText }}</p>
			</button>
		</div>

		<div class="window__status" v-if="assistantMode == 2 && isMobile">
			<button class="button expand" @click="toggleContentHandler">
				<span v-if="!expanded" class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M7 8v7h1V8h7V7H8V0H7v7H0v1h7z"
						/>
					</svg>
				</span>
				<span v-if="expanded" class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15">
						<path d="M0 7h15v1H0V7z" />
					</svg>
				</span>
				<p>{{ currentStyle.name }}</p>
			</button>
			<button class="window-button previous" @click="previousStyleHandler">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
						<path d="M17 21.8L10.1 15 17 8.1l.7.8-6.2 6.1 6.2 6.1z" />
					</svg>
				</span>
			</button>
			<button class="window-button next" @click="nextStyleHandler">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
						<path d="M12.7 21.9l-.7-.8 6.1-6.1L12 8.9l.7-.7 6.8 6.8z" />
					</svg>
				</span>
			</button>
			<button class="window-button close" @click="closeStyleHandler">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
						<path
							d="M15.7 15l7.8-7.8-.7-.7-7.8 7.8-7.8-7.8-.7.7 7.8 7.8-7.8 7.8.7.7 7.8-7.8 7.8 7.8.7-.7-7.8-7.8z"
						/>
					</svg>
				</span>
			</button>
		</div>

		<div class="window__status" v-if="assistantMode == 2 && !isMobile">
			<p>{{ currentStyle.name }}</p>
			<button class="window-button previous" @click="previousStyleHandler">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
						<path d="M17 21.8L10.1 15 17 8.1l.7.8-6.2 6.1 6.2 6.1z" />
					</svg>
				</span>
			</button>
			<button class="window-button next" @click="nextStyleHandler">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
						<path d="M12.7 21.9l-.7-.8 6.1-6.1L12 8.9l.7-.7 6.8 6.8z" />
					</svg>
				</span>
			</button>
			<button class="window-button close" @click="closeStyleHandler">
				<span class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
						<path
							d="M15.7 15l7.8-7.8-.7-.7-7.8 7.8-7.8-7.8-.7.7 7.8 7.8-7.8 7.8.7.7 7.8-7.8 7.8 7.8.7-.7-7.8-7.8z"
						/>
					</svg>
				</span>
			</button>
		</div>

		<hr v-if="assistantMode == 2 && (!isMobile || (isMobile && expanded))" />

		<!-- ####################### CONTENT ####################### -->

		<div class="window__content">
			<div class="assistant">
				<assistant-mode-welcome v-if="assistantMode === 0" />
				<assistant-mode-filter-collection v-if="assistantMode === 1" />
				<assistant-mode-style-details v-if="assistantMode === 2" />
				<assistant-mode-wishlist v-if="assistantMode === 3" />
				<assistant-mode-collection-seen v-if="assistantMode === 4" />
				<assistant-mode-collage v-if="assistantMode === 5" />
				<assistant-mode-custom v-if="assistantMode === 6" />
				<assistant-mode-puzzle v-if="assistantMode === 7" />
			</div>
		</div>
	</section>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'
import {
	CLOSE_WINDOW_GROUP,
	// SHOW_NEXT_STYLE,
	SHOW_NEW_STYLE,
	ASSISTANT_MODE,
	ASSISTANT_EXPANDED,
	CURRENT_STYLE,
	SET_HIDDEN_ASSETS,
} from '~/model/constants'

import AssistantModeWelcome from '~/components/content/AssistantModeWelcome.vue'
import AssistantModeFilterCollection from '~/components/content/AssistantModeFilterCollection.vue'
import AssistantModeStyleDetails from '~/components/content/AssistantModeStyleDetails.vue'
import AssistantModeCollage from '~/components/content/AssistantModeCollage.vue'
import AssistantModeWishlist from '~/components/content/AssistantModeWishlist.vue'
import AssistantModeCollectionSeen from '~/components/content/AssistantModeCollectionSeen.vue'
import AssistantModeCustom from '~/components/content/AssistantModeCustom.vue'
import AssistantModePuzzle from '~/components/content/AssistantModePuzzle.vue'

import ContentTypes from '~/model/content-types'
import AssistantModes from '~/model/assistant-modes'

export default {
	name: 'assistant',
	components: {
		AssistantModeWelcome,
		AssistantModeFilterCollection,
		AssistantModeStyleDetails,
		AssistantModeCollage,
		AssistantModeWishlist,
		AssistantModeCollectionSeen,
		AssistantModeCustom,
		AssistantModePuzzle,
	},
	data() {
		return {
			filterName: null,
		}
	},
	computed: {
		...mapState(['topMostWindow']),
		...mapState('collection', [
			'wishList',
			'allStyles',
			'currentStyle',
			'currentStyles',
			'activeFilter',
		]),
		...mapState('assistant', ['assistantMode', 'expanded']),
		...mapState('utils', ['isMobile']),

		filterStatusText() {
			return this.filterName || 'Filter'
		},
	},
	watch: {
		activeFilter(newVal) {
			if (newVal && newVal.name != '') {
				this.filterName = newVal.name
				this[ASSISTANT_EXPANDED.action](false)
			} else this.filterName = null
		},
		topMostWindow() {
			let noRelevantAssistantContent = false
			// this.shareUrl = null
			// this.styleHasBeenAdded = false

			if (!this.topMostWindow.contentComponent) {
				noRelevantAssistantContent = true
			} else {
				const { contentComponent, contentComponentProps } = this.topMostWindow

				switch (contentComponent) {
					case ContentTypes.imagePortrait.contentComponent:
					case ContentTypes.imageLandscape.contentComponent:
					case ContentTypes.imageSquare.contentComponent:
					case ContentTypes.videoPortrait.contentComponent:
					case ContentTypes.videoLandscape.contentComponent:
					case ContentTypes.videoSquare.contentComponent:
						if (
							contentComponentProps.asset &&
							contentComponentProps.asset.styleId
						) {
							const currentStyle = this.allStyles.filter(
								(e) => e.styleId === contentComponentProps.asset.styleId
							)[0]
							this[CURRENT_STYLE.action](currentStyle)
							this[SET_HIDDEN_ASSETS.action]()
							this[ASSISTANT_MODE.action](AssistantModes.STYLE_DETAILS)
						} else {
							noRelevantAssistantContent = true
						}
						break
					case ContentTypes.wishList.contentComponent:
						this[ASSISTANT_MODE.action](AssistantModes.WISHLIST)
						break
					default:
						//No window type found?
						noRelevantAssistantContent = true
						break
				}
			}

			if (noRelevantAssistantContent && !this.topMostWindow.assistant) {
				if (this.wishList.length > 0) {
					this[ASSISTANT_MODE.action](AssistantModes.COLLECTION_SEEN)
				}
			}
		},
		wishList() {
			if (
				this.wishList.length == 0 &&
				this.assistantMode == AssistantModes.COLLECTION_SEEN
			) {
				this[ASSISTANT_MODE.action](AssistantModes.WELCOME)
			}
		},
	},
	methods: {
		...mapActions([CLOSE_WINDOW_GROUP.action]),
		...mapActions('collection', [
			SHOW_NEW_STYLE.action,
			// SHOW_NEXT_STYLE.action,
			CURRENT_STYLE.action,
			SET_HIDDEN_ASSETS.action,
		]),
		...mapActions('assistant', [
			ASSISTANT_MODE.action,
			ASSISTANT_EXPANDED.action,
		]),

		previousStyleHandler() {
			this[SHOW_NEW_STYLE.action]({
				styleId: this.currentStyle.styleId,
				previous: true,
			})
		},

		nextStyleHandler() {
			this[SHOW_NEW_STYLE.action]({
				styleId: this.currentStyle.styleId,
				next: true,
			})
		},

		closeStyleHandler() {
			this[CLOSE_WINDOW_GROUP.action]()
		},

		toggleContentHandler() {
			this[ASSISTANT_EXPANDED.action](!this.expanded)
		},
	},
	mounted() {
		if (this.isMobile) {
			this[ASSISTANT_EXPANDED.action](false)
		}
	},
}
</script>
