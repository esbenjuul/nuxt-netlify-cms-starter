import {
	CLIPBOARD_COPY,
	DOWNLOAD_PREPARING,
	IS_MOBILE,
	SHORTENED_URL
} from '~/model/constants'

export const state = () => ({
	clipBoardCopyComplete: false,
	downloadPreparing: false,
	isMobile: true,
	shortenedReceiptUrl: '',
	__prod__: process.env.NODE_ENV === 'production'
})

export const mutations = {
	[CLIPBOARD_COPY.mutation](state, value) {
		if (window.GS_LOGS) console.warn('CLIPBOARD_COPY')
		state.clipBoardCopyComplete = value
	},
	[DOWNLOAD_PREPARING.mutation](state, value) {
		if (window.GS_LOGS) console.warn('DOWNLOAD_PREPARING')
		state.downloadPreparing = value
	},
	[IS_MOBILE.mutation](state, value) {
		state.isMobile = value
	},
	[SHORTENED_URL.mutation](state, value) {
		state.shortenedReceiptUrl = value
	}
}

export const actions = {
	[CLIPBOARD_COPY.action]({ commit }, value) {
		commit(CLIPBOARD_COPY.mutation, value)
	},
	[DOWNLOAD_PREPARING.action]({ commit }, value) {
		commit(DOWNLOAD_PREPARING.mutation, value)
	},
	[IS_MOBILE.action]({ commit }, value) {
		commit(IS_MOBILE.mutation, value)
	},
	[SHORTENED_URL.action]({ commit }, value) {
		commit(SHORTENED_URL.mutation, value)
	}
}
