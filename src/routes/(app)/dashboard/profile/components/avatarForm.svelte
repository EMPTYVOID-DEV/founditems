<script lang="ts">
	import { fileToBlob, showToast } from '@client/utils.svelte';
	import FileUpload from '@components/custom/fileUpload.svelte';
	import FormWrapper from '@components/custom/formWrapper.svelte';
	import { Button } from '@components/shadcn/button';
	import { svelteLL } from '@shared/i18n/i18n-svelte';
	import { getValidator, getImageSchema } from '@shared/zod';
	import type { SubmitFunction } from '@sveltejs/kit';

	let files = $state<File[]>([]);
	const avatarValidator = getValidator(getImageSchema());
	const avatarAction: SubmitFunction = async ({ formData }) => {
		if (files.length == 0) return;
		formData.append('avatar', fileToBlob(files[0]));
		return ({ result, update }) => {
			if (result.type == 'success')
				showToast(
					$svelteLL.general.success(),
					$svelteLL.profile.fullnameChangeSuccess(),
					'success'
				);
			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast($svelteLL.general.error(), result.data.message, 'error');
			files = [];
			update();
		};
	};
</script>

<FormWrapper action={avatarAction} actionName="?/avatar" formClass="w-[80%] mr:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.avatar()}</h4>
		<p>{$svelteLL.profile.avatarChange()}</p>
		<FileUpload accept="image/*" validator={avatarValidator} maxFiles={1} bind:files />
	{/snippet}
	{#snippet submitterSnippet()}
		<Button type="submit">{$svelteLL.general.confirm()}</Button>
	{/snippet}
</FormWrapper>
