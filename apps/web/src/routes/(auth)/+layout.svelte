<script lang="ts">
	import '../../app.css';
	import { Toaster } from 'svelte-sonner';
	import { svelteUsedLocale } from '@assets/i18n/i18n-svelte';
	import { detectLocaleDirection } from '@shared/utils';
	import '@fontsource/dm-sans';
	import '@fontsource/inter';
	let { children } = $props();
</script>

{@render children()}

<Toaster
	expand
	position={detectLocaleDirection($svelteUsedLocale) == 'rtl' ? 'bottom-left' : 'bottom-right'}
/>
