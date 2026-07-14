<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data }: { data: PageServerData } = $props();
	let selectedSantri: string[] = $state([]);
	let deleteSantriKelasModal: HTMLDialogElement;
	const { tahunMulai, tahunSelesai, tipeSemester } = data.infoKelas?.tahun_ajaran;
	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.listSantri.map((item) => item.id);
		} else {
			selectedSantri = [];
		}
	};
</script>

<svelte:head><title>Detail Kelas</title></svelte:head>

<dialog class="modal" id="delete_santri_kelas_modal" bind:this={deleteSantriKelasModal}>
	<div class="modal-box">
		<p>Apakah Anda Yakin untuk Menghapus data yang terpilih?</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-success">Batal</button>
			</form>
			<form
				action="?/delete"
				method="post"
				id="delete-santri-kelas"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							deleteSantriKelasModal.close();
						}
						await update();
					};
				}}
			>
				<button type="submit" class="btn btn-error">Hapus</button>
			</form>
		</div>
	</div>
</dialog>

<!-- <div class="card">
	<div class="card-body">
		<h2 class="card-title">Detail Kelas</h2>
		<div>
			<table class="table">
				{#if data.infoKelas != undefined}
					<tbody>
						<tr>
							<th>Nama Kelas</th>
							<td>{data.infoKelas.namaKelas}</td>
						</tr>
						<tr>
							<th>Tahun Ajaran</th>
							<td
								>{data.infoKelas.tahun_ajaran?.tahunMulai +
									'/' +
									data.infoKelas.tahun_ajaran?.tahunSelesai +
									' ' +
									data.infoKelas.tahun_ajaran?.tipeSemester?.toUpperCase()}</td
							>
						</tr>
						<tr>
							<th>Wali Kelas</th>
							<td>{data.infoKelas.guru?.user.name}</td>
						</tr>
					</tbody>
				{/if}
			</table>
			{#if data.infoKelas != undefined}
				<div class="card-actions justify-end mt-4">
					<a href={resolve(`/kelas/${data.infoKelas.id}/tambah-santri`)} class="btn btn-accent"
						>Tambah Santri</a
					>
					{#if selectedSantri.length > 0}
						<button
							class="btn btn-error"
							onclick={() => {
								deleteSantriKelasModal.showModal();
							}}>Hapus Data</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
<div class="card">
	<table class="table">
		<thead>
			<tr>
				<th
					><label for=""
						><input
							type="checkbox"
							name=""
							id="main-checkbox"
							onchange={toggleSelectAll}
							class="checkbox checkbox-md"
						/></label
					></th
				>
				<th></th>
				<th>Nama</th>
			</tr>
		</thead>
		<tbody>
			{#each data.listSantri as santri_kelas, i (santri_kelas.id)}
				<tr>
					<th
						><label for=""
							><input
								type="checkbox"
								name="idSantri"
								id=""
								class="checkbox checkbox-md"
								form="delete-santri-kelas"
								value={santri_kelas.santriId}
								bind:group={selectedSantri}
							/></label
						></th
					>
					<th>{i + 1}</th>
					<td>{santri_kelas.santri.user.name}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div> -->

<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header & Tombol Kembali -->
	<div class="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
		<div>
			<h1 class="text-3xl font-bold text-base-content">
				Detail Kelas: {data.infoKelas?.namaKelas || 'Memuat...'}
			</h1>
			<p class="text-base-content/70 mt-1">
				Informasi lengkap kelas dan daftar santri yang terdaftar.
			</p>
		</div>
		<a href="/kelas" class="btn btn-outline"> « Kembali ke Daftar Kelas </a>
	</div>

	<!-- Layout Grid Utama -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Kolom Kiri: Informasi Kelas (1/3 Lebar Layar) -->
		<div class="col-span-1">
			<div class="card bg-base-100 shadow-xl card-border">
				<div class="card-body">
					<h2 class="card-title text-lg border-b border-base-200 pb-2">Informasi Kelas</h2>

					<div class="mt-4 space-y-4">
						<div>
							<p class="text-sm text-base-content/60">Nama Kelas</p>
							<p class="font-medium text-lg">{data.infoKelas?.namaKelas || '-'}</p>
						</div>
						<div>
							<p class="text-sm text-base-content/60">Tipe Kelas</p>
							<!-- Penggunaan varian badge-soft daisyUI 5 -->
							<div
								class="badge {data.infoKelas?.tipeKelas === 'diniyah'
									? 'badge-info'
									: 'badge-success'} badge-soft capitalize mt-1"
							>
								{data.infoKelas?.tipeKelas || '-'}
							</div>
						</div>
						<div>
							<p class="text-sm text-base-content/60">Tahun Ajaran</p>
							<p class="font-medium">
								{tahunMulai + '/' + tahunSelesai + ' ' + tipeSemester || '-'}
							</p>
						</div>
						<div>
							<p class="text-sm text-base-content/60">Wali Kelas</p>
							<p class="font-medium">{data.infoKelas?.guru?.user.name || 'Belum ditugaskan'}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Kolom Kanan: Daftar Santri (2/3 Lebar Layar) -->
		<div class="col-span-1 lg:col-span-2">
			<div class="card bg-base-100 shadow-xl card-border h-full">
				<div class="card-body p-0">
					<!-- Header Bagian Kanan -->
					<div class="p-6 pb-2 flex flex-col sm:flex-row justify-between items-center gap-4">
						<h2 class="card-title">
							Daftar Santri Terdaftar
							<span class="text-base-content/50 text-sm font-normal"
								>({data.listSantri?.length || 0} orang)</span
							>
						</h2>

						<!-- Tombol Penetapan Santri yang akan redirect ke halaman assign -->
						<div class="flex gap-2">
							<a href="/kelas/{data.infoKelas?.id}/tambah-santri" class="btn btn-primary">
								+ Penetapan Santri
							</a>
							{#if selectedSantri.length > 0}
								<button
									class="btn btn-error"
									onclick={() => {
										deleteSantriKelasModal.showModal();
									}}>Hapus Data</button
								>
							{/if}
						</div>
					</div>

					<!-- Tabel Santri Terdaftar -->
					<div class="overflow-x-auto p-2">
						<table class="table table-zebra w-full">
							<thead>
								<tr>
									<th class="w-12 text-center">
										<input
											type="checkbox"
											class="checkbox checkbox-sm checkbox-primary"
											onchange={toggleSelectAll}
										/>
									</th>
									<th class="w-12 text-center">No</th>
									<th>NIS</th>
									<th>Nama Lengkap</th>
								</tr>
							</thead>
							<tbody>
								{#if data.listSantri && data.listSantri.length > 0}
									{#each data.listSantri as santri, index (santri.santriId)}
										<tr>
											<td class="text-center">
												<input
													type="checkbox"
													name="kelasSantriId"
													value={santri.id}
													form="delete-santri-kelas"
													bind:group={selectedSantri}
													class="checkbox checkbox-sm"
												/>
											</td>
											<td class="text-center text-base-content/50">{index + 1}</td>
											<td class="font-mono text-sm">{santri.nis || '-'}</td>
											<td class="font-medium">{santri.santri.user.name}</td>
										</tr>
									{/each}
								{:else}
									<tr>
										<td colspan="3" class="text-center italic text-base-content/50 py-12">
											Belum ada santri yang terdaftar di kelas ini.
											<br />
											<span class="text-sm mt-2 block"
												>Klik "Penetapan Santri" untuk mulai menambahkan.</span
											>
										</td>
									</tr>
								{/if}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
