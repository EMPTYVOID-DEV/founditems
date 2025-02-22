<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import * as Select from '@components/shadcn/select/index.js';
	import { transports, type RawAddress, type Transports } from 'utils';
	import SearchAddress from './searchAddress.svelte';

	let {
		setTransport
	}: {
		setTransport: (transport: Transports, start: RawAddress | null, end: RawAddress | null) => void;
	} = $props();

	let selected = $state(transports[0]);
	let transportStart = $state<RawAddress | null>(null);
	let transportEnd = $state<RawAddress | null>(null);

	$effect(() => {
		setTransport(selected, transportStart, transportEnd);
	});
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-col gap-1">
		<span class="text-small">{$svelteLL.general.transportMethod()}</span>
		<Select.Root type="single" bind:value={selected}>
			<Select.Trigger class="flex w-full max-w-lg items-center justify-between">
				<span class="capitalize">{$svelteLL.transports[selected]()}</span>
			</Select.Trigger>
			<Select.Content>
				{#each transports as transport}
					<Select.Item value={transport} class="capitalize"
						>{$svelteLL.transports[transport]()}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex flex-col gap-1">
		<span class="text-small">{$svelteLL.posts.transportStart()}</span>
		<SearchAddress setRawAddress={(val) => (transportStart = val)} />
	</div>

	<div class="flex flex-col gap-1">
		<span class="text-small">{$svelteLL.posts.transportEnd()}</span>
		<SearchAddress setRawAddress={(val) => (transportEnd = val)} />
	</div>
</div>
