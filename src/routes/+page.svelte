<script lang="ts">
	import LL from '$lib/client/i18n/i18n-svelte';
	import { setLang } from '$lib/client/utils';
	import { Button } from '@components/shadcn/button';
</script>

<div class="flex h-svh w-svw flex-col items-center justify-center gap-1">
	<h1 class="text-primary">{$LL.title()}</h1>
	<p class="text-foreground">{$LL.intro()}</p>
	<Button onclick={() => setLang('ar')}>{$LL.startNow()}</Button>
</div>
