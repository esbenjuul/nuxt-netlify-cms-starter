<template>
	<div class="receipt">
		<h1 class="receipt__title" style="font-weight: 500;">ganni export</h1>
		<receipt-item
			v-for="(item, key) in receiptStyles"
			:key="'receiptItem' + key"
			:receipt-item="item"
		/>
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
		...mapState('assistant', ['pdfDownloadLink']),
		...mapState('collection', ['allStyles']),
		receiptStyles() {
			return this.filterStyles
		}
	},
	methods: {
		parseUrl() {
			const url = new URL(window.location.href)
			const styles = url.searchParams.get('styles')
			this.filter = url.searchParams.get('filter')
			this.group = url.searchParams.get('group')
			this.styles = styles && styles.split(',')

			this.usableStyles = this.allStyles.filter(
				s => !s.styleId.includes('TEST')
			) // [fix this] - weird check..?

			this.filterGroup = this.group
				? this.usableStyles.filter(s => s.groupId === this.group)
				: this.usableStyles

			this.filterFilter = this.filter
				? this.filterGroup.filter(s => s.filters.includes(this.filter))
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
