<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	const stats = $derived({
		hadir: data.dataAbsensi.filter((h) => h.status_kehadiran === 'hadir'),
		izin: data.dataAbsensi.filter((i) => i.status_kehadiran === 'izin'),
		alfa: data.dataAbsensi.filter((a) => a.status_kehadiran === 'alfa'),
		sakit: data.dataAbsensi.filter((s) => s.status_kehadiran === 'sakit'),
		total: data.dataAbsensi.length
	});
</script>

<svelte:head><title>Menu Guru: Detail Pertemuan</title></svelte:head>

<div class="flex flex-col gap-4">
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">
				Detail Pertemuan: {data.dataPertemuan?.jadwal.kitab.namaKitab} - {data.dataPertemuan?.jadwal
					.kelas.namaKelas}
			</h2>
			<p>Jurnal Mengajar: {data.dataPertemuan?.jurnalMengajar}</p>
			<p>Status: {data.dataPertemuan?.status}</p>
			<div class="card-action">
				<button>Edit Jurnal</button>
			</div>
		</div>
	</div>

	<div class="card bg-base-100 shadow-sm">
		<div class="stats">
			<div class="stat place-items-center">
				<div class="stat-title">Hadir</div>
				<div class="stat-value text-success">{stats.hadir.length}</div>
			</div>
			<div class="stat place-items-center">
				<div class="stat-title">Izin</div>
				<div class="stat-value text-accent">{stats.izin.length}</div>
			</div>
			<div class="stat place-items-center">
				<div class="stat-title">Alfa</div>
				<div class="stat-value text-error">{stats.alfa.length}</div>
			</div>
			<div class="stat place-items-center">
				<div class="stat-title">Sakit</div>
				<div class="stat-value text-warning">{stats.sakit.length}</div>
			</div>
			<div class="stat place-items-center">
				<div class="stat-title">Total</div>
				<div class="stat-value text-neutral">{stats.total}</div>
			</div>
		</div>
	</div>
</div>
