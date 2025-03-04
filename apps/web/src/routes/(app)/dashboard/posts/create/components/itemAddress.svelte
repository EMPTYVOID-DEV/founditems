<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import * as Tabs from '@components/shadcn/tabs';
	import SearchAddress from '@components/custom/address/searchAddress.svelte';
	import Transport from '@components/custom/address/transport.svelte';
	import {
		type ItemAddress,
		type Nullable,
		type ItemAddressTypes,
		transports,
		itemAddressLength
	} from 'utils';
	import Button from '@components/shadcn/button/button.svelte';
	import type { ItemType } from 'utils';
	import CloseIconV2 from '@icons/closeIconV2.svelte';

	let {
		itemAddress = $bindable(),
		itemType
	}: { itemType: ItemType; itemAddress: Nullable<ItemAddress[number]>[] } = $props();

	let whereLost = $derived(
		itemType == 'found' ? $svelteLL.posts.whereYouFound() : $svelteLL.posts.whereYouLost()
	);

	function changeTab(index: number, tab: string) {
		const castedType = tab as ItemAddressTypes;
		if (castedType == 'general') itemAddress[index] = { type: 'general', address: null };
		else if (castedType == 'transport')
			itemAddress[index] = {
				type: 'transport',
				method: transports[0],
				endAddress: null,
				startAddress: null
			};
	}
	function pushAddress() {
		itemAddress.push({ type: 'general', address: null });
	}

	function removeAddress(index: number) {
		itemAddress.splice(index, 1);
	}
</script>

{#snippet addressHead(index: number)}
	{#if itemAddress.length > 1}
		<div class="flex w-full max-w-lg items-center justify-between">
			<span class="text-small">{$svelteLL.general.address()}-{index + 1}</span>
			<Button
				size="icon"
				class="hover:bg-transparent"
				variant="ghost"
				onclick={() => removeAddress(index)}
			>
				<CloseIconV2 variant="default" width={20} height={20} />
			</Button>
		</div>
	{/if}
{/snippet}

{#snippet addressSnippet(index: number)}
	<div class="flex w-full flex-col gap-1 capitalize">
		{@render addressHead(index)}
		<Tabs.Root
			value="general"
			class="w-full max-w-lg"
			onValueChange={(tab) => changeTab(index, tab)}
		>
			<Tabs.List>
				<Tabs.Trigger value="general" class="capitalize">{$svelteLL.general.address()}</Tabs.Trigger
				>
				<Tabs.Trigger value="transport" class="capitalize"
					>{$svelteLL.general.transport()}</Tabs.Trigger
				>
			</Tabs.List>
			<!-- Here we should reset -->
			{#key itemAddress[index]}
				<Tabs.Content value="general">
					<SearchAddress
						setRawAddress={(val) => {
							if (itemAddress[index].type == 'general') itemAddress[index].address = val;
						}}
					/>
				</Tabs.Content>
				<Tabs.Content value="transport">
					<Transport
						setTransport={(transport, start, end) => {
							if (itemAddress[index].type == 'transport') {
								itemAddress[index].method = transport;
								itemAddress[index].startAddress = start;
								itemAddress[index].endAddress = end;
							}
						}}
					/>
				</Tabs.Content>
			{/key}
		</Tabs.Root>
	</div>
{/snippet}

<div class="flex w-full flex-col items-start gap-3">
	<h4 class="capitalize">{whereLost}</h4>
	{#each itemAddress as _, idx}
		{@render addressSnippet(idx)}
	{/each}
	{#if itemAddress.length < itemAddressLength}
		<Button class="text-secondary p-0" variant="link" onclick={pushAddress}
			>{$svelteLL.posts.additionalAddress()}</Button
		>
	{/if}
</div>
