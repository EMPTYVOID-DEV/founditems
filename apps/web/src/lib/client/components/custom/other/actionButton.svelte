<script lang="ts">
	import { Button, type ButtonProps } from '@components/shadcn/button/index';
	import LoadingIcon from '@icons/loadingIcon.svelte';

	let { loading, children, ...restProps }: { loading: boolean } & ButtonProps = $props();
</script>

<Button disabled={loading} {...restProps} type="submit">
	{#if loading}
		<LoadingIcon classname1="fill-muted" classname2="fill-foreground/60" />
	{/if}
	{@render children?.()}
</Button>
