<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import { Trash } from 'lucide-svelte';

	export let data: PageData;
</script>

<div class="w-full flex flex-col justify-center items-center">
	<form action="?/addLinkPage" method="post" use:enhance class="flex flex-col items-center gap-5">
		<label for="link_name">
			<span class="text-base">Link:</span>
			<input
				type="text"
				name="link_name"
				id="link_name"
				class="px-5 py-2 shadow-sm border placeholder:capitalize"
				placeholder="link name"
			/>
		</label>
		<label for="link_url">
			<span class="text-base">Url:</span>
			<input
				type="url"
				name="link_url"
				id="link_url"
				class="px-5 py-2 border shadow-sm"
				placeholder="https://example.com"
			/>
		</label>
		<button class="bg-primary text-primary-foreground px-5 py-2 rounded-md border capitalize"
			>add link</button
		>
	</form>

	{#if data.page}
		<div class="my-10 flex flex-col gap-5 items-center">
			{#each data.page.links as link (link.id)}
				<div
					transition:fly
					class=" w-[300px] flex justify-between items-center gap-2 border shadow-md px-5 py-2 rounded-md"
				>
					<div class="flex flex-col items-center gap-1">
						<span class="">{link.name}</span>
						<a
							href={link.url}
							target="_blank"
							class="text-muted-foreground text-xs"
							on:click|stopPropagation
						>
							{link.url.startsWith('http') ? link.url.slice(12) : link.url}
						</a>
					</div>

					<form action="?/deleteLinkPage" method="post" use:enhance>
						<input type="text" name="link_id" id="link_id" hidden value={link.id} />
						<button class="text-red-500">
							<Trash class="w-4 h-4" />
						</button>
					</form>
				</div>
			{/each}
		</div>
	{/if}
</div>
