<script>
	import { enhance } from '$app/forms';
	import Footer from '$lib/components/footer.svelte';
	import { CldUploadButton, CldUploadWidget } from 'svelte-cloudinary';

	export let data;
</script>

<div class="main w-full min-h-[calc(100vh-6rem)] flex flex-col items-center">
	<div class="w-full flex flex-col items-center justify-center gap-5 my-10">
		<h1 class="text-5xl sm:text-8xl">Linkspot</h1>
		<p>a oasis for your links</p>
	</div>

	<p
		class="max-sm:w-full w-1/2 text-xl font-nunito text-center px-10 first-letter:capitalize text-clip text-transparent bg-gradient-to-br from-violet-600 to-slate-900 bg-clip-text"
	>
		linkspot is an app where you can share your links under different topics as pages. You can use
		it as link in bio tool as well. Its an open source app free for individuals
	</p>

	<a href="/login" class="px-5 py-2 border rounded-md shadow-lg my-5">Get stated for free</a>
</div>

<Footer />
