<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full flex flex-col items-center gap-5">
	<h1 class="text-xl">Pages</h1>
	<form action="?/createPage" method="post" use:enhance class="flex flex-col items-center gap-5">
		<input
			type="text"
			name="page_name"
			id="page_name"
			placeholder="page name"
			class="border px-5 py-2 rounded-sm dark:bg-primary-foreground dark:text-primary placeholder:capitalize"
		/>
		<button class="rounded-md flex gap-2 items-center border capitalize px-5 py-2">save</button>
	</form>
</div>

<div class="w-full flex flex-col items-center gap-5 my-10">
	{#if data.pages.length === 0}
		<span> no pages created</span>
	{:else}
		{#each data.pages as page}
			<div>
				<p>{page.name}</p>
				<form action="?/deletePage" method="post" use:enhance>
					<input type="text" name="page_id" id="page_id" hidden value={page.id} />
					<button>delete {page.name} </button>
				</form>
			</div>
		{/each}
	{/if}
</div>
