export default function(cl, asset, transform = {}, pixelDensity = 2) {
	// if passed url is wrapped in an array, get the string value
	const url =
		typeof asset.cloudinaryUrl === 'string'
			? asset.cloudinaryUrl
			: Array.isArray(asset.cloudinaryUrl)
			? asset.cloudinaryUrl[0]
			: asset.cloudinaryUrl

	if (url) {
		const parseUrl = url.split('upload/')[1]

		if (asset.type === 'video') {
			transform.crop = 'scale'
			transform.fetchFormat = 'auto' //may need to be h264?

			if (transform.width === undefined) {
				transform.width = 608

				if (asset.aspect === 'portrait') {
					transform.width = 274
				}
			}

			transform.width *= pixelDensity

			return cl.video_url(parseUrl, transform)
		} else {
			// transform.crop = 'fill'

			transform.width ? (transform.width *= pixelDensity) : null
			transform.height ? (transform.height *= pixelDensity) : null

			transform.quality = transform.quality || 60

			return cl.url(parseUrl, transform)
		}
	} else if (typeof asset.defaultImageUrl != 'undefined') {
		return asset.defaultImageUrl
	} else {
		return '/img/under-construction.gif' //fallback
	}

	// if ( window.GS_LOGS ) console.log('CLOUDINARY URL', parseUrl, transform, resultUrl)
	if (window.GS_LOGS && window.GS_URLS)
		console.warn('CLOUDINARY URL: "' + resultUrl + '"')
}
