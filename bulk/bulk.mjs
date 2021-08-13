import fs from 'fs'
import path from 'path'

const data = fs.readFileSync('./files/updated-assets-bulk-upload.json')
const json = JSON.parse(data)

// settings
const OUT_FOLDER = 'content' // no slashes
const STYLES_FILE = json
const assetFolder = `../assets/${OUT_FOLDER}`

// helpers
const date = new Date()
const dateString = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
const parseFalse = x => x !== undefined && (x === 'FALSK' || x === false)
function clean(obj) {
	for (var propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined) {
			delete obj[propName]
		}
	}
	return obj
}
const getUniqueId = () =>
	Math.random()
		.toString(36)
		.substr(2, 9)

const isVideo = fileName =>
	[
		'.WEBM',
		'.MPG',
		'.MP2',
		'.MPEG',
		'.MPE',
		'.MPV',
		'.OGG',
		'.MP4',
		'.M4P',
		'.M4V',
		'.AVI',
		'.WMV',
		'.MOV',
		'.QT',
		'.FLV',
		'.SWF',
		'.AVCHD'
	].find(ext => fileName.toUpperCase().includes(ext))

// copypasted from netlify cms
const defaultFilters = {
	misc5: 'GANNI Software',
	rtw1: 'Dresses',
	rtw2: 'Denim',
	rtw3: 'Coats / Jackets',
	rtw4: 'Jersey',
	rtw5: 'Knitwear',
	rtw6: 'Skirts',
	rtw7: 'Suiting',
	rtw8: 'Tops',
	rtw9: 'Trousers',
	rtw10: 'T-shirts',
	rtw11: 'Shorts',
	acc1: 'Accessories',
	acc2: 'Bags',
	acc3: 'Shoes',
	acc4: 'Swimwear',
	acc5: 'Hats',
	acc6: 'Underwear',
	misc1: 'White Cotton Poplin',
	misc2: 'Design Darlings',
	misc3: 'Leather',
	misc4: 'Love for Leopard'
}

STYLES_FILE.forEach(item => {
	const styleFileName = `${assetFolder}/collectionItems/${dateString}-${item['groupId']}-${item['styleId']}.json`.replace(
		/ /g,
		'_'
	)

	// console.log(Object.entries(item))

	/**
	 * format the incoming object before parsing it to a json file
	 */
	const itemFormatted = clean({
		...item,
		/**
		 * Any string value representing a boolean, should become a boolean
		 */
		responsible: parseFalse(item.responsible) ? false : true,
		inclusive: parseFalse(item.inclusive) ? false : true,
		['re-runner']: parseFalse(item['re-runner']) ? false : true,
		assets: Object.entries(item)
			.filter(([key]) => key.includes('assets'))
			.reduce((acc, [_, value]) => [...acc, value], []),
		chest: parseFloat(item.chest),
		waist: parseFloat(item.waist),
		hip: parseFloat(item.hip),
		bottomWidth: parseFloat(item.bottomWidth),
		totalLenght: parseFloat(item.totalLenght),
		inseamLenght: parseFloat(item.inseamLenght),
		sleeveLenght: parseFloat(item.sleeveLenght),
		length: parseFloat(item.length),
		width: parseFloat(item.width),
		height: parseFloat(item.height),
		heelHeight: parseFloat(item.heelHeight)
	})

	fs.writeFile(styleFileName, JSON.stringify(itemFormatted), err => {
		if (err) throw err
		console.log(`Collection item ${styleFileName} done`)
	})
})
