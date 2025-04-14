<script lang="ts">
	import type { SessionValidationResult } from '@shared/types';
	import LangSelect from './langSelect.svelte';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import UserAvatar from './userAvatar.svelte';
	import CloseIcon from '@client/icons/closeIcon.svelte';
	import MenuIcon from '@client/icons/menuIcon.svelte';
	import { cn } from '@client/utils.svelte';
	import { authPage, matchesPage, postsPage } from '@shared/const';
	import { page } from '$app/state';
	import Logo from './logo.svelte';
	import { checkPath } from '@shared/utils';

	$effect(() => {
		if (page.url.pathname) showMenu = false;
	});

	let { user }: { user: SessionValidationResult['user'] } = $props();
	let currentPathname = $derived(page.url.pathname);
	let showMenu = $state(false);
</script>

<div
	class="bg-background fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-between px-[2.5%] shadow-md"
	dir="ltr"
>
	<Logo class="sm-auto" />
	<button class="hidden sm:contents" onclick={() => (showMenu = !showMenu)}>
		{#if showMenu}
			<CloseIcon />
		{:else}
			<MenuIcon />
		{/if}
	</button>

	<div
		class={cn(
			'sm:bg-background flex items-center gap-5 transition-transform duration-300 ease-in-out sm:fixed sm:left-0 sm:top-20 sm:h-full sm:w-full sm:flex-col sm:items-start sm:px-4 sm:pl-4',
			{ 'sm:translate-x-0': showMenu, 'sm:-translate-x-full': !showMenu }
		)}
	>
		<LangSelect />
		{#if user}
			<a
				href={matchesPage}
				class={cn('border-primary hover:text-primary capitalize hover:border-b-2', {
					'text-primary': checkPath(currentPathname, [matchesPage], 'startWith')
				})}>{$svelteLL.navbar.matches()}</a
			>
			<a
				href={postsPage}
				class={cn('border-primary hover:text-primary capitalize hover:border-b-2', {
					'text-primary': checkPath(currentPathname, [postsPage], 'startWith')
				})}>{$svelteLL.navbar.posts()}</a
			>
			<UserAvatar avatar={user.avatar} fullname={user.fullname} />
		{:else}
			<a href={authPage} class="border-primary hover:text-primary capitalize hover:border-b-2"
				>{$svelteLL.auth.login()}</a
			>
		{/if}
	</div>
</div>
