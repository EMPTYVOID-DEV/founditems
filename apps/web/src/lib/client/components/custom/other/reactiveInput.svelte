<script lang="ts">
	import type { Validator } from '@shared/types';
	import Input from '@components/shadcn/input/input.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '@client/utils.svelte';

	let {
		validator,
		label,
		value = $bindable(),
		oninput,
		class: className,
		...restProps
	}: {
		validator: Validator;
		label?: string;
	} & WithElementRef<HTMLInputAttributes> = $props();

	let errorMsg = $state('');
	let status = $state<'valid' | 'invalid' | 'idle'>('idle');

	function onblur() {
		const result = validator(value);
		status = result.status;
		errorMsg = result.errorMsg;
	}

	function onfocus() {
		status = 'idle';
		errorMsg = '';
	}
</script>

<div class="flex w-full flex-col gap-1">
	<label for="password" class="text-small capitalize empty:hidden">{label}</label>
	<Input
		bind:value
		{onblur}
		{onfocus}
		{oninput}
		class={cn(
			'bg-background/40',
			{
				'border-destructive': status === 'invalid'
			},
			className
		)}
		{...restProps}
	/>
	{#if status === 'invalid'}
		<span class="text-destructive">{errorMsg}</span>
	{/if}
</div>
