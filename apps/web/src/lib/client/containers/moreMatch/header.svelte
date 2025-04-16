<script lang="ts">
	import { svelteLL } from '@assets/i18n/i18n-svelte';
	import BackButton from '@components/custom/other/backButton.svelte';
</script>

<div class="flex items-center justify-between">
	<h2 class="text-primary capitalize">{$svelteLL.matches.matchInformation()}</h2>
	<BackButton />
</div>
