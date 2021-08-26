export default function(cl, asset, tf = {}, pixelDensity = 2) {
	let transform = tf
	let resultUrl
	let parseUrl

	if (asset.cloudinaryUrl) {
		parseUrl = asset.cloudinaryUrl.split('upload/')[1]

		if (asset.type === 'video') {
			transform.crop = 'scale'
			transform.fetchFormat = 'auto' //may need to be h264?

			let aspect = 342 / 608
			if (typeof transform.width != 'undefined') {
				// transform.height = Math.round(aspect * transform.width)
			} else {
				transform.width = 608
				// transform.height = 342
				if (asset.aspect === 'portrait') {
					transform.width = 274
					// transform.height = 417
				}
			}

			transform.width *= pixelDensity
			// transform.height *= pixelDensity

			resultUrl = cl.video_url(parseUrl, transform)
		} else {
			transform.crop = 'fill'

			transform.width ? (transform.width *= pixelDensity) : null
			transform.height ? (transform.height *= pixelDensity) : null

			transform.quality = tf.quality || 60

			resultUrl = cl.url(parseUrl, transform)
		}
	} else if (typeof asset.defaultImageUrl != 'undefined') {
		resultUrl = asset.defaultImageUrl
	} else {
		resultUrl = '/img/under-construction.gif' //fallback
	}

	// if ( window.GS_LOGS ) console.log('CLOUDINARY URL', parseUrl, transform, resultUrl)
	if (window.GS_LOGS && window.GS_URLS)
		console.warn('CLOUDINARY URL: "' + resultUrl + '"')

	return resultUrl
}
