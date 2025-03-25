<script lang="ts">
	import { goto } from '$app/navigation';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import BackIcon from '@icons/backIcon.svelte';
	import { postsPage } from '@shared/const';

	let { src }: { src: string } = $props();
</script>

<div class="flex items-center justify-between">
	<h2 class="text-primary capitalize">{$svelteLL.posts.postInformation()}</h2>
	<button
		class="border-primary hover:bg-primary/25 flex aspect-square w-11 items-center justify-center rounded-[50%] border-2 bg-transparent"
		onclick={() => goto(postsPage)}><BackIcon /></button
	>
</div>

<div
	class="border-secondary bg-secondary/25 flex aspect-square w-1/6 items-center justify-center self-center rounded-[50%] border-2 p-4 sm:w-1/4"
>
	<img alt="category" {src} class="object-cover object-center" />
</div>
