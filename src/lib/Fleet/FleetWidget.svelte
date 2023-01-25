<script lang="ts">
	export let discordAccountId: string;
	export let username: string | undefined | null;
	export let connected: boolean;
	export let version: string;

	let showWidget = false;

	function handleClickLogo() {
		showWidget = !showWidget;
	}
</script>

<div
	class={`fixed ${
		showWidget
			? 'h-64 w-64 px-4 py-4 max-w-xs opacity-75 text-opacity-100'
			: 'px-0 py-0 h-0 w-0 opacity-0 text-opacity-0'
	} transition-all backdrop-blur-sm shadow-lg duration-500 ease-in-out bottom-0 right-0 z-40 bg-slate-100 rounded-3xl border-sky-900 border-2 mr-2 mb-2`}
>
	<div
		class="flex h-full w-full break-before-auto text-xs flex-col flex-wrap justify-center items-center"
	>
		{#if showWidget}
			{#if connected}
				<div
					class={`flex flex-col justify-center items-center ${
						showWidget ? 'visible' : 'hidden'
					} h-1/2 w-full`}
				>
					<h2 class="font-semibold text-md text-sky-900">
						Hi {username ? username : discordAccountId}
					</h2>
					<div>
						<img src={'/ship-line.svg'} alt="ship" class="w-14 h-14" />
					</div>
					<div class="mt-auto">
						<p>No notifications.</p>
					</div>
				</div>
			{:else}
				<div>Unable to connect to the fleet network - try again later.</div>
			{/if}
		{/if}
		<div class="mt-auto text-xs text-slate-600 flex flex-row items-center gap-2 w-full">
			{#if version}
				<p>{version}</p>
			{/if}
			<!-- <p>
				<a href="https://fleet.williamtang.me"> fleet.williamtang.me </a>
			</p> -->
		</div>
	</div>
</div>
<button
	on:click={handleClickLogo}
	class={`fixed cursor-pointer ${
		!showWidget && 'hover:border-white hover:bg-slate-600'
	} transition-all duration-500 ease-in-out bottom-0 right-0 z-50 bg-slate-700 rounded-full border-sky-900 border mr-2 mb-2`}
>
	<img src={'/billbotlogo.png'} alt="billbot-fleet logo" class="w-14 h-14 px-1 py-1" />
</button>
