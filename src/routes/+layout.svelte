<script>
	// @ts-nocheck

	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	import { enhance } from '$app/forms';
	import { writable } from 'svelte/store';

	import { Toast } from '@svelte-things/toast';
	import CreateUsername from '$lib/components/create-username.svelte';

	let showModal = false;

	export let data;
	export let form;

	$: if (data.loggedIn && data?.user.username == null) {
		showModal = true;
	}

	const username_res = writable(null);
</script>

<svelte:head>
	<title>Linkspot</title>
	<meta name="description" content="linkspot a place to share your links" />
</svelte:head>

<Navbar />

<CreateUsername bind:showModal resText={$username_res} />

<slot />

<Toast position="top-center" stacked closable={false} />
