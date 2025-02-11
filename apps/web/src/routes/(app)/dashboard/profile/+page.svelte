<script lang="ts">
	import AddressForm from './components/addressForm.svelte';
	import AvatarForm from './components/avatarForm.svelte';
	import FullnameForm from './components/fullnameForm.svelte';
	import LogoutForm from './components/logoutForm.svelte';
	import PhoneForm from './components/phoneForm.svelte';

	let { data } = $props();
</script>

<div class="flex w-full flex-col gap-4 px-[2.5%] py-[2.5%]">
	<FullnameForm fullname={data.user!.fullname} />
	<AddressForm address={data.user!.address} />
	<PhoneForm phoneNumber={data.user!.phoneNumber} />
	<AvatarForm />
	<LogoutForm />
</div>
