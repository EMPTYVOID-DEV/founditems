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

{#snippet postSnippet(itemType: ItemType, category: string[], state: ItemStates, id: string)}
	{@const src = PostData.getImageSrc(category[1])}
	{@const typeTranslation = itemType as keyof Translation['posts']}
	{@const stateTranslation = state as keyof Translation['states']}
	<div
		class="border-foreground bg-foreground/15 flex flex-wrap items-center gap-4 rounded-md border-2 p-2"
	>
		<img alt="category" {src} class="aspect-square w-10 object-cover object-center" />
		<div class="flex flex-col">
			<span class="font-bold capitalize">{$svelteLL.general.postType()}</span>
			<span>{$svelteLL.posts[typeTranslation]()}</span>
		</div>
		<div class="flex flex-col">
			<span class="font-bold capitalize">{$svelteLL.general.postState()}</span>
			<span>{$svelteLL.states[stateTranslation]()}</span>
		</div>
		<Button
			class={cn('md:basis-full', {
				'ml-auto': $svelteUsedLocale != 'ar',
				'mr-auto': $svelteUsedLocale == 'ar'
			})}
			onclick={() => goto(`${postsPage}/more/${id}`)}
			variant="secondary"
		>
			<MoreIcon />
			<span>{$svelteLL.general.seeMore()}</span>
		</Button>
	</div>
{/snippet}

<div class="flex w-full flex-grow flex-col gap-6 p-[2.5%]">
	<div class="flex items-center justify-between sm:flex-col sm:items-start sm:gap-2">
		<h1 class="capitalize">{$svelteLL.navbar.posts()}</h1>
		<Button onclick={() => goto(createPostPage)} class="cursor-pointer sm:w-full">
			<AddIcon classname="fill-background" />
			<span class="capitalize">{$svelteLL.posts.newPost()}</span>
		</Button>
	</div>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
		{#each data.posts as post}
			{@const itemType = post.isFound ? 'found' : 'lost'}
			{@render postSnippet(itemType, post.category, post.state, post.id)}
		{/each}
	</div>
</div>
