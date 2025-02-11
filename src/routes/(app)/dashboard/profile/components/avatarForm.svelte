<script lang="ts">
	import type { SubmitFunctionBefore, SubmitFunctionAfter } from '@client/types';
	import { actionLoadingWrapper, fileToBlob, showToast } from '@client/utils.svelte';
	import ActionButton from '@components/custom/actionButton.svelte';
	import FileUpload from '@components/custom/fileUpload.svelte';
	import FormWrapper from '@components/custom/formWrapper.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { getValidator, getAvatarSchema } from '@shared/zod';

	let files = $state<File[]>([]);
	const avatarValidator = getValidator(getAvatarSchema());

	const avatarActionBefore: SubmitFunctionBefore = ({ formData }) => {
		if (files.length == 0) return;
		formData.append('avatar', fileToBlob(files[0]));
	};
	const avatarActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'success')
			showToast($svelteLL.general.success(), $svelteLL.profile.fullnameChangeSuccess(), 'success');
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		files = [];
		update();
	};
	const { action, loading } = actionLoadingWrapper({
		after: avatarActionAfter,
		before: avatarActionBefore
	});
</script>

<FormWrapper {action} actionName="?/avatar" formClass="w-[80%] mr:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.avatar()}</h4>
		<p>{$svelteLL.profile.avatarChange()}</p>
		<FileUpload accept="image/*" validator={avatarValidator} maxFiles={1} bind:files />
	{/snippet}
	{#snippet submitterSnippet()}
		<ActionButton loading={loading.value} type="submit">{$svelteLL.general.confirm()}</ActionButton>
	{/snippet}
</FormWrapper>
