<script lang="ts">
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import * as Dialog from '@components/shadcn/dialog';
	let { description, images }: { description: string; images: string[] } = $props();
</script>

{#if description}
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">{$svelteLL.posts.itemDescription()}</span>
		<span>{description}</span>
	</div>
{/if}

{#if images.length > 0}
	<div class="flex flex-col gap-1">
		<span class="font-bold capitalize">{$svelteLL.posts.itemImages()}</span>
		<div class="flex gap-4">
			{#each images as image}
				{@const src = `${PUBLIC_API_HOST}/proofs/${image}`}
				<Dialog.Root>
					<Dialog.Trigger>
						<img
							{src}
							alt=""
							class="aspect-square w-48 rounded-md object-cover object-center sm:w-40"
						/>
					</Dialog.Trigger>
					<Dialog.Content class="w-[40%] bg-transparent p-0 sm:w-[80%]" closeClass="hidden">
						<img {src} alt="" class="aspect-square w-full rounded-md object-cover object-center" />
					</Dialog.Content>
				</Dialog.Root>
			{/each}
		</div>
	</div>
{/if}
