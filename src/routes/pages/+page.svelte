<script lang="ts">
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { Check, Copy, Edit, Share, Share2, Trash } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { formatDistanceToNow } from 'date-fns';
	import { copy } from '$lib/utils/copy';
	import Modal from '$lib/components/modal.svelte';
	import { onMount } from 'svelte';
	import { qr } from '@svelte-put/qr/svg';

	import { toaster } from '@svelte-kit/svelte-toast';

	export let data: PageData;

	interface modal {
		[page_id: string]: boolean;
	}

	let showModal: modal = {};

	$: share_url = '';
	onMount(() => {
		share_url = `${location.origin}/${data.user?.username}/`;
	});

	let isCopied = false;

	function handlecopy(e: CustomEvent) {
		isCopied = true;

		setTimeout(() => {
			isCopied = false;
		}, 2000);
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

				if (result?.data.created === false) {
					toaster.error({
						title: 'Error',
						content: 'Page already exists'
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

{#await data.stream?.c}
	<div class="w-full flex items-center justify-center text-4xl min-h-[calc(100vh-6rem)]">
		Loading...
	</div>
{:then pages}
	<div class="w-full flex flex-col items-center gap-5 my-10">
		{#if pages?.length === 0}
			<span class="text-2xl capitalize text-muted-foreground"> no pages created</span>
		{:else if pages}
			{#each pages as page (page.id)}
				<div
					in:fly={{ duration: 500, easing: quintOut }}
					out:scale={{ duration: 500 }}
					class="min-w-[300px] flex flex-col justify-center gap-2 border-2 shadow-xl rounded-md px-3 py-2"
				>
					<div class="flex items-center justify-between">
						<a href="/pages/{page.id}" class="text-lg font-semibold capitalize">{page.name}</a>

						<div class="flex gap-2 items-center justify-center">
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
											{#if isCopied}
												<span class="flex gap-2 items-center"><Check class="w-3 h-3" /> copied</span
												>
											{:else}
												<span class="flex gap-2 items-center"><Copy class="w-3 h-3" /> copy</span>
											{/if}
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
										toaster.error({
											title: 'Deleted',
											content: `${page.name} deleted`
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
{:catch error}
	<div class="text-2xl">Something went wrong , please try again</div>
{/await}
