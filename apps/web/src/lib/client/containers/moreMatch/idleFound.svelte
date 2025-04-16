<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import Body from '@containers/morePost/body.svelte';
	import Extra from '@containers/morePost/extra.svelte';
	import Footer from '@containers/morePost/footer.svelte';
	import type { Item } from 'db';
	let { lostItem }: { lostItem: Item } = $props();
</script>

<p>{$svelteLL.matches.idleFound()}</p>

<Body
	category={lostItem.category}
	isFound={lostItem.isFound}
	metadata={lostItem.metadata}
	state={lostItem.state}
/>
<Footer address={lostItem.address} date={lostItem.date} />
<Extra description={lostItem.description} images={lostItem.images} />
