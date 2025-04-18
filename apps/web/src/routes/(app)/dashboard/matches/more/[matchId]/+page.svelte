<script lang="ts">
	import Header from '@containers/moreMatch/header.svelte';
	import IdleFound from '@containers/moreMatch/idleFound.svelte';
	import IdleLost from '@containers/moreMatch/idleLost.svelte';
	import ValidatedFound from '@containers/moreMatch/validatedFound.svelte';
	import ValidatedLost from '@containers/moreMatch/validatedLost.svelte';
	import type { UserContact } from '@shared/types.js';
	import type { User, Item } from 'db';
	import type { MatchStates } from 'utils';

	type MatchContext = {
		state: MatchStates;
		isFound: boolean;
		finderContact?: UserContact;
		victimContact?: UserContact;
		lostItem?: Item | undefined;
	};

	let { data } = $props();
	let ctx = $derived<MatchContext>(data.ctx);
</script>

<div class="flex w-full flex-grow flex-col gap-8 p-[2.5%]">
	<Header />
	{#if !ctx.isFound && ctx.state == 'idle'}
		<IdleLost />
	{:else if !ctx.isFound && ctx.state == 'validated'}
		<ValidatedLost finderContact={ctx.finderContact!} />
	{:else if ctx.isFound && ctx.state == 'idle'}
		<IdleFound lostItem={ctx.lostItem!} />
	{:else}
		<ValidatedFound victimContact={ctx.victimContact!} />
	{/if}
</div>
