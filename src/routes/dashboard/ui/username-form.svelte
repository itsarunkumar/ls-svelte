<script lang="ts">
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { writable } from 'svelte/store';
	import { toaster } from '@svelte-kit/svelte-toast';

	export let edit: boolean;
	let username_res = writable(null);

	export let username: string | null | undefined;
</script>

{#if !edit}
	<h1 class="text-xl font-semibold">{username}</h1>
{:else}
	<form
		action="?/username"
		method="post"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					edit = false;
					await update();
					toaster.success({
						title: 'Success',
						content: 'Username updated'
					});
				}
				if (result.type === 'error') {
					await update();

					toaster.error({
						title: 'Failure',
						content: 'Username already exists'
					});
				}
			};
		}}
		class="flex items-center gap-2"
	>
		<input
			class="border p-2 rounded-sm dark:bg-primary-foreground dark:text-primary"
			type="text"
			value={username}
			name="username"
			id="username"
			placeholder="username"
		/>
		<button class="border px-5 py-2 rounded-md bg-primary text-primary-foreground capitalize"
			>save</button
		>
	</form>
{/if}
