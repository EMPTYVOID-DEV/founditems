<script lang="ts">
	import { showToast } from '@client/utils.svelte';
	import FormWrapper from '@components/custom/formWrapper.svelte';
	import ReactiveInput from '@components/custom/reactiveInput.svelte';
	import { Button } from '@components/shadcn/button';
	import { svelteLL } from '@shared/i18n/i18n-svelte';
	import { getValidator, getFullnameSchema } from '@shared/zod';
	import type { SubmitFunction } from '@sveltejs/kit';

	let { fullname }: { fullname: string } = $props();
	const fullnameValidator = getValidator(getFullnameSchema());
	const fullnameAction: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'success')
				showToast(
					$svelteLL.general.success(),
					$svelteLL.profile.fullnameChangeSuccess(),
					'success'
				);
			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast($svelteLL.general.error(), result.data.message, 'error');
			update({ reset: false });
		};
	};
</script>

<FormWrapper action={fullnameAction} actionName="?/fullname" formClass="w-[80%] mr:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.schema.fullname()}</h4>
		<p>{$svelteLL.profile.fullnameChange()}</p>
		<ReactiveInput validator={fullnameValidator} name="fullname" value={fullname} />
	{/snippet}
	{#snippet submitterSnippet()}
		<Button type="submit">{$svelteLL.general.confirm()}</Button>
	{/snippet}
</FormWrapper>
