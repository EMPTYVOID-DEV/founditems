<script>
	import { goto } from '$app/navigation';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import BackIcon from '@icons/backIcon.svelte';
	import { postsPage } from '@shared/const';
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<h1 class=" text-primary capitalize">{$svelteLL.posts.newPost()}</h1>
		<button
			class="border-primary hover:bg-primary/25 flex aspect-square w-11 items-center justify-center rounded-[50%] border-2 bg-transparent"
			onclick={() => goto(postsPage)}><BackIcon classname="stroke-foreground" /></button
		>
	</div>
	<p class="sm:text-small">{$svelteLL.posts.createDescription()}</p>
</div>
