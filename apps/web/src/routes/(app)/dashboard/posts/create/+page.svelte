<script lang="ts">
	import { ItemCategory, ItemMetaData, PostDataInstance } from '@components/custom/postItem';
	import Header from './components/header.svelte';
	import type { ItemType } from '@shared/types';
	import ItemTypeComponent from './components/itemType.svelte';
	import type { ItemDate } from 'utils';
	import AddressDate from './components/addressDate.svelte';
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

	let itemType = $state<ItemType>('found');
	let itemDate: ItemDate = $state({ date: '', section: 1 });
	let address = $state('');
	let fullDescription = $state('');
	let files = $state<File[]>([]);

	let beforeAction: SubmitFunctionBefore = ({ formData }) => {
		formData.append('address', address);
		formData.append('date', itemDate.date);
		formData.append('section', itemDate.section.toString());
		formData.append('type', itemType);
		for (let lvl of PostDataInstance.category) formData.append('category', lvl);
		formData.append('metaData', JSON.stringify(PostDataInstance.metaData));
		if (itemType == 'lost') {
			formData.append('description', fullDescription);
			for (let file of files) formData.append('files', file);
		}
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

<div class="flex w-full flex-grow flex-col gap-8 p-[2.5%]">
	<Header />
	<ItemTypeComponent setType={(type) => (itemType = type)} />
	<AddressDate
		{itemType}
		setAddress={(val) => (address = val)}
		setSection={(section) => (itemDate.section = section)}
		setDate={(date) => (itemDate.date = date)}
	/>
	<ItemCategory />
	<ItemMetaData />
	{#if itemType == 'lost'}
		<Footer bind:files setFullDescription={(desc) => (fullDescription = desc)} />
	{/if}
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
