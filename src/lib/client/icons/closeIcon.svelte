<script lang="ts">
	import { cn } from '../utils.svelte';
	let { variant = 'primary' }: { variant?: 'primary' | 'default' } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 24 24"
	><g
		class={cn({
			'stroke-primary': variant === 'primary',
			'stroke-foreground': variant === 'default'
		})}
		fill="none"
		stroke-linecap="round"
		stroke-width="2"
		><path d="M5 5L19 5"
			><animate
				fill="freeze"
				attributeName="d"
				begin="0.2s"
				dur="0.4s"
				values="M5 5L19 5;M5 5L19 19"
			></animate></path
		><path d="M5 12H19"
			><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 12H19;M12 12H12"
			></animate><set attributeName="opacity" begin="0.4s" to="0"></set></path
		><path d="M5 19L19 19"
			><animate
				fill="freeze"
				attributeName="d"
				begin="0.2s"
				dur="0.4s"
				values="M5 19L19 19;M5 19L19 5"
			></animate></path
		></g
	></svg
>
