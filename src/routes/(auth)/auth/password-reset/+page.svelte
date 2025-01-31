<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@shared/i18n/i18n';
	import { showToast } from '@client/utils';
	import Logo from '@components/custom/logo.svelte';
	import ReactiveInput from '@components/custom/reactiveInput.svelte';
	import Button from '@components/shadcn/button/button.svelte';
	import * as InputOTP from '@components/shadcn/input-otp';
	import { getValidator, getEmailSchema, getPasswordSchema } from '@shared/zod';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';

	const emailValidator = getValidator(getEmailSchema());

	const passwordValidator = getValidator(getPasswordSchema());

	const sendEmailAction: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast($svelteLL.general.error(), result.data.message, 'error');
			if (result.type == 'success') {
				showToast($svelteLL.general.success(), $svelteLL.auth.sendSuccess(), 'success');
				stage = 'verify';
			}
			update();
		};
	};

	const verifyCodeActions: SubmitFunction = async ({ formData, action }) => {
		formData.append('email', email);
		formData.append('otp', otp);
		return ({ result, update }) => {
			if (result.type == 'success' && action.search == '?/resend')
				showToast($svelteLL.general.success(), $svelteLL.auth.resendSuccess(), 'success');

			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast($svelteLL.general.error(), result.data.message, 'error');
			update({ reset: false });
		};
	};

	const actionsMap = new Map<'send' | 'verify', SubmitFunction>([
		['send', sendEmailAction],
		['verify', verifyCodeActions]
	]);

	let stage = $state<'send' | 'verify'>('send');
	let currentAction = $derived(actionsMap.get(stage));
	let email = $state('');
	let otp = $state('');
</script>

<div class="flex h-svh w-svw items-center justify-center bg-background">
	{#key currentAction}
		<form
			method="post"
			class=" flex w-1/2 flex-col items-center gap-5 mr:w-[90%]"
			use:enhance={currentAction}
		>
			<Logo class="self-center" />
			{#if stage == 'send'}
				<p class="w-full max-w-sm font-bold text-muted-foreground">
					{$svelteLL.auth.lostPasswordEmail()}
				</p>
				<ReactiveInput
					label={$svelteLL.auth.email()}
					placeholder={$svelteLL.auth.email()}
					name="email"
					type="email"
					validator={emailValidator}
					oninput={(e) => (email = e.currentTarget.value)}
				/>
				<Button class="w-full max-w-sm" type="submit" formaction="?/send"
					>{$svelteLL.auth.sendTheCode()}</Button
				>
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
					label={$svelteLL.auth.password()}
					placeholder={$svelteLL.auth.password()}
					name="password"
					type="password"
					validator={passwordValidator}
				/>
				<Button class="w-full max-w-sm" type="submit" formaction="?/verify"
					>{$svelteLL.auth.confirmNewPassword()}</Button
				>
				<Button class="w-full max-w-sm" variant="secondary" type="submit" formaction="?/resend"
					>{$svelteLL.auth.resendEmail()}</Button
				>
			{/if}
		</form>
	{/key}
</div>
