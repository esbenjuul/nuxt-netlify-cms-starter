import fs from 'fs'

const oldFile = fs.readFileSync(
	'./files/Copy-of-22.1-bulk-upload-Ark1-(1).json'
)
const newFile = fs.readFileSync(
	'./files/22.1-upload-(new assets)-TO-UPLOAD.json'
)

const oldJSON = JSON.parse(oldFile)
const newJSON = JSON.parse(newFile)

const OUTPUT_FILENAME = 'updated-assets-bulk-upload.json'

const outputFile = oldJSON.map(style => {
	const newContent = newJSON.find(s => s.styleId === style.styleId)

	const result = {
		...style,
		...newContent
	}

	return result
})

fs.writeFile(OUTPUT_FILENAME, JSON.stringify(outputFile), err => {
	if (err) throw err
	console.log(`New file created`)
})
