<script>
	import '../app.css';
	import '@fontsource/dm-sans';
	import '@fontsource/inter';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { page } from '$app/state';
	import Button from '@components/shadcn/button/button.svelte';
	import { goto } from '$app/navigation';

	let status = $derived(page.status);
	const errorMap = new Map([
		[400, $svelteLL.errors.badRequest()],
		[403, $svelteLL.errors.forbidden()],
		[404, $svelteLL.errors.notFound()],
		[500, $svelteLL.errors.internalServerError()],
		[503, $svelteLL.errors.serviceUnavailable()]
	]);
</script>

<div class="flex h-screen flex-col items-center justify-center gap-4 text-center">
	{#if errorMap.has(status)}
		<h1 class="text-destructive">{status}</h1>
		<h4 class="capitalize">{errorMap.get(status)}</h4>
	{:else}
		<h1 class="text-destructive">500</h1>
		<h4 class="capitalize">{$svelteLL.errors.internalServerError()}</h4>
	{/if}
	<Button variant="destructive" onclick={() => goto('/')}>Return to home</Button>
</div>
