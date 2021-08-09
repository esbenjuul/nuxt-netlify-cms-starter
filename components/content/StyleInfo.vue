<template>
	<div class="style-info">
		<span v-if="responsible" class="responsible">
			<div v-for="_ in 6" :key="`banner-item${_}`">
				<svg-icon v-if="responsible" name="ganni-smiley--inv" />
				{{ responsible ? 'responsible&nbsp;&nbsp;' : '' }}
				<!-- <svg-icon v-if="reRunner" name="ganni-smiley--inv" />
				{{ reRunner ? 're-runner&nbsp;&nbsp;' : '' }} -->
			</div>
		</span>

		<div class="style-info__row">
			<span>Color</span>
			<span>{{ item.colorNames }}</span>
		</div>
		<div class="style-info__row">
			<span>Material</span>
			<span>{{ item.material }}</span>
		</div>
		<div class="style-info__row">
			<span>Style #</span>
			<span>{{ item.styleId }}</span>
		</div>
		<div class="style-info__row">
			<span>Program #</span>
			<span>{{ item.program }}</span>
		</div>

		<div v-if="item.feature_text" class="style-info__row">
			<span>Features</span>
			<span>{{ item.feature_text }}</span>
		</div>

		<div class="style-info__row">
			<span>Program name</span>
			<span>{{ item.programName }}</span>
		</div>

		<div class="style-info__row" v-if="item.sizes">
			<span>Sizes</span>
			<span>{{ item.sizes }}</span>
		</div>

		<!-- <div
			class="style-info__row"
			style="width: 100%;
				padding: 0.625em;
				margin-top: 0.625em;
				box-sizing: border-box;
				justify-content: center;"
			
		>
			
		</div> -->

		<div class="style-info__row" v-if="item.sizeRange">
			<span>Sizes range</span>
			<span
				>{{ item.sizeRange }}
				<span v-if="item.inclusive"> (SIZE INCLUSIVE)</span></span
			>
		</div>

		<div class="style-info__row" v-if="item.measurements">
			<span>Measurements</span>
			<span>{{ item.measurements }}</span>
		</div>

		<div class="style-info__row" v-if="individualMeasurements.length">
			<span>Measurements (cm)</span>
			<span v-html="individualMeasurements"></span>
		</div>

		<div class="style-info__row" v-if="item.message">
			<span>message</span>
			<span>{{ item.message }}</span>
		</div>

		<div class="style-info__row" v-if="SHOW_WHOLESALE_PRICE">
			<span>Wholesale price</span>
			<span
				>DKK {{ item.wholesalePriceDKK }}<br />
				EUR {{ item.wholesalePriceEUR }}<br />
				USD {{ item.wholesalePriceUSD }}<br />
				GBP {{ item.wholesalePriceGBP }}</span
			>
		</div>

		<div class="style-info__row">
			<span>Suggested retail price</span>
			<span
				>DKK {{ item.retailPriceDKK }}<br />
				EUR {{ item.retailPriceEUR }}<br />
				USD {{ item.retailPriceUSD }}<br />
				<div v-if="item.retailPriceGBP">GBP {{ item.retailPriceGBP }}</div>
				<div v-if="item.retailRMB">RMB {{ item.retailRMB }}</div>
			</span>
		</div>
	</div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	name: 'style-info',
	props: {
		item: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		...mapState(['SHOW_WHOLESALE_PRICE']),
		responsible() {
			return this.item.responsible === true || this.item.responsible === 'SAND'
		},
		reRunner() {
			return (
				this.item['re-runner'] === true || this.item['re-runner'] === 'SAND'
			)
		},
		individualMeasurements() {
			const targets = [
				'chest',
				'waist',
				'hip',
				'bottomWidth',
				'totalLength',
				'inseamLength',
				'sleeveLength',
				'height',
				'length',
				'width',
				'heelHeight'
			]

			const capitalize = word =>
				word.charAt(0).toUpperCase() + word.substring(1)

			const toCapitalizedWords = name => {
				var words = name.match(/[A-Za-z][a-z]*/g) || []

				return words.map(capitalize).join(' ')
			}

			const nonZeroMeasurements = Object.entries(this.item)
				.filter(([key]) => targets.includes(key))
				.filter(([_, value]) => value && value !== 0)
				.map(([key, value]) => [toCapitalizedWords(key), value])

			// console.log(nonZeroMeasurements)

			const stringOutput = nonZeroMeasurements
				.map(([key, value]) => `${key}: ${value}`)
				.join('<br />')

			return stringOutput
		}
	}
}
</script>
