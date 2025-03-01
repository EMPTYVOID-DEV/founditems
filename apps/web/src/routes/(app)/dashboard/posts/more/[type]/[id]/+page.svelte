<script lang="ts">
	import { page } from '$app/state';
	import { svelteLL } from '@assets/i18n/i18n-svelte.js';
	import type { Translation } from '@assets/i18n/i18n-types.js';
	import { formatDate } from '@client/utils.svelte.js';
	import { PostData } from '@components/custom/postItem/postData.svelte.js';
	import type { ItemType } from '@shared/types.js';

	let { data } = $props();

	let itemType = page.params.type as ItemType;
	const item = data.item._tag == 'Right' ? data.item.right : data.item.left;
	let src = PostData.getImageSrc(item.category[1]);
	let categoryTranslation = item.category[1] as keyof Translation['categories'];
	let typeTranslation = itemType as keyof Translation['posts'];
	let stateTranslation = item.state as keyof Translation['postStates'];
	let date = data.item._tag == 'Right' ? data.item.right.foundDate : data.item.left.lostDate;
</script>

<div class="flex w-full flex-grow flex-col gap-6 p-[2.5%]">
	<h2 class="text-primary capitalize">{$svelteLL.posts.postInformation()}</h2>
	<img alt="category" {src} class="aspect-square w-1/6 self-center object-cover object-center" />
	<div class="mr:grid-cols-1 grid grid-cols-2 gap-2">
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
		{#each item.metadata as metaData}
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
	<div class="flex flex-col gap-1">
		<h4 class="font-bold capitalize">{$svelteLL.general.date()}</h4>
		<span>{formatDate(date)}</span>
	</div>
	<div class="flex flex-col gap-1">
		<h4 class="font-bold capitalize">{$svelteLL.general.address()}</h4>
		{#each item.address as addressItem}
			{#if addressItem.type == 'general'}
				<li>{addressItem.address.name}</li>
			{:else}
				<li>{addressItem.method}-{addressItem.startAddress.name}->{addressItem.endAddress.name}</li>
			{/if}
		{/each}
	</div>
</div>
