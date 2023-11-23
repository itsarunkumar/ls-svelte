<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Icons, TData } from './types';

	import { toaster } from '@svelte-kit/svelte-toast';

	export let icons: Icons;

	export let data: TData;

	export let edit: boolean;
</script>

<form
	action="?/social"
	method="post"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();
			edit = false;
			if (result.type === 'success') {
				toaster.success({
					title: 'Success',
					content: 'Social links updated'
				});
			}
		};
	}}
	class="flex flex-col gap-4 items-center"
>
	{#if data.user}
		{#each ['instagram', 'github', 'facebook', 'twitter', 'youtube'] as link}
			<div class="flex gap-2 items-center">
				<svelte:component this={icons.find((i) => i.title === link)?.icon} class="w-6 h-6 " />
				<input
					type="text"
					name={link}
					id={link}
					value={data.user.social_links.find((l) => l.name === link)?.username === undefined
						? ''
						: data.user.social_links.find((l) => l.name === link)?.username}
					placeholder={'@' + link.toLowerCase()}
					class="border p-2 rounded-sm dark:bg-primary-foreground dark:text-primary placeholder:text-sm"
				/>
			</div>
		{/each}
	{/if}

	<button class="border px-5 py-2 rounded-md bg-primary text-primary-foreground capitalize"
		>save</button
	>
</form>
