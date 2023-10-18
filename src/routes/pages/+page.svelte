<script lang="ts">
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toast/toast';
	import { Copy, Edit, Share, Share2, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { formatDistanceToNow } from 'date-fns';
	import { copy } from '$lib/utils/copy';
	import Modal from '$lib/components/modal.svelte';
	import { onMount } from 'svelte';
	import { qr } from '@svelte-put/qr/svg';

	export let data: PageData;

	interface modal {
		[page_id: string]: boolean;
	}

	let showModal: modal = {};

	$: share_url = '';
	onMount(() => {
		share_url = `${location.origin}/${data.user?.username}/`;
	});

	function handlecopy(e: CustomEvent) {
		addToast({
			title: 'Copied',
			content: e.detail.copiedText,
			type: 'success'
		});
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
						<a href="/pages/{page.id}" class="text-lg font-semibold capitalize">{page.name}</a>

						<div class="flex gap-2 items-center justify-center">
							<!-- <a href="/pages/{page.id}" class="text-blue-500">open</a> -->

							<button
								on:click={() => (showModal[page.id] = !showModal[page.id])}
								class="flex gap-2 items-center"
							>
								<Share2 class="w-3 h-3" /> share</button
							>

							<Modal bind:showModal={showModal[page.id]} {page} class=" bg-primary-foreground">
								<div class="w-full h-full flex flex-col gap-5 justify-center items-center">
									<div class="flex flex-col items-center gap-2 capitalize font-semibold">
										<span>Scan the QR</span>
										<svg
											use:qr={{
												data: `${location.origin}/${data.user?.username}/${page.name}`,
												logo: 'https://rstr.in/ee3j70q5p5zq4a/my-library/YTts-y0OiOm',
												shape: 'circle'
											}}
											class="w-40 h-40 p-3 bg-slate-50 text-slate-950 rounded-md"
										/>
									</div>
									<div class="text-primary flex flex-col gap-2 items-center">
										<span class="font-semibold capitalize">share the link</span>
										<p class="text-muted-foreground p-1 bg-muted rounded-md">
											{share_url + page.name}
										</p>
										<button
											use:copy={{ text: `${location.origin}/${data.user?.username}/${page.name}` }}
											on:copied={handlecopy}
											class="flex gap-2 items-center"
										>
											copy <Copy class="w-3 h-3" />
										</button>
									</div>
								</div>
							</Modal>
						</div>

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
