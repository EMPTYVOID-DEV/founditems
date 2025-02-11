<script>
	import { goto } from '$app/navigation';
	import Button from '@components/shadcn/button/button.svelte';
	import AddIcon from '@icons/addIcon.svelte';
	import { createPostPage } from '@shared/const';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
</script>

<div class="flex w-full flex-grow flex-col gap-4 px-[2.5%] py-[2.5%]">
	<div class="flex w-full items-center justify-between mr:flex-col mr:items-start mr:gap-4">
		<h1 class="capitalize text-primary">{$svelteLL.navbar.posts()}</h1>
		<Button
			onclick={() => goto(createPostPage)}
			variant="secondary"
			class="cursor-pointer mr:w-full"
		>
			<AddIcon variant="default" />
			<span class="capitalize">{$svelteLL.posts.newPost()}</span>
		</Button>
	</div>
</div>
