<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { ChevronLeft } from 'lucide-svelte';

	export let data: LayoutData;
</script>

<svelte:head>
	<title>Pages</title>
</svelte:head>

{#if $page.route.id === '/pages/[pageid]'}
	<a href="/pages" class="flex items-center gap-1 w-24 ml-10 max-sm:m-0">
		<ChevronLeft class="w-5 h-5" /> go back</a
	>
{/if}

<slot />
