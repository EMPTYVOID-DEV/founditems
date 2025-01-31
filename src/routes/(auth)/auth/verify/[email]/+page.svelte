<script lang="ts">
	import { enhance } from '$app/forms';
	import { svelteLL } from '@shared/i18n/i18n';
	import { showToast } from '@client/utils';
	import Logo from '@components/custom/logo.svelte';
	import Button from '@components/shadcn/button/button.svelte';
	import * as InputOTP from '@components/shadcn/input-otp/index';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	let otp = $state('');
	const handleAction: SubmitFunction = async ({ formData }) => {
		formData.append('otp', otp);
		return ({ result, update }) => {
			if (result.type == 'failure' && typeof result.data?.message == 'string')
				showToast($svelteLL.general.error(), result.data.message, 'error');
			if (result.type == 'success')
				showToast($svelteLL.general.success(), $svelteLL.auth.resendSuccess(), 'success');
			update();
		};
	};
</script>

<div class="flex h-svh w-svw items-center justify-center bg-background">
	<form
		method="post"
		class=" flex w-1/2 flex-col items-center gap-5 mr:w-[90%]"
		use:enhance={handleAction}
	>
		<Logo class="self-center" />
		<p class="w-full max-w-sm font-bold text-muted-foreground">
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
		<Button class="w-full max-w-sm" type="submit" formaction="?/verify"
			>{$svelteLL.auth.verifyCode()}</Button
		>
		<Button class="w-full max-w-sm" variant="secondary" type="submit" formaction="?/resend"
			>{$svelteLL.auth.resendEmail()}</Button
		>
	</form>
</div>
