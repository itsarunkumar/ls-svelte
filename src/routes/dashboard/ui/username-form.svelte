<script lang="ts">
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/toast/toast';
	import { writable } from 'svelte/store';

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
					addToast({
						title: 'Success',
						content: 'Username updated',
						type: 'success'
					});
				}
				if (result.type === 'error') {
					addToast({
						title: 'Failure',
						content: 'Username already exists',
						type: 'error'
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
		<button
			class="border px-5 py-2 rounded-sm dark:bg-primary-foreground dark:text-primary capitalize"
			>save</button
		>
	</form>
{/if}
