<script lang="ts">
	import { cn } from '../utils.svelte';
	let {
		variant = 'primary',
		height = 24,
		width = 24
	}: {
		variant?: 'primary' | 'default' | 'destructive';
		width?: number;
		height?: number;
	} = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
	><path
		class={cn({
			'fill-primary': variant === 'primary',
			'fill-foreground': variant === 'default',
			'fill-destructive': variant === 'destructive'
		})}
		d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
	/></svg
>
