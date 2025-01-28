<script lang="ts">
	import LL from '@client/i18n/i18n-svelte';
	import Logo from '@components/custom/logo.svelte';
	import Button from '@components/shadcn/button/button.svelte';
	import Input from '@components/shadcn/input/input.svelte';
	import { Toaster } from 'svelte-sonner';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { showToast } from '@client/utils';
	let isRegister = true;
	const handleAction: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast('Error', result.data.message, 'error');
			update({ reset: false });
		};
	};
</script>

<div class="flex h-svh w-svw items-center justify-center bg-background">
	<form
		class=" flex w-2/6 flex-col items-center gap-5 mr:w-[90%]"
		action={isRegister ? '?/signup' : '?/signin'}
		method="POST"
		use:enhance={handleAction}
	>
		<Logo class="self-center" />
		{#if isRegister}
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				<label for="fullname">{$LL.auth.fullname()}</label>
				<Input type="text" name="fullname" placeholder={$LL.auth.fullname()} />
			</div>
		{/if}
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<label for="email">{$LL.auth.email()}</label>
			<Input type="email" name="email" placeholder={$LL.auth.email()} />
		</div>
		<div class="flex w-full max-w-sm flex-col gap-1.5">
			<label for="password">{$LL.auth.password()}</label>
			<Input type="password" name="password" placeholder={$LL.auth.password()} />
		</div>
		<Button class="w-full max-w-sm" type="submit">
			{isRegister ? $LL.auth.signup() : $LL.auth.login()}
		</Button>
		<div class="flex w-full max-w-sm items-center justify-between gap-2">
			<button
				type="button"
				class="underline hover:text-primary"
				onclick={() => (isRegister = !isRegister)}
				>{isRegister ? $LL.auth.alreadyHaveAccount() : $LL.auth.dontHaveAccount()}</button
			>
			{#if !isRegister}
				<a href="/auth/forget-password" class="underline hover:text-primary"
					>{$LL.auth.forgetPassword()}</a
				>
			{/if}
		</div>
	</form>
</div>

<Toaster expand={true} />
