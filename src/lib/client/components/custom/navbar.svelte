<script lang="ts">
	import type { SessionValidationResult } from '@shared/types';
	import LangSelect from './langSelect.svelte';
	import { svelteLL } from '@shared/i18n/i18n';
	import UserAvatar from './userAvatar.svelte';
	import CloseIcon from '@client/icons/closeIcon.svelte';
	import MenuIcon from '@client/icons/menuIcon.svelte';
	import { cn } from '@client/utils';
	import { authPage, claimsPage, postsPage, searchPage } from '@shared/const';
	import { page } from '$app/state';
	import Logo from './logo.svelte';

	$effect(() => {
		if (page.url.pathname) showMenu = false;
	});

	let { user }: { user: SessionValidationResult['user'] } = $props();
	let currentPathname = $derived(page.url.pathname);
	let showMenu = $state(false);
</script>

<div
	class="fixed left-0 top-0 z-50 flex h-20 w-full items-center bg-background px-4 shadow-md"
	dir="ltr"
>
	<Logo class="mr-auto" />
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
				'text-primary': currentPathname == searchPage
			})}>{$svelteLL.navbar.search()}</a
		>
		{#if user}
			<a
				href={claimsPage}
				class={cn('border-primary hover:border-b-2 hover:text-primary', {
					'text-primary': currentPathname == claimsPage
				})}>{$svelteLL.navbar.claims()}</a
			>
			<a
				href={postsPage}
				class={cn('border-primary hover:border-b-2 hover:text-primary', {
					'text-primary': currentPathname == postsPage
				})}>{$svelteLL.navbar.posts()}</a
			>
			<UserAvatar avatar={user.avatar} fullname={user.fullname} />
		{:else}
			<a
				href={authPage}
				class={cn('border-primary hover:border-b-2 hover:text-primary', {
					'text-primary': currentPathname == authPage
				})}>{$svelteLL.auth.login()}</a
			>
		{/if}
	</div>
</div>
