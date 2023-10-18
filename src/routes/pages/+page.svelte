<script lang="ts">
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toast/toast';
	import { Edit, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { formatDistanceToNow } from 'date-fns';

	export let data: PageData;

	const pageid = $page.url.searchParams.get('pageid');

	interface modal {
		[page_id: string]: boolean;
	}

	let showModal: modal = {};

	function habdleModal(page_id: string) {
		showModal[page_id] = true;
	}
</script>

<div class="w-full flex flex-col items-center gap-5">
	<h1 class="text-xl">Pages</h1>
	<form
		action="?/createPage"
		method="post"
		use:enhance={() => {
			return async ({ update, result }) => {
				await update();
				console.log(result);
				if (result?.data.created === false) {
					addToast({
						title: 'Error',
						content: 'Page already exists',
						type: 'error'
					});
				}
			};
		}}
		class="flex flex-col items-center gap-5"
	>
		<label for="page_name" class=" text-lg">
			Page:
			<input
				required
				type="text"
				name="page_name"
				id="page_name"
				placeholder="page name"
				class="border px-5 py-2 rounded-sm dark:bg-primary-foreground dark:text-primary placeholder:capitalize"
			/></label
		>
		<button
			class="rounded-md bg-primary text-primary-foreground flex gap-2 items-center border capitalize px-5 py-2 shadow-sm"
			>create Page</button
		>
	</form>
</div>

{#if data.pages}
	<div class="w-full flex flex-col items-center gap-5 my-10">
		{#if data.pages.length === 0}
			<span class="text-2xl capitalize text-muted-foreground"> no pages created</span>
		{:else}
			{#each data.pages as page (page.id)}
				<div
					in:fly={{ duration: 500, easing: quintOut }}
					out:scale={{ duration: 500 }}
					class="min-w-[300px] flex flex-col justify-center gap-2 border rounded-md px-3 py-2"
				>
					<div class="flex items-center justify-between">
						<p class="text-lg font-semibold capitalize">{page.name}</p>

						<a href="/pages/{page.id}" class="text-blue-500">open</a>

						<form
							action="?/deletePage"
							method="post"
							use:enhance={() => {
								return async ({ result, update, formData }) => {
									await update();
									if (result.type === 'success') {
										addToast({
											title: 'Deleted',
											content: `${page.name} deleted`,
											type: 'error'
										});
									}
								};
							}}
						>
							<input type="text" name="page_id" id="page_id" hidden value={page.id} />
							<button class="text-red-500">
								<Trash class="w-4 h-4" />
							</button>
						</form>
					</div>
					<span class="text-[10px] text-muted-foreground">
						{formatDistanceToNow(new Date(page.createdAt), {
							addSuffix: true
						})} created
					</span>
				</div>
			{/each}
		{/if}
	</div>
{/if}
