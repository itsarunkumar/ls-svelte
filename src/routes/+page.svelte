<script>
	import Footer from '$lib/components/footer.svelte';
	import { Landing } from '$lib/components/icons';

	export let data;
</script>

<div class="main w-full min-h-[calc(100vh-6rem)] flex flex-col items-center">
	<div class="w-full flex flex-col items-center justify-center gap-5 my-10">
		<h1 class="text-5xl sm:text-8xl">Linkspot</h1>
		<p class="first-letter:capitalize text-muted-foreground">a oasis for your links</p>
	</div>

	<p
		class="max-sm:w-full w-1/2 text-xl font-nunito text-center px-10 first-letter:capitalize text-clip text-transparent bg-gradient-to-br from-slate-600 to-slate-900 bg-clip-text"
	>
		linkspot is an app where you can share your links under different topics as pages. You can use
		it as link in bio tool as well. Its an open source app free for individuals
	</p>

	{#if data.loggedIn}
		<div class="flex flex-col items-center gap-1 my-10">
			<h1>
				welcome back <span class="text-xl text-violet-600"> {data.user?.username}</span>
			</h1>
			<a
				href="/dashboard"
				class="px-5 py-2 border bg-primary text-primary-foreground rounded-md shadow-lg my-5"
			>
				Go to dashboard
			</a>
		</div>
	{:else}
		<a href="/login" class="px-5 py-2 border rounded-md shadow-lg my-5">Get stated for free</a>
	{/if}

	<Landing class="w-44 h-44 my-10 object-cover object-center" />
</div>

<Footer />
