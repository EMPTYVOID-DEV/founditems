<script lang="ts">
	import { ItemCategory, ItemMetaData, PostDataInstance } from '@components/custom/postItem';
	import Header from './components/header.svelte';
	import type { ItemType } from 'utils';
	import ItemTypeComponent from './components/itemType.svelte';
	import Footer from './components/footer.svelte';
	import Button from '@components/shadcn/button/button.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { goto } from '$app/navigation';
	import { postsPage } from '@shared/const';
	import type { SubmitFunctionAfter, SubmitFunctionBefore } from '@client/types';
	import { actionLoadingWrapper } from '@client/utils.svelte';
	import { showToast } from '@client/utils.svelte';
	import { enhance } from '$app/forms';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import ItemDate from './components/itemDate.svelte';
	import type { ItemAddress, Nullable } from 'utils';
	import ItemAddressComponent from './components/itemAddress.svelte';

	let itemType = $state<ItemType>('found');
	let fullDescription = $state('');
	let files = $state<File[]>([]);
	let itemDate = $state<null | Date>(null);
	let itemAddress = $state<Nullable<ItemAddress[number]>[]>([{ type: 'general', address: null }]);

	let beforeAction: SubmitFunctionBefore = ({ formData }) => {
		formData.append('address', JSON.stringify(itemAddress));
		formData.append('date', itemDate ? itemDate.toISOString() : '');
		formData.append('type', itemType);
		formData.append('metaData', JSON.stringify(PostDataInstance.metaData));
		formData.append('description', fullDescription);
		for (let lvl of PostDataInstance.category) formData.append('category', lvl);
		for (let file of files) formData.append('files', file);
	};

	let afterAction: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		if (result.type == 'redirect') PostDataInstance.resetPostData();
		update();
	};

	let { action, loading } = actionLoadingWrapper({ after: afterAction, before: beforeAction });

	$effect(() => {
		return () => {
			PostDataInstance.resetPostData();
		};
	});
</script>

<div class="flex w-full flex-grow flex-col gap-4 p-[2.5%]">
	<Header />
	<ItemTypeComponent setType={(type) => (itemType = type)} />
	<ItemDate {itemType} setDate={(date) => (itemDate = date)} />
	<ItemAddressComponent bind:itemAddress {itemType} />
	<ItemCategory />
	<ItemMetaData />
	<Footer bind:files setFullDescription={(desc) => (fullDescription = desc)} />
	<div class="flex gap-4">
		<Button size="lg" class="w-fit" variant="outline" onclick={() => goto(postsPage)}
			>{$svelteLL.general.cancel()}</Button
		>
		<form action="?/create" method="post" enctype="multipart/form-data" use:enhance={action}>
			<ActionButton size="lg" class="w-fit" loading={loading.value}
				>{$svelteLL.general.confirm()}</ActionButton
			>
		</form>
	</div>
</div>
