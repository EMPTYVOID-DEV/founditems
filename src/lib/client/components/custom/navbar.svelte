<script lang="ts">
	import type { SessionValidationResult } from '$lib/shared/types';
	import LangSelect from './langSelect.svelte';
	import Button from '../shadcn/button/button.svelte';
	import LL from '$lib/client/i18n/i18n-svelte';
	import UserAvatar from './userAvatar.svelte';
	import { goto } from '$app/navigation';
	import LogoIcon from '$lib/client/icons/logoIcon.svelte';
	import CloseIcon from '$lib/client/icons/closeIcon.svelte';
	import MenuIcon from '$lib/client/icons/menuIcon.svelte';
	import { cn } from '$lib/client/utils';

	let { user }: { user: SessionValidationResult['user'] } = $props();

	let showMenu = $state(false);
</script>

<div class="fixed left-0 top-0 z-50 flex h-20 w-full items-center bg-background px-4 shadow-md">
	<a href="/" class="mr-auto cursor-pointer">
		<LogoIcon />
	</a>

	<button class="mr:contents hidden" onclick={() => (showMenu = !showMenu)}>
		{#if showMenu}
			<CloseIcon />
		{:else}
			<MenuIcon />
		{/if}
	</button>

	<div
		class={cn(
			'mr:fixed mr:flex-col mr:bg-background mr:top-20 mr:left-0 mr:w-full mr:h-full mr:pl-4 mr:items-start mr:px-4 flex items-center gap-5 transition-transform duration-300 ease-in-out',
			{ 'mr:translate-x-0': showMenu, 'mr:-translate-x-full': !showMenu }
		)}
	>
		<LangSelect />
		<a href="/search" class="border-primary hover:border-b-2 hover:text-primary"
			>{$LL.navbar.search()}</a
		>
		{#if user}
			<a href="/claims" class="border-primary hover:border-b-2 hover:text-primary"
				>{$LL.navbar.claims()}</a
			>
			<a href="/posts" class="border-primary hover:border-b-2 hover:text-primary"
				>{$LL.navbar.posts()}</a
			>
			<UserAvatar avatar={user.avatar} />
		{:else}
			<a href="/login" class="border-primary hover:border-b-2 hover:text-primary"
				>{$LL.auth.login()}</a
			>
		{/if}
	</div>
</div>
