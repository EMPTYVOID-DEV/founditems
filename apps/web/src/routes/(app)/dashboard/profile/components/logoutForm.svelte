<script lang="ts">
	import FormWrapper from '@components/custom/formWrapper.svelte';
	import { Button } from '@components/shadcn/button';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
</script>

<FormWrapper actionName="?/logout" formClass="w-[80%] mr:w-full">
	{#snippet mainSnippet()}
		<h4>{$svelteLL.auth.logout()}</h4>
		<p>{$svelteLL.profile.logout()}</p>
	{/snippet}
	{#snippet submitterSnippet()}
		<Button type="submit">{$svelteLL.general.confirm()}</Button>
	{/snippet}
</FormWrapper>
