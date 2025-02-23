<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import FileUpload from '@components/custom/other/fileUpload.svelte';
	import Input from '@components/shadcn/input/input.svelte';
	import { getImageSchema, getValidator } from '@shared/zod';
	let {
		files = $bindable(),
		setFullDescription
	}: { setFullDescription: (descr: string) => void; files: File[] } = $props();

	let imageValidator = getValidator(getImageSchema());
</script>

<div class="flex w-full max-w-lg flex-col gap-1">
	<span>{$svelteLL.posts.lostItemDescription()}</span>
	<Input oninput={(e) => setFullDescription(e.currentTarget.value)} />
</div>

<div class="flex w-full max-w-lg flex-col gap-1">
	<span>{$svelteLL.posts.lostItemImages()}</span>
	<FileUpload bind:files maxFiles={5} validator={imageValidator} accept="image/*" />
</div>
