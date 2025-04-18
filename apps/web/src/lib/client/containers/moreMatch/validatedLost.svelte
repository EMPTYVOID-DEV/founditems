<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import UserInfo from './userContact.svelte';
	import type { UserContact } from '@shared/types';

	let { finderContact }: { finderContact: UserContact } = $props();
</script>

<p>{$svelteLL.matches.validatedLost()}</p>

<UserInfo userContact={finderContact} />
