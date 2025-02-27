<script lang="ts">
	import type { RawAddress } from 'utils';
	import { mapQueryApi } from '@shared/const';
	import Select from 'svelte-select';
	import { svelteLL } from '@assets/i18n/i18n-svelte';

	let { setRawAddress }: { setRawAddress: (rawAddress: RawAddress | null) => void } = $props();

	async function loadOptions(searchText: string) {
		if (!searchText) return;
		const query = `${mapQueryApi}/${searchText}`;
		const rawAddressOptions: RawAddress[] = await fetch(query).then((res) => res.json());
		return rawAddressOptions.map((val) => ({ value: val, label: val.name }));
	}
</script>

<Select
	class="w-full max-w-lg"
	containerStyles="border:1px solid hsl(var(--input));"
	placeholder={$svelteLL.general.searchAddress()}
	listOpen={false}
	{loadOptions}
	on:input={(e) => setRawAddress(e.detail.value)}
>
	<span slot="empty" class="hidden"></span>
</Select>
