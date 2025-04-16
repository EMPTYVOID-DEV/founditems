<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@assets/i18n/i18n-svelte.js';
	import type { SubmitFunctionAfter } from '@client/types.js';
	import { actionLoadingWrapper } from '@client/utils.svelte.js';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import BinIcon from '@icons/binIcon.svelte';
	import Header from '@containers/morePost/header.svelte';
	import Body from '@containers/morePost/body.svelte';
	import Footer from '@containers/morePost/footer.svelte';
	import Extra from '@containers/morePost/extra.svelte';

	const { data } = $props();
	const item = data.item;
	const afterAction: SubmitFunctionAfter = ({ update }) => {
		update();
	};
	const { action, loading } = actionLoadingWrapper({ after: afterAction });
</script>

<div class="flex w-full flex-grow flex-col gap-8 p-[2.5%]">
	<Header />
	<Body
		category={item.category}
		isFound={item.isFound}
		metadata={item.metadata}
		state={item.state}
	/>
	<Footer address={item.address} date={item.date} />
	<Extra description={item.description} images={item.images} />
	<form action="?/release" method="post" enctype="multipart/form-data" use:enhance={action}>
		<ActionButton variant="destructive" size="lg" class="w-fit" loading={loading.value}>
			<BinIcon classname="fill-destructive-foreground" />
			<span class="capitalize">{$svelteLL.posts.releasePost()}</span>
		</ActionButton>
	</form>
</div>
