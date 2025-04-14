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
		d="m20.37 8.91l-1 1.73l-12.13-7l1-1.73l3.04 1.75l1.36-.37l4.33 2.5l.37 1.37zM6 19V7h5.07L18 11v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2"
	/></svg
>
