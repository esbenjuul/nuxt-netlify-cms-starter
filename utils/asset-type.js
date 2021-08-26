import ContentTypes from '~/model/content-types'

export default function(asset) {
	switch (asset.type) {
		case 'image':
			switch (asset.aspect) {
				case 'portrait':
					return ContentTypes.imagePortraitLarge
					break
				case 'landscape':
					return ContentTypes.imageLandscapeLarge
					break
				case 'square':
					return ContentTypes.imageSquare
					break
			}
			break
		case 'video':
			switch (asset.aspect) {
				case 'portrait':
					return ContentTypes.videoPortrait
					break
				case 'landscape':
					return ContentTypes.videoLandscape
					break
			}
			break
	}

	//if all else fails
	console.warn('NO ASSET TYPE FOUND', asset)
	return ContentTypes.imagePortrait
}
