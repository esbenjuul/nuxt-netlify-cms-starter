import camelCase from 'lodash/camelCase'

const createMutation = type => ({
	action: camelCase(`${type}_ACTION`),
	mutation: camelCase(`${type}_MUTATION`),
	stateKey: camelCase(type)
})

export const IS_MOBILE = createMutation('IS_MOBILE')
export const PASSWORDS_FETCH = createMutation('PASSWORDS_FETCH')

export const COOKIES_ACCEPT = createMutation('COOKIES_ACCEPT')
export const LOGIN = createMutation('LOGIN')
export const COPYRIGHT_ACCEPT = createMutation('COPYRIGHT_ACCEPT')
export const SAVE_AS_BACKGROUND = createMutation('SAVE_AS_BACKGROUND')
export const IDLE = createMutation('IDLE')
export const RESET_STATE = createMutation('RESET_STATE')

export const EXHIBITION_FETCH = createMutation('EXHIBITION_FETCH')
export const EXHIBITION_ASSETS_FETCH = createMutation('EXHIBITION_ASSETS_FETCH')
export const COLLECTION_ITEMS_FETCH = createMutation('COLLECTION_ITEMS_FETCH')
export const COLLECTION_GROUPS_FETCH = createMutation('COLLECTION_GROUPS_FETCH')
export const COLLECTION_FILTERS_FETCH = createMutation(
	'COLLECTION_FILTERS_FETCH'
)
export const COLLECTION_ASSETS_FETCH = createMutation('COLLECTION_ASSETS_FETCH')
export const FILMS_FETCH = createMutation('FILMS_FETCH')
export const GANNIGIRLS_FETCH = createMutation('GANNIGIRLS_FETCH')
export const LOOKBOOK_FETCH = createMutation('LOOKBOOK_FETCH')
export const ANAS_FETCH = createMutation('ANAS_FETCH')
export const GENERAL_FETCH = createMutation('GENERAL_FETCH')
export const ASSISTANT_FETCH = createMutation('ASSISTANT_FETCH')
export const DITTE_FETCH = createMutation('DITTE_FETCH')
export const SONGS_FETCH = createMutation('SONGS_FETCH')
export const ABOUT_FETCH = createMutation('ABOUT_FETCH')
export const DESKTOP_FETCH = createMutation('DESKTOP_FETCH')
export const INTRO_FETCH = createMutation('INTRO_FETCH')

export const CURRENT_STYLE = createMutation('CURRENT_STYLE')
export const SET_HIDDEN_ASSETS = createMutation('SET_HIDDEN_ASSETS')

export const AUTHORIZE_GROUPS = createMutation('AUTHORIZE_GROUPS')

export const KEYPRESS = createMutation('KEYPRESS')
export const MOUSEMOVE = createMutation('MOUSEMOVE')

export const INIT_PROGRESS = createMutation('INIT_PROGRESS')
export const UPDATE_PROGRESS = createMutation('UPDATE_PROGRESS')

export const CONNECT_ASSETS = createMutation('CONNECT_ASSETS')
export const INDEX_COLLECTION_DATA = createMutation('INDEX_COLLECTION_DATA')
export const COLLECTION_LAYOUT_CHANGE = createMutation(
	'COLLECTION_LAYOUT_CHANGE'
)
export const TOPMOST_WINDOW = createMutation('TOPMOST_WINDOW')
export const CLOSE_WINDOW = createMutation('CLOSE_WINDOW')
export const UPDATE_WINDOW = createMutation('UPDATE_WINDOW')
export const CLOSE_WINDOW_GROUP = createMutation('CLOSE_WINDOW_GROUP')
export const EXPAND_WINDOW_GROUP = createMutation('EXPAND_WINDOW_GROUP')
export const OPEN_CONTENT = createMutation('OPEN_CONTENT')
export const OPEN_GALLERY = createMutation('OPEN_GALLERY')
export const ADD_TO_WISHLIST = createMutation('ADD_TO_WISHLIST')
export const REMOVE_FROM_WISHLIST = createMutation('REMOVE_FROM_WISHLIST')
export const ALL_ASSETS_VISIBLE = createMutation('ALL_ASSETS_VISIBLE')
// export const SHOW_NEXT_STYLE = createMutation('SHOW_NEXT_STYLE')
export const SHOW_NEW_STYLE = createMutation('SHOW_NEW_STYLE')

export const SET_CURRENT_FILTER = createMutation('SET_CURRENT_FILTER')
export const SET_GROUP_BY_IDENTIFIER = createMutation('SET_GROUP_BY_IDENTIFIER')
export const SET_GROUP_BY_INDEX = createMutation('SET_GROUP_BY_INDEX')
export const SET_NEXT_GROUP = createMutation('SET_NEXT_GROUP')
export const SET_PREVIOUS_GROUP = createMutation('SET_PREVIOUS_GROUP')

export const PROGRESS_UPDATE = createMutation('PROGRESS_UPDATE')
export const OPEN_WISH_LIST = createMutation('OPEN_WISH_LIST')
export const OPEN_STYLE_CONTENT = createMutation('OPEN_STYLE_CONTENT')
export const TOGGLE_MUSIC_PLAYER = createMutation('TOGGLE_MUSIC_PLAYER')
export const FORCE_STOP_MUSIC = createMutation('FORCE_STOP_MUSIC')
export const MUSIC_PLAY_PAUSE = createMutation('MUSIC_PLAY_PAUSE')
export const CLIPBOARD_COPY = createMutation('CLIPBOARD_COPY')
export const DOWNLOAD_PREPARING = createMutation('DOWNLOAD_PREPARING')
export const SHORTENED_URL = createMutation('SHORTENED_URL')

export const CONNECT_EXHIBITION_ASSETS = createMutation(
	'CONNECT_EXHIBITION_ASSETS'
)
export const OPEN_EXHIBITION_CONTENT = createMutation('OPEN_EXHIBITION_CONTENT')

export const SAVE_COLLAGE = createMutation('SAVE_COLLAGE')
export const MAKE_BACKGROUND = createMutation('MAKE_BACKGROUND')
export const COLLAGE_IS_OPEN = createMutation('COLLAGE_IS_OPEN')
export const CHANGE_COLLAGE = createMutation('CHANGE_COLLAGE')

export const ASSISTANT_TEXT = createMutation('ASSISTANT_TEXT')
export const ASSISTANT_MODE = createMutation('ASSISTANT_MODE')
export const ASSISTANT_EXPANDED = createMutation('ASSISTANT_EXPANDED')

export const DESKTOP_BACKGROUND = createMutation('DESKTOP_BACKGROUND')

export const PUZZLE_INSTANCE = createMutation('PUZZLE_INSTANCE')
export const SAVE_PUZZLE = createMutation('SAVE_PUZZLE')
