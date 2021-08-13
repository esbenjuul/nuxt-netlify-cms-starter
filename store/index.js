import {
	RESET_STATE,
	FETCH_COLLECTION_ITEMS,
	FETCH_COLLECTION_GROUPS,
	FETCH_COLLECTION_FILTERS,
	// FETCH_COLLECTION_ASSETS,
	FETCH_SONGS,
	FETCH_LOOKBOOK,
	FETCH_GENERAL,
	FETCH_ASSISTANT,
	FETCH_DESKTOP,
	FETCH_VARIOUS,
	FETCH_DOWNLOADS,
	TOPMOST_WINDOW,
	UPDATE_WINDOW,
	CLOSE_WINDOW,
	CLOSE_WINDOW_GROUP,
	OPEN_CONTENT,
	OPEN_GALLERY,
	OPEN_WISH_LIST,
	OPEN_STYLE_CONTENT,
	FETCH_PASSWORDS,
	UPDATE_PROGRESS,
	// OPEN_CONTENT_IN_DASHBOARD,
	ASSISTANT_UPDATE,
	FETCH_GREEN_ROOM,
	FETCH_ABOUT_GANNI,
	FETCH_AFTERPARTY,
	FETCH_FABRICS,
	FETCH_WARM_UP,
	FETCH_SUBTITLES,
	FETCH_HIGHER_LOVE
} from '~/model/constants'

import ContentTypes from '~/model/content-types'
import _ from 'lodash'

import { getNested } from '~/utils/get-nested'
import getUniqueId from '~/utils/get-unique-id.js'
import getOptimalProp from '~/utils/get-optimal-props'
import resetZOrder from '~/utils/reset-z-order'
import getAssetType from '~/utils/asset-type'
import { lastElement } from '~/utils/array-helpers'
import { isVideo } from '~/utils/is-video'

export const state = () => ({
	SHOW_WHOLESALE_PRICE: true, // for when the site is for PR purposes only (a.k.a. "is old")

	rehydrated: false,

	windowList: [],
	windowGroupList: [],
	topMostWindow: null,
	highestZIndex: 0,

	dashboardContent: {}
})

export const mutations = {
	// Baseline content to cms

	// fired when nuxt has access to the store
	rehydrated(state) {
		state.rehydrated = true
	},

	[RESET_STATE.mutation](state) {
		state.collection.wishList = []
		// state.progressBar.progressPct = 0
		// Object.keys(ContentTypes).forEach(type => {
		// 	state.progressBar.progressItems[type].complete = false
		// })
		state.user.hasDoneQuiz = false
		state.user.loggedIn = false
		state.user.cookiesAccepted = false
		state.user.copyrightAccepted = false
	},

	/*
	 *	Activate content block, opens window with matching contentComponent
	 *
	 */
	[OPEN_CONTENT.mutation](state, params) {
		if (window.GS_LOGS) console.warn('OPEN_CONTENT', params)

		let windowGroup = params.addToGroupId
			? state.windowGroupList.find(e => e.groupId === params.addToGroupId)
			: {
					groupId: '' + getUniqueId(),
					windowIds: [],
					contentIds: [],
					groupSize: 0
			  }

		if (params.styleWindowGroup) windowGroup.styleWindowGroup = true

		params.windowContent.forEach(content => {
			const hasSame = prop => x => x[prop] === content[prop]

			let alreadyExists =
				state.content.list.filter(hasSame('contentId')).length > 0

			// don't open a window twice
			if (alreadyExists) return

			const newWindow = getOptimalProp(state, content, windowGroup.groupId)
			newWindow.windowProps.nthChild = windowGroup.groupSize

			state.windowList.unshift(newWindow)
			state.content.list.unshift(newWindow)

			windowGroup.windowIds.push(newWindow.windowId)
			windowGroup.contentIds.push(newWindow.contentId)
			windowGroup.groupSize++

			state.topMostWindow = newWindow

			// console.log('newWindow', newWindow)
		})

		//only add the group if it has content
		if (windowGroup.groupSize > 0 && !params.addToGroupId)
			state.windowGroupList.push(windowGroup)

		state.windowList = resetZOrder(state.windowList)
		state.highestZIndex = lastElement(state.windowList).positionZ
	},

	/**
	 * opens a window content, but in the dashboard instead of a draggable window
	 */
	// [OPEN_CONTENT_IN_DASHBOARD.mutation](state, { dispatch, params }) {
	// 	if (window.GS_LOGS) console.warn('OPEN_CONTENT', params)

	// 	params.windowContent.forEach(content => {
	// 		const newWindow = getOptimalProp(state, content, getUniqueId())
	// 		state.dashboardContent = newWindow
	// 	})

	// 	dispatch('assistant/' + ASSISTANT_UPDATE.action)
	// },

	/*
	 *	Save window position and size values
	 *
	 */
	[UPDATE_WINDOW.mutation](state, params) {
		let currentWindow = state.windowList.filter(
			e => e.windowId === params.windowId
		)[0]
		for (var key in params.windowProps) {
			currentWindow.windowProps[key] = params.windowProps[key]
		}
	},

	/*
	 *	Bring window to top.
	 *
	 */
	[TOPMOST_WINDOW.mutation](state, { dispatch, windowId }) {
		if (window.GS_LOGS) console.warn('TOPMOST_WINDOW', windowId)
		//console.log("zIndexes after",state.zIndexes)

		let matchingWindow = state.windowList.filter(
			e => e.windowId === windowId
		)[0]

		if (matchingWindow) {
			matchingWindow.positionZ = state.highestZIndex + 1
			state.windowList = resetZOrder(state.windowList)
			state.highestZIndex = lastElement(state.windowList).positionZ
			state.topMostWindow = matchingWindow
		}

		dispatch('assistant/' + ASSISTANT_UPDATE.action)
	},

	/*
	 *	Single window close. Wipes window group history, so user has to close all windows individually after
	 *
	 */
	[CLOSE_WINDOW.mutation](state, { contentId, windowId }) {
		state.content.list = state.content.list.filter(
			e => e.contentId !== contentId
		)

		//remove window
		state.windowList = state.windowList.filter(e => e.windowId !== windowId)

		//search for and remove dead ids in groups
		if (state.windowGroupList.length) {
			for (var i = state.windowGroupList.length - 1; i >= 0; i--) {
				let windowGroup = state.windowGroupList[i]
				if (windowGroup.windowIds.indexOf(windowId) > -1) {
					//if id found in id list, remove it
					windowGroup.windowIds.splice(
						windowGroup.windowIds.indexOf(windowId),
						1
					)
				}
				if (windowGroup.windowIds.length == 0) {
					//if no ids left, remove group
					state.windowGroupList.splice(i, 1)
				}
			}
		}

		if (window.GS_LOGS)
			console.warn(
				'CLOSE_WINDOW | removed id:' +
					windowId +
					', remaining windows: ' +
					state.windowList.length
			)
	},

	/*
	 *	Close a window group. Closes the last added group.
	 *
	 */
	[CLOSE_WINDOW_GROUP.mutation](state, params) {
		let groupsLength = state.windowGroupList.length

		if (groupsLength < 1) return false

		let windowGroup = state.windowGroupList[groupsLength - 1] //get latest group

		if (params && params.styleWindowGroup) {
			windowGroup = state.windowGroupList.filter(
				e => e.styleWindowGroup === true
			)[0]
		}

		if (!windowGroup) return false

		for (var i = 0; i < windowGroup.groupSize; i++) {
			let ids = {
				windowId: windowGroup.windowIds[i],
				contentId: windowGroup.contentIds[i]
			}

			state.content.list = state.content.list.filter(
				e => e.contentId !== ids.contentId
			)

			let currentWindow = state.windowList.filter(
				e => e.windowId === ids.windowId
			)[0]
			state.windowList = state.windowList.filter(
				e => e.windowId !== ids.windowId
			)
		}

		state.windowGroupList.pop() //remove that group
		if (window.GS_LOGS)
			console.warn(
				'CLOSE_WINDOW_GROUP | remaining groups: ' +
					state.windowGroupList.length +
					' | close style? ' +
					(params && params.styleWindowGroup)
			)
	}
}

export const actions = {
	[TOPMOST_WINDOW.action]({ commit, dispatch }, windowId) {
		commit(TOPMOST_WINDOW.mutation, { dispatch, windowId })
	},

	[CLOSE_WINDOW.action]({ commit, dispatch, state }, ids) {
		commit(CLOSE_WINDOW.mutation, ids)
		if (state.windowList.length) {
			dispatch(TOPMOST_WINDOW.action, lastElement(state.windowList).windowId)
		} else {
			dispatch('assistant/' + ASSISTANT_UPDATE.action)
		}
	},

	[OPEN_CONTENT.action]({ commit, dispatch, state, rootState }, content) {
		// if passed windowContent is a string:
		// use the string as a path to find an array of windowContent (starting from rootState)
		if (typeof content.windowContent === 'string') {
			content.windowContent = getNested(rootState, content.windowContent)
		}

		commit(OPEN_CONTENT.mutation, content)
		dispatch(TOPMOST_WINDOW.action, lastElement(state.windowList).windowId)
	},

	[CLOSE_WINDOW_GROUP.action]({ commit, dispatch, state }, params) {
		commit(CLOSE_WINDOW_GROUP.mutation, params)
		if (state.windowList.length) {
			dispatch(TOPMOST_WINDOW.action, lastElement(state.windowList).windowId)
		} else {
			dispatch('assistant/' + ASSISTANT_UPDATE.action)
		}
	},

	[UPDATE_WINDOW.action]({ commit }, params) {
		commit(UPDATE_WINDOW.mutation, params)
	},

	[OPEN_STYLE_CONTENT.action]({ commit, state, dispatch }, styleId) {
		let listStyle = state.collection.allStyles.find(e => e.styleId === styleId)

		if (!listStyle || !listStyle.assets) return false

		//backwards loop to ensure asset [0] gets on top (as sorted in $store)
		const content = [...listStyle.assets]
			.flat()
			.reverse()
			.map(asset => {
				const mediaAsset = {
					assetId: getUniqueId(),
					cloudinaryUrl: asset,
					onTop: false,
					visible: true,
					aspect: asset.toLowerCase().includes('landscape')
						? 'landscape'
						: 'portrait',
					type: isVideo(asset) ? 'video' : 'image',
					styleId,
					name: listStyle.name
				}

				let type = getAssetType(mediaAsset)

				return {
					title: listStyle.name,
					contentId: mediaAsset.assetId,
					type: type,
					canOverride: false,
					windowProps: type.defaultWindowProps,
					contentComponentProps: { asset: mediaAsset },
					statusComponentProps: type.defaultStatusComponentProps
				}
			})

		if (state.utils.isMobile) {
			commit(CLOSE_WINDOW_GROUP.mutation, { styleWindowGroup: true })
			dispatch(OPEN_GALLERY.action, listStyle)
		} else {
			commit(CLOSE_WINDOW_GROUP.mutation, { styleWindowGroup: true })
			commit(OPEN_CONTENT.mutation, {
				windowContent: content,
				styleWindowGroup: true
			})
		}
	},
	[OPEN_GALLERY.action]({ commit, dispatch }, asset) {
		// console.log('asset', asset)

		let galleryContent = [
			{
				title: 'Zoom window',
				contentId: 'gallery',
				type: ContentTypes.gallery,
				canOverride: true,
				contentComponentProps: {
					styleId: asset.styleId,
					focusedAssetId: asset.assetId
				}
			}
		]
		commit(OPEN_CONTENT.mutation, { windowContent: galleryContent })
		dispatch(TOPMOST_WINDOW.action)
	},

	[OPEN_WISH_LIST.action]({ commit, dispatch }, asset) {
		let wishListContent = [
			{
				title: 'Your wishlist',
				contentId: 'wish-list',
				type: ContentTypes.wishList,
				canOverride: false
			}
		]
		commit(OPEN_CONTENT.mutation, { windowContent: wishListContent })
		// dispatch('assistant/' + ASSISTANT_TOGGLE.action, false)
	},

	[RESET_STATE.action]({ commit }) {
		commit(RESET_STATE.mutation)
	},

	/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */

	// FETCH ALL CONTENT!

	async nuxtServerInit({ commit, state }, { $content }) {
		await commit(
			'ganniFm/' + FETCH_SONGS.mutation,
			await $content('songs').fetch()
		)

		await commit(
			'assistant/' + FETCH_ASSISTANT.mutation,
			await $content('assistant').fetch()
		)

		await commit(
			'collection/' + FETCH_COLLECTION_ITEMS.mutation,
			await $content('collectionItems')
				.sortBy('weight', 'desc')
				.fetch()
		)

		await commit(
			'collection/' + FETCH_COLLECTION_FILTERS.mutation,
			await $content('collectionFilters')
				.sortBy('order')
				.fetch()
		)

		await commit(
			'collection/' + FETCH_COLLECTION_GROUPS.mutation,
			await $content('collectionGroups')
				.sortBy('order')
				.fetch()
		)

		await commit(
			'assets/' + FETCH_LOOKBOOK.mutation,
			await $content('lookBook').fetch()
		)

		// await commit(
		// 	'assets/' + FETCH_DESKTOP.mutation,
		// 	await $content('desktop').fetch()
		// )

		// await commit('assets/' + FETCH_GENERAL.mutation, {
		// 	data: await $content('general').fetch(),
		// 	rootState: state
		// })

		await commit(
			'user/' + FETCH_PASSWORDS.mutation,
			await $content('passwords').fetch()
		)

		await commit(
			'utils/' + FETCH_VARIOUS.mutation,
			await $content('various').fetch()
		)

		await commit(
			'assets/' + FETCH_DOWNLOADS.mutation,
			await $content('downloads').fetch()
		)

		await commit(
			'greenRoom/' + FETCH_GREEN_ROOM.mutation,
			await $content('greenRoom').fetch()
		)

		await commit(
			'aboutGanni/' + FETCH_ABOUT_GANNI.mutation,
			await $content('aboutGanni').fetch()
		)

		await commit(
			'fabrics/' + FETCH_FABRICS.mutation,
			await $content('fabrics').fetch()
		)

		// await commit(
		// 	'afterparty/' + FETCH_AFTERPARTY.mutation,
		// 	await $content('afterparty').fetch()
		// )

		await commit(
			'warm-up/' + FETCH_WARM_UP.mutation,
			await $content('warmUp').fetch()
		)

		await commit(
			'audio/' + FETCH_SUBTITLES.mutation,
			await $content('subtitles')
				.sortBy('time')
				.fetch()
		)

		await commit(
			'higher-love/' + FETCH_HIGHER_LOVE.mutation,
			await $content('higherLove').fetch()
		)

		console.log('NUXT SERVER INIT DONE')
	}
}
