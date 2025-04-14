<script lang="ts">
	import AddressForm from '@containers/profile/addressForm.svelte';
	import AvatarForm from '@containers/profile/avatarForm.svelte';
	import FullnameForm from '@containers/profile/fullnameForm.svelte';
	import LogoutForm from '@containers/profile/logoutForm.svelte';
	import PhoneForm from '@containers/profile/phoneForm.svelte';

	let { data } = $props();
</script>

<div class="flex w-full flex-col gap-4 p-[2.5%]">
	<FullnameForm fullname={data.user!.fullname} />
	<AddressForm address={data.user!.address} />
	<PhoneForm phoneNumber={data.user!.phoneNumber} />
	<AvatarForm />
	<LogoutForm />
</div>
