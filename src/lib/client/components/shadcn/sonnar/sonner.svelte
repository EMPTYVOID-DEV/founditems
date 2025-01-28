<script lang="ts">
	import { cn } from '@client/utils';

	let {
		message,
		state,
		title
	}: { title: string; message: string; state: 'error' | 'info' | 'success' } = $props();

	const stateClasses = {
		error: {
			toast: 'bg-destructive/70 border-destructive',
			text: 'text-destructive-foreground'
		},
		info: {
			toast: 'bg-primary/70 border-primary',
			text: 'text-primary-foreground'
		},
		success: {
			toast: 'bg-success/70 border-success',
			text: 'text-success-foreground'
		}
	};

	const currentState = stateClasses[state];
</script>

<div
	class={cn(
		'gap-i2 relative flex w-[var(--width)] flex-col rounded-lg border-2 p-2',
		currentState.toast
	)}
>
	<span class={cn('font-semibold', currentState.text)}>{title}</span>
	<span class={currentState.text}>{message}</span>
</div>
