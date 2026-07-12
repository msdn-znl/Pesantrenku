<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const breadcrumbsMap: Record<string, string> = {
		'[id]': 'Detail',
		dashboard: 'Admin Dashboard',
		guru: 'Guru',
		jadwal: 'Jadwal',
		kamar: 'Kamar',
		kelas: 'Kelas',
		kitab: 'Kitab',
		periode: 'Tahun Ajaran',
		pertemuan: 'Pertemuan',
		santri: 'Santri',
		user: 'User',
		'dashboard-guru': 'Guru Dashboard',
		'pertemuan-guru': 'Pertemuan',
		'jadwal-guru': 'Jadwal Mengajar'
	};

	const path = $derived(page.url.pathname.split('/').filter(Boolean));
	const route = $derived(page.route.id?.split('/').filter((r) => r && !r.startsWith('(')) || []);
	const breadcrumbs = $derived(
		path.map((item, i) => {
			const routePattern = route[i];
			const fullPath = '/' + path.slice(0, i + 1).join('/');
			let label =
				breadcrumbsMap[routePattern] ||
				breadcrumbsMap[item] ||
				item.replace(/-/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
			return { label, href: fullPath };
		})
	);
</script>

<nav class="breadcrumbs text-sm bg-base-200 rounded-2xl">
	<ul class="ml-6">
		{#each breadcrumbs as item, i (item.label)}
			<li>
				{#if i === breadcrumbs.length - 1}
					<span class="font-semibold">{item.label}</span>
				{:else}
					<a href={resolve(item.href)}>{item.label}</a>
				{/if}
			</li>
		{/each}
	</ul>
</nav>
