<script lang="ts">
	import { svelteLL, svelteUsedLocale } from '@assets/i18n/i18n-svelte';
	import SveltyPicker from 'svelty-picker';
	import { ar_DZ, fr } from 'svelty-picker/i18n';
	let {
		setDate,
		includeHours = false
	}: {
		setDate: (date: Date | null) => void;
		mode?: 'date' | 'datetime';
		includeHours?: boolean;
	} = $props();
</script>

<div class="input-wrap">
	<SveltyPicker
		mode={includeHours ? 'datetime' : 'date'}
		hourOnly
		displayFormat={includeHours ? 'dd/mm/yyyy:h' : 'dd/mm/yyyy'}
		i18n={$svelteUsedLocale == 'ar' ? ar_DZ : fr}
		placeholder={$svelteLL.general.selectDate()}
		on:dateChange={(e) => {
			if (!(e.detail.dateValue instanceof Array)) setDate(e.detail.dateValue);
		}}
	/>
</div>

<style>
	.input-wrap :global(input) {
		width: 100%;
		border: 1px solid hsl(var(--input));
		background-color: hsl(var(--background));
		padding-inline: 0.75rem;
		padding-block: 0.25rem;
		border-radius: calc(var(--radius) - 2px);
		outline: none;
	}
</style>
