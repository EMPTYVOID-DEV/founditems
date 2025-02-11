<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '@client/utils.svelte';
	import { Button } from '@components/shadcn/button/index';
	import { Calendar } from '@components/shadcn/calendar/index';
	import * as Popover from '@components/shadcn/popover/index';
	import { svelteLL, svelteUsedLocale } from '@assets/i18n/i18n-svelte';

	const df = new DateFormatter($svelteUsedLocale, { dateStyle: 'long' });

	let { dateValue = $bindable(undefined) }: { dateValue?: DateValue } = $props();
</script>

<Popover.Root>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class={cn(
					'w-[280px] justify-start text-left font-normal',
					!dateValue && 'text-muted-foreground'
				)}
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
		<Calendar bind:value={dateValue} type="single" initialFocus locale={$svelteUsedLocale} />
	</Popover.Content>
</Popover.Root>
