<script lang="ts">
	// @ts-nocheck
	import type { PageData } from './$types';

	import { Facebook, Github, Instagram, Twitter, Youtube } from '$lib/components/icons';

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

	export let data: PageData;
</script>

<div class="w-full min-h-screen flex flex-col justify-center items-center">
	<div class="flex flex-col items-center gap-8">
		<img
			src={data.public_details?.profile_pic}
			alt={data.public_details?.username}
			class="w-24 h-24 rounded-full object-cover object-center shadow-md"
		/>
		<h1 class="text-2xl font-semibold">{data.public_details?.username}</h1>

		<div class="flex flex-col items-center gap-3">
			{#each data.public_details?.social_links as social_link}
				{#if social_link.username}
					<div class="flex items-center gap-2">
						<svelte:component
							this={icons.find((icon) => icon.title === social_link.name)?.icon}
							class="w-6 h-6 mix-blend-normal "
						/>

						<span class="text-sm italic font-philosopher font-semibold">{social_link.name}</span>

						<a
							href={social_link.url}
							target="_blank"
							class="text-sm text-muted-foreground"
							on:click|stopPropagation
						>
							{social_link.url.startsWith('http') ? social_link.url.slice(12) : social_link.url}
						</a>
					</div>
				{/if}
			{/each}
		</div>

		<div class="flex flex-col gap-3 items-center my-10 relative px-2">
			{#each data?.public_details.links as link}
				<div
					class=" w-full flex gap-2 items-center flex-col border rounded-md px-3 py-2 shadow-md bg-primary-foreground before:absolute before:-inset-1 before:rounded-md before:shadow-md before:bg-primary/5 before:blur-2xl before:w-full before:h-full before:-z-10"
				>
					<span class="capitalize font-semibold">{link.name}</span>
					<a href={link.url} target="_blank" class="text-xs text-muted-foreground">
						{link.url.startsWith('http') ? link.url.slice(12) : link.url}
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>
