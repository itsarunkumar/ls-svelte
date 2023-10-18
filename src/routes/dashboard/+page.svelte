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
						src="https://images.unsplash.com/photo-1696590358767-4615ebd16cb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
						alt="{data.user?.username}'s profile picture"
					/>
				</div>

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
