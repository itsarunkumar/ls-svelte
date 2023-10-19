<script lang="ts">
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils/cn';
	import type { PageData } from './$types';
	import { Youtube, Instagram, Github, Twitter, Facebook } from '$lib/components/icons';
	import UsernameForm from './ui/username-form.svelte';
	import SociallinkForm from './ui/sociallink-form.svelte';
	import SocialView from './ui/social-view.svelte';
	import Link from './ui/link.svelte';
	import { addToast } from '$lib/components/toast/toast';

	export let data: PageData;

	$: selected = 'details';

	$: links = data.links;

	$: uploading = false;

	let edit: boolean = false;

	const icons = [
		{
			title: 'instagram',
			icon: Instagram
		},
		{
			title: 'github',
			icon: Github
		},
		{
			title: 'youtube',
			icon: Youtube
		},
		{
			title: 'twitter',
			icon: Twitter
		},
		{
			title: 'facebook',
			icon: Facebook
		}
	];
</script>

<div class="w-full flex flex-col items-center">
	<h1 class="text-xl">Dashboard</h1>

	<div class="flex items-center space-x-2 self-end align-middle mr-5">
		<label for="edit" class="cursor-pointer">
			<span class="relative">
				<!-- Hidden input -->
				<input
					type="checkbox"
					name="edit"
					id="edit"
					class="sr-only"
					bind:checked={edit}
					on:click={() => (edit = !edit)}
					on:change={() => console.log(edit)}
				/>

				<!-- Visible switch -->
				<span class="block bg-primary w-10 h-6 rounded-full transition duration-300 ease-in-out" />

				<!-- Switch knob -->
				<span
					class="absolute left-1 top-1 bg-primary-foreground w-4 h-4 rounded-full transition-transform duration-300 ease-in-out transform translate-x-0"
					style="transform: translateX({edit ? '100%' : '0'})"
				/>
			</span>
		</label>

		<span class="text-gray-600">Edit</span>
	</div>

	<div class="flex justify-around items-center gap-10 mt-14">
		<button
			on:click={() => (selected = 'details')}
			class={cn(
				`${
					selected === 'details' ? 'text-primary underline underline-offset-1 text-decoration' : ''
				}`
			)}>My Details</button
		>
		<button
			on:click={() => (selected = 'links')}
			class={cn(
				`${selected === 'links' ? 'text-primary underline underline-offset-1 text-decoration' : ''}`
			)}>My Links</button
		>
	</div>
	<div class="my-5">
		{#if selected === 'details'}
			<div class="flex flex-col items-center gap-5">
				<div class=" rounded-full border-2 shadow-sm">
					<img
						class="w-24 h-24 rounded-full object-cover object-center"
						src={data.user?.profile_pic}
						alt="{data.user?.username}'s profile picture"
					/>
				</div>

				{#if uploading}
					<span class="text-sm text-gray-600">Uploading...</span>
				{/if}

				{#if edit}
					<form
						method="post"
						enctype="multipart/form-data"
						action="?/upload"
						class="flex flex-col items-center justify-center gap-2"
					>
						<div>
							<label for="image" class="block text-sm text-muted-foreground">Profile Image</label>

							<input
								name="image"
								id="image"
								type="file"
								class="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg file:bg-gray-200 file:text-gray-700 file:text-sm file:px-4 file:py-1 file:border-none file:rounded-full dark:file:bg-gray-800 dark:file:text-gray-200 dark:text-gray-300 placeholder-gray-400/70 dark:placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:focus:border-blue-300"
							/>
						</div>
						<button
							disabled={uploading}
							class="px-5 py-2 rounded-md border bg-primary text-primary-foreground">Upload!</button
						>
					</form>
				{/if}

				<UsernameForm bind:edit username={data.user?.username} />

				<span>{data.user?.email}</span>
				<div class="flex flex-col gap-4 items-center">
					<h1>Social Links</h1>

					{#if !edit}
						<SocialView {icons} {data} />
					{:else}
						<span class="text-xs text-muted-foreground capitalize"
							>enter your username and make sure your profile is public</span
						>
						<SociallinkForm bind:edit {icons} {data} />
					{/if}
				</div>
			</div>
		{:else if selected === 'links'}
			<div class="w-full flex items-center flex-col gap-5 px-3">
				<form
					action="?/createLink"
					method="post"
					use:enhance={() => {
						return async ({ update, result }) => {
							await update();
							if (result.type === 'success') {
								addToast({
									title: 'Success',
									content: 'Link created'
								});
							}
						};
					}}
					class=" max-sm:w-full flex max-sm:flex-col items-center justify-center gap-2"
				>
					<input
						type="text"
						name="name"
						id="name"
						placeholder="link name"
						class=" max-sm:w-full px-5 py-2 border rounded-sm dark:bg-primary-foreground dark:text-primary placeholder:capitalize"
					/>
					<input
						type="url"
						name="url"
						id="url"
						placeholder="https://example.com"
						class=" max-sm:w-full border px-5 py-2 rounded-sm dark:bg-primary-foreground dark:text-primary"
					/>
					<button class="border px-5 py-2 rounded-md bg-primary text-primary-foreground capitalize"
						>save</button
					>
				</form>

				<div class="flex flex-col gap-2 items-center">
					{#each links as link (link.id)}
						<Link link={link.url} name={link.name} id={link.id} />
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
