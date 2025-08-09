<script lang="ts">
	import '../app.css';
	import { Toaster } from 'svelte-sonner';
	import { page } from '$app/state';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>{page.url.pathname}</title>
</svelte:head>
{#if data.user}
	<div class="drawer lg:drawer-open">
		<Toaster position="top-right" richColors />
		<input type="checkbox" id="app-drawer" class="drawer-toggle" />

		{@render children()}
	</div>
{:else}
	<nav class="navbar bg-base-100 shadow-sm">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl">Pesantrenku</a>
		</div>
		<div class="none"></div>
		<a href="/login" class="btn btn-ghost text-md">Login</a>
	</nav>

	{@render children()}
{/if}
