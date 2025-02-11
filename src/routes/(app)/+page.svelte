<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { authPage, postsPage } from '@shared/const.js';
	let { data } = $props();
</script>

<div class="flex w-full flex-grow flex-col items-center justify-center gap-4">
	<h1 class="text-balance text-center text-primary">{$svelteLL.home.title()}</h1>
	<p class="w-3/4 text-balance text-center font-bold text-muted-foreground mr:w-full">
		{$svelteLL.home.description()}
	</p>
	<Button
		variant="secondary"
		size="lg"
		onclick={() => {
			if (data.user) goto(postsPage);
			else goto(authPage);
		}}>{$svelteLL.home.findYourThings()}</Button
	>
</div>
