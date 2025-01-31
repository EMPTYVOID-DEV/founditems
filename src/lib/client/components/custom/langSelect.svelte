<script lang="ts">
	import { svelteLL, usedLocale } from '@shared/i18n/i18n';
	import { setClientLocale } from '$lib/client/utils';
	import { availableLocales } from '@shared/const';
	import * as Select from '@components/shadcn/select/index.js';
	import type { Locales } from '@shared/i18n/i18n-types';
	let selected = $state<Locales>(usedLocale);
	const languages = availableLocales.map((v) => ({ value: v, label: v }));
	function onValueChange() {
		setClientLocale(selected);
	}
</script>

<Select.Root type="single" {onValueChange} bind:value={selected}>
	<Select.Trigger class="w-[180px]">
		{$svelteLL.general.select()} {$svelteLL.general.language()}</Select.Trigger
	>
	<Select.Content>
		{#each languages as { value, label }}
			<Select.Item {value}>{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
