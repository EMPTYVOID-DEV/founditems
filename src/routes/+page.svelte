<script lang="ts">
	import Navbar from '@components/custom/navbar.svelte';
	let { data } = $props();
</script>

<div class="flex h-svh w-svw flex-col gap-1">
	<Navbar user={data.user} />
</div>
