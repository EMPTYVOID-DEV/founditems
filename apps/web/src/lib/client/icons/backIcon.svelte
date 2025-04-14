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
	><path
		class={classname}
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="m9 11l-4 4l4 4m-4-4h11a4 4 0 0 0 0-8h-1"
	/></svg
>
