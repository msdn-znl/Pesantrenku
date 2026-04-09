<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
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

{#each listMenu as menu (menu.nama)}
	<li class="font-medium">
		<a href={resolve(menu.href)} class={isActive(page.url.pathname, menu.href) ? 'menu-active' : ''}
			>{menu.nama}</a
		>
	</li>
{/each}
