<script lang="ts">
	import type { DateValue } from '@internationalized/date';
	import Date from './date.svelte';
	import Time from './time.svelte';

	let {
		dateValue = $bindable(undefined),
		hours = $bindable('00'),
		minutes = $bindable('00')
	}: { dateValue?: DateValue; hours?: string; minutes?: string } = $props();
</script>

<div class="mr: flex items-end gap-4 mr:flex-col mr:items-start">
	<Date {dateValue} />
	<Time {hours} {minutes} />
</div>
