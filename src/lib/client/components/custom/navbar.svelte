<script lang="ts">
	import type { SessionValidationResult } from '$lib/shared/types';
	import LangSelect from './langSelect.svelte';
	import LL from '$lib/client/i18n/i18n-svelte';
	import UserAvatar from './userAvatar.svelte';
	import LogoIcon from '$lib/client/icons/logoIcon.svelte';
	import CloseIcon from '$lib/client/icons/closeIcon.svelte';
	import MenuIcon from '$lib/client/icons/menuIcon.svelte';
	import { cn } from '$lib/client/utils';
	import { authPage, claimsPage, postsPage, searchPage } from '$lib/client/consts';
	import { page } from '$app/state';

	let { user }: { user: SessionValidationResult['user'] } = $props();
	let currentPathname = $derived(page.url.pathname);
	let showMenu = $state(false);
</script>

<div class="fixed left-0 top-0 z-50 flex h-20 w-full items-center bg-background px-4 shadow-md">
	<a href="/" class="mr-auto cursor-pointer">
		<LogoIcon />
	</a>

	<button class="hidden mr:contents" onclick={() => (showMenu = !showMenu)}>
		{#if showMenu}
			<CloseIcon />
		{:else}
			<MenuIcon />
		{/if}
	</button>

	<div
		class={cn(
			'flex items-center gap-5 transition-transform duration-300 ease-in-out mr:fixed mr:left-0 mr:top-20 mr:h-full mr:w-full mr:flex-col mr:items-start mr:bg-background mr:px-4 mr:pl-4',
			{ 'mr:translate-x-0': showMenu, 'mr:-translate-x-full': !showMenu }
		)}
	>
		<LangSelect />
		<a
			href={searchPage}
			class={cn('border-primary hover:border-b-2 hover:text-primary', {
				'text-secondary': currentPathname == searchPage
			})}>{$LL.navbar.search()}</a
		>
		{#if user}
			<a
				href={claimsPage}
				class={cn('border-primary hover:border-b-2 hover:text-primary', {
					'text-primary': currentPathname == claimsPage
				})}>{$LL.navbar.claims()}</a
			>
			<a
				href={postsPage}
				class={cn('border-primary hover:border-b-2 hover:text-primary', {
					'text-primary': currentPathname == postsPage
				})}>{$LL.navbar.posts()}</a
			>
			<UserAvatar avatar={user.avatar} />
		{:else}
			<a
				href={authPage}
				class={cn('border-primary hover:border-b-2 hover:text-primary', {
					'text-primary': currentPathname == authPage
				})}>{$LL.auth.login()}</a
			>
		{/if}
	</div>
</div>
