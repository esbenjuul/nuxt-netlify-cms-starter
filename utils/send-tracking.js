export default function(category, action) {
	// console.warn("GOOGLE: '"+category+"', '"+action+"'")

	try {
		window.$gtm.push({
			event: 'GAEvent',
			eventCategory: category,
			eventAction: action,
			eventLabel: category
		})
	} catch (error) {
		console.warn("COULDN'T TRACK.", error)
	}
}
