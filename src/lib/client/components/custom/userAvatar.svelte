<script lang="ts">
	import { profilePage } from '$lib/client/consts';
	import * as Avatar from '@components/shadcn/avatar/index.js';
	let { avatar }: { avatar: string } = $props();
</script>

<a href={profilePage}>
	<Avatar.Root>
		<Avatar.Image src={avatar} alt="avatar" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
</a>
