<script lang="ts">
	import type { PageData } from './$types';
	import { ArrowUpRight, RotateCcw } from 'lucide-svelte';
	import { createLinkPreview, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createLinkPreview({
		forceVisible: true
	});

	$: console.log($open, $content);

	export let data: PageData;
</script>

{#await data.stream.page}
	<div class="w-full min-h-screen flex gap-3 items-center justify-center">
		<h1>Loading...</h1>
		<RotateCcw class="w-8 h-8 animate-spin" />
	</div>
{:then page}
	{#if page}
		<div class="w-full flex flex-col items-center justify-center gap-5">
			<div class="flex flex-col gap-4 items-center">
				<h1 class="text-2xl font-semibold capitalize">{page.name}</h1>
				<a href="#" target="_blank">
					<img
						src={page.page_pic}
						alt="linkspot logo"
						class=" w-20 h-20 object-cover object-center rounded-full border shadow-md"
					/></a
				>
			</div>
			<div class="flex flex-col gap-3">
				{#each page.links as link}
					<div class=" w-80 flex items-center gap-2 border-2 rounded-md px-3 py-2">
						<div class="flex gap-2 items-start flex-col justify-center flex-grow">
							<span class="capitalize">{link.name}</span>
							<a
								href={link.url}
								target="_blank"
								class="text-sm text-muted-foreground"
								on:click|stopPropagation
							>
								{link.url}
							</a>
						</div>
						<a href={link.url} target="_blank"> <ArrowUpRight class="w-6 h-6" /> </a>
					</div>
				{/each}
			</div>
			<div class="flex gap-2 items-center self-center mx-10 opacity-40">
				<span class="text-sm text-muted-foreground">curated by</span>
				<img
					src={data.user?.profile_pic}
					alt={data.user?.username}
					class="w-8 h-8 rounded-full object-cover object-center shadow-md"
				/>
				<h1 class="text-lg text-muted-foreground font-semibold">{data.user?.username}</h1>
			</div>
		</div>
	{/if}
{:catch e}
	<p>error while fetching</p>
{/await}
