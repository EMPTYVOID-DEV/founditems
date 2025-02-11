<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import { Input } from '../input/index';

	let { hours = $bindable('00'), minutes = $bindable('00') }: { hours?: string; minutes?: string } =
		$props();

	function validateHours(event: Event & { currentTarget: HTMLInputElement }) {
		const value = event.currentTarget.value;
		let localeHours = parseInt(value, 10);

		if (isNaN(localeHours)) {
			localeHours = 0;
		}

		localeHours = Math.min(Math.max(localeHours, 0), 23);

		hours = localeHours == 0 ? '00' : localeHours.toString();
	}

	function validateMinutes(event: Event & { currentTarget: HTMLInputElement }) {
		const value = event.currentTarget.value;
		let localeMinutes = parseInt(value, 10);

		if (isNaN(localeMinutes)) {
			localeMinutes = 0;
		}

		localeMinutes = Math.min(Math.max(localeMinutes, 0), 59);

		minutes = localeMinutes == 0 ? '00' : localeMinutes.toString();
	}
</script>

<div class="flex gap-2" dir="ltr">
	<div class="flex flex-col gap-1">
		<span class="capitalize">{$svelteLL.general.hours()}</span>
		<Input class="h-10 w-12 text-center" bind:value={hours} oninput={validateHours} />
	</div>
	<div class="flex flex-col gap-1">
		<span class="capitalize">{$svelteLL.general.minutes()}</span>
		<Input class="h-10 w-12 text-center" bind:value={minutes} oninput={validateMinutes} />
	</div>
</div>
