<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { actionLoadingWrapper, showToast } from '@client/utils.svelte';
	import Logo from '@components/custom/other/logo.svelte';
	import * as InputOTP from '@components/shadcn/input-otp/index';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import type { SubmitFunctionAfter, SubmitFunctionBefore } from '@client/types';
	import ActionButton from '@components/custom/other/actionButton.svelte';

	let otp = $state('');

	const verifyActionBefore: SubmitFunctionBefore = ({ formData }) => {
		formData.append('otp', otp);
	};

	const verifyActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		update();
	};

	const resendActionAfter: SubmitFunctionAfter = ({ result, update }) => {
		if (result.type == 'failure' && typeof result.data?.message == 'string')
			showToast($svelteLL.general.error(), result.data.message, 'error');
		if (result.type == 'success')
			showToast($svelteLL.general.success(), $svelteLL.auth.resendSuccess(), 'success');
		update();
	};

	const { action: verifyAction, loading: verifyLoading } = actionLoadingWrapper({
		after: verifyActionAfter,
		before: verifyActionBefore
	});

	const { action: resendAction, loading: resendLoading } = actionLoadingWrapper({
		after: resendActionAfter
	});
</script>

<div class="flex h-svh w-svw items-center justify-center">
	<div class=" mr:w-[90%] flex w-1/2 flex-col items-center gap-5">
		<Logo class="self-center" />
		<p class="text-muted-foreground w-full max-w-sm font-bold">
			{$svelteLL.auth.verificationEmail()}
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
		<form action="?/verify" method="post" use:enhance={verifyAction} class="contents">
			<ActionButton loading={verifyLoading.value} class="w-full max-w-sm" type="submit"
				>{$svelteLL.auth.verifyCode()}</ActionButton
			>
		</form>
		<form action="?/resend" method="post" use:enhance={resendAction} class="contents">
			<ActionButton
				loading={resendLoading.value}
				class="w-full max-w-sm"
				variant="secondary"
				type="submit">{$svelteLL.auth.resendEmail()}</ActionButton
			>
		</form>
	</div>
</div>
