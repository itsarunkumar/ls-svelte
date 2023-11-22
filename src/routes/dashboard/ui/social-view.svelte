<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import type { Icons, TData } from './types';
	import { enhance } from '$app/forms';
	import { toaster } from '@svelte-things/toast';

	export let data: TData;
	export let icons: Icons;
</script>

{#if data.user}
	<div class="px-5 w-full flex flex-wrap flex-col items-center justify-center gap-5">
		{#each data.user.social_links as link (link.id)}
			{#if link.username}
				<div
					class=" bg-primary-foreground relative flex flex-col justify-center items-center gap-3 px-2 w-96 h-36 rounded-md border shadow-md before:absolute before:-inset-3 before:rounded-md before:shadow-md before:content-[''] before:bg-primary/10 before:-z-10 before:w-full before:h-full before:blur-xl"
				>
					<div class="flex items-center gap-2 self-start align-middle px-3 border-b w-full py-0.5">
						<svelte:component
							this={icons.find((i) => i.title === link.name)?.icon}
							class="w-8 h-8   mix-blend-normal "
						/>
						<span class="text-sm italic font-philosopher">{link.name}</span>
					</div>
					<div class="flex flex-col items-start gap-1">
						<span class="text-base font-semibold">@{link.username}</span>
						<a
							href={link.url}
							target="_blank"
							class="text-xs text-muted-foreground"
							on:click|stopPropagation
							>{link.url.startsWith('http') ? link.url.slice(12) : link.url}</a
						>
					</div>

					<div class="flex gap-2 text-base items-center justify-evenly w-full capitalize">
						<a href={link.url} target="_blank" class="">view </a>

						<form
							action="?/deleteSocialLink"
							method="post"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									toaster.success({
										title: 'Success',
										content: 'Social link deleted'
									});
								};
							}}
						>
							<input type="text" name="id" id="id" value={link.id} hidden />
							<button class="capitalize text-red-500"> delete </button>
						</form>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.plan::before {
		content: '';
		position: absolute;
		z-index: -10;
		inset: 0;
		translate: -1.25rem -1.25rem;
		border-radius: inherit;
		background-color: aqua;
	}
</style>
