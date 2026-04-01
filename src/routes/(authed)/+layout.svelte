<script lang="ts">
	import { enhance } from '$app/forms';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import SideMenuItemsAdmin from '$lib/components/SideMenuItemsAdmin.svelte';
	import SideMenuItemsGuru from '$lib/components/SideMenuItemsGuru.svelte';
	let { children, data } = $props();
</script>

<div class="drawer-content">
	<nav
		class="navbar
  bg-base-100/90 text-base-content sticky top-0 z-30 flex h-16 w-full [transform:translate3d(0,0,0)] justify-center backdrop-blur transition-shadow duration-100 print:hidden
  shadow-xs
  "
	>
		<label for="app-drawer" class="btn btn-square btn-ghost lg:hidden">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				class="inline-block h-6 w-6 stroke-current"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path>
			</svg>
		</label>
		<div class="flex-1"></div>
		<div class="none"></div>

		<form action="/logout" method="post" use:enhance>
			<button class="btn btn-ghost">Sign Out</button>
		</form>
	</nav>
	<main class="p-6">
		<Breadcrumbs />
		{@render children()}
	</main>
</div>
<div class="drawer-side z-40">
	<label for="app-drawer" class="drawer-overlay" aria-label="close sidebar"></label>
	<aside class="bg-base-200 min-h-screen w-4/5 lg:w-80 sticky">
		<div class="bg-base-200 navbar sticky top-0 hidden lg:flex">
			<p class="font-bold">
				Selamat Datang <br />
				{data.user.nama}
			</p>
		</div>
		<div class="h-16 lg:hidden"></div>
		<ul class="menu px-3 py-2 w-full lg:w-80">
			{#if data.user.role === 'admin'}
				<SideMenuItemsAdmin />
			{:else if data.user.role === 'guru'}
				<SideMenuItemsGuru />
			{/if}
		</ul>
	</aside>
</div>
