<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tambahData: HTMLDialogElement | undefined;
	$inspect(data.kelas);

	/* 
	  Ekspektasi struktur data yang akan Anda parsing dari server:
	  data.kelasInfo = { namaKelas: string, tipeKelas: string, tahunAjaran: string }
	  data.santriTerdaftar = [ { kelasSantriId: string, nis: string, nama: string, assignedAt: string } ]
	  data.santriTersedia = [ { santriId: string, nis: string, nama: string } ]
	*/

	// State Svelte 5 untuk UI [6]
	let isFormOpen = $state(false);
	$inspect(isFormOpen);
	let isSubmittingTambah = $state(false);
	let isSubmittingHapus = $state<string | null>(null); // Menyimpan ID yang sedang dihapus untuk loading state

	// State untuk Bulk Insert Santri Baru
	let searchQuery = $state('');
	let selectedSantri = $state<string[]>([]);

	// Derived state untuk pencarian santri yang tersedia [7]
	let filteredSantriTersedia = $derived(
		(data.santriTanpaKelas || []).filter(
			(s) =>
				s.santri.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(s.santri.nomorIndukSantri &&
					s.santri.nomorIndukSantri.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	// Derived state untuk Checkbox 'Pilih Semua' [7]
	let allSelected = $derived(
		filteredSantriTersedia.length > 0 && selectedSantri.length === filteredSantriTersedia.length
	);

	// Event handler untuk Svelte 5 tanpa titik dua (onchange) [8]
	function toggleAll(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = filteredSantriTersedia.map((s: any) => s.santriId);
		} else {
			selectedSantri = [];
		}
	}
</script>

<svelte:head>
	<title>Menu Kelas: Tambah Santri</title>
</svelte:head>
<!-- <div>
	<h1>Tambah Santri</h1>
	<div>
		<button class="btn btn-primary" onclick={() => tambahData?.showModal()}> Tambah Data</button>
	</div>
	<dialog id="tambahData" class="modal" bind:this={tambahData}>
		<div class="modal-box">
			<h2>Tambah Data Uy</h2>
			<div>
				<table class="table">
					<thead>
						<tr>
							<th></th>
							<th>Nama</th>
							<th>kelas Terdaftar</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{#each data.santriWithoutClass as santri, i (santri.id)}
							<tr>
								<th>{i + 1}</th>
								<td>{santri.nama}</td>
								<td>{santri.daftarKelas}</td>
								<td>
									<form action="?/create" method="post" use:enhance>
										<input type="string" name="id" id="id" value={santri.id} hidden />
										<button type="submit" class="btn btn-success">Tambah</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div> -->
<!-- <div>
	<h2>List Santri</h2>
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama</th>
			</tr>
		</thead>
		<tbody>
			{#each data.santriWithClass as santri, i (santri.santriId)}
				<tr>
					<th>{i + 1}</th>
					<td>{santri.santri.user.nama}</td>
					<td>
						<form action="?/delete" method="post" use:enhance>
							<input type="string" name="id" id="id" value={santri.santriId} hidden />
							<button type="submit" class="btn btn-error">Hapus Data</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div> -->
<!-- <div class="card">
	<h2 class="card-title">Tambah Santri untuk Kelas {data.kelas?.namaKelas}</h2>
	<div class="card-body">
		<form action="?/create" method="post" use:enhance>
			<fieldset class="fieldset flex flex-col md:flex-row md:flex-wrap">
				<legend class="fieldset-legend"> List Santri </legend>
				{#each data.santriTanpaKelas as santri, i (santri.santri.id)}
					<label class="">
						<input type="checkbox" name="idSantri" value={santri.santri.id} class="checkbox" />
						{santri.santri.user.name}
					</label>
				{/each}
			</fieldset>
			<button type="submit" class="btn btn-success mt-4 w-full">Tambah Santri</button>
		</form>
	</div>
</div> -->

<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header Halaman & Tombol Toggle Form -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
		<div>
			<h1 class="text-3xl font-bold text-base-content">
				Anggota Kelas: <span class="text-primary">{data.kelas?.namaKelas || '...'}</span>
			</h1>
			<p class="text-base-content/70 mt-1">
				Kelola daftar santri untuk kelas ini ({data.kelas?.tahunAjaranId || '-'}).
			</p>
		</div>
		<div class="flex gap-2">
			<a href="/kelas" class="btn btn-outline">« Kembali</a>
			<!-- Tombol untuk memunculkan form Create [1, 2] -->
			<button class="btn btn-primary" onclick={() => (isFormOpen = !isFormOpen)}>
				{isFormOpen ? 'Tutup Form' : '+ Tambah Santri ke Kelas'}
			</button>
		</div>
	</div>

	<!-- SECTION CREATE (Form Penambahan Santri Bulk) -->
	{#if isFormOpen}
		<div class="card bg-base-100 shadow-xl card-border mb-8">
			<div class="card-body">
				<h2 class="card-title text-lg mb-2 border-b pb-2">Penetapan Santri Baru</h2>

				<div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
					<input
						type="text"
						placeholder="Cari nama santri atau NIS..."
						class="input input-bordered w-full max-w-xs"
						bind:value={searchQuery}
					/>
					<div class="text-sm font-medium bg-base-200 py-2 px-4 rounded-lg">
						Terpilih: <span class="text-primary">{selectedSantri.length}</span> santri
					</div>
				</div>

				<!-- Form Action mengarah ke ?/tambah [9] -->
				<form
					method="POST"
					action="?/create"
					use:enhance={() => {
						isSubmittingTambah = true;
						return async ({ update }) => {
							await update();
							isSubmittingTambah = false;
							if (!form?.error) {
								selectedSantri = [];
								isFormOpen = false; // Otomatis tutup card jika sukses
							}
						};
					}}
				>
					<div class="overflow-y-auto border rounded-box max-h-[40vh] mb-4">
						<table class="table table-zebra table-pin-rows w-full">
							<thead>
								<tr>
									<th class="w-12 text-center">
										<input
											type="checkbox"
											class="checkbox checkbox-sm checkbox-primary"
											checked={allSelected}
											onchange={toggleAll}
										/>
									</th>
									<th>NIS</th>
									<th>Nama Santri</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredSantriTersedia as s (s.santri.id)}
									<tr>
										<td class="text-center">
											<input
												type="checkbox"
												name="idSantri"
												value={s.santri.id}
												bind:group={selectedSantri}
												class="checkbox checkbox-sm"
											/>
										</td>
										<td class="font-mono text-sm">{s.santri.nomorIndukSantri || '-'}</td>
										<td class="font-medium">{s.santri.user.name}</td>
									</tr>
								{:else}
									<tr>
										<td colspan="3" class="text-center italic text-base-content/50 py-6">
											{data.santriTanpaKelas?.length === 0
												? 'Semua santri yang aktif sudah berada di dalam kelas ini.'
												: 'Tidak ada santri yang cocok dengan pencarian.'}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="flex justify-end">
						<button
							type="submit"
							class="btn btn-primary"
							disabled={selectedSantri.length === 0 || isSubmittingTambah}
						>
							{#if isSubmittingTambah}<span class="loading loading-spinner loading-sm"></span>{/if}
							Masukkan ke Kelas
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- SECTION READ & DELETE (Daftar Santri Terdaftar) -->
	<div class="card bg-base-100 shadow-xl card-border">
		<div class="card-body p-0">
			<div class="p-6 pb-2 border-b">
				<h2 class="card-title">
					Daftar Santri di Kelas Ini
					<div class="badge badge-neutral badge-soft ml-2">
						{data.santriTerdaftarKelasAktif?.length || 0} orang
					</div>
				</h2>
			</div>

			<div class="overflow-x-auto p-4">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th class="w-12 text-center">No</th>
							<th>NIS</th>
							<th>Nama Lengkap</th>
							<th>Tanggal Ditetapkan</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#if data.santriTerdaftarKelasAktif && data.santriTerdaftarKelasAktif.length > 0}
							{#each data.santriTerdaftarKelasAktif as terdaftar, index (terdaftar.id)}
								<tr>
									<td class="text-center text-base-content/50">{index + 1}</td>
									<td class="font-mono text-sm">{terdaftar.santri.nomorIndukSantri || '-'}</td>
									<td class="font-medium">{terdaftar.santri.user.name}</td>
									<td class="text-sm">
										{new Date(terdaftar.assignedAt).toLocaleDateString('id-ID', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</td>
									<td class="text-right">
										<!-- Form Action mengarah ke ?/hapus untuk operasi Delete [9] -->
										<form
											method="POST"
											action="?/delete"
											use:enhance={() => {
												isSubmittingHapus = terdaftar.id;
												return async ({ update }) => {
													await update({ reset: false });
													isSubmittingHapus = null;
												};
											}}
										>
											<input type="hidden" name="kelasSantriId" value={terdaftar.id} />
											<!-- Memanfaatkan daisyUI variant btn-error dan btn-soft [10] -->
											<button
												type="submit"
												class="btn btn-sm btn-error btn-soft"
												disabled={isSubmittingHapus === terdaftar.id}
												onclick={(e) => {
													if (
														!confirm(
															`Yakin ingin mengeluarkan ${terdaftar.santri.user.name} dari kelas?`
														)
													)
														e.preventDefault();
												}}
											>
												{#if isSubmittingHapus === terdaftar.id}
													<span class="loading loading-spinner loading-xs"></span>
												{:else}
													Keluarkan
												{/if}
											</button>
										</form>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="5" class="text-center italic text-base-content/50 py-12">
									Belum ada santri yang terdaftar di kelas ini.
									<br />
									<span class="text-sm mt-2 block"
										>Klik tombol "+ Tambah Santri ke Kelas" di atas untuk memulai.</span
									>
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Notifikasi Form Action [11] -->
	{#if form}
		<div class="toast toast-end toast-bottom z-50">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
