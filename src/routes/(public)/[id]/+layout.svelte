<script lang="ts">
	import type { LayoutData } from '../$types';
	import { page } from '$app/stores';

	export let data: LayoutData;
</script>

<svelte:head>
	<title>{$page.params.id}</title>
</svelte:head>

<slot />
