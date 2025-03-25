<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import AddIcon from '@icons/addIcon.svelte';
	import { createPostPage, postsPage } from '@shared/const';
	import { svelteLL, svelteUsedLocale } from '@assets/i18n/i18n-svelte';
	import type { ItemType } from 'utils';
	import { type ItemStates } from 'utils';
	import { PostData } from '@components/custom/postItem';
	import type { Translation } from '@assets/i18n/i18n-types.js';
	import MoreIcon from '@icons/moreIcon.svelte';
	import { cn } from '@client/utils.svelte.js';
	let { data } = $props();
</script>

{#snippet postSnippet(itemType: ItemType, category: string[], state: ItemStates, id: number)}
	{@const src = PostData.getImageSrc(category[1])}
	{@const categoryTranslation = category[1] as keyof Translation['categories']}
	{@const typeTranslation = itemType as keyof Translation['posts']}
	{@const stateTranslation = state as keyof Translation['postStates']}
	<div class="border-secondary bg-secondary/15 flex items-center gap-4 rounded-sm border-2 p-2">
		<img alt="category" {src} class="aspect-square w-10 object-cover object-center" />
		<div class="flex flex-col">
			<span class="font-bold capitalize">{$svelteLL.general.postType()}</span>
			<span>{$svelteLL.posts[typeTranslation]()}</span>
		</div>
		<div class="flex flex-col">
			<span class="font-bold capitalize">{$svelteLL.general.postState()}</span>
			<span>{$svelteLL.postStates[stateTranslation]()}</span>
		</div>
		<div class="flex flex-col">
			<span class="font-bold capitalize">{$svelteLL.general.itemCategory()}</span>
			<span class="line-clamp-1">{$svelteLL.categories[categoryTranslation]()}</span>
		</div>
		<Button
			class={cn({
				'ml-auto': $svelteUsedLocale != 'ar',
				'mr-auto': $svelteUsedLocale == 'ar'
			})}
			onclick={() => goto(`${postsPage}/more/${id}`)}
		>
			<MoreIcon variant="ghost" />
			<span class="text-small capitalize sm:hidden">{$svelteLL.general.seeInfo()}</span>
		</Button>
	</div>
{/snippet}

<div class="flex w-full flex-grow flex-col gap-6 p-[2.5%]">
	<div class="flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
		<h1 class="text-primary capitalize">{$svelteLL.navbar.posts()}</h1>
		<Button
			onclick={() => goto(createPostPage)}
			variant="secondary"
			class="cursor-pointer sm:w-full"
		>
			<AddIcon variant="default" />
			<span class="capitalize">{$svelteLL.posts.newPost()}</span>
		</Button>
	</div>
	<div class="flex flex-col gap-4">
		{#each data.posts as post}
			{@const itemType = post.isFound ? 'found' : 'lost'}
			{@render postSnippet(itemType, post.category, post.state, post.id)}
		{/each}
	</div>
</div>
