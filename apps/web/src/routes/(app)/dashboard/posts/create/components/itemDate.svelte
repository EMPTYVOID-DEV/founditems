<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import DatePicker from '@components/custom/other/datePicker.svelte';
	import type { DateValue } from '@internationalized/date';
	import type { ItemType } from '@shared/types';

	let {
		setDateValue,
		itemType
	}: {
		setDateValue: (dateValue: DateValue) => void;
		itemType: ItemType;
	} = $props();

	let whenLost = $derived(
		itemType == 'found' ? $svelteLL.posts.whenYouFound() : $svelteLL.posts.whenYouLost()
	);
</script>

<div class="flex flex-col gap-1">
	<h4>{whenLost}</h4>
	<DatePicker {setDateValue} />
</div>
