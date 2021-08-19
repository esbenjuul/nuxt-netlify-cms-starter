import fs from 'fs'
import glob from 'glob'

const data = fs.readFileSync(
	'./files/22.1-bulk-upload-(size-inclusive)18_8-Ark1(2).json'
)
const json = JSON.parse(data)

const assetsFolder = '../assets/content/collectionItems'

json
	// .map(f => ({ ...f, retailPriceGBP: parseInt(f.retailPriceGBP) }))
	.forEach(newValues => {
		glob(`${assetsFolder}/*${newValues.styleId}*.json`, (er, [file]) => {
			if (!file) return

			const oldJson = JSON.parse(fs.readFileSync(file, 'utf8'))

			const newContent = {
				...oldJson,
				...newValues
			}

			fs.writeFile(file, JSON.stringify(newContent), err => {
				if (err) return console.log(err)
			})
		})
	})
