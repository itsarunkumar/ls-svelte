<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<pre>
	{JSON.stringify($page.params, null, 2)}
</pre>

<pre>{JSON.stringify(data.page, null, 2)}</pre>
