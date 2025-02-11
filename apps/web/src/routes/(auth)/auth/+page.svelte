<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import Logo from '@components/custom/logo.svelte';
	import { enhance } from '$app/forms';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import ReactiveInput from '@components/custom/reactiveInput.svelte';
	import { getEmailSchema, getFullnameSchema, getPasswordSchema, getValidator } from '@shared/zod';
	import { authPasswordResetPage } from '@shared/const';
	import type { SubmitFunctionAfter } from '@client/types';
	import ActionButton from '@components/custom/actionButton.svelte';
	let isRegister = $state(true);
	const fullnameValidator = getValidator(getFullnameSchema());
	const emailValidator = getValidator(getEmailSchema());
	const passwordValidator = getValidator(getPasswordSchema());

	const afterAction: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		update({ reset: false });
	};
	const { action, loading } = actionLoadingWrapper({ after: afterAction });
</script>

<div class="flex h-svh w-svw items-center justify-center">
	<form
		class=" flex w-1/2 flex-col items-center gap-5 mr:w-[90%]"
		action={isRegister ? '?/signup' : '?/signin'}
		method="POST"
		use:enhance={action}
	>
		<Logo class="self-center" />

		{#if isRegister}
			<ReactiveInput
				label={$svelteLL.schema.fullname()}
				validator={fullnameValidator}
				type="text"
				name="fullname"
				placeholder={$svelteLL.schema.fullname()}
			/>
		{/if}

		<ReactiveInput
			label={$svelteLL.schema.email()}
			validator={emailValidator}
			type="email"
			name="email"
			placeholder={$svelteLL.schema.email()}
		/>

		<ReactiveInput
			label={$svelteLL.schema.password()}
			validator={passwordValidator}
			type="password"
			name="password"
			placeholder={$svelteLL.schema.password()}
		/>

		<ActionButton loading={loading.value} class="w-full max-w-sm" type="submit" size="lg">
			{isRegister ? $svelteLL.auth.signup() : $svelteLL.auth.login()}
		</ActionButton>

		<div class="flex w-full max-w-sm items-center justify-between gap-2">
			<button
				type="button"
				class="underline hover:text-primary"
				onclick={() => (isRegister = !isRegister)}
				>{isRegister
					? $svelteLL.auth.alreadyHaveAccount()
					: $svelteLL.auth.dontHaveAccount()}</button
			>
			{#if !isRegister}
				<a href={authPasswordResetPage} class="underline hover:text-primary"
					>{$svelteLL.auth.forgetPassword()}</a
				>
			{/if}
		</div>
	</form>
</div>
