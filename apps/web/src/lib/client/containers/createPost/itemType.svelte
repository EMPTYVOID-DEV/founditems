<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { Button } from '@components/shadcn/button';
	import type { ItemType } from 'utils';

	let { setType }: { setType: (type: ItemType) => void } = $props();
	let isLost = $state(true);

	$effect(() => {
		const type = isLost ? 'lost' : 'found';
		setType(type);
	});
</script>

<div class="flex flex-col gap-2">
	<h4 class="capitalize">{$svelteLL.posts.selectItemType()}</h4>
	<div class="flex items-center gap-4">
		<Button
			size="lg"
			class="rounded-3xl"
			variant={isLost ? 'secondary' : 'outline'}
			onclick={() => (isLost = true)}>{$svelteLL.posts.lost()}</Button
		>
		<Button
			size="lg"
			class="rounded-3xl"
			variant={!isLost ? 'secondary' : 'outline'}
			onclick={() => (isLost = false)}>{$svelteLL.posts.found()}</Button
		>
	</div>
</div>
