import {
	RESET_STATE,
	EXHIBITION_FETCH,
	EXHIBITION_ASSETS_FETCH,
	COLLECTION_ITEMS_FETCH,
	COLLECTION_GROUPS_FETCH,
	COLLECTION_FILTERS_FETCH,
	COLLECTION_ASSETS_FETCH,
	INTRO_FETCH,
	FILMS_FETCH,
	SONGS_FETCH,
	GANNIGIRLS_FETCH,
	LOOKBOOK_FETCH,
	GENERAL_FETCH,
	ANAS_FETCH,
	ABOUT_FETCH,
	ASSISTANT_FETCH,
	DESKTOP_FETCH,
	DITTE_FETCH,
	TOPMOST_WINDOW,
	UPDATE_WINDOW,
	CLOSE_WINDOW,
	CLOSE_WINDOW_GROUP,
	OPEN_CONTENT,
	OPEN_GALLERY,
	OPEN_WISH_LIST,
	OPEN_STYLE_CONTENT,
	PASSWORDS_FETCH,
	ASSISTANT_TEXT,
	ASSISTANT_MODE,
	UPDATE_PROGRESS
} from '~/model/constants'

import ContentTypes from '~/model/content-types'
import _ from 'lodash'

import { getNested } from '~/utils/get-nested'
import getUniqueId from '~/utils/get-unique-id'
import getOptimalProp from '~/utils/get-optimal-props'
import resetZOrder from '~/utils/reset-z-order'
import getAssetType from '~/utils/asset-type'
import { lastElement } from '~/utils/array-helpers'
import AssistantModes from '~/model/assistant-modes'

export const state = () => ({
	SHOW_WHOLESALE_PRICE: false, // for when the site is for PR purposes only (a.k.a. "is old")

	rehydrated: false,

	windowList: [],
	windowGroupList: [],
	topMostWindow: null,
	highestZIndex: 0
})

export const mutations = {
	// Baseline content to cms

	// fired when nuxt has access to the store
	rehydrated(state) {
		state.rehydrated = true
	},

	[RESET_STATE.mutation](state) {
		state.collection.wishList = []
		state.progressBar.progressPct = 0
		Object.keys(ContentTypes).forEach(type => {
			state.progressBar.progressItems[type].complete = false
		})
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
		})

		//only add the group if it has content
		if (windowGroup.groupSize > 0 && !params.addToGroupId)
			state.windowGroupList.push(windowGroup)

		state.windowList = resetZOrder(state.windowList)
		state.highestZIndex = lastElement(state.windowList).positionZ
	},

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

		if (matchingWindow && matchingWindow.assistant) {
			dispatch(
				'assistant/' + ASSISTANT_MODE.action,
				matchingWindow.assistant.mode
			)
			if (matchingWindow.assistant.text) {
				dispatch(
					'assistant/' + ASSISTANT_TEXT.action,
					matchingWindow.assistant.text
				)
			}
		}
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
			dispatch('assistant/' + ASSISTANT_MODE.action, AssistantModes.WELCOME)
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
		dispatch(
			'progressBar/' + UPDATE_PROGRESS.action,
			content.windowContent[0].type.name
		)
	},

	[CLOSE_WINDOW_GROUP.action]({ commit, dispatch, state }, params) {
		commit(CLOSE_WINDOW_GROUP.mutation, params)
		if (state.windowList.length) {
			dispatch(TOPMOST_WINDOW.action, lastElement(state.windowList).windowId)
		} else {
			dispatch('assistant/' + ASSISTANT_MODE.action, AssistantModes.WELCOME)
		}
	},

	[UPDATE_WINDOW.action]({ commit }, params) {
		commit(UPDATE_WINDOW.mutation, params)
	},

	[OPEN_STYLE_CONTENT.action]({ commit, state }, styleId) {
		let listStyle = state.collection.allStyles.filter(
			e => e.styleId === styleId
		)[0]
		if (!listStyle || !listStyle.assets) return false

		let content = []
		let al = listStyle.assets.length

		//backwards loop to ensure asset [0] gets on top (as sorted in $store)
		for (var i = al - 1; i >= 0; i--) {
			let asset = listStyle.assets[i]

			if (asset.visible) {
				let type = getAssetType(asset)

				content.push({
					title: asset.name,
					contentId: asset.assetId,
					type: type,
					canOverride: false,
					windowProps: type.defaultWindowProps,
					contentComponentProps: { asset: asset },
					statusComponentProps: type.defaultStatusComponentProps
				})
			}
		}

		commit(CLOSE_WINDOW_GROUP.mutation, { styleWindowGroup: true })
		commit(OPEN_CONTENT.mutation, {
			windowContent: content,
			styleWindowGroup: true
		})
	},
	[OPEN_GALLERY.action]({ commit }, asset) {
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
	},

	[OPEN_WISH_LIST.action]({ commit }, asset) {
		let wishListContent = [
			{
				title: 'Your wishlist',
				contentId: 'wish-list',
				type: ContentTypes.wishList,
				canOverride: false
			}
		]
		commit(OPEN_CONTENT.mutation, { windowContent: wishListContent })
	},

	[RESET_STATE.action]({ commit }) {
		commit(RESET_STATE.mutation)
	},

	/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */

	// FETCH ALL CONTENT!

	async nuxtServerInit({ commit, dispatch, state }) {
		const getData = async req => {
			let files = await req
			return files.keys().map(key => {
				let res = files(key)
				res.slug = key.slice(2, -5)
				return res
			})
		}

		commit(
			'assistant/' + ASSISTANT_FETCH.mutation,
			await getData(
				require.context(`~/assets/content/assistant/`, false, /\.json$/)
			)
		)

		commit(
			'exhibition/' + EXHIBITION_FETCH.mutation,
			await getData(
				require.context(`~/assets/content/exhibition/`, false, /\.json$/)
			)
		)

		commit(
			'exhibition/' + EXHIBITION_ASSETS_FETCH.mutation,
			await getData(
				require.context(`~/assets/content/exhibitionAssets/`, false, /\.json$/)
			)
		)

		commit(
			'collection/' + COLLECTION_ITEMS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/collectionItems/', false, /\.json$/)
			)
		)

		commit(
			'collection/' + COLLECTION_FILTERS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/collectionFilters/', false, /\.json$/)
			)
		)

		commit(
			'collection/' + COLLECTION_GROUPS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/collectionGroups/', false, /\.json$/)
			)
		)

		commit(
			'collection/' + COLLECTION_ASSETS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/mediaAssets/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + FILMS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/films/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + GANNIGIRLS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/ganniGirls/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + LOOKBOOK_FETCH.mutation,
			await getData(
				require.context('~/assets/content/lookBook/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + ANAS_FETCH.mutation,
			await getData(require.context('~/assets/content/anas/', false, /\.json$/))
		)

		commit(
			'assets/' + DITTE_FETCH.mutation,
			await getData(
				require.context('~/assets/content/ditte/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + ABOUT_FETCH.mutation,
			await getData(
				require.context('~/assets/content/about/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + DESKTOP_FETCH.mutation,
			await getData(
				require.context('~/assets/content/desktop/', false, /\.json$/)
			)
		)

		commit(
			'assets/' + INTRO_FETCH.mutation,
			await getData(
				require.context('~/assets/content/intro/', false, /\.json$/)
			)
		)

		commit('assets/' + GENERAL_FETCH.mutation, {
			data: await getData(
				require.context('~/assets/content/general/', false, /\.json$/)
			),
			rootState: state
		})

		commit(
			'user/' + PASSWORDS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/passwords/', false, /\.json$/)
			)
		)

		commit(
			'ganniFm/' + SONGS_FETCH.mutation,
			await getData(
				require.context('~/assets/content/songs/', false, /\.json$/)
			)
		)

		console.log('NUXT SERVER INIT DONE')
	}
}
