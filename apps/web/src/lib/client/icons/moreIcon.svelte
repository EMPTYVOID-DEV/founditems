<script lang="ts">
	import { cn } from '../utils.svelte';
	let {
		variant = 'primary',
		height = 24,
		width = 24
	}: { variant?: 'primary' | 'default' | 'ghost'; width?: number; height?: number } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
	><path
		class={cn({
			'fill-primary': variant === 'primary',
			'fill-foreground': variant === 'default',
			'fill-background': variant == 'ghost'
		})}
		d="M17 7H9q-.425 0-.712-.288T8 6t.288-.712T9 5h9q.425 0 .713.288T19 6v9q0 .425-.288.713T18 16t-.712-.288T17 15zm-5 5H4q-.425 0-.712-.288T3 11t.288-.712T4 10h9q.425 0 .713.288T14 11v9q0 .425-.288.713T13 21t-.712-.288T12 20z"
	/></svg
>
