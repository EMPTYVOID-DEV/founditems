<script lang="ts">
	import type { SubmitFunctionAfter } from '@client/types';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import ActionButton from '@components/custom/other/actionButton.svelte';
	import FormWrapper from '@components/custom/other/formWrapper.svelte';
	import ReactiveInput from '@components/custom/other/reactiveInput.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { getAddressSchema, getValidator } from '@shared/zod';

	let { address }: { address: string } = $props();
	const addressValidator = getValidator(getAddressSchema());

	const addressActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'success')
			showToast($svelteLL.general.success(), $svelteLL.profile.addressChangeSuccess(), 'success');
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		update({ reset: false });
	};

	const { action, loading } = actionLoadingWrapper({ after: addressActionAfter });
</script>

<FormWrapper {action} actionName="?/address" formClass="w-[80%] sm:w-full">
	{#snippet mainSnippet()}
		<h4 class="capitalize">{$svelteLL.schema.address()}</h4>
		<p>{$svelteLL.profile.addressChange()}</p>
		<ReactiveInput validator={addressValidator} name="address" class="max-w-lg" value={address} />
	{/snippet}
	{#snippet submitterSnippet()}
		<ActionButton loading={loading.value} type="submit">{$svelteLL.general.confirm()}</ActionButton>
	{/snippet}
</FormWrapper>
