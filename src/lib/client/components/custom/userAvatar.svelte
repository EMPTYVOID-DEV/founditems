<script lang="ts">
	import * as Avatar from '@components/shadcn/avatar/index.js';
	let { avatar }: { avatar: string } = $props();
</script>

<a href="/profile">
	<Avatar.Root>
		<Avatar.Image src={avatar} alt="avatar" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
</a>
