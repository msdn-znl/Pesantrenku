<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	const isActive = (currentPath: string, menuHref: string) => {
		if (menuHref === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(menuHref);
	};
	let userManagementMenu = [
		{ href: '/(authed)/(admin)/user', nama: 'User' },
		{ href: '/(authed)/(admin)/guru', nama: 'Guru' },
		{ href: '/(authed)/(admin)/santri', nama: 'Santri' }
	];
	let setupMenu = [
		{ href: '/(authed)/(admin)/periode', nama: 'Tahun Ajaran' },
		{ href: '/(authed)/(admin)/kelas', nama: 'Kelas' },
		{ href: '/(authed)/(admin)/penetapan-santri', nama: 'Penetapan Santri' },
		{ href: '/(authed)/(admin)/penugasan-guru', nama: 'Penugasan Guru' },
		{ href: '/(authed)/(admin)/kamar', nama: 'Kamar' }
	];
	let akademikMenu = [
		{ href: '/(authed)/(admin)/kitab', nama: 'Kitab' },
		{ href: '/(authed)/(admin)/jadwal', nama: 'Jadwal' },
		{ href: '/(authed)/(admin)/pertemuan', nama: 'Pertemuan' }
	];
	// let listMenu = [
	// 	{ href: '/dashboard', nama: 'Dashboard' },
	// 	{ href: '/user', nama: 'User' },
	// 	{ href: '/guru', nama: 'Guru' },
	// 	{ href: '/santri', nama: 'Santri' },
	// 	{ href: '/kamar', nama: 'Kamar' },
	// 	{ href: '/periode', nama: 'Tahun Ajaran' },
	// 	{ href: '/kelas', nama: 'Kelas' },
	// 	{ href: '/kitab', nama: 'Kitab' },
	// 	{ href: '/jadwal', nama: 'Jadwal' },
	// 	{ href: '/pertemuan', nama: 'Pertemuan' }
	// ];
</script>

<!-- <ul class="menu">
	{#each listMenu as menu (menu.href)}
		<li class="font-medium">
			<a
				href={resolve(menu.href)}
				class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}>{menu.nama}</a
			>
		</li>
	{/each}
</ul> -->

<ul>
	<li>
		<a
			href={resolve('/dashboard')}
			class={isActive(page.url.pathname, '/dashboard') ? 'menu-active' : ''}>Dashboard</a
		>
	</li>
	<li>
		<h2 class="menu-title">User</h2>
		<ul>
			{#each userManagementMenu as menu (menu.nama)}
				<li>
					<a
						href={resolve(menu.href)}
						class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}>{menu.nama}</a
					>
				</li>
			{/each}
		</ul>
	</li>
	<li>
		<h2 class="menu-title">Tahun Ajaran</h2>
		<ul>
			{#each setupMenu as menu (menu.nama)}
				<li>
					<a
						href={resolve(menu.href)}
						class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}>{menu.nama}</a
					>
				</li>
			{/each}
		</ul>
	</li>
	<li>
		<h2 class="menu-title">Akademik</h2>
		<ul>
			{#each akademikMenu as menu (menu.nama)}
				<li>
					<a
						href={resolve(menu.href)}
						class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}>{menu.nama}</a
					>
				</li>
			{/each}
		</ul>
	</li>
</ul>
