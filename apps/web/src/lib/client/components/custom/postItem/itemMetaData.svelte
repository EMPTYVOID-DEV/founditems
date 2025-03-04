<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { Translation } from '@assets/i18n/i18n-types';
	import * as Select from '@components/shadcn/select/index.js';
	import { PostDataInstance } from './postData.svelte';
	import { getValidator, getMetaDataTextSchema } from '@shared/zod';
	import ReactiveInput from '../other/reactiveInput.svelte';
	import DatePicker from '../other/datePicker.svelte';
	const textValidator = getValidator(getMetaDataTextSchema());

	function formatDate(date: Date | null) {
		if (date) return date.toISOString();
		return '';
	}
</script>

{#snippet selectSnippet(options: string[], name: string)}
	{@const metaKey = name as keyof Translation['metaData']}
	<div class="flex flex-col">
		<span class="text-small capitalize">{$svelteLL.metaData[metaKey]()}</span>
		<Select.Root type="single" onValueChange={(val) => PostDataInstance.setMetaData(name, val)}>
			<Select.Trigger class="flex w-full max-w-lg items-center justify-between">
				{@const optionKey = PostDataInstance.getMetaData(
					name
				) as keyof Translation['selectOptions']}
				<span class="capitalize">{$svelteLL.selectOptions[optionKey]()}</span>
			</Select.Trigger>
			<Select.Content>
				{#each options as option}
					{@const translationKey = option as keyof Translation['selectOptions']}
					<Select.Item value={option} class="capitalize"
						>{$svelteLL.selectOptions[translationKey]()}</Select.Item
					>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>
{/snippet}

{#snippet textSnippet(name: string)}
	{@const translationKey = name as keyof Translation['metaData']}
	<ReactiveInput
		maxSize="lg"
		label={$svelteLL.metaData[translationKey]()}
		validator={textValidator}
		oninput={(e) => PostDataInstance.setMetaData(name, e.currentTarget.value)}
	/>
{/snippet}

{#snippet dateSnippet(name: string)}
	{@const translationKey = name as keyof Translation['metaData']}
	<div class="flex flex-col gap-1">
		<span>{$svelteLL.metaData[translationKey]()}</span>
		<DatePicker setDate={(val) => PostDataInstance.setMetaData(name, formatDate(val))} />
	</div>
{/snippet}

<div class="flex w-full flex-col gap-2 empty:hidden">
	{#each PostDataInstance.metaDataDescOptions as metaDataObject}
		{#if metaDataObject.options}
			{@render selectSnippet(metaDataObject.options, metaDataObject.name)}
		{:else if metaDataObject.type == 'text'}
			{@render textSnippet(metaDataObject.name)}
		{:else}
			{@render dateSnippet(metaDataObject.name)}
		{/if}
	{/each}
</div>
