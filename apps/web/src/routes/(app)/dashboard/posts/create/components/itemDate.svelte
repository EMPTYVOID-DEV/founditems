<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import DatePicker from '@components/custom/other/datePicker.svelte';
	import type { ItemType } from 'utils';

	let {
		setDate,
		itemType
	}: {
		setDate: (dateValue: Date | null) => void;
		itemType: ItemType;
	} = $props();

	let whenLost = $derived(
		itemType == 'found' ? $svelteLL.posts.whenYouFound() : $svelteLL.posts.whenYouLost()
	);
</script>

<div class="flex flex-col gap-1">
	<h4 class="capitalize">{whenLost}</h4>
	<DatePicker {setDate} mode="datetime" />
</div>
