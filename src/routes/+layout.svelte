<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	let { children, data } = $props();
	import { resolve } from '$app/paths';
	let isDrawerOpen = $state(false);
	afterNavigate(() => {
		isDrawerOpen = false;
	});
</script>

<!-- <svelte:head>
	<title>{page.url.pathname}</title>
</svelte:head> -->
{#if data.user}
	<div class="drawer lg:drawer-open">
		<Toaster position="top-right" richColors />
		<input type="checkbox" id="app-drawer" class="drawer-toggle" bind:checked={isDrawerOpen} />

		{@render children()}
	</div>
{:else}
	<nav class="navbar bg-base-100 shadow-sm">
		<div class="flex-1">
			<a href={resolve('/')} class="btn btn-ghost text-xl">Pesantrenku</a>
		</div>
		<div class="none"></div>
		<a href={resolve('/login')} class="btn btn-ghost text-md">Login</a>
	</nav>

	{@render children()}
{/if}
