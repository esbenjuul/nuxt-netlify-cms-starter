<template>
	<section
		:class="wrapperClass"
		:style="{ position: 'relative', zIndex: zIndexStyle, transformOrigin }"
	>
		<vue-draggable-resizable
			ref="draggableResizable"
			:class-name="concatClassName"
			:resizable="computedResizable"
			class-name-dragging="is-dragging"
			@dragging="onDrag"
			@dragstop="onDragStop"
			@resizing="onResize"
			@resizestop="onResizeStop"
			:handles="['br']"
			:drag-handle="'.title'"
			:x="computedPositionX"
			:y="computedPositionY"
			:w="computedSizeW"
			:h="computedSizeH"
		>
			<header class="window__top">
				<span class="title" @touchstart="titleClick" @mouseDown="titleClick"
					>{{ title }}&nbsp;
					<p v-if="contentComponent === 'collection'">
						({{ currentStyles.length }})
					</p>
					<p v-if="contentComponent === 'wish-list'">({{ wishList.length }})</p>
				</span>
				<button
					:style="{
						lineHeight: 0,
						fontSize: '20px',
						fontWeight: 'normal',
						marginTop: '-0.2em'
					}"
					class="button close"
					@click.stop="closeHandler"
				>
					<!-- <span class="icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
							<path
								d="M15.7 15l7.8-7.8-.7-.7-7.8 7.8-7.8-7.8-.7.7 7.8 7.8-7.8 7.8.7.7 7.8-7.8 7.8 7.8.7-.7-7.8-7.8z"
							/>
						</svg>
					</span> -->
					&times;
				</button>
			</header>
			<div
				v-if="statusComponent"
				class="window__status"
				@click="contentActivateHandler"
			>
				<component :is="statusComponent" v-bind="statusComponentProps" />
			</div>

			<!-- <hr v-if="statusComponent" /> -->

			<div v-bar class="window__content" @click="contentActivateHandler">
				<component
					:is="contentComponent"
					:parent-window-id="windowId"
					v-bind="{ ...contentComponentProps, contentId }"
					ref="contentComponent"
				/>
			</div>
		</vue-draggable-resizable>
	</section>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'
import { TOPMOST_WINDOW, CLOSE_WINDOW, UPDATE_WINDOW } from '~/model/constants'

import VueDraggableResizable from 'vue-draggable-resizable'

import Exhibition from '~/components/content/Exhibition.vue'
import MusicPlayer from '~/components/content/MusicPlayer.vue'
import Collection from '~/components/content/Collection.vue'
import SingleImage from '~/components/content/SingleImage.vue'
import SingleVideo from '~/components/content/SingleVideo.vue'
import TextReader from '~/components/content/TextReader.vue'
import Films from '~/components/content/Films.vue'
import Gallery from '~/components/content/Gallery.vue'
import WishList from '~/components/content/WishList.vue'
import HampsterDance from '~/components/content/HampsterDance.vue'
import GanniGirls from '~/components/content/GanniGirls.vue'
import LookBook from '~/components/content/LookBook.vue'
import Collage from '~/components/content/Collage.vue'
import Puzzle from '~/components/content/Puzzle.vue'
import DownloadModal from '~/components/content/DownloadModal.vue'

import StatusStatic from '~/components/content/StatusStatic.vue'
import StatusCollection from '~/components/content/StatusCollection.vue'
import StatusWishList from '~/components/content/StatusWishList.vue'

export default {
	name: 'window',
	components: {
		VueDraggableResizable,
		Exhibition,
		StatusStatic,
		StatusCollection,
		StatusWishList,
		Collection,
		SingleImage,
		SingleVideo,
		TextReader,
		Films,
		Gallery,
		WishList,
		MusicPlayer,
		HampsterDance,
		GanniGirls,
		LookBook,
		Collage,
		Puzzle,
		DownloadModal
	},
	props: {
		modifierClass: {
			type: String,
			default: ''
		},
		wrapperClass: {
			type: String,
			default: ''
		},
		contentType: {
			type: Object,
			required: true
		},
		contentName: {
			type: String,
			required: true
		},
		canResize: {
			type: Boolean,
			default: true
		},
		canReorder: {
			type: Boolean,
			default: true
		},

		contentComponent: {
			type: String,
			default: null
		},
		contentComponentProps: {
			type: Object,
			default: null
		},

		// noStatus: {
		// 	type: Boolean,
		// 	default: false
		// },
		statusComponent: {
			type: String,
			default: null,
			required: false
		},
		statusComponentProps: {
			type: Object,
			default: null
		},

		customAssistantText: {
			type: Object
		},

		title: {
			type: String
		},
		positionX: {
			type: Number
		},
		positionY: {
			type: Number
		},
		positionZ: {
			type: Number
		},
		sizeW: {
			type: Number
		},
		sizeH: {
			type: Number
		},
		contentId: {
			type: String
		},
		windowId: {
			type: String
		},
		groupId: {
			type: String
		},
		nthChild: {
			type: Number
		}
	},
	computed: {
		...mapState('puzzle', ['puzzle']),
		...mapState('collection', ['currentStyles', 'wishList']),
		computedPositionX() {
			return this.x > -1 ? this.x : this.positionX
		},
		computedPositionY() {
			return this.y > -1 ? this.y : this.positionY
		},
		computedPositionZ() {
			return this.positionZ
		},
		computedSizeW() {
			return this.w > 0 ? this.w : this.sizeW
		},
		computedSizeH() {
			return this.h > 0 ? this.h : this.sizeH
		},
		computedResizable() {
			if (!this.canResize) return false
			return true
		},
		zIndexStyle() {
			return this.positionZ
		},
		concatClassName() {
			let cn = 'window'
			if (this.modifierClass != '') cn += ' ' + this.modifierClass
			if (!this.statusComponent) cn += ' window--no-status'

			return cn
		}
	},
	data: function() {
		return {
			resetPositionDistance: 40,
			maximizeOffset: 0,
			maximizeTimeoutHandle: -1,
			maximizeClicked: false,
			isMaximized: false,

			x: this.computedPositionX,
			y: this.computedPositionY,

			w: this.computedSizeW,
			h: this.computedSizeH,

			transformOrigin: 0,

			savedAttributes: {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			}
		}
	},
	methods: {
		...mapActions([
			TOPMOST_WINDOW.action,
			CLOSE_WINDOW.action,
			UPDATE_WINDOW.action
		]),
		closeHandler(e) {
			this[CLOSE_WINDOW.action]({
				windowId: this.windowId,
				contentId: this.contentId
			})
		},
		contentActivateHandler(e) {
			if (this.canReorder) {
				this[TOPMOST_WINDOW.action](this.windowId)
			}
		},
		titleClick() {
			if (!this.canResize) return false

			if (this.maximizeClicked) {
				clearTimeout(this.maximizeTimeoutHandle)
				this.maximizeClicked = false
				this.maximizeHandler()
			} else {
				this.maximizeClicked = true
				this.maximizeTimeoutHandle = setTimeout(() => {
					this.maximizeClicked = false
				}, 200)
			}
		},
		maximizeHandler() {
			if (this.isMaximized) {
				this.isMaximized = false
				this.onResize(
					this.savedAttributes.x,
					this.savedAttributes.y,
					this.savedAttributes.w,
					this.savedAttributes.h
				)
			} else {
				this.isMaximized = true
				this.savedAttributes = {
					x: this.positionX,
					y: this.positionY,
					w: this.sizeW,
					h: this.sizeH
				}
				this.onResize(
					this.maximizeOffset,
					this.maximizeOffset,
					window.innerWidth - 2 * this.maximizeOffset,
					window.innerHeight - 2 * this.maximizeOffset
				)
			}
			this.constrain()
		},
		onResize(x, y, w, h) {
			// console.log(x, y, w, h);
			this.x = x
			this.y = y
			this.w = w
			this.h = h
			if (this.canReorder) {
				this[TOPMOST_WINDOW.action](this.windowId)
			}
		},
		onResizeStop() {
			this.isMaximized = false
			this.constrain()

			// used for the collage
			if (typeof this.$refs.contentComponent.fitScreen === 'function') {
				this.$refs.contentComponent.fitScreen()
			}
		},
		onDrag(x, y) {
			this.x = x
			this.y = y
			if (this.canReorder) {
				this[TOPMOST_WINDOW.action](this.windowId)
			}
		},
		onDragStop() {
			this.constrain()
			if (this.contentId === 'puzzle') {
				this.$nextTick(() => {
					this.puzzle.update()
				})
			}
		},
		constrain() {
			this.x = Math.min(
				Math.max(this.x, 0),
				window.innerWidth - this.resetPositionDistance
			)
			this.y = Math.min(
				Math.max(this.y, 0),
				window.innerHeight - this.resetPositionDistance
			)

			this[UPDATE_WINDOW.action]({
				windowId: this.windowId,
				windowProps: {
					positionX: this.x,
					positionY: this.y,
					sizeW: this.w,
					sizeH: this.h
				}
			})
			if (this.canReorder) {
				this[TOPMOST_WINDOW.action](this.windowId)
			}
		}
		// onMouseDown() {
		// 	this[TOPMOST_WINDOW.action](this.windowId);
		// },
	},
	mounted() {
		this.onResize(this.positionX, this.positionY, this.sizeW, this.sizeH)

		// this.windowRef = this.$el.querySelector('.window') // use this.$refs.draggableResizable if needed
	}
}
</script>
