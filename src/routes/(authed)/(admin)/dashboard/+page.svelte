<!-- <script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let jadwalId = $state<string | null>(null);
</script>


<h1>Hi, {data.user.username}!</h1> -->
<script lang="ts">
	// Menerima data dari load function (+page.server.ts) menggunakan Svelte 5 $props rune
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard Admin</title>
</svelte:head>
<!-- Wrapper utama tanpa sidebar/navbar -->
<div class="p-6 min-h-screen">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Ikhtisar Pesantren</h1>
		<p class="text-base-content/70 mt-1">Ringkasan data operasional pesantren hari ini.</p>
	</div>

	<!-- Bagian Statistik (Overview Data) -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<!-- Stat: Total Santri -->
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">Total Santri</div>
				<div class="stat-value text-primary">{data.totalSantri}</div>
				<div class="stat-desc">Terdaftar di sistem</div>
			</div>
		</div>

		<!-- Stat: Total Guru -->
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">Total Guru</div>
				<div class="stat-value text-secondary">{data.totalGuru}</div>
				<div class="stat-desc">Staf pengajar aktif</div>
			</div>
		</div>

		<!-- Stat: Total Kelas -->
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">Total Kelas</div>
				<div class="stat-value text-accent">{data.totalKelas}</div>
				<div class="stat-desc">Diniyah & Al-Quran</div>
			</div>
		</div>

		<!-- Stat: Total Kamar -->
		<div class="stats shadow">
			<div class="stat">
				<div class="stat-title">Total Kamar</div>
				<div class="stat-value text-info">{data.totalKamar}</div>
				<div class="stat-desc">Asrama santri</div>
			</div>
		</div>
	</div>

	<!-- Bagian Tabel: Pendaftaran Santri Terbaru -->
	<div class="card bg-base-100 shadow-xl card-border">
		<div class="card-body">
			<h2 class="card-title mb-4">Pendaftaran Santri Terbaru</h2>
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>NIS</th>
							<th>Nama Lengkap</th>
							<th>Kamar ID</th>
							<th>Tahun Ajaran ID</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						<!-- Iterasi data pendaftaran menggunakan blok #each Svelte -->
						{#each data.pendaftaranTerbaru as daftar (daftar.nis)}
							<tr>
								<td>{daftar.nis || '-'}</td>
								<td>{daftar.nama}</td>
								<td class="font-mono text-sm">{daftar.kamarId || 'Belum diatur'}</td>
								<td class="font-mono text-sm">{daftar.tahunAjaranId}</td>
								<td>
									<!-- Render warna badge kondisional berdasarkan status enum -->
									{#if daftar.status === 'aktif'}
										<div class="badge badge-success badge-soft">{daftar.status}</div>
									{:else if daftar.status === 'lulus'}
										<div class="badge badge-info badge-soft">{daftar.status}</div>
									{:else}
										<div class="badge badge-error badge-soft">{daftar.status}</div>
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center italic text-base-content/50"
									>Tidak ada data pendaftaran terbaru.</td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
