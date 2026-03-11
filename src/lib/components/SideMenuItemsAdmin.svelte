<script lang="ts">
	import { page } from '$app/state';

	const isActive = (currentPath: string, menuHref: string) => {
		if (menuHref === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(menuHref);
	};

	let listMenu = [
		{ href: '/dashboard', nama: 'Dashboard' },
		{ href: '/user', nama: 'User' },
		{ href: '/guru', nama: 'Guru' },
		{ href: '/santri', nama: 'Santri' },
		{ href: '/kamar', nama: 'Kamar' },
		{ href: '/periode', nama: 'Tahun Ajaran' },
		{ href: '/kelas', nama: 'Kelas' },
		{ href: '/kitab', nama: 'Kitab' },
		{ href: '/jadwal', nama: 'Jadwal' },
		{ href: '/pertemuan', nama: 'Pertemuan' }
	];
</script>

{#each listMenu as menu}
	<li class="font-medium">
		<a href={menu.href} class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}
			>{menu.nama}</a
		>
	</li>
{/each}
