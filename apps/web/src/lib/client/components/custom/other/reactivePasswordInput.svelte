<script lang="ts">
	import type { Validator } from '@shared/types';
	import Input from '@components/shadcn/input/input.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { cn } from '@client/utils.svelte';
	import HideIcon from '@icons/hideIcon.svelte';
	import ShowIcon from '@icons/showIcon.svelte';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = {
		validator: Validator;
		label?: string;
	} & WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
	>;

	let {
		validator,
		label,
		value = $bindable(),
		oninput,
		class: className,
		...restProps
	}: Props = $props();

	let errorMsg = $state('');
	let status = $state<'valid' | 'invalid' | 'idle'>('idle');
	let showPassword = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

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
	<div class="relative">
		<Input
			bind:value
			{onblur}
			{onfocus}
			{oninput}
			class={cn(
				'bg-background/40 pr-10',
				{
					'border-destructive': status === 'invalid'
				},
				className
			)}
			type={showPassword ? 'text' : 'password'}
			{...restProps}
		/>
		<button
			type="button"
			class="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2"
			onclick={() => togglePasswordVisibility()}
		>
			{#if showPassword}
				<HideIcon classname="fill-foreground" />
			{:else}
				<ShowIcon classname="fill-foreground" />
			{/if}
		</button>
	</div>
	{#if status === 'invalid'}
		<span class="text-destructive">{errorMsg}</span>
	{/if}
</div>
