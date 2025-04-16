<script>
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import BackButton from '@components/custom/other/backButton.svelte';
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<h2 class=" text-primary capitalize">{$svelteLL.posts.newPost()}</h2>
		<BackButton />
	</div>
	<p class="sm:text-small">{$svelteLL.posts.createDescription()}</p>
</div>
