<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { Translation } from '@assets/i18n/i18n-types';
	import BackIcon from '@icons/backIcon.svelte';
	import { PostData, PostDataInstance } from './postData.svelte';
	import { cn } from '@client/utils.svelte';

	function increaselvl(lvlValue: string) {
		if (lvl == 2) return;
		lvl++;
		PostDataInstance.pushToCategory(lvlValue);
		if (lvl == 1) categoryOptions = PostData.getSecondLvl(lvlValue);
		else PostDataInstance.setMetaDataDesc(lvlValue);
	}

	function resetlvl() {
		categoryOptions = PostData.getLvl1Keys();
		PostDataInstance.resetPostData();
		lvl = 0;
	}

	let lvl = $state(0);
	let categoryOptions = $state(PostData.getLvl1Keys());
</script>

{#snippet categorySnippet(lvl: string)}
	{@const translationKey = lvl as keyof Translation['categories']}
	{@const src = `/categories/${PostData.getImageName(lvl)}`}
	<button
		class="border-secondary bg-secondary/25 flex aspect-square w-[10rem] flex-col items-center justify-center gap-2 rounded-sm border-2 p-2"
		onclick={() => increaselvl(lvl)}
	>
		<img alt="category" {src} class="aspect-square w-3/5 object-cover object-center" />
		<span class="text-small text-center capitalize">{$svelteLL.categories[translationKey]()}</span>
	</button>
{/snippet}

<div
	class={cn('mr:grid-cols-2 grid w-fit grid-cols-5 gap-2', {
		'grid-cols-3': categoryOptions.length == 3
	})}
>
	{#if lvl > 0}
		<button
			class="border-primary bg-primary/25 flex aspect-square w-[10rem] flex-col items-center justify-center gap-2 rounded-md border-2"
			onclick={resetlvl}
		>
			<span class="text-small capitalize">{$svelteLL.posts.returnCategories()}</span>
			<BackIcon width={48} height={48} />
		</button>
	{/if}
	{#if lvl < 2}
		{#each categoryOptions as categoryOption}
			{@render categorySnippet(categoryOption)}
		{/each}
	{/if}

	{#if lvl == 2}
		{@render categorySnippet(PostDataInstance.category.at(-1)!)}
	{/if}
</div>
