<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';
	export let form: ActionData;
	export let data: PageData;

	$: ({ shortlinks } = data);
</script>

<h1 class="my-4 font-bold uppercase text-3xl">Shortlink</h1>

<form action="?/createShortLink" method="POST" use:enhance>
	<h2 class="text-xl font-semibold">New shortlink:</h2>
	<div class="flex flex-col justify-center gap-2 items-center">
		<input
			type="text"
			name="url"
			placeholder="URL"
			class="border shadow-md py-2 rounded-md px-2 w-full"
		/>
		<button
			type="submit"
			class="bg-slate-800 rounded-md w-1/4 py-2 border-2 ml-2 px-4 shadow-md text-white"
			>Create</button
		>
	</div>

	{#if form?.error}
		<p class="error bg-red-300 rounded-md py-2 px-2 text-sm mt-4 font-bold">{form.message}</p>
	{:else if form?.success}
		<p class="success bg-emerald-300 rounded-md py-2 px-2 text-sm mt-4 font-bold">
			Success!
			{form.code}
		</p>
	{/if}
</form>

<div class="py-4">
	<h2 class="text-xl font-semibold">Your current shortlinks:</h2>
	<div class="flex flex-col gap-4">
		{#each shortlinks as shortlink}
			<div
				class="flex flex-col justify-center py-2 px-2 w-full items-center bg-slate-200 rounded-md"
			>
				<div class="flex flex-row flex-wrap w-full justify-center">
					<div class="w-1/2 break-all border-r-zinc-400 border-r px-2">
						<a href={shortlink.original} target="_blank" rel="noopener noreferrer" class="text-sm"
							>{shortlink.original}</a
						>
					</div>
					<div class="w-1/2 border-l-zinc-400 border-l px-2">
						<a
							href={`https://s.wclt.tech/${shortlink.shortUrl}`}
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm">{`https://s.wclt.tech/${shortlink.shortUrl}`}</a
						>
					</div>
				</div>

				<div class="border-t-2 border-t-zinc-500 w-full text-center">
					Visits: {shortlink.visits}
				</div>

				<div>
					<form action="?/deleteShortLink" method="POST" use:enhance>
						<input type="number" class="hidden" name="id" value={shortlink.id} />
						<button
							type="submit"
							class="bg-red-500 rounded-md w-fit py-2 border-2 px-4 shadow-md text-white"
						>
							Delete
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</div>
