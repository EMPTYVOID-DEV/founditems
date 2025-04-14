<script lang="ts">
	let {
		height = 24,
		width = 24,
		classname = ''
	}: {
		classname?: string;
		width?: number;
		height?: number;
	} = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} viewBox="0 0 24 24"
	><g class={classname} fill="none" stroke-linecap="round" stroke-width="2"
		><path d="M5 5L19 19"
			><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 5L19 19;M5 5L19 5"
			></animate></path
		><path d="M12 12H12" opacity="0"
			><animate fill="freeze" attributeName="d" begin="0.2s" dur="0.4s" values="M12 12H12;M5 12H19"
			></animate><set attributeName="opacity" begin="0.2s" to="1"></set></path
		><path d="M5 19L19 5"
			><animate fill="freeze" attributeName="d" dur="0.4s" values="M5 19L19 5;M5 19L19 19"
			></animate></path
		></g
	></svg
>
