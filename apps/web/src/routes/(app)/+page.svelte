<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { authPage, postsPage } from '@shared/const.js';
	let { data } = $props();
</script>

<div class="flex w-full flex-grow flex-col items-center justify-center gap-4">
	<h1 class="text-primary text-center capitalize">{$svelteLL.home.title()}</h1>
	<p class="text-muted-foreground max-w-xl text-center font-bold sm:w-full">
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
