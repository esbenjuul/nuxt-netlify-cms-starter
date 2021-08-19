import fs from 'fs'
import glob from 'glob'

const assetsFolder = '../assets/content/collectionItems'

const KEY_TO_REMOVE = 'inclusive'

glob(`${assetsFolder}/*.json`, (er, files) => {
	files.forEach(file => {
		if (!file) return

		const json = JSON.parse(fs.readFileSync(file, 'utf8'))

		delete json[KEY_TO_REMOVE]

		fs.writeFile(file, JSON.stringify(json), err => {
			if (err) return console.log(err)
		})
	})
})
