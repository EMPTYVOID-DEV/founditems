<script>
	import { page } from '$app/state';

	let status = page.status;
	let message = page.error?.message || 'An unexpected error occurred';
</script>

<div class="flex h-screen flex-col items-center justify-center text-center">
	<h1 class="text-destructive">{status}</h1>
	<p>{message}</p>
</div>
