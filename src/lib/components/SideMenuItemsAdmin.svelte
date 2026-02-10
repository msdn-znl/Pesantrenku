<script>
	import { page } from '$app/state';

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
		<a href={menu.href} class={menu.href === page.url.pathname ? 'menu-active' : ''}>{menu.nama}</a>
	</li>
{/each}
