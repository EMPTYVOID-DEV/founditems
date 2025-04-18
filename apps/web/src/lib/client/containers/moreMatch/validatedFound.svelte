<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import UserInfo from './userContact.svelte';
	import type { UserContact } from '@shared/types';
	let { victimContact }: { victimContact: UserContact } = $props();
</script>

<p>{$svelteLL.matches.validatedFound()}</p>

<UserInfo userContact={victimContact} />
