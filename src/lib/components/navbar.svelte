<script>
	import { fly, scale, slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import { Goal, Menu, PersonStanding, User, UserCircle, X } from 'lucide-svelte';

	import { cn } from '$lib/utils/cn';
	import { clickOutside } from '$lib/utils/click-outside';

	import DarkMode from './dark-mode.svelte';
	import Modal from './modal.svelte';
	import Google from './icons/google.svelte';
	import Github from './icons/github.svelte';
	import Logo from './logo.svelte';

	let view = true;
	let showModal = false;

	function showNav() {
		view = !view;
	}
</script>

<nav
	on:outside={() => (view = true)}
	use:clickOutside
	class={cn(
		`w-full min-h-[50px] bg-primary text-primary-foreground  relative capitalize flex justify-between items-center px-5 py-4  z-10 transition-all duration-300 ease-in-out border-b shadow mb-3  ${$$props.class}`
	)}
>
	<Logo />

	<div class={cn('flex items-center gap-5 max-sm:hidden')}>
		{#if $page.data.user && $page.data.loggedIn}
			<a href="/pages">Pages</a>
			<a href="/dashboard">dashboard</a>
			<button
				on:click={() => {
					showModal = true;
					view = !view;
				}}
				class=" rounded-full flex gap-2 items-center"
			>
				Profile
			</button>
		{:else}
			<button on:click={() => (showModal = true)} class=" rounded-full flex gap-2 items-center">
				<UserCircle class="w-4 h-4" /> Login
			</button>
		{/if}
	</div>

	<!-- small devices burger nav options -->
	<div
		on:outside={() => (view = true)}
		use:clickOutside
		class="items-center justify-center flex-col hidden max-sm:flex transition-opacity duration-300 ease-in-out relative"
	>
		<button class="px-5 py-2 hidden max-sm:block" on:click={showNav}>
			{#if view}
				<Menu />
			{:else}
				<X />
			{/if}
		</button>

		{#if !view}
			<div
				transition:slide={{ duration: 500, easing: quintOut }}
				class={cn(
					' absolute px-5 text-primary py-2 rounded-md shadow-2xl  top-10 right-0 flex flex-col items-center gap-2 transition-all duration-300 ease-in-out z-10 bg-primary-foreground border'
				)}
			>
				{#if $page.data.user && $page.data.loggedIn}
					<a href="/pages" on:click={() => (view = !view)}>Pages</a>
					<a href="/dashboard" on:click={() => (view = !view)}>dashboard</a>
					<button
						on:click={() => {
							showModal = true;
							view = !view;
						}}
						class=" rounded-full flex gap-2 items-center"
					>
						<User class="w-4 h-4" /> Profile
					</button>
				{:else}
					<a href="/login">Login</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>

<Modal bind:showModal class="">
	<div class="flex flex-col gap-5 items-center justify-center w-full h-full">
		{#if $page.data.user && $page.data.loggedIn}
			<div class="w-full flex flex-col items-center justify-center gap-5">
				<img
					class="w-20 h-20 rounded-full object-cover object-center"
					alt=""
					src={$page.data.user.profile_pic}
				/>

				<h1>{$page.data.user.username}</h1>
				<span>{$page.data.user.email}</span>

				<form
					method="post"
					action="/logout"
					use:enhance={() => {
						return async ({ update }) => {
							await update();
							showModal = false;
						};
					}}
				>
					<button class="capitalize px-5 py-2 rounded-md bg-primary text-primary-foreground shadow"
						>Logout</button
					>
				</form>
			</div>
		{:else if !$page.data.loggedIn}
			<div transition:slide class="flex flex-col items-center justify-around gap-5">
				<img
					src="https://rstr.in/ee3j70q5p5zq4a/my-library/YTts-y0OiOm"
					alt="linkspot logo"
					class=" w-10 h-10 object-cover object-center"
				/>
				<h1 class="text-2xl">Login or Sign up</h1>
				<span>using</span>
				<div class="flex flex-col items-center gap-5 my-5">
					<a
						href="/login/github"
						class="border rounded-md px-5 py-2 shadow-sm flex items-center gap-2"
					>
						<Github class="w-6 h-6" /> Sign in with GitHub</a
					>
					<a
						href="/login/google"
						class="border rounded-md px-5 py-2 shadow-sm flex items-center gap-2"
					>
						<Google class="w-6 h-6" /> Sign in with Google</a
					>
				</div>
			</div>
		{/if}
	</div>
</Modal>
