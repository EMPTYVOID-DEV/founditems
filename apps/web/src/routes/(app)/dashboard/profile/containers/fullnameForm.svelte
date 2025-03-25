<script lang="ts">
	import type { SubmitFunctionAfter } from '@client/types';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import FormWrapper from '@components/custom/other/formWrapper.svelte';
	import ReactiveInput from '@components/custom/other/reactiveInput.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { getValidator, getFullnameSchema } from '@shared/zod';

	let { fullname }: { fullname: string } = $props();
	const fullnameValidator = getValidator(getFullnameSchema());
	const fullnameActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'success')
			showToast($svelteLL.general.success(), $svelteLL.profile.fullnameChangeSuccess(), 'success');
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		update({ reset: false });
	};
	const { action, loading } = actionLoadingWrapper({ after: fullnameActionAfter });
</script>

<FormWrapper {action} actionName="?/fullname" formClass="w-[80%] sm:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.fullname()}</h4>
		<p>{$svelteLL.profile.fullnameChange()}</p>
		<ReactiveInput validator={fullnameValidator} name="fullname" value={fullname} />
	{/snippet}
	{#snippet submitterSnippet()}
		<ActionButton loading={loading.value} type="submit">{$svelteLL.general.confirm()}</ActionButton>
	{/snippet}
</FormWrapper>
