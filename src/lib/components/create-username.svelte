<script lang="ts">
	export let showModal: boolean;
	export let resText: string;

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

{#if showModal}
	<div
		class=" flex flex-col items-center justify-center z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border rounded-md shadow-xl bg-gray-100/40 w-full h-full"
	>
		<div
			class="  flex flex-col items-center justify-center absolute bg-primary-foreground w-80 h-80 border rounded-md shadow-xl"
		>
			<img
				src={$page.data.user.profile_pic}
				alt="linkspot logo"
				class=" w-14 h-14 object-cover object-center rounded-md shadow-md border"
			/>
			<form
				action="/login/username"
				method="post"
				use:enhance={() => {
					return async ({ update, result }) => {
						if (result.type === 'success') {
							resText = result.data?.msg;
							await update();
							showModal = false;
						}

						resText = 'try another username';
					};
				}}
				class="flex flex-col items-center justify-center gap-5 my-5"
			>
				<h1 class="text-2xl font-semibold">Create a username</h1>
				<input type="text" name="userid" id="userid" value={$page.data.userId} hidden />
				<input
					type="text"
					name="username"
					id="username"
					class="border {resText
						? 'border-red-500'
						: ''} px-5 py-2 rounded-md outline-none dark:bg-primary-foreground dark:text-primary placeholder:capitalize"
					placeholder="create a username"
				/>

				<button class="border px-5 py-2 rounded-md bg-primary text-primary-foreground capitalize"
					>create username</button
				>
			</form>

			{#if resText}
				<span class="text-xs text-muted-foreground my-5">{resText}</span>
			{/if}
		</div>
	</div>
{/if}
