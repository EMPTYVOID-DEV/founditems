<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import LL from '@client/i18n/i18n-svelte.js';
	import { searchPage } from '@client/consts';
</script>

<div
	class="flex h-full w-svw flex-col items-center justify-center gap-4 bg-gradient-to-t from-primary/60 from-0% to-background to-60%"
>
	<h1 class="text-balance text-center text-primary">{$LL.home.title()}</h1>
	<p class="w-3/4 text-balance text-center font-bold text-muted-foreground mr:w-full">
		{$LL.home.description()}
	</p>
	<Button variant="secondary" onclick={() => goto(searchPage)}>{$LL.home.findYourThings()}</Button>
</div>
