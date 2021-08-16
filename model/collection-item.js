export default {
	styleId: {
		//unique identifier
		type: String,
		default: null
	},
	name: {
		//"file name" human readable title
		type: String,
		default: null
	},
	program: {
		//series lvl 1
		default: null
	},
	programName: {
		//series lvl 2
		type: String,
		default: null
	},
	material: {
		//textile
		type: String,
		default: null
	},
	drop: {
		//ready for order time
		type: String,
		default: null
	},
	colorNames: {
		// human readable
		type: String,
		default: null
	},
	colorId: {
		// human readable number
		default: null
	},
	wholesalePriceDKK: {
		//price in DKK
		type: Number,
		default: 0
	},
	wholesalePriceEUR: {
		//price in EUR
		type: Number,
		default: 0
	},
	wholesalePriceUSD: {
		//price in USD
		type: Number,
		default: 0
	},
	retailPriceDKK: {
		//price in DKK
		type: Number,
		default: 0
	},
	retailPriceEUR: {
		//price in EUR
		type: Number,
		default: 0
	},
	retailPriceUSD: {
		//price in USD
		type: Number,
		default: 0
	},
	filters: {
		type: Array,
		default: null
	},
	assets: {
		type: Array,
		default: null
	},
	index: {
		type: Number,
		default: 0
	},
	responsible: {
		type: [Boolean, String],
		default: false
	},
	groupId: {
		type: String
	},
	weight: {
		type: Number
	},
	sizeRange: {
		type: String
	},
	chest: {
		type: Number
	},
	waist: {
		type: Number
	},
	hip: {
		type: Number
	},
	bottomWidth: {
		type: Number
	},
	totalLength: {
		type: Number
	},
	inseamLength: {
		type: Number
	},
	sleeveLength: {
		type: Number
	},
	height: {
		type: Number
	},
	length: {
		type: Number
	},
	width: {
		type: Number
	},
	heelHeight: {
		type: Number
	},
	wholesalePriceGBP: {
		type: Number
	},
	retailPriceGBP: {
		type: Number
	},
	retailRMB: {
		type: Number
	},
	slug: {
		type: String
	},
	['re-runner']: {
		type: Boolean
	},
	assets1: {
		type: String
	},
	assets2: {
		type: String
	},
	assets3: {
		type: String
	},
	assets4: {
		type: String
	},
	assets5: {
		type: String
	},
	assets6: {
		type: String
	},
	inseamLenght: {
		type: Number
	},
	totalLenght: {
		type: Number
	},
	sleeveLenght: {
		type: Number
	},
	inclusive: {
		type: Boolean
	},
	product_group: {
		type: String
	}
}
