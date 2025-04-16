<script>
	import BackIcon from '@icons/backIcon.svelte';
</script>

<button
	class="border-primary hover:bg-primary/25 flex aspect-square w-11 items-center justify-center rounded-[50%] border-2 bg-transparent"
	onclick={() => window.history.back()}><BackIcon classname="stroke-foreground" /></button
>
