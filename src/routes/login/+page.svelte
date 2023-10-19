<script lang="ts">
	import Github from '$lib/components/icons/github.svelte';
	import Google from '$lib/components/icons/google.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<!-- routes/login/+page.svelte -->
<!-- <h1>Sign in</h1>
<a href="/login/github">Sign in with GitHub</a>

<a href="/login/google">google login</a> -->

<div class="w-full min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
	<h1 class="text-2xl font-nunito text-center">Sign in or create an account</h1>
	<div class="flex flex-col items-center gap-5 my-5">
		<a href="/login/github" class="border px-5 py-2 shadow-sm flex items-center gap-2">
			<Github class="w-6 h-6" /> Sign in with GitHub</a
		>
		<a href="/login/google" class="border px-5 py-2 shadow-sm flex items-center gap-2">
			<Google class="w-6 h-6" /> Sign in with Google</a
		>
	</div>
</div>
