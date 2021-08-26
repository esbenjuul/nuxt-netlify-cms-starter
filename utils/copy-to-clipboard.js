export default function copyToClipboard(text, callback) {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text, callback)
		return
	}
	navigator.clipboard.writeText(text).then(
		function() {
			callback(true)
			console.log('Async: Copying to clipboard was successful!', text)
		},
		function(err) {
			callback(false)
			console.warn('Async: Could not copy text: ', err)
		}
	)
}

function fallbackCopyTextToClipboard(text, callback) {
	var textArea = document.createElement('textarea')
	textArea.value = text

	// Avoid scrolling to bottom
	textArea.style.top = '0'
	textArea.style.left = '0'
	textArea.style.position = 'fixed'

	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()

	try {
		var successful = document.execCommand('copy')
		var msg = successful ? 'successful' : 'unsuccessful'
		console.log('Fallback: Copying text command was ' + msg)
		callback(true)
	} catch (err) {
		console.warn('Fallback: Unable to copy', err)
		callback(false)
	}

	document.body.removeChild(textArea)
}
