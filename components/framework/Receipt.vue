<template>
	<div class="receipt">
		<h1 class="receipt__title" style="font-weight: 500">ganni export</h1>
		<div v-for="(value, name) in receiptStyles" :key="'group' + name">
			<h2>{{ name.replace('-', ' ') }}</h2>
			<receipt-item
				v-for="(item, idx) in value"
				:key="'receiptItem' + idx"
				:receipt-item="item"
			/>
		</div>
		<receipt-watermark />
	</div>
</template>

<script>
import { mapState } from 'vuex'
import ReceiptItem from '~/components/content/ReceiptItem.vue'
import ReceiptWatermark from '~/components/content/ReceiptWatermark.vue'

export default {
	name: 'Receipt',
	components: {
		ReceiptItem,
		ReceiptWatermark
	},
	data() {
		return {
			group: null,
			filter: null,
			styles: null,
			urlParams: [],
			filterGroup: [],
			filterFilter: [],
			filterStyles: []
		}
	},
	computed: {
		...mapState('collection', [
			'allStyles',
			'authorizedGroups',
			'RTWFilters',
			'ACCFilters',
			'shoesFilters'
		]),
		receiptStyles() {
			const sortedOnWeight = [...this.filterStyles].sort((a, b) =>
				a.weight > b.weight ? -1 : 1
			)

			const splitIntoGroups = sortedOnWeight.reduce((acc, cur) => {
				acc[cur.groupId] = acc[cur.groupId] || []

				return {
					...acc,
					[cur.groupId]: [...acc[cur.groupId], cur]
				}
			}, {})

			return splitIntoGroups
		}
	},

	methods: {
		parseUrl() {
			const url = new URL(window.location.href)
			const styles = url.searchParams.get('styles')
			this.filter = url.searchParams.get('filter')
			this.group = url.searchParams.get('group')
			this.styles = styles && styles.split(',')

			this.filterGroup = this.group
				? this.allStyles.filter(s => s.groupId === this.group)
				: this.allStyles

			this.filterFilter = this.filter
				? this.filterGroup.filter(s =>
						s.filters.find(f =>
							this.filter === 'RTW'
								? this.RTWFilters.includes(f)
								: this.filter === 'ACC'
								? this.ACCFilters.includes(f)
								: this.filter === 'SHOES'
								? this.shoesFilters.includes(f)
								: this.filter === f
						)
				  )
				: this.filterGroup

			this.filterStyles = this.styles
				? this.filterFilter.filter(s => this.styles.includes(s.styleId))
				: this.filterFilter

			// example urls to show all styles with filter in a group:
			// http://localhost:3000/export/?filter=rtw10&group=drop1-nov

			// example to show a list of styles:
			// http://localhost:3000/export/?styles=T2685,T2692
		}
	},
	mounted() {
		this.parseUrl()
	}
}
</script>
