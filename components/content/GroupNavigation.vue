<template>
	<div class="group-navigation">
		<label
			for="all"
			:style="{ width: `${75 / (authorizedGroups.length + 1)}%` }"
		>
			<input
				id="all"
				name="group-navigation"
				type="radio"
				@change="e => e.target.checked && groupHandler('')"
				:checked="!activeGroup"
			/>
			All
		</label>
		<label
			:for="group.groupId"
			v-for="(group, i) in authorizedGroups"
			:key="group.name"
			:style="{
				width: `${
					i === authorizedGroups.length - 1
						? 25
						: 75 / (authorizedGroups.length + 1)
				}%`
			}"
		>
			<input
				:id="group.groupId"
				name="group-navigation"
				type="radio"
				@change="e => e.target.checked && groupHandler(group.groupId)"
				:checked="activeGroup && activeGroup.groupId === group.groupId"
			/>
			{{ group.name }}
		</label>

		<!-- <button class="group-navigation__prev" @click="groupPrevHandler">
			<span>←</span>
		</button>
		<p>{{ groupName }}</p>
		<button class="group-navigation__next" @click="groupNextHandler">
			<span>→</span>
		</button> -->
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
	SET_NEXT_GROUP,
	SET_PREVIOUS_GROUP,
	SET_GROUP_BY_IDENTIFIER
} from '~/model/constants'
export default {
	name: 'group-navigation',
	computed: {
		...mapState('collection', ['activeGroup', 'authorizedGroups']),
		groupName() {
			if (this.activeGroup) {
				return this.activeGroup.name
			} else {
				return 'All styles'
			}
		}
	},
	methods: {
		...mapActions('collection', [
			SET_PREVIOUS_GROUP.action,
			SET_NEXT_GROUP.action,
			SET_GROUP_BY_IDENTIFIER.action
		]),
		groupPrevHandler() {
			this[SET_PREVIOUS_GROUP.action]()
		},
		groupNextHandler() {
			this[SET_NEXT_GROUP.action]()
		},
		groupHandler(id) {
			this[SET_GROUP_BY_IDENTIFIER.action](id)
		}
	}
}
</script>