const WINDOW_TOPBAR_BORDERS_HEIGHT = 30
const WINDOW_STATUSBAR_HR_HEIGHT = 40
const WINDOW_BORDERS_WIDTH = 0
const WINDOW_SCROLLBAR_WIDTH = 30

const WINDOW_DEFAULT_CHROME_WIDTH =
	WINDOW_BORDERS_WIDTH + WINDOW_SCROLLBAR_WIDTH
const WINDOW_TIGHT_CHROME_WIDTH = WINDOW_BORDERS_WIDTH
const WINDOW_DEFAULT_CHROME_HEIGHT =
	WINDOW_TOPBAR_BORDERS_HEIGHT + WINDOW_STATUSBAR_HR_HEIGHT
const WINDOW_NOSTATUS_CHROME_HEIGHT = WINDOW_TOPBAR_BORDERS_HEIGHT

import ViewportSizes from '~/model/viewport-sizes'

export default {
	exhibition: {
		name: 'exhibition',
		contentComponent: 'exhibition',
		contentScore: 0,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 700 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 750 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 600 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 355 }
			}
		}
	},
	collection: {
		name: 'collection',
		contentComponent: 'collection',
		contentScore: 25,
		statusComponent: 'status-collection',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 5 * 208 + 50 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 700 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 4 * 208 + 50 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 510 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 390 }
			}
		}
	},
	films: {
		name: 'films',
		contentComponent: 'films',
		contentScore: 15,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 980 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 500 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 670 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 500 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 400 }
			}
		}
	},
	musicPlayer: {
		name: 'musicPlayer',
		contentComponent: 'music-player',
		contentScore: 0,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 320 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 110 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 320 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 110 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 353,
					h: 110 + WINDOW_NOSTATUS_CHROME_HEIGHT
				}
			},
			canResize: false,
			noPlacement: true,
			wrapperClass: 'window--music-player__wrapper',
			modifierClass: 'window--music-player music-player window--tight'
		}
	},
	textFile: {
		name: 'textFile',
		contentComponent: 'text-reader',
		contentScore: 10,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 600 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 400 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 600 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 400 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 300, h: 300 }
			}
		}
	},
	imagePortrait: {
		name: 'imagePortrait',
		contentComponent: 'single-image',
		contentScore: 0,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 274 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 417 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 274 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 417 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 274,
					h: 417 + WINDOW_NOSTATUS_CHROME_HEIGHT
				}
			},
			modifierClass: 'window--tight'
		}
	},
	imagePortraitLarge: {
		name: 'imagePortraitLarge',
		contentComponent: 'single-image',
		contentScore: 0,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 370 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 563 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 329 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 500 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 274,
					h: 417 + WINDOW_NOSTATUS_CHROME_HEIGHT
				}
			},
			modifierClass: 'window--tight'
		}
	},
	imageLandscape: {
		name: 'imageLandscape',
		contentComponent: 'single-image',
		contentScore: 0,
		// statusComponent: 'status-static',
		// defaultStatusComponentProps: {
		// 	text: 'TIP! Click image to zoom.'
		// },
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 417 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 274 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 417 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 274 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 232 }
			},
			modifierClass: 'window--tight'
		}
	},
	imageLandscapeLarge: {
		name: 'imageLandscapeLarge',
		contentComponent: 'single-image',
		contentScore: 0,
		// statusComponent: 'status-static',
		// defaultStatusComponentProps: {
		// 	text: 'TIP! Click image to zoom.'
		// },
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 592 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 389 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 563 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 370 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 232 }
			},
			modifierClass: 'window--tight'
		}
	},
	imageSquare: {
		name: 'imageSquare',
		contentComponent: 'single-image',
		contentScore: 0,
		// statusComponent: 'status-static',
		// defaultStatusComponentProps: {
		// 	text: 'TIP! Click image to zoom.'
		// },
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 320 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 320 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 320 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 320 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 274,
					h: 274 + WINDOW_NOSTATUS_CHROME_HEIGHT
				}
			},
			modifierClass: 'window--tight'
		}
	},
	videoPortrait: {
		name: 'videoPortrait',
		contentComponent: 'single-video',
		contentScore: 0,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 370 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 658 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 274 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 487 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 200,
					h: 355 + WINDOW_NOSTATUS_CHROME_HEIGHT
				}
			},
			modifierClass: 'window--tight'
			// noStatus: true
		}
	},
	videoLandscape: {
		name: 'videoLandscape',
		contentComponent: 'single-video',
		contentScore: 0,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 608 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 342 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 608 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 342 + WINDOW_NOSTATUS_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 353,
					h: 199 + WINDOW_NOSTATUS_CHROME_HEIGHT
				}
			},
			modifierClass: 'window--tight'
			// noStatus: true
		}
	},
	videoSquare: {
		name: 'videoSquare',
		contentComponent: 'single-video',
		contentScore: 0,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 320 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 320 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 320 + WINDOW_TIGHT_CHROME_WIDTH,
					h: 320 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: {
					w: 274,
					h: 274 + WINDOW_DEFAULT_CHROME_HEIGHT
				}
			},
			modifierClass: 'window--tight'
		}
	},
	gallery: {
		name: 'gallery',
		contentComponent: 'gallery',
		contentScore: 0,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 600 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 600 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 600, h: 600 }
			},
			// noStatus: true,
			isMaximized: true,
			canResize: false,
			canReorder: false,
			wrapperClass: 'window--gallery__wrapper',
			modifierClass: 'window--gallery'
		}
	},
	wishList: {
		name: 'wishList',
		contentComponent: 'wish-list',
		contentScore: 15,
		// statusComponent: 'status-wish-list',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 705 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 640 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 705 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 640 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 400 }
			},
			wrapperClass: 'window--wish-list__wrapper',
			modifierClass: 'window--wish-list'
		}
	},
	hampsterDance: {
		name: 'hampsterDance',
		contentComponent: 'hampster-dance',
		contentScore: 10,
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 620 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 620 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 400 }
			}
			// noStatus: true
		}
	},
	ganniGirls: {
		name: 'ganniGirls',
		contentComponent: 'ganni-girls',
		contentScore: 0,
		statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 705 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 705 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 355 }
			}
		}
	},

	lookBook: {
		name: 'lookBook',
		contentComponent: 'look-book',
		contentScore: 15,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 500 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 750 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 400 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 600 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 353, h: 355 }
			}
		}
	},

	collage: {
		name: 'collage',
		contentComponent: 'collage',
		contentScore: 10,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: {
					w: 500 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 550 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.LARGE.name]: {
					w: 500 + WINDOW_DEFAULT_CHROME_WIDTH,
					h: 550 + WINDOW_DEFAULT_CHROME_HEIGHT
				},
				[ViewportSizes.SMALL.name]: { w: 350, h: 440 }
			},
			// noStatus: true,
			canResize: false,
			modifierClass: 'window--tight'
		}
	},

	puzzle: {
		name: 'puzzle',
		contentComponent: 'puzzle',
		contentScore: 10,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: { w: 800, h: 830 },
				[ViewportSizes.LARGE.name]: { w: 800, h: 830 },
				[ViewportSizes.SMALL.name]: { w: 800, h: 830 }
			},
			// noStatus: true,
			canResize: false,
			modifierClass: 'window--tight'
		}
	},

	download: {
		name: 'download',
		contentComponent: 'download-modal',
		contentScore: 0,
		// statusComponent: 'status-static',
		defaultWindowProps: {
			sizes: {
				[ViewportSizes.XLARGE.name]: { w: 400, h: 160 },
				[ViewportSizes.LARGE.name]: { w: 400, h: 160 },
				[ViewportSizes.SMALL.name]: { w: 400, h: 160 }
			},
			// noStatus: true,
			canResize: false,
			modifierClass: 'window--tight'
		}
	}
}
