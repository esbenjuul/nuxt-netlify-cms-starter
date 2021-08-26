import {
	SET_CURRENT_FILTER,
	SET_GROUP_BY_IDENTIFIER,
	SET_GROUP_BY_INDEX,
	COLLECTION_LAYOUT_CHANGE,
	ASSISTANT_MODE,
	OPEN_CONTENT
} from '~/model/constants'

import CollectionLayouts from '~/model/collection-layouts'
import ContentTypes from '~/model/content-types'
import ShortcutTypes from '~/model/shortcut-types'
import AssistantModes from '~/model/assistant-modes'

export const state = () => ({
	textStyledWithoutIcon: true,
	list: [
		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'dittes-folder',
			icon: '/img/shortcuts/dittes_private.png',
			label: `Ditte now`,
			posH: 3,
			posV: 1,
			widthSpan: 2,
			windowContent: 'assets.ditte'
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'anas',
			icon: '/img/shortcuts/anna.png',
			label: `Ana's Copenhagen`,
			posH: 3,
			posV: 2,
			windowContent: [
				{
					title: `Ana's Copenhagen`,
					contentId: 'anas', // should match assets[contentId] to define content
					type: ContentTypes.lookBook,
					assistant: {
						mode: AssistantModes.CUSTOM
					}
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'look-book',
			icon: '/img/shortcuts/look_book.png',
			label: 'PF21 LookBook',
			posH: 2,
			posV: 2,
			windowContent: [
				{
					title: 'GANNI LookBook',
					contentId: 'lookBook',
					type: ContentTypes.lookBook,
					statusComponentProps: {
						text: 'Photo credit: Josefine Seifert'
					},
					assistant: {
						mode: AssistantModes.CUSTOM,
						text: 'lookBook'
					}
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'collection',
			icon: '/img/shortcuts/ps21.png',
			label: 'PF21 Collection',
			posH: 1,
			posV: 1,
			actions: [
				{
					name: 'collection/' + SET_GROUP_BY_INDEX.action,
					param: -1
				},
				{ name: 'collection/' + SET_CURRENT_FILTER.action, param: '' },
				{
					name: 'assistant/' + ASSISTANT_MODE.action,
					param: AssistantModes.FILTER_COLLECTION
				}
			],
			windowContent: [
				{
					title: 'PF21 collection',
					contentId: 'collection',
					type: ContentTypes.collection,
					canOverride: true,
					assistant: {
						mode: AssistantModes.FILTER_COLLECTION
					}
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'exhibition',
			icon: '/img/shortcuts/rails.png',
			label: 'On display',
			posH: 3,
			posV: 3,
			windowContent: [
				{
					title: 'rails',
					contentId: 'rails',
					type: ContentTypes.exhibition,
					statusComponentProps: {
						text: 'PRE SPRING 21 RAILS'
					},
					assistant: {
						mode: AssistantModes.CUSTOM,
						text: {
							headline: 'PRE SPRING 21 RAILS',
							bodyText:
								'This is the new rail section. Click on an image to explore the rail'
						}
					}
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'software',
			icon: '/img/shortcuts/animal_print.png',
			label: 'GANNI Software',
			posH: 10,
			posV: 6,
			actions: [
				{
					name: 'collection/' + SET_GROUP_BY_IDENTIFIER.action,
					param: 'software'
				}
			],
			windowContent: [
				{
					title: 'PF21 collection',
					contentId: 'collection',
					type: ContentTypes.collection,
					canOverride: true,
					assistant: {
						mode: AssistantModes.FILTER_COLLECTION
					}
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'ganni-favourites',
			icon: '/img/shortcuts/ganni_software.png',
			label: `Design Darlings`,
			posH: 11,
			posV: 6,
			actions: [
				{
					name: 'collection/' + SET_GROUP_BY_INDEX.action,
					param: -1
				},
				{
					name: 'collection/' + SET_CURRENT_FILTER.action,
					param: 'misc2'
				}
			],
			windowContent: [
				{
					title: 'Collection',
					contentId: 'collection',
					type: ContentTypes.collection,
					canOverride: true,
					assistant: {
						mode: AssistantModes.FILTER_COLLECTION
					}
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'about',
			icon: '/img/shortcuts/dittes_private.png',
			label: 'Our world',
			posH: 3,
			posV: 1,
			widthSpan: 2,
			windowContent: 'assets.about'
		},

		{
			type: ShortcutTypes.MARQUEE,
			text: 'A loveletter to Copenhagen through artist ',
			label: 'Ana Kraš lens',
			windowContent: [
				{
					title: `Ana's Copenhagen`,
					contentId: 'anas', // should match assets[contentId] to define content
					type: ContentTypes.lookBook,
					assistant: {
						mode: AssistantModes.CUSTOM
					}
				}
			]
		},
		{
			type: ShortcutTypes.MARQUEE,
			text: 'Feel Complete. Piece together ',
			label: 'our puzzle',
			windowContent: [
				{
					title: 'Puzzle',
					contentId: 'puzzle',
					type: ContentTypes.puzzle,
					assistant: {
						mode: AssistantModes.PUZZLE
					}
				}
			]
		},
		{
			type: ShortcutTypes.MARQUEE,
			text: 'Don’t miss our latest drop of ',
			label: 'GANNI Software',
			actions: [
				{
					name: 'collection/' + SET_GROUP_BY_IDENTIFIER.action,
					param: 'software'
				}
			],
			windowContent: [
				{
					title: 'PF21 collection',
					contentId: 'collection',
					type: ContentTypes.collection,
					canOverride: true,
					assistant: {
						mode: AssistantModes.FILTER_COLLECTION
					}
				}
			]
		},

		{
			type: ShortcutTypes.MARQUEE,
			text: 'Remember to collect your ',
			label: 'digital goodiebag',
			textAfter: ' before you leave',
			windowContent: [
				{
					title: 'Download',
					contentId: 'download-modal',
					type: ContentTypes.download,
					canOverride: true
				}
			]
		},

		{
			type: ShortcutTypes.BADGE,
			shortcutId: 'puzzle',
			label: 'Puzzle',
			icon: '/img/shortcuts/Expert_level_puzzle_bw.png',
			posH: 10,
			posV: 5,
			windowContent: [
				{
					title: 'Puzzle',
					contentId: 'puzzle',
					type: ContentTypes.puzzle,
					assistant: {
						mode: AssistantModes.PUZZLE
					}
				}
			]
		},

		{
			type: ShortcutTypes.BADGE,
			shortcutId: 'music-player',
			icon: '/img/shortcuts/Hits_for_buyers_bw.png',
			label: 'GANNI FM',
			posH: 1,
			posV: 2,
			windowContent: [
				{
					title: 'GANNI FM',
					contentId: 'ganni-fm',
					type: ContentTypes.musicPlayer,
					canOverride: true
				}
			]
		},

		{
			type: ShortcutTypes.BADGE,
			shortcutId: 'download',
			icon: '/img/shortcuts/download.png',
			label: 'Download',
			posH: 1,
			posV: 2,
			windowContent: [
				{
					title: 'Download',
					contentId: 'download-modal',
					type: ContentTypes.download,
					canOverride: true
				}
			]
		}
	]
})

export const getters = {
	// filter out shortcuts that opens a group,
	// that is not part of the authorized groups
	authorizedShortcuts: (state, getters, rootState, rootGetters) => {
		return state.list.filter(s => {
			// authorize by default
			if (!s.actions) return true

			// authorize if actions are not pw protected
			// (i.e. doesn't include an action that shows a maybe hidden group)
			if (
				!s.actions
					.map(a => a.name)
					.find(name => name.includes(SET_GROUP_BY_IDENTIFIER.action))
			)
				return true

			// we're left with shortcuts that includes an action that might show a hidden group
			return s.actions.find(action => {
				const isRelevantAction = action.name.includes(
					SET_GROUP_BY_IDENTIFIER.action
				)

				// authorize the shortcut if the action opens a group,
				// and that group is part of the authorized groups
				return (
					isRelevantAction &&
					rootGetters['collection/authorizedGroupsIds'].includes(action.param)
				)
			})
		})
	}
}

export const mutations = {}

export const actions = {}
