import {
	SET_CURRENT_FILTER,
	SET_GROUP_BY_IDENTIFIER,
	SET_GROUP_BY_INDEX,
	ASSISTANT_MODE,
	MENU_SHOW
} from '~/model/constants'

import ContentTypes from '~/model/content-types'
import ShortcutTypes from '~/model/shortcut-types'
import AssistantModes from '~/model/assistant-modes'

export const state = () => ({
	textStyledWithoutIcon: true,
	list: [
		// {
		// 	type: ShortcutTypes.WINDOW,
		// 	shortcutId: 'audio-gallery',
		// 	label: 'Ditte speak',
		// 	windowContent: [
		// 		{
		// 			contentId: 'audio-gallery',
		// 			type: {
		// 				contentComponent: 'audio-gallery-controller'
		// 			}
		// 		}
		// 	]
		// },

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'warm-up',
			label: 'Warm up'
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'higher-love-tv',
			label: 'Higher love TV'
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'lookbook',
			label: 'SS22 LookBook'
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'collection',
			icon: '/img/shortcuts/ps21.png',
			label: 'SS22 Collection',
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
					title: 'SS22 collection',
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
			shortcutId: 'fabrics',
			label: 'Fabrics',
			windowContent: [
				{
					title: 'Fabrics',
					contentId: 'fabrics',
					type: ContentTypes.fabrics
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'ganni-lab',
			label: 'GANNI Lab',
			windowContent: [
				{
					title: 'GANNI Lab',
					contentId: 'ganni-lab',
					type: ContentTypes.greenRoom
				}
			]
		},

		{
			type: ShortcutTypes.WINDOW,
			shortcutId: 'about-ganni',
			label: 'About Ganni',
			windowContent: [
				{
					title: 'About Ganni',
					contentId: 'about-ganni',
					type: ContentTypes.aboutGanni
				}
			]
		}

		// {
		// 	type: ShortcutTypes.WINDOW,
		// 	shortcutId: 'links',
		// 	label: 'Tools',
		// 	actions: [
		// 		{
		// 			name: 'utils/' + MENU_SHOW.action,
		// 			param: { toggle: true }
		// 		}
		// 	]
		// }
	]
})

export const getters = {
	// filter out shortcuts that opens a group,
	// that is not part of the authorized groups
	authorizedShortcuts: (state, _, x, rootGetters) => {
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
