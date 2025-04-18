<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import type { UserContact } from '@shared/types';

	let { userContact }: { userContact: UserContact } = $props();
</script>

<div class="grid grid-cols-2 items-start gap-2 sm:grid-cols-1">
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.fullname()}
		</span>
		<span>{userContact.fullname}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.email()}
		</span>
		<span>{userContact.email}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.phoneNumber()}
		</span>
		<span>{userContact.phoneNumber}</span>
	</div>
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">
			{$svelteLL.schema.address()}
		</span>
		<span>{userContact.address}</span>
	</div>
</div>
