<script lang="ts">
	import LL, { locale } from '$lib/client/i18n/i18n-svelte';
	import { setLang, setLangCookie } from '$lib/client/utils';
	import type { Languages } from '$lib/shared/types';
	import { availableLocales } from '@client/consts';
	import * as Select from '@components/shadcn/select/index.js';
	let selected = $state<Languages>($locale);
	const languages = availableLocales.map((v) => ({ value: v, label: v }));
	const triggerContent = $derived(
		languages.find((lang) => lang.value === selected)?.label ?? $LL.navbar.selectLanguage()
	);
	function onValueChange() {
		setLang(selected);
		setLangCookie(selected);
	}
</script>

<Select.Root type="single" {onValueChange} bind:value={selected}>
	<Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
	<Select.Content>
		{#each languages as { value, label }}
			<Select.Item {value}>{label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
