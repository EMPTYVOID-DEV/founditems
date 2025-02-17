<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import ReactiveInput from '@components/custom/other/reactiveInput.svelte';
	import { getAddressSchema, getValidator } from '@shared/zod';
	import type { ItemType } from '@shared/types';
	import DatePicker from '@components/custom/date/datePicker.svelte';
	import { formatDate } from '@client/utils.svelte';
	import SectionSelect from '@components/custom/date/sectionSelect.svelte';

	let addressValidator = getValidator(getAddressSchema());
	let {
		setAddress,
		setDate,
		setSection,
		itemType
	}: {
		setAddress: (address: string) => void;
		setDate: (date: string) => void;
		setSection: (section: number) => void;
		itemType: ItemType;
	} = $props();

	let whereLost = $derived(
		itemType == 'lost' ? $svelteLL.posts.whereYouFound() : $svelteLL.posts.whereYouLost()
	);
	let whenLost = $derived(
		itemType == 'found' ? $svelteLL.posts.whenYouFound() : $svelteLL.posts.whenYouLost()
	);
</script>

<div class="flex w-full flex-col gap-2">
	<span class="capitalize">{whenLost}</span>
	<div class="mr:flex-col flex gap-4">
		<DatePicker setDateValue={(date) => setDate(formatDate(date))} />
		<SectionSelect {setSection} />
	</div>
</div>

<ReactiveInput
	validator={addressValidator}
	label={whereLost}
	oninput={(e) => setAddress(e.currentTarget.value)}
/>
