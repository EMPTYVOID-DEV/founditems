<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import Logo from '@components/custom/logo.svelte';
	import ReactiveInput from '@components/custom/reactiveInput.svelte';
	import * as InputOTP from '@components/shadcn/input-otp';
	import { getValidator, getEmailSchema, getPasswordSchema } from '@shared/zod';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import type { SubmitFunctionAfter, SubmitFunctionBefore } from '@client/types';
	import ActionButton from '@components/custom/actionButton.svelte';

	let stage = $state<'send' | 'verify'>('send');

	let email = $state('');

	let otp = $state('');

	let password = $state('');

	const emailValidator = getValidator(getEmailSchema());

	const passwordValidator = getValidator(getPasswordSchema());

	const sendEmailActionBefore: SubmitFunctionBefore = ({ formData }) => {
		formData.append('email', email);
	};

	const sendEmailActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		if (result.type == 'success') {
			showToast($svelteLL.general.success(), $svelteLL.auth.sendSuccess(), 'success');
			stage = 'verify';
		}
		update();
	};

	const resendActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		if (result.type == 'success')
			showToast($svelteLL.general.success(), $svelteLL.auth.resendSuccess(), 'success');
		update();
	};

	const verifyActionBefore: SubmitFunctionBefore = ({ formData }) => {
		formData.append('otp', otp);
		formData.append('email', email);
		formData.append('password', password);
	};

	const verifyActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		update();
	};

	const { action: verifyAction, loading: verifyLoading } = actionLoadingWrapper({
		after: verifyActionAfter,
		before: verifyActionBefore
	});

	const { action: resendAction, loading: resendLoading } = actionLoadingWrapper({
		after: resendActionAfter,
		before: sendEmailActionBefore
	});

	const { action: sendAction, loading: sendLoading } = actionLoadingWrapper({
		after: sendEmailActionAfter,
		before: sendEmailActionBefore
	});
</script>

<div class="flex h-svh w-svw items-center justify-center">
	<div class=" flex w-1/2 flex-col items-center gap-5 mr:w-[90%]">
		<Logo class="self-center" />
		{#if stage == 'send'}
			<p class="w-full max-w-sm font-bold text-muted-foreground">
				{$svelteLL.auth.lostPasswordEmail()}
			</p>
			<ReactiveInput
				label={$svelteLL.schema.email()}
				placeholder={$svelteLL.schema.email()}
				type="email"
				validator={emailValidator}
				oninput={(e) => (email = e.currentTarget.value)}
			/>
			<form action="?/send" class="contents" use:enhance={sendAction} method="post">
				<ActionButton loading={sendLoading.value} class="w-full max-w-sm" type="submit"
					>{$svelteLL.auth.sendTheCode()}</ActionButton
				>
			</form>
		{:else}
			<p class="w-full max-w-sm font-bold text-muted-foreground">
				{$svelteLL.auth.resetPassword()}
			</p>
			<div class="contents" dir="ltr">
				<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS} bind:value={otp}>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells.slice(0, 3) as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
						<InputOTP.Separator />
						<InputOTP.Group>
							{#each cells.slice(3) as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
			</div>
			<ReactiveInput
				label={$svelteLL.schema.password()}
				placeholder={$svelteLL.schema.password()}
				type="password"
				validator={passwordValidator}
				oninput={(e) => (password = e.currentTarget.value)}
			/>
			<form action="?/verify" class="contents" use:enhance={verifyAction} method="post">
				<ActionButton loading={verifyLoading.value} class="w-full max-w-sm" type="submit"
					>{$svelteLL.auth.confirmNewPassword()}</ActionButton
				>
			</form>
			<form action="?/resend" class="contents" use:enhance={resendAction} method="post">
				<ActionButton
					loading={resendLoading.value}
					class="w-full max-w-sm"
					variant="secondary"
					type="submit">{$svelteLL.auth.resendEmail()}</ActionButton
				>
			</form>
		{/if}
	</div>
</div>
