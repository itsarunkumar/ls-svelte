<script>
	// @ts-nocheck

	import Navbar from '$lib/components/navbar.svelte';
	import '../app.css';
	import { enhance } from '$app/forms';
	import { writable } from 'svelte/store';

	import { Toast } from '@svelte-things/toast';

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

{#if showModal}
	<div
		class=" flex flex-col items-center justify-center z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-foreground border rounded-md shadow-xl"
	>
		<form
			action="/login/username"
			method="post"
			use:enhance={() => {
				return async ({ update, result }) => {
					console.log(result);

					if (result.type === 'success') {
						$username_res = result.data?.msg;
						await update();
						showModal = false;
					}

					$username_res = 'try another username';
				};
			}}
			class="flex flex-col items-center justify-center gap-5"
		>
			<h1 class="text-2xl font-semibold">Create a username</h1>
			<input type="text" name="userid" id="userid" value={data.user?.userId} hidden />
			<input
				type="text"
				name="username"
				id="username"
				class="border px-5 py-2 rounded-sm dark:bg-primary-foreground dark:text-primary placeholder:capitalize"
				placeholder="create a username"
			/>

			<button class="border px-5 py-2 rounded-sm bg-primary text-primary-foreground capitalize"
				>submit</button
			>
		</form>

		{#if $username_res}
			<span class="text-xs text-muted-foreground capitalize my-5">{$username_res}</span>
		{/if}
	</div>
{/if}

<slot />

<Toast position="top-center" />

<style>
	:global(html) {
	}
</style>
