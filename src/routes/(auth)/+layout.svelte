<script lang="ts">
	import '../../app.css';
	import { Toaster } from 'svelte-sonner';
	import '@fontsource/dm-sans';
	import '@fontsource/inter';
	let { children } = $props();
</script>

{@render children()}

<Toaster expand />
