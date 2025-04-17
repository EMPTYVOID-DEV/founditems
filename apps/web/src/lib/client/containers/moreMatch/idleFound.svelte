<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { SubmitFunctionAfter } from '@client/types';
	import { actionLoadingWrapper } from '@client/utils.svelte';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import Body from '@containers/morePost/body.svelte';
	import Extra from '@containers/morePost/extra.svelte';
	import Footer from '@containers/morePost/footer.svelte';
	import type { Item } from 'db';
	let { lostItem }: { lostItem: Item } = $props();
	const afterAction: SubmitFunctionAfter = ({ update }) => {
		update();
	};
	let { action: validateAction, loading: validateLoading } = actionLoadingWrapper({
		after: afterAction
	});
	let { action: rejectAction, loading: rejectLoading } = actionLoadingWrapper({
		after: afterAction
	});
</script>

<p>{$svelteLL.matches.idleFound()}</p>

<Body
	category={lostItem.category}
	isFound={lostItem.isFound}
	metadata={lostItem.metadata}
	state={lostItem.state}
/>
<Footer address={lostItem.address} date={lostItem.date} />
<Extra description={lostItem.description} images={lostItem.images} />

<div class="flex gap-4 sm:flex-col-reverse">
	<form action="?/reject" method="post" use:enhance={rejectAction}>
		<ActionButton variant="destructive" size="lg" class="w-full" loading={rejectLoading.value}>
			<span class="capitalize">{$svelteLL.matches.rejectMatch()}</span>
		</ActionButton>
	</form>
	<form action="?/validate" method="post" use:enhance={validateAction}>
		<ActionButton size="lg" class="w-full" loading={validateLoading.value}>
			<span class="capitalize">{$svelteLL.matches.validateMatch()}</span>
		</ActionButton>
	</form>
</div>
