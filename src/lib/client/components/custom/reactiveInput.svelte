<script lang="ts">
	import type { Validator } from '@shared/types';
	import Input from '@components/shadcn/input/input.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '@client/utils';

	let {
		validator,
		label,
		value = $bindable(),
		oninput,
		class: className,
		...restProps
	}: { validator: Validator; label?: string } & WithElementRef<HTMLInputAttributes> = $props();

	let errorMsg = $state('');
	let status = $state<'valid' | 'invalid' | 'idle'>('idle');

	const statusClasses = {
		invalid: 'bg-destructive/40 border-destructive text-destructive-foreground',
		valid: 'bg-success/40 border-success text-success-foreground',
		idle: ''
	};

	function validate(e: Event & { currentTarget: HTMLInputElement }) {
		if (oninput) oninput(e);
		const result = validator(value);
		status = result.status;
		errorMsg = result.errorMsg;
	}
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<label for="password" class="empty:hidden">{label}</label>
	<Input
		bind:value
		oninput={validate}
		class={cn(statusClasses[status], className)}
		{...restProps}
	/>
	{#if status === 'invalid'}
		<span class="text-destructive">{errorMsg}</span>
	{/if}
</div>
