<script lang="ts">
	import { page } from '$app/state';
	const isActive = (currentPath: string, menuHref: string) => {
		if (menuHref === '/') {
			return currentPath === '/';
		}
		return currentPath.startsWith(menuHref);
	};
	let listMenu = [
		{ href: '/dashboard-guru', nama: 'Dashboard' },
		{ href: '/jadwal-guru', nama: 'Jadwal' },
		{ href: '/pertemuan-guru', nama: 'Pertemuan' }
	];
</script>

{#each listMenu as menu}
	<li class="font-medium">
		<a href={menu.href} class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}
			>{menu.nama}</a
		>
	</li>
{/each}
