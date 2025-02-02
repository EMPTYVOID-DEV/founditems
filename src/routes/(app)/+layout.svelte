<script lang="ts">
	import '../../app.css';
	import { Toaster } from 'svelte-sonner';
	import { svelteUsedLocale } from '@shared/i18n/i18n-svelte';
	import { detectLocaleDirection } from '@shared/utils';
	import '@fontsource/dm-sans';
	import '@fontsource/inter';
	import Navbar from '@components/custom/navbar.svelte';
	let { children, data } = $props();
	let position: 'bottom-left' | 'bottom-right' = $derived(
		detectLocaleDirection($svelteUsedLocale) == 'rtl' ? 'bottom-left' : 'bottom-right'
	);
</script>

{#key $svelteUsedLocale}
	<div class="flex h-fit min-h-svh w-svw pt-20">
		<Navbar user={data.user} />
		{@render children()}
	</div>
	<Toaster expand {position} />
{/key}
