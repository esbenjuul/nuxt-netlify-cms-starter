import {
	FETCH_COLLECTION_ITEMS,
	FETCH_COLLECTION_GROUPS,
	FETCH_COLLECTION_FILTERS,
	SET_CURRENT_FILTER,
	SET_GROUP_BY_IDENTIFIER,
	SET_GROUP_BY_INDEX,
	SET_NEXT_GROUP,
	SET_PREVIOUS_GROUP,
	ADD_TO_WISHLIST,
	REMOVE_FROM_WISHLIST,
	ALL_ASSETS_VISIBLE,
	SHOW_NEW_STYLE,
	OPEN_STYLE_CONTENT,
	CLOSE_WINDOW_GROUP,
	COLLECTION_LAYOUT_CHANGE,
	AUTHORIZE_GROUPS,
	CURRENT_STYLE,
	SET_HIDDEN_ASSETS,
	SET_SEARCHSTRING
} from '~/model/constants'

import { nextElement, prevElement } from '~/utils/array-helpers'

const getStylesFromMultipleFilters = (state, getters, filters) => {
	const isFilterWeWant = filterId => filters.includes(filterId)
	const hasFilter = style => style.filters.find(isFilterWeWant)

	return state.activeGroup
		? getters.groups[state.activeGroup.groupId].styles.filter(hasFilter)
		: Object.values(getters.groups)
				.map(g => g.styles.filter(hasFilter))
				.flat()
}

export const state = () => ({
	// collectionLayout: CollectionLayouts.GRID,

	//all indexasion done
	// dataIndexComplete: false,

	//loaded from json
	// allMediaAssets: [],

	//loaded from json
	allStyles: [],
	//currently active in app
	// currentStyles: [],

	//loaded from json
	allGroups: [],
	//currently active in app
	activeGroup: null,
	activeGroupIndex: -1,

	// filtered by password used
	authorizedGroups: [],

	//loaded from json
	allFilters: [],
	//currently available in app
	// referencedFilters: [],
	//currently available in active group
	// groupFilters: null,

	//currently active filter in assistent
	activeFilter: {
		filterId: null,
		name: '',
		styleIds: []
	},

	//new list
	wishList: [],

	currentStyle: null,
	hiddenAssetContent: [],

	RTWFilters: [
		'rtw1',
		'rtw2',
		'rtw3',
		'rtw4',
		'rtw5',
		'rtw6',
		'rtw7',
		'rtw8',
		'rtw9',
		'rtw10',
		'rtw11',
		'rtw12',
		'rtw13',
		'rtw14'
	],

	ACCFilters: ['acc1', 'acc2', 'acc5', 'acc6', 'acc7'],

	shoesFilters: ['sho1', 'sho2', 'sho3', 'sho4']
})

export const getters = {
	wishListUrl: state =>
		`${window.location.origin}/export/?styles=${state.wishList
			.map(style => style.styleId)
			.join(',')}`,
	// `https://gannispace.com/export/?styles=${state.wishList
	// 	.map(style => style.styleId)
	// 	.join(',')}`,

	authorizedGroupsIds: state => state.authorizedGroups.map(g => g.groupId),

	currentStyleGroupId: state =>
		state.currentStyle && state.currentStyle.groupId,

	currentStyleGroupIndex: state =>
		state.currentStyle &&
		state.authorizedGroups.findIndex(
			g => g.groupId === state.currentStyle.groupId
		),

	allStyles: state => state.allStyles,

	readyToWear: (state, getters) => {
		return getStylesFromMultipleFilters(state, getters, state.RTWFilters)
	},

	accessories: (state, getters) => {
		return getStylesFromMultipleFilters(state, getters, state.ACCFilters)
	},

	shoes: (state, getters) => {
		return getStylesFromMultipleFilters(state, getters, state.shoesFilters)
	},

	groups: state => {
		return state.allGroups.reduce((acc, group) => {
			const groupStyles = state.allStyles.filter(
				({ groupId }) => group.groupId === groupId
			)
			const groupFilters = state.allFilters.reduce((acc, filter) => {
				const stylesWithCurrentFilter = groupStyles.filter(style =>
					style.filters.includes(filter.filterId)
				)
				return {
					...acc,
					...(stylesWithCurrentFilter.length && {
						[filter.filterId]: {
							styles: stylesWithCurrentFilter,
							filter
						}
					})
				}
			}, {})

			return {
				...acc,
				[group.groupId]: {
					group,
					styles: groupStyles,
					filters: groupFilters
				}
			}
		}, {})
	},

	allStylesWithFilter: state => {
		return state.allFilters.reduce((acc, filter) => {
			const styles = state.allStyles.filter(style =>
				style.filters.includes(filter.filterId)
			)

			return {
				...acc,
				...(styles.length && {
					[filter.filterId]: { filter, styles }
				})
			}
		}, {})
	}
}

export const mutations = {
	[FETCH_COLLECTION_ITEMS.mutation](state, data) {
		state.allStyles = data
	},
	[FETCH_COLLECTION_GROUPS.mutation](state, data) {
		state.allGroups = data
			.map(group => {
				if (group.passwords) {
					group.passwords = group.passwords.map(pw => pw.toLowerCase())
				}
				return group
			})
			.sort((a, b) => (a.order < b.order ? -1 : 1))
	},
	[FETCH_COLLECTION_FILTERS.mutation](state, data) {
		state.allFilters = data
	},

	[SET_GROUP_BY_IDENTIFIER.mutation](state, groupId) {
		state.activeFilter = {
			filterId: null,
			name: '',
			styleIds: []
		}
		if (!groupId || groupId == '') {
			state.activeGroup = null
			state.activeGroupIndex = -1
		} else {
			state.activeGroup = state.allGroups.filter(e => e.groupId === groupId)[0]
			state.activeGroupIndex = state.allGroups.indexOf(state.activeGroup)
		}
	},

	[SET_GROUP_BY_INDEX.mutation](state, newIndex) {
		if (window.GS_LOGS)
			console.warn('SET_GROUP_BY_INDEX | newIndex=' + newIndex)
		//
		state.activeFilter = {
			filterId: null,
			name: '',
			styleIds: []
		}
		state.activeGroupIndex = newIndex
		if (state.activeGroupIndex == -1) {
			state.activeGroup = null
			state.activeGroupIndex = -1
		} else {
			state.activeGroup = state.authorizedGroups[state.activeGroupIndex]
		}
	},

	[SET_CURRENT_FILTER.mutation](state, { filterId, getters }) {
		if (filterId === 'RTW') {
			state.activeFilter = {
				filterId,
				name: 'Ready to wear',
				styleIds: state.currentStyles
			}

			return
		}
		if (filterId === 'ACC') {
			state.activeFilter = {
				filterId,
				name: 'Accessories',
				styleIds: state.currentStyles
			}

			return
		}
		if (filterId === 'SHOES') {
			state.activeFilter = {
				filterId,
				name: 'Shoes',
				styleIds: state.currentStyles
			}

			return
		}

		if (!filterId) {
			state.activeFilter = {
				filterId: null,
				name: '',
				styleIds: []
			}
		} else {
			state.activeFilter = state.allFilters.find(e => e.filterId === filterId)
		}
	},

	[ALL_ASSETS_VISIBLE.mutation](state, styleItem) {
		let listStyle = state.allStyles.filter(
			e => e.styleId === styleItem.styleId
		)[0]
		let sial = listStyle.assets.length

		for (var i = 0; i < sial; i++) {
			let asset = listStyle.assets[i]
			asset.visible = true
		}
	},
	[ADD_TO_WISHLIST.mutation](state, styleId) {
		console.log('ADD', styleId)
		let listStyle = state.allStyles.find(e => e.styleId === styleId)
		if (!state.wishList.find(s => s.styleId === styleId)) {
			state.wishList.push(listStyle)
		}
	},
	[REMOVE_FROM_WISHLIST.mutation](state, styleId) {
		console.log('REMOVE', styleId)
		if (state.wishList.find(s => s.styleId === styleId)) {
			state.wishList = state.wishList.filter(e => e.styleId !== styleId)
		}
	},

	[COLLECTION_LAYOUT_CHANGE.mutation](state, value) {
		if (window.GS_LOGS) console.warn('COLLECTION_LAYOUT_CHANGE')
		state.collectionLayout = value
	},

	[AUTHORIZE_GROUPS.mutation](state, rootState) {
		state.authorizedGroups = state.allGroups.filter(
			group =>
				!group.passwords ||
				!group.passwords.length ||
				group.passwords.includes(rootState.user.loggedIn)
		)
	},

	[CURRENT_STYLE.mutation](state, data) {
		state.currentStyle = data
	},

	[SET_HIDDEN_ASSETS.mutation](state, fill) {
		state.hiddenAssetContent = []

		if (!state.currentStyle || fill !== false) return

		state.hiddenAssetContent = [...state.currentStyle.assets]
			.filter(asset => !asset.visible)
			.reverse()
			.map(asset => ({
				title: asset.name,
				contentId: asset.assetId,
				type: getAssetType(asset),
				canOverride: false,
				windowProps: getAssetType(asset).defaultWindowProps,
				contentComponentProps: { asset },
				statusComponentProps: getAssetType(asset).defaultStatusComponentProps
			}))
	},

	[SET_SEARCHSTRING.mutation](state, data) {
		state.searchstring = data
	}
}

export const actions = {
	[ALL_ASSETS_VISIBLE.action]({ commit }, style) {
		commit(ALL_ASSETS_VISIBLE.mutation, style)
	},
	[ADD_TO_WISHLIST.action]({ commit }, style) {
		commit(ADD_TO_WISHLIST.mutation, style)
	},
	[REMOVE_FROM_WISHLIST.action]({ commit }, style) {
		commit(REMOVE_FROM_WISHLIST.mutation, style)
	},
	[SET_CURRENT_FILTER.action]({ commit, getters }, filterId) {
		// ex 'c2'
		commit(SET_CURRENT_FILTER.mutation, { filterId, getters })
	},
	[SET_GROUP_BY_IDENTIFIER.action]({ commit, dispatch }, groupId) {
		// ex 'drop1-nov'
		dispatch(
			CLOSE_WINDOW_GROUP.action,
			{ styleWindowGroup: true },
			{ root: true }
		)
		commit(SET_GROUP_BY_IDENTIFIER.mutation, groupId)
	},
	[SET_GROUP_BY_INDEX.action]({ commit, dispatch }, groupIndex) {
		// ex 'drop1-nov'
		dispatch(
			CLOSE_WINDOW_GROUP.action,
			{ styleWindowGroup: true },
			{ root: true }
		)
		commit(SET_GROUP_BY_INDEX.mutation, groupIndex)
	},
	[SET_NEXT_GROUP.action]({ commit, state, dispatch }) {
		let newIndex
		if (state.activeGroupIndex === -1) {
			//currently showing all, show first group
			newIndex = 0
		} else {
			newIndex =
				state.activeGroupIndex === state.authorizedGroups.length - 1
					? -1
					: state.activeGroupIndex + 1
		}
		dispatch(
			CLOSE_WINDOW_GROUP.action,
			{ styleWindowGroup: true },
			{ root: true }
		)
		commit(SET_GROUP_BY_INDEX.mutation, newIndex)
	},
	[SET_PREVIOUS_GROUP.action]({ commit, state, dispatch }) {
		let newIndex
		if (state.activeGroupIndex === -1) {
			//currently showing all, show last group
			newIndex = state.authorizedGroups.length - 1
		} else {
			newIndex = state.activeGroupIndex === 0 ? -1 : state.activeGroupIndex - 1
		}
		dispatch(
			CLOSE_WINDOW_GROUP.action,
			{ styleWindowGroup: true },
			{ root: true }
		)
		commit(SET_GROUP_BY_INDEX.mutation, newIndex)
	},

	[SHOW_NEW_STYLE.action]({ dispatch, state, getters }, { styleId, next }) {
		dispatch(
			CLOSE_WINDOW_GROUP.action,
			{ styleWindowGroup: true },
			{ root: true }
		)

		const allStyles = state.activeGroup
			? getters.groups[state.activeGroup.groupId].styles
			: Object.values(getters.groups)
					.map(group => group.styles)
					.flat()

		const currentStyle = allStyles.find(style => style.styleId === styleId)
		const currentIndex = allStyles.findIndex(
			style => style.styleId === currentStyle.styleId
		)

		const newStyle = next
			? nextElement(allStyles, currentIndex)
			: prevElement(allStyles, currentIndex)

		if (newStyle) {
			dispatch(OPEN_STYLE_CONTENT.action, newStyle.styleId, {
				root: true
			})
		}
	},

	[COLLECTION_LAYOUT_CHANGE.action]({ commit }, value) {
		commit(COLLECTION_LAYOUT_CHANGE.mutation, value)
	},

	[AUTHORIZE_GROUPS.action]({ commit, rootState }) {
		commit(AUTHORIZE_GROUPS.mutation, rootState)
	},

	[CURRENT_STYLE.action]({ commit }, data) {
		commit(CURRENT_STYLE.mutation, data)
	},

	[SET_HIDDEN_ASSETS.action]({ commit }, fill) {
		commit(SET_HIDDEN_ASSETS.mutation, fill)
	},

	[SET_SEARCHSTRING.action]({ commit }, data) {
		commit(SET_SEARCHSTRING.mutation, data)
	}
}
