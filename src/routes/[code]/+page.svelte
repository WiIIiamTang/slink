<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	{#if data.error}
		<h1>{data.message} {data.code}</h1>
	{/if}
</div>
