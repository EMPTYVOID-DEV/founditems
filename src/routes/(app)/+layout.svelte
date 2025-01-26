<script lang="ts">
	import '../../app.css';
	import '@fontsource/dm-sans';
	import '@fontsource/inter';
	import Navbar from '@components/custom/navbar.svelte';
	let { children, data } = $props();
</script>

<div class="h-svh min-h-svh w-svw pt-20">
	<Navbar user={data.user} />
	{@render children()}
</div>
