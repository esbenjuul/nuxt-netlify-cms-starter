import fs from 'fs'

const oldFile = fs.readFileSync('./files/updated-assets-bulk-upload.json')
const newFile = fs.readFileSync(
	'./files/Copy-of-22.1-bulk-(new-prices)-Ark1.json'
)

const oldJSON = JSON.parse(oldFile)
const newJSON = JSON.parse(newFile)

const OUTPUT_FILENAME = 'updated-prices-bulk-upload.json'

const outputFile = oldJSON.map(oldContent => {
	const newContent = newJSON.find(s => s.styleId === oldContent.styleId)

	const result = {
		...oldContent,
		...newContent
	}

	return result
})

fs.writeFile(OUTPUT_FILENAME, JSON.stringify(outputFile), err => {
	if (err) throw err
	console.log(`New file created`)
})
