<script lang="ts">
	import { goto } from '$app/navigation';
	import { svelteLL, svelteUsedLocale } from '@assets/i18n/i18n-svelte';
	import type { Translation } from '@assets/i18n/i18n-types.js';
	import { cn } from '@client/utils.svelte.js';
	import { PostData } from '@components/custom/postItem';
	import { Button } from '@components/shadcn/button';
	import MoreIcon from '@icons/moreIcon.svelte';
	import { matchesPage, postsPage } from '@shared/const';
	import type { MatchStates } from 'utils';
	let { data } = $props();
</script>

{#snippet matchSnippet(id: string, ownItemId: string, category: string[], state: MatchStates)}
	{@const src = PostData.getImageSrc(category[1])}
	{@const stateTranslation = state as keyof Translation['states']}
	<div
		class="border-foreground bg-foreground/15 flex flex-wrap items-center gap-4 rounded-md border-2 p-2"
	>
		<img alt="category" {src} class="aspect-square w-10 object-cover object-center" />
		<div class="flex flex-col">
			<span class="font-bold capitalize">{$svelteLL.general.postState()}</span>
			<span>{$svelteLL.states[stateTranslation]()}</span>
		</div>
		<Button
			class={cn('md:basis-full', {
				'ml-auto': $svelteUsedLocale != 'ar',
				'mr-auto': $svelteUsedLocale == 'ar'
			})}
			onclick={() => goto(`${postsPage}/more/${ownItemId}`)}
			variant="secondary"
		>
			{$svelteLL.matches.yourItem()}
		</Button>
		<Button class={cn('md:basis-full')} onclick={() => goto(`${matchesPage}/more/${id}`)}>
			<MoreIcon />
			<span>{$svelteLL.general.seeMore()}</span>
		</Button>
	</div>
{/snippet}

<div class="flex w-full flex-grow flex-col gap-6 p-[2.5%]">
	<h1 class="capitalize">{$svelteLL.navbar.matches()}</h1>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
		{#each data.matches as match}
			{@render matchSnippet(match.id, match.ownItemId, match.category, match.state)}
		{/each}
	</div>
</div>
