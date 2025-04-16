<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { User } from 'db';

	let {
		finderInfo
	}: { finderInfo: Pick<User, 'address' | 'avatar' | 'email' | 'fullname' | 'phoneNumber'> } =
		$props();
</script>

<p>{$svelteLL.matches.validatedLost()}</p>

<div class="grid grid-cols-2 items-start gap-2 sm:grid-cols-1">
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.fullname()}
		</span>
		<span>{finderInfo.fullname}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.email()}
		</span>
		<span>{finderInfo.email}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.phoneNumber()}
		</span>
		<span>{finderInfo.phoneNumber}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.address()}
		</span>
		<span>{finderInfo.address}</span>
	</div>
</div>
