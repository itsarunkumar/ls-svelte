<script lang="ts">
	// @ts-nocheck
	import { enhance } from '$app/forms';
	import { quintOut } from 'svelte/easing';
	import { fly, scale, slide } from 'svelte/transition';

	import { toaster } from '@svelte-kit/svelte-toast';

	export let link: string;
	export let name: string;
	export let id: string;
</script>

<div
	in:slide={{ duration: 500, easing: quintOut }}
	out:scale={{ duration: 500 }}
	class=" w-full flex flex-col items-center justify-center gap-3 px-2 py-4 rounded-md border shadow-md"
>
	<div class="flex flex-col items-center">
		<h1 class="text-lg font-semibold capitalize">{name}</h1>
		<a
			href={link}
			on:click|stopPropagation
			target="_blank"
			class="text-muted-foreground overflow-hidden text-clip"
		>
			{link.startsWith('http') ? link.slice(12) : link}
		</a>
	</div>
	<div class="flex gap-2 items-center w-full justify-evenly border-t">
		<a href={link} target="_blank" class="capitalize"> view </a>
		<hr class="w-[1px] h-6 border" />
		<form
			action="?/deleteLink"
			method="post"
			use:enhance={() => {
				return async ({ update, result }) => {
					await update();
					if (result.type === 'success') {
						toaster.success({ title: 'Success', content: 'Link deleted' });
					}
				};
			}}
		>
			<input type="text" name="id" id="id" value={id} hidden />
			<button class="capitalize text-red-500">delete</button>
		</form>
	</div>
</div>
