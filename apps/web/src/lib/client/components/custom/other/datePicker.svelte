<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { Button } from '@components/shadcn/button/index';
	import { Calendar } from '@components/shadcn/calendar/index';
	import * as Popover from '@components/shadcn/popover/index';
	import { svelteLL, svelteUsedLocale } from '@assets/i18n/i18n-svelte';

	let { setDateValue }: { setDateValue: (dateValue: DateValue) => void } = $props();

	let dateValue = $state<DateValue | undefined>(undefined);

	const df = new DateFormatter($svelteUsedLocale, { dateStyle: 'long' });

	function onValueChange(value: DateValue | undefined) {
		if (!value) return;
		dateValue = value;
	}

	$effect(() => {
		if (dateValue) setDateValue(dateValue);
	});
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-full max-w-lg justify-start text-left font-normal"
				{...props}
			>
				<CalendarIcon class="mr-2 size-4" />
				{dateValue
					? df.format(dateValue.toDate(getLocalTimeZone()))
					: $svelteLL.general.selectDate()}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<Calendar
			type="single"
			initialFocus
			locale={$svelteUsedLocale}
			value={dateValue}
			{onValueChange}
		/>
	</Popover.Content>
</Popover.Root>
