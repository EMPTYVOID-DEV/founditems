<script lang="ts">
	import { showToast } from '@client/utils.svelte';
	import CloseIconV2 from '@icons/closeIconV2.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { Validator } from '@shared/types';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		validator,
		files: uploadedFiles = $bindable(),
		maxFiles,
		...restProps
	}: {
		validator: Validator;
		maxFiles: number;
		files: File[];
	} & WithElementRef<HTMLInputAttributes> = $props();

	function handleFiles(files: FileList) {
		if (files.length == 0) return;

		if (uploadedFiles.length + files.length > maxFiles) {
			return showToast(
				$svelteLL.general.error(),
				$svelteLL.validation.maxFilesNumber(maxFiles),
				'error'
			);
		}

		for (const file of files) {
			const fileValidation = validator(file);
			if (fileValidation.status == 'invalid')
				return showToast($svelteLL.general.error(), fileValidation.errorMsg, 'error');
		}

		for (let i = 0; i < files.length; i++) uploadedFiles.push(files[i]);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer?.files) {
			handleFiles(event.dataTransfer.files);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function handleInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			handleFiles(input.files);
		}
	}
	function limitFileName(filename: string) {
		return filename.slice(0, 20) + (filename.length > 20 ? '...' : '');
	}
	function removeFile(index: number) {
		uploadedFiles.splice(index, 1);
	}
</script>

{#snippet fileSnippet(filename: string, index: number)}
	<div
		class="border-secondary bg-secondary/30 flex items-center gap-2 rounded-lg border-2 px-3 py-1"
		dir="ltr"
	>
		<span class="text-small" dir="ltr">{limitFileName(filename)}</span>
		<button class="contents" type="button" onclick={() => removeFile(index)}
			><CloseIconV2 classname="fill-foreground" /></button
		>
	</div>
{/snippet}

<div class="border-input flex w-full flex-col rounded-lg border-2 border-dashed bg-transparent p-3">
	<label
		for="file"
		class=" text-muted-foreground w-full cursor-pointer text-center"
		ondrop={handleDrop}
		ondragover={handleDragOver}
	>
		{$svelteLL.general.upload()}
	</label>
	<div class="mt-2 flex flex-wrap justify-center gap-2 empty:hidden">
		{#each uploadedFiles as file, idx}
			{@render fileSnippet(file.name, idx)}
		{/each}
	</div>
</div>

<input id="file" type="file" multiple class="hidden" onchange={handleInputChange} {...restProps} />
