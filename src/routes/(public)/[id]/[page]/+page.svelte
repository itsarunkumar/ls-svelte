<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { ArrowUpRight } from 'lucide-svelte';

	export let data: PageData;
</script>

{#await data.stream.page}
	<p>loading</p>
{:then page}
	{#if page}
		<div class="w-full flex flex-col items-center justify-center gap-5">
			<h1 class="text-2xl font-semibold capitalize">{page.name}</h1>
			<div class="flex flex-col gap-3">
				{#each page.links as link}
					<div class=" w-80 flex items-center gap-2 border rounded-md px-3 py-2">
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
				<span class="text-sm text-muted-foreground">currated by</span>
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
