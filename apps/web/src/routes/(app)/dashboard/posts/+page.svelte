<script>
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import AddIcon from '@icons/addIcon.svelte';
	import { createPostPage } from '@shared/const';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
</script>

<div class="flex w-full flex-grow flex-col gap-4 p-[2.5%]">
	<div class="mr:flex-col mr:items-start mr:gap-2 flex w-full items-center justify-between">
		<h1 class="text-primary capitalize">{$svelteLL.navbar.posts()}</h1>
		<Button
			onclick={() => goto(createPostPage)}
			variant="secondary"
			class="mr:w-full cursor-pointer"
		>
			<AddIcon variant="default" />
			<span class="capitalize">{$svelteLL.posts.newPost()}</span>
		</Button>
	</div>
</div>
