<script lang="ts">
	import type { SubmitFunctionAfter } from '@client/types';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import ActionButton from '@components/custom/actionButton.svelte';
	import FormWrapper from '@components/custom/formWrapper.svelte';
	import ReactiveInput from '@components/custom/reactiveInput.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { getPhoneNumberSchema, getValidator } from '@shared/zod';

	let { phoneNumber }: { phoneNumber: string } = $props();
	const addressValidator = getValidator(getPhoneNumberSchema());

	const addressActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'success')
			showToast(
				$svelteLL.general.success(),
				$svelteLL.profile.phoneNumberChangeSuccess(),
				'success'
			);
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		update({ reset: false });
	};

	const { action, loading } = actionLoadingWrapper({ after: addressActionAfter });
</script>

<FormWrapper {action} actionName="?/phone" formClass="w-[80%] mr:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.phoneNumber()}</h4>
		<p>{$svelteLL.profile.phoneNumberChange()}</p>
		<ReactiveInput validator={addressValidator} name="phoneNumber" value={phoneNumber} />
	{/snippet}
	{#snippet submitterSnippet()}
		<ActionButton loading={loading.value} type="submit">{$svelteLL.general.confirm()}</ActionButton>
	{/snippet}
</FormWrapper>
