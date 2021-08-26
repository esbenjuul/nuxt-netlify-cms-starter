<template>
	<div class="collection" :class="{ 'collection--fun': collectionLayout == 1 }">
		<div v-if="!activeGroup">
			<!-- ALL STYLES -->
			<div
				class="collection__group"
				v-for="(group, i) in groupsRenderList"
				:key="'group' + i"
			>
				<h4 v-if="groupsRenderList.length && group.styles.length">
					{{ group.name }}
				</h4>
				<div>
					<collection-item
						v-for="(item, j) in group.styles"
						:key="'group' + i + 'collectionItem' + j"
						v-bind="item"
					/>
				</div>
			</div>
		</div>
		<div v-else>
			<!-- ONLY ACTIVE GROUP -->
			<div class="collection__group">
				<div>
					<collection-item
						v-for="(item, i) in currentStyles"
						:key="'collectionItem' + i"
						v-bind="item"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { vuex, mapActions, mapState } from 'vuex'

import CollectionItem from '~/components/content/CollectionItem.vue'

import WindowContent from '~/components/framework/WindowContent.vue'

export default {
	extends: WindowContent,
	name: 'collection',
	components: {
		CollectionItem
	},
	computed: {
		...mapState('collection', [
			'collectionLayout',
			'currentStyles',
			// 'allGroups',
			'authorizedGroups',
			'activeGroup'
		]),

		groupsRenderList() {
			let groups = []

			let cl = this.authorizedGroups.length
			for (var j = 0; j < cl; j++) {
				let groupItem = this.authorizedGroups[j]

				groups.push({
					name: groupItem.name,
					styles: this.currentStyles.filter(
						e => e.groupId === groupItem.groupId
					)
				})
			}
			return groups
		}
	}
	// watch: {
	// 	collectionLayout(newVal) {
	// 		console.log('collectionLayout', newVal)
	// 	}
	// }
}
</script>
