<script lang="ts">
	import { cn } from '@client/utils';
	import LogoIcon from '@icons/logoIcon.svelte';
	let { class: className }: { class?: string } = $props();
</script>

<a href="/" class={cn('cursor-pointer', className)}>
	<LogoIcon />
</a>
