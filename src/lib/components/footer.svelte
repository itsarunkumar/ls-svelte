<script>
	import DarkMode from './dark-mode.svelte';
</script>

<footer class="">
	<div class="container flex flex-col items-center justify-between px-6 py-8 mx-auto lg:flex-row">
		<a href="/">
			<h1 class="text-2xl font-semibold capitalize">linkspot</h1>
		</a>

		<div
			class="flex flex-wrap items-center justify-center gap-4 mt-6 lg:gap-6 lg:mt-0 text-primary"
		>
			<a
				href="#"
				class="text-sm transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
			>
				Overview
			</a>

			<a
				href="#"
				class="text-sm transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
			>
				Features
			</a>

			<a
				href="#"
				class="text-sm transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
			>
				Pricing
			</a>
			<a
				href="#"
				class="text-sm transition-colors duration-300 hover:text-blue-500 dark:hover:text-blue-400"
			>
				Careers
			</a>
		</div>

		<p class="mt-6 text-sm text-gray-500 lg:mt-0 dark:text-gray-400">© Copyright 2023</p>
		<!-- <DarkMode /> -->
	</div>
</footer>
