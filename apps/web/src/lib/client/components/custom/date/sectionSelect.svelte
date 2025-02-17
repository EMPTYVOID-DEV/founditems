<script lang="ts">
	import { daySectionsNumber } from 'utils';
	import * as Select from '@components/shadcn/select';
	import { svelteLL } from '@assets/i18n/i18n-svelte';

	let { setSection }: { setSection: (section: number) => void } = $props();

	let section = $state('1');

	function generateDaySectionOptions() {
		const daySectionHours = 24 / daySectionsNumber;
		let sectionStartHour = 1;
		let sectionEndHour = daySectionHours;
		let sectionIndex = 1;
		const daySections: { value: number; label: string }[] = [];

		while (sectionEndHour <= 24) {
			daySections.push({
				value: sectionIndex,
				label: `${sectionStartHour}h-${sectionEndHour}h`
			});
			sectionStartHour = sectionEndHour;
			sectionEndHour += daySectionHours;
			sectionIndex++;
		}

		return daySections;
	}

	function onValueChange(value: string) {
		section = value;
	}

	const daySectionOptions = generateDaySectionOptions();

	$effect(() => {
		setSection(parseInt(section));
	});
</script>

<Select.Root type="single" {onValueChange}>
	<Select.Trigger class="w-full max-w-sm">
		<span class="capitalize" dir="ltr">{$svelteLL.posts.daySection(section)}</span>
	</Select.Trigger>
	<Select.Content>
		{#each daySectionOptions as { value, label }}
			<Select.Item value={value.toString()}>{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
