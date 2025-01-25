<script lang="ts">
	import type { SessionValidationResult } from '$lib/shared/types';
	import LangSelect from './langSelect.svelte';
	import Button from '../shadcn/button/button.svelte';
	import LL from '$lib/client/i18n/i18n-svelte';
	import UserAvatar from './userAvatar.svelte';
	import Logo from './logo.svelte';

	let { user }: { user: SessionValidationResult['user'] } = $props();
</script>

<div class="flex h-20 w-full items-center justify-between px-4 md:px-2" dir="ltr">
	<Logo />
	<div class="flex items-center gap-4">
		<a href="/search" class="border-primary hover:border-b-2 hover:text-primary"
			>{$LL.navbar.search()}</a
		>
		<LangSelect />
		{#if user}
			<a href="/claims" class="border-primary hover:border-b-2 hover:text-primary"
				>{$LL.navbar.claims()}</a
			>
			<a href="/posts" class="border-primary hover:border-b-2 hover:text-primary"
				>{$LL.navbar.posts()}</a
			>
			<UserAvatar avatar={user.avatar} />
		{:else}
			<Button>{$LL.navbar.login()}</Button>
		{/if}
	</div>
</div>
