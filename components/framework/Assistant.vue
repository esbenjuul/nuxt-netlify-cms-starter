<template>
	<section
		class="window window--tight window--assistant"
		:class="'assistant-mode--' + assistantMode"
	>
		<div class="window__top" @click="toggle()">
			<div class="plus-icon" :class="{ closed: closed || !expanded }" />

			<span class="title">
				<span></span>
				<svg-icon name="ganni--knockout" />
				<span></span>
			</span>
		</div>

		<!-- ####################### STATUS ####################### -->

		<!-- <div class="window__status" v-if="assistantMode == 1 && isMobile">
			<button class="button expand" @click="toggleContentHandler">
				<span class="icon">
					<svg-icon :name="!expanded ? 'plus' : 'minus'" />
				</span>
				<p>{{ filterName || 'Filter' }}</p>
			</button>
		</div> -->

		<div class="window__status" v-if="assistantMode == 2">
			<button
				class="button expand"
				@click="toggleContentHandler"
				v-if="isMobile"
			>
				<!-- <span class="icon">
					<svg-icon :name="!expanded ? 'plus' : 'minus'" />
				</span> -->
				<p>{{ currentStyle ? currentStyle.name : '' }}</p>
			</button>
			<p v-else>{{ currentStyle ? currentStyle.name : '' }}</p>

			<button class="window-button previous" @click="previousStyleHandler">
				<svg-icon name="arrow--left" />
			</button>
			<button class="window-button next" @click="nextStyleHandler">
				<svg-icon style="transform: scaleX(-1)" name="arrow--left" />
			</button>
			<button class="window-button close" @click="closeStyleHandler">
				<svg-icon name="cross" />
			</button>
		</div>

		<!-- <hr v-if="assistantMode == 2 && (!isMobile || (isMobile && expanded))" /> -->

		<!-- ####################### CONTENT ####################### -->

		<transition-expand>
			<div v-show="!closed || windowList.length" class="window__content">
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
		</transition-expand>
	</section>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
	CLOSE_WINDOW_GROUP,
	SHOW_NEW_STYLE,
	ASSISTANT_MODE,
	ASSISTANT_EXPANDED,
	CURRENT_STYLE,
	SET_HIDDEN_ASSETS,
	ASSISTANT_TOGGLE
} from '~/model/constants'

import AssistantModeWelcome from '~/components/content/AssistantModeWelcome.vue'
import AssistantModeFilterCollection from '~/components/content/AssistantModeFilterCollection.vue'
import AssistantModeStyleDetails from '~/components/content/AssistantModeStyleDetails.vue'
import AssistantModeCollage from '~/components/content/AssistantModeCollage.vue'
import AssistantModeWishlist from '~/components/content/AssistantModeWishlist.vue'
import AssistantModeCollectionSeen from '~/components/content/AssistantModeCollectionSeen.vue'
import AssistantModeCustom from '~/components/content/AssistantModeCustom.vue'
import AssistantModePuzzle from '~/components/content/AssistantModePuzzle.vue'

import TransitionExpand from '~/components/transitions/Expand.vue'
import RotatingText from '~/components/content/RotatingText.vue'

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
		TransitionExpand,
		RotatingText
	},
	data() {
		return {
			filterName: null
		}
	},
	computed: {
		...mapState(['topMostWindow', 'dashboardContent', 'windowList']),
		...mapState('collection', [
			'wishList',
			'allStyles',
			'currentStyle',
			'currentStyles',
			'activeFilter'
		]),
		...mapState('assistant', ['assistantMode', 'expanded', 'closed']),
		...mapState('utils', ['isMobile']),
		...mapState('user', ['currentScroll'])
	},
	watch: {
		currentScroll() {
			if (!this.closed && !this.windowList.length) {
				this[ASSISTANT_TOGGLE.action](true)
			}
		},
		activeFilter(newVal) {
			if (newVal && newVal.name != '') {
				this.filterName = newVal.name
				this[ASSISTANT_EXPANDED.action](false)
			} else this.filterName = null
		},
		topMostWindow() {
			let noRelevantAssistantContent = false

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
					case ContentTypes.gallery.contentComponent:
						if (
							(contentComponentProps.asset &&
								contentComponentProps.asset.styleId) ||
							contentComponentProps.styleId
						) {
							const currentStyle = this.allStyles.find(
								e =>
									(contentComponentProps.asset &&
										e.styleId === contentComponentProps.asset.styleId) ||
									e.styleId === contentComponentProps.styleId
							)

							this[CURRENT_STYLE.action](currentStyle)
							this[SET_HIDDEN_ASSETS.action]()
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
		}
	},
	methods: {
		...mapActions([CLOSE_WINDOW_GROUP.action]),
		...mapActions('collection', [
			SHOW_NEW_STYLE.action,
			CURRENT_STYLE.action,
			SET_HIDDEN_ASSETS.action
		]),
		...mapActions('assistant', [
			ASSISTANT_MODE.action,
			ASSISTANT_EXPANDED.action,
			ASSISTANT_TOGGLE.action
		]),

		previousStyleHandler() {
			if (this.isMobile) {
				this.closeStyleHandler()
				this.$nextTick(() => {
					this[SHOW_NEW_STYLE.action]({
						styleId: this.currentStyle.styleId,
						previous: true
					})
				})
			} else {
				this[SHOW_NEW_STYLE.action]({
					styleId: this.currentStyle.styleId,
					previous: true
				})
			}
		},

		nextStyleHandler() {
			if (this.isMobile) {
				this.closeStyleHandler()
				this.$nextTick(() => {
					this[SHOW_NEW_STYLE.action]({
						styleId: this.currentStyle.styleId,
						next: true
					})
				})
			} else {
				this[SHOW_NEW_STYLE.action]({
					styleId: this.currentStyle.styleId,
					next: true
				})
			}
		},

		closeStyleHandler() {
			this[CLOSE_WINDOW_GROUP.action]()
		},

		toggleContentHandler(close) {
			this[ASSISTANT_EXPANDED.action](
				close !== undefined ? close : !this.expanded
			)
			// this.toggle(!this.expanded)
		},

		toggle(close) {
			const newValue = close !== undefined ? close : !this.closed

			if (this.isMobile) {
				this.toggleContentHandler(!newValue)
			}

			if (this.isMobile || !this.windowList.length) {
				this[ASSISTANT_TOGGLE.action](newValue)
			}
		}
	},
	mounted() {
		if (this.isMobile) {
			this[ASSISTANT_EXPANDED.action](false)
		}
	}
}
</script>
