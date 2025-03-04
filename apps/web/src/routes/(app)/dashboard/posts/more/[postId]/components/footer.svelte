<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { formatDate } from '@client/utils.svelte';
	import { Map, Timer } from 'lucide-svelte';
	import type { ItemAddress } from 'utils';
	let { date, address }: { date: Date; address: ItemAddress } = $props();
</script>

<div class="flex flex-col gap-1">
	<span class="flex items-center gap-1 font-bold capitalize">
		<Timer class="h-5 w-5" />
		{$svelteLL.general.date()}
	</span>
	<span>{formatDate(date)}</span>
</div>
<div class="flex flex-col gap-1">
	<span class="flex items-center gap-1 font-bold capitalize">
		<Map class="h-5 w-5" />
		{$svelteLL.general.address()}
	</span>
	{#each address as addressItem}
		{#if addressItem.type == 'general'}
			<div class="bg-secondary/25 border-secondary flex flex-col rounded-md border-2 p-3">
				<span class="font-medium">{addressItem.address.name}</span>
				<span class="text-muted-foreground text-small">
					{addressItem.address.latitude}, {addressItem.address.longtitude}
				</span>
			</div>
		{:else}
			<div class="border-secondary bg-secondary/15 flex flex-col rounded-md border-2 p-2">
				<span class="capitalize"
					>{$svelteLL.general.transport()}-{$svelteLL.transports[addressItem.method]()}</span
				>
				<div class=" mr:grid-cols-1 grid grid-cols-2 gap-2">
					<div class="flex flex-col">
						<span class="text-muted-foreground text-small capitalize">{$svelteLL.posts.from()}</span
						>
						<span class="font-medium">{addressItem.startAddress.name}</span>
					</div>
					<div class="flex flex-col">
						<span class="text-muted-foreground text-small capitalize">{$svelteLL.posts.to()}</span>
						<span class="font-medium">{addressItem.endAddress.name}</span>
					</div>
				</div>
			</div>
		{/if}
	{/each}
</div>
