<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@assets/i18n/i18n-svelte.js';
	import type { SubmitFunctionAfter } from '@client/types.js';
	import { actionLoadingWrapper } from '@client/utils.svelte.js';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import { PostData } from '@components/custom/postItem/postData.svelte.js';
	import BinIcon from '@icons/binIcon.svelte';
	import Header from './containers/header.svelte';
	import Body from './containers/body.svelte';
	import Footer from './containers/footer.svelte';
	import Extra from './containers/extra.svelte';

	const { data } = $props();
	const item = data.item;
	const src = PostData.getImageSrc(item.category[1]);
	const afterAction: SubmitFunctionAfter = ({ update }) => {
		update();
	};
	const { action, loading } = actionLoadingWrapper({ after: afterAction });
</script>

<div class="flex w-full flex-grow flex-col gap-6 p-[2.5%]">
	<Header {src} />
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
			<BinIcon variant="ghost" />
			<span class="capitalize">{$svelteLL.posts.releasePost()}</span>
		</ActionButton>
	</form>
</div>
