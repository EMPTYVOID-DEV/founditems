<script lang="ts">
	import AddressForm from './containers/addressForm.svelte';
	import AvatarForm from './containers/avatarForm.svelte';
	import FullnameForm from './containers/fullnameForm.svelte';
	import LogoutForm from './containers/logoutForm.svelte';
	import PhoneForm from './containers/phoneForm.svelte';

	let { data } = $props();
</script>

<div class="flex w-full flex-col gap-4 p-[2.5%]">
	<FullnameForm fullname={data.user!.fullname} />
	<AddressForm address={data.user!.address} />
	<PhoneForm phoneNumber={data.user!.phoneNumber} />
	<AvatarForm />
	<LogoutForm />
</div>
