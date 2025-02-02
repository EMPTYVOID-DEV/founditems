<script lang="ts">
	import { showToast } from '@client/utils';
	import FormWrapper from '@components/custom/formWrapper.svelte';
	import ReactiveInput from '@components/custom/reactiveInput.svelte';
	import { Button } from '@components/shadcn/button';
	import { svelteLL } from '@shared/i18n/i18n-svelte';
	import { getAddressSchema, getValidator } from '@shared/zod';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { address }: { address: string } = $props();
	const addressValidator = getValidator(getAddressSchema());
	const addressAction: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'success')
				showToast($svelteLL.general.success(), $svelteLL.profile.addressChangeSuccess(), 'success');
			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast($svelteLL.general.error(), result.data.message, 'error');
			update({ reset: false });
		};
	};
</script>

<FormWrapper action={addressAction} actionName="?/address" formClass="w-[80%] mr:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.address()}</h4>
		<p>{$svelteLL.profile.addressChange()}</p>
		<ReactiveInput validator={addressValidator} name="address" value={address} />
	{/snippet}
	{#snippet submitterSnippet()}
		<Button type="submit">{$svelteLL.general.confirm()}</Button>
	{/snippet}
</FormWrapper>
