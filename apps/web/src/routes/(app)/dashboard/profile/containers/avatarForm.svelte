<script lang="ts">
	import type { SubmitFunctionBefore, SubmitFunctionAfter } from '@client/types';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import FileUpload from '@components/custom/other/fileUpload.svelte';
	import FormWrapper from '@components/custom/other/formWrapper.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { getValidator, getImageSchema } from '@shared/zod';

	let files = $state<File[]>([]);
	const avatarValidator = getValidator(getImageSchema());

	const avatarActionBefore: SubmitFunctionBefore = ({ formData }) => {
		if (files.length == 0) return;
		formData.append('avatar', files[0]);
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

<FormWrapper {action} actionName="?/avatar" formClass="w-[80%] sm:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.avatar()}</h4>
		<p>{$svelteLL.profile.avatarChange()}</p>
		<FileUpload accept="image/*" validator={avatarValidator} maxFiles={1} bind:files />
	{/snippet}
	{#snippet submitterSnippet()}
		<ActionButton loading={loading.value} type="submit">{$svelteLL.general.confirm()}</ActionButton>
	{/snippet}
</FormWrapper>
