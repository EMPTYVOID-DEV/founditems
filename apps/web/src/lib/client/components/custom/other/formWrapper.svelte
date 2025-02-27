<script lang="ts">
	import { enhance } from '$app/forms';
	import { cn } from '@client/utils.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	let {
		action = async () => {},
		actionName,
		mainSnippet: Main,
		submitterSnippet: Submitter,
		submitterClass,
		formClass,
		mainClass
	}: {
		submitterClass?: string;
		formClass?: string;
		mainClass?: string;
		action?: SubmitFunction;
		actionName: string;
		mainSnippet: Snippet;
		submitterSnippet: Snippet;
	} = $props();
</script>

<form
	use:enhance={action}
	action={actionName}
	class={cn('border-secondary bg-secondary/15 flex w-full flex-col rounded-md border-2', formClass)}
	enctype="multipart/form-data"
	method="post"
>
	<div class={cn('flex w-full flex-col gap-2 px-4 py-3', mainClass)}>
		{@render Main()}
	</div>
	<div
		class={cn(
			'border-secondary flex w-full items-center justify-between border-t-2 px-4 py-3',
			submitterClass
		)}
	>
		{@render Submitter()}
	</div>
</form>
