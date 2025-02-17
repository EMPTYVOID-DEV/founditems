<script lang="ts">
	import { profilePage } from '@shared/const';
	import * as Avatar from '@components/shadcn/avatar/index.js';
	import { PUBLIC_API_HOST } from '$env/static/public';
	let { avatar, fullname }: { avatar: string; fullname: string } = $props();
</script>

<a href={profilePage}>
	<Avatar.Root class="h-12 w-12">
		<Avatar.Image
			src={`${PUBLIC_API_HOST}/avatars/${avatar}`}
			alt="avatar"
			class="object-cover object-center"
		/>
		<Avatar.Fallback>
			<span class=" bg-primary/30 rounded-[50%] p-3 uppercase">{fullname.slice(0, 2)}</span>
		</Avatar.Fallback>
	</Avatar.Root>
</a>
