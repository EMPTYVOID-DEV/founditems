<script lang="ts">
	import { profilePage } from '@shared/const';
	import * as Avatar from '@components/shadcn/avatar/index.js';
	let { avatar, fullname }: { avatar: string; fullname: string } = $props();
</script>

<a href={profilePage}>
	<Avatar.Root class="h-15 w-15">
		<Avatar.Image src={avatar} alt="avatar" />
		<Avatar.Fallback>
			<span class="rounded-[50%] bg-primary/30 p-3 uppercase">{fullname.slice(0, 2)}</span>
		</Avatar.Fallback>
	</Avatar.Root>
</a>
