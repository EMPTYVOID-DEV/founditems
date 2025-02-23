<script lang="ts">
	import { svelteUsedLocale } from '@assets/i18n/i18n-svelte';
	import { setClientLocale } from '@client/utils.svelte';
	import * as Select from '@components/shadcn/select/index.js';
	import type { Locales } from '@assets/i18n/i18n-types';
	import GlobeIcon from '@icons/globeIcon.svelte';
	import { availableLocales } from 'utils';
	let selected = $state<Locales>($svelteUsedLocale);
	const languages = availableLocales.map((v) => ({ value: v, label: v }));
	function onValueChange() {
		setClientLocale(selected);
	}
</script>

<Select.Root type="single" {onValueChange} bind:value={selected}>
	<Select.Trigger class="flex w-[120px] items-center justify-between">
		<GlobeIcon />
		<span class="capitalize">{selected}</span>
	</Select.Trigger>
	<Select.Content>
		{#each languages as { value, label }}
			<Select.Item {value} class="capitalize">{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
