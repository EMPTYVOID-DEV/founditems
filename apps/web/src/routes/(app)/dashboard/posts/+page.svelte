<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import AddIcon from '@icons/addIcon.svelte';
	import { createPostPage, postsPage } from '@shared/const';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { ItemType } from '@shared/types.js';
	import type { AvailableLocales, ItemStates } from 'utils';
	import { PostData } from '@components/custom/postItem';
	import { detectLocaleDirection } from '@shared/utils.js';
	import type { Translation } from '@assets/i18n/i18n-types.js';
	import MoreIcon from '@icons/moreIcon.svelte';
	let { data } = $props();

	$effect(() => {
		$inspect(data);
	});
</script>

{#snippet postSnippet(
	itemType: ItemType,
	lang: AvailableLocales,
	category: string[],
	state: ItemStates,
	id: number
)}
	{@const src = PostData.getImageSrc(category[1])}
	{@const categoryTranslation = category[1] as keyof Translation['categories']}
	{@const typeTranslation = itemType as keyof Translation['posts']}
	{@const stateTranslation = state as keyof Translation['postStates']}
	<div
		dir={detectLocaleDirection(lang)}
		class="border-secondary bg-secondary/15 flex w-full flex-col gap-1 rounded-sm border-2 p-3"
	>
		<img alt="category" {src} class="aspect-square w-2/6 self-center object-cover object-center" />
		<div class="flex justify-between">
			<div class="flex flex-col">
				<span class="font-bold capitalize">{$svelteLL.posts.postType()}</span>
				<span>{$svelteLL.posts[typeTranslation]()}</span>
			</div>
			<div class="flex flex-col">
				<span class="font-bold capitalize">{$svelteLL.posts.itemCategory()}</span>
				<span>{$svelteLL.categories[categoryTranslation]()}</span>
			</div>
			<div class="flex flex-col">
				<span class="font-bold capitalize">{$svelteLL.posts.postState()}</span>
				<span>{$svelteLL.postStates[stateTranslation]()}</span>
			</div>
		</div>
		<Button class="flex gap-1" onclick={() => goto(`${postsPage}/more/${id}`)}>
			<MoreIcon />
			<span class="capitalize">{$svelteLL.posts.seeInfo()}</span>
		</Button>
	</div>
{/snippet}

<div class="flex w-full flex-grow flex-col gap-6 p-[2.5%]">
	<div class="mr:flex-col mr:items-start mr:gap-2 flex w-full items-center justify-between">
		<h1 class="text-primary capitalize">{$svelteLL.navbar.posts()}</h1>
		<Button
			onclick={() => goto(createPostPage)}
			variant="secondary"
			class="mr:w-full cursor-pointer"
		>
			<AddIcon variant="default" />
			<span class="capitalize">{$svelteLL.posts.newPost()}</span>
		</Button>
	</div>
	<div class="mr:grid-cols-1 grid w-full grid-cols-5 items-stretch gap-6">
		{#each data.foundItems as item}
			{@render postSnippet('found', item.lang, item.category, item.state, item.id)}
		{/each}
		{#each data.lostItems as item}
			{@render postSnippet('lost', item.lang, item.category, item.state, item.id)}
		{/each}
	</div>
</div>
