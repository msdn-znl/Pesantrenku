<script>
	import { page } from '$app/state';
	let listMenu = [
		{ href: '/dashboard-guru', nama: 'Dashboard' },
		{ href: '/jadwal-guru', nama: 'Jadwal' },
		{ href: '/pertemuan-guru', nama: 'Pertemuan' }
	];
</script>

{#each listMenu as menu}
	<li class="font-medium">
		<a href={menu.href} class={menu.href === page.url.pathname ? 'menu-active' : ''}>{menu.nama}</a>
	</li>
{/each}
