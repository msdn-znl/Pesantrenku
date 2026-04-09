<script lang="ts">
	import type { PageServerData } from './$types';
	import { resolve } from '$app/paths';
	let { data }: { data: PageServerData } = $props();
	$inspect(data.jadwalList);
</script>

<svelte:head>
	<title>Menu Jadwal Guru</title>
</svelte:head>

<div class="flex flex-col flex-wrap gap-4 w-full md:flex-row">
	{#each data.jadwalList as jadwal (jadwal.id)}
		<div class="card bg-base-100 shadow-sm">
			<div class="card-body">
				<h2 class="card-title">{jadwal.kitab.namaKitab} - {jadwal.hari}</h2>
				<div class="card-actions justify-end">
					<a
						href={resolve('/(authed)/(guru)/jadwal-guru/[id]', { id: jadwal.id })}
						class="btn btn-primary">Detail Jurnal</a
					>
				</div>
			</div>
		</div>
	{/each}
	<!-- <div class="card bg-base-100 shadow-sm card-lg">
		<div class="card-body">
			<h2 class="card-title">Ini Preview Card-nya</h2>
			<div class="card-actions justify-end">
				<a href="/#" class="btn btn-primary">Detail</a>
			</div>
		</div>
	</div>
	<div class="card bg-base-100 shadow-sm card-lg">
		<div class="card-body">
			<h2 class="card-title">Ini Preview Card-nya</h2>
			<div class="card-actions justify-end">
				<a href="/#" class="btn btn-primary">Detail</a>
			</div>
		</div>
	</div> -->
</div>
