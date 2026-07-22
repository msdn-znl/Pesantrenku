<script lang="ts">
	import type { PageServerData } from './$types';
	import { resolve } from '$app/paths';
	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>Menu Jadwal Guru</title>
</svelte:head>

<!-- <div class="flex flex-col flex-wrap gap-4 w-full md:flex-row">
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
</div> -->

<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header Halaman -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Daftar Jadwal Mengajar</h1>
		<p class="text-base-content/70 mt-1">
			Pilih jadwal pelajaran Anda untuk melihat detail rekam jurnal harian.
		</p>
	</div>

	<!-- Layout Grid untuk Card Jadwal -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.jadwalList as jadwal (jadwal.id)}
			<div class="card bg-base-100 shadow-xl card-border">
				<div class="card-body">
					<!-- Top Info: Hari & Jam -->
					<div class="flex justify-between items-start mb-2">
						<div class="badge badge-primary badge-soft font-medium">
							{jadwal.hari}
						</div>
						<!-- Menampilkan jam (potong detik jika formatnya HH:MM:SS) -->
						<div class="badge badge-neutral badge-soft font-mono">
							{jadwal.jamMulai?.slice(0, 5) || '-'} - {jadwal.jamSelesai?.slice(0, 5) || '-'}
						</div>
					</div>

					<!-- Judul & Detail (Kitab dan Kelas) -->
					<h2 class="card-title text-primary text-xl mt-2">
						{jadwal.kitab.namaKitab}
					</h2>
					<!-- Asumsi data kelas di-join juga, sangat disarankan ditampilkan agar guru tidak bingung -->
					<p class="text-base-content/70 font-medium">
						Kelas: {jadwal.kelas?.namaKelas || 'Semua Kelas'}
					</p>

					<!-- Tombol Aksi -->
					<div class="card-actions justify-end mt-6">
						<a
							href={resolve('/(authed)/(guru)/jadwal-guru/[id]', { id: jadwal.id })}
							class="btn btn-primary w-full sm:w-auto"
						>
							Detail Jurnal
						</a>
					</div>
				</div>
			</div>
		{:else}
			<!-- Tampilan jika list jadwal kosong -->
			<div class="col-span-full">
				<div class="card bg-base-100 shadow-sm border border-base-200">
					<div class="card-body text-center py-12">
						<p class="text-lg font-medium text-base-content/70">
							Anda belum memiliki jadwal mengajar yang terdaftar saat ini.
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
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
