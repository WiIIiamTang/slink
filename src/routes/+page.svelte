<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
	export let data: PageData;

	$: ({ shortlinks } = data);
</script>

<h1>Welcome to SvelteKit</h1>

<form action="?/createShortLink" method="POST" use:enhance>
	<h3>New shortlink</h3>
	<input type="text" name="url" placeholder="URL" />
	<button type="submit">Create</button>

	{#if form?.error}
		<p class="error">{form.message}</p>
	{:else if form?.success}
		<p class="success">{form.code} {form.createdAt} {form.visits}</p>
	{/if}
</form>

<div>
	<h2>Current shortlinks</h2>
	{#each shortlinks as shortlink}
		<p>{shortlink.shortUrl} {shortlink.createdAt} {shortlink.visits} {shortlink.original}</p>
	{/each}
</div>
