<script lang="ts">
	import { cn } from '../utils.svelte';
	let {
		variant = 'primary',
		height = 24,
		width = 24
	}: { variant?: 'primary' | 'default'; width?: number; height?: number } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
	><path
		class={cn({
			'fill-primary': variant == 'primary',
			'fill-foreground': variant == 'default'
		})}
		d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
	/></svg
>
