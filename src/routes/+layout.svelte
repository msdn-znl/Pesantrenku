<script lang="ts">
	import '../app.css';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { Toaster } from 'svelte-sonner';

	let { children, data } = $props();

	let listMenu = [
		{ href: '/dashboard', nama: 'Dashboard' },
		{ href: '/user', nama: 'User' },
		{ href: '/guru', nama: 'Guru' },
		{ href: '/santri', nama: 'Santri' },
		{ href: '/periode', nama: 'Tahun Ajaran' },
		{ href: '/kelas', nama: 'Kelas' },
		{ href: '/kitab', nama: 'Kitab' },
		{ href: '/jadwal', nama: 'Jadwal' },
		{ href: '/pertemuan', nama: 'Pertemuan' }
	];
</script>

{#if data.user}
	<div class="drawer lg:drawer-open">
		<Toaster position="top-right" richColors />
		<input type="checkbox" id="app-drawer" class="drawer-toggle" />
		<div class="drawer-content">
			<nav class="navbar bg-base-100 shadow-sm sticky top-0 z-30">
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
				<div class="flex-1">
					<br />
				</div>
				<div class="none"></div>

				<form action="/logout" method="post" use:enhance>
					<button class="btn btn-ghost">Sign Out</button>
				</form>
			</nav>

			{@render children()}
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
				<ul class="menu w-4/5 lg:w-80">
					{#each listMenu as menu}
						<li class="font-medium">
							<a href={menu.href} class={menu.href === page.url.pathname ? 'menu-active' : ''}
								>{menu.nama}</a
							>
						</li>
					{/each}
				</ul>
			</aside>
		</div>
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
