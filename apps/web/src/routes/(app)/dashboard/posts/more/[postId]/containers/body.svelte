<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { Translation } from '@assets/i18n/i18n-types';
	import type { ItemMetaData, ItemStates } from 'utils';

	let {
		category,
		isFound,
		metadata,
		state
	}: { category: string[]; isFound: boolean; state: ItemStates; metadata: ItemMetaData } = $props();
	let itemType = isFound ? 'found' : 'lost';
	let categoryTranslation = category[1] as keyof Translation['categories'];
	let typeTranslation = itemType as keyof Translation['posts'];
	let stateTranslation = state as keyof Translation['postStates'];
</script>

<div class="grid grid-cols-2 gap-2">
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">{$svelteLL.general.postType()}</span>
		<span>{$svelteLL.posts[typeTranslation]()}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">{$svelteLL.general.itemCategory()}</span>
		<span>{$svelteLL.categories[categoryTranslation]()}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">{$svelteLL.general.postState()}</span>
		<span>{$svelteLL.postStates[stateTranslation]()}</span>
	</div>
	{#each metadata as metaData}
		{@const metaKey = metaData.name as keyof Translation['metaData']}
		{#if metaData.value}
			<div class="flex flex-col gap-1">
				<span class="font-bold capitalize">{$svelteLL.metaData[metaKey]()}</span>
				{#if metaData.type == 'select'}
					{@const optionKey = metaData.value as keyof Translation['selectOptions']}
					<span>{$svelteLL.selectOptions[optionKey]()}</span>
				{:else}
					<span>{metaData.value}</span>
				{/if}
			</div>
		{/if}
	{/each}
</div>
