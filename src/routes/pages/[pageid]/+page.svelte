<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Trash } from 'lucide-svelte';
	import { toaster } from '@svelte-things/toast';

	export let data: PageData;

	let changePic = false;
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
			<span class="text-base">url:</span>
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

	<div class="flex flex-col items-center gap-4">
		<div class="flex flex-col items-center gap-5">
			<img
				src={data.page.page_pic}
				alt="page logo"
				class=" w-14 h-14 object-cover object-center m-5 rounded-md shadow-lg"
			/>
			<label for="changepic" class="flex gap-3 items-center">
				<input
					type="checkbox"
					name="changepic"
					id="changepic"
					class="w-4 h-4"
					on:input={() => (changePic = !changePic)}
				/>
				<span> change picture </span>
			</label>
		</div>

		{#if changePic}
			<form
				method="post"
				enctype="multipart/form-data"
				action="?/upload"
				class="flex flex-col items-center justify-center gap-2"
			>
				<div>
					<label for="image" class="block text-sm text-muted-foreground">Page Image</label>
					<input type="text" name="pageid" id="pageid" value={data.page?.id} hidden />
					<input
						name="image"
						id="image"
						type="file"
						class="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
					/>
				</div>
				<button class="px-5 py-2 rounded-md border bg-primary text-primary-foreground"
					>Upload!</button
				>
			</form>
		{/if}
	</div>

	{#if data.page?.links.length === 0}
		<div class="my-10 text-muted-foreground text-xl">No links yet , add some to share</div>
	{/if}

	{#if data.page}
		<div class="my-10 flex flex-col gap-5 items-center">
			{#each data.page.links as link (link.id)}
				<div
					animate:flip
					transition:fly
					class=" w-[300px] flex justify-between items-center gap-2 border shadow-md px-5 py-2 rounded-md"
				>
					<div class="flex flex-col items-center gap-1">
						<span class=" capitalize">{link.name}</span>
						<a
							href={link.url}
							target="_blank"
							class="text-muted-foreground text-xs"
							on:click|stopPropagation
						>
							{link.url.startsWith('http') ? link.url.slice(12) : link.url}
						</a>
					</div>

					<form
						action="?/deleteLinkPage"
						method="post"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								toaster.info({
									title: 'link delete',
									content: `${link.name} is deleted`
								});
							};
						}}
					>
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
