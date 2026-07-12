<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	const isActive = (currentPath: string, menuHref: string) => {
		if (menuHref === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(menuHref);
	};
	let masterDataMenu = [
		{ href: '/user', nama: 'Data User' },
		{ href: '/guru', nama: 'Data Guru' },
		{ href: '/santri', nama: 'Data Santri' },
		{ href: '/kitab', nama: 'Data Kitab' },
		{ href: '/kamar', nama: 'Data Kamar' }
	];
	let setupMenu = [
		{ href: '/periode', nama: 'Tahun Ajaran' },
		{ href: '/penetapan-santri', nama: 'Penetapan Santri' },
		{ href: '/penugasan-guru', nama: 'Penugasan Guru' },
		{ href: '/kelas', nama: 'Manajemen Kelas' }
	];
	let akademikMenu = [
		{ href: '/jadwal', nama: 'Jadwal' },
		{ href: '/pertemuan', nama: 'Pertemuan' },
		{ href: '/rekap', nama: 'Rekap' }
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
		<h2 class="menu-title">Master Data</h2>
		<ul>
			{#each masterDataMenu as menu (menu.nama)}
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
		<h2 class="menu-title">Administrasi Akademik</h2>
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
		<h2 class="menu-title">Kegiatan Belajar Mengajar (KBM)</h2>
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
