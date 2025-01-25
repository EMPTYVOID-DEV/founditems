<script lang="ts">
	import type { SessionValidationResult } from '$lib/shared/types';

	let { user }: { user: SessionValidationResult['user'] } = $props();
</script>

<div class="h-20 w-full"></div>
