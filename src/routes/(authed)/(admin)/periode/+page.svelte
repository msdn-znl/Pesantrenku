<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	// let createPeriodeModal: HTMLDialogElement;
	// let deletePeriodeModal: HTMLDialogElement;
	// let activatePeriodeModal: HTMLDialogElement;
	// let periodeToDelete = $state<string | null>(null);
	// let periodeToActivate = $state<string | null>(null);

	// State Svelte 5 untuk mengontrol tampilan UI
	let isFormOpen = $state(false);
	let isSubmitting = $state(false);
	let isSettingActive = $state(false);

	/* 
	  Ekspektasi struktur data dari server:
	  data.daftarTahunAjaran = [
	    { id: string, tahunMulai: number, tahunSelesai: number, tipeSemester: 'ganjil'|'genap', isActive: boolean }
	  ]
	*/
</script>

<svelte:head>
	<title>Menu Tahun Ajar</title>
</svelte:head>
<div>
	<!-- <dialog
		class="modal"
		id="activate_periode_modal"
		bind:this={activatePeriodeModal}
		onclose={() => {
			periodeToActivate = null;
		}}
	>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<div>
				<form action="?/activate" method="post">
					<input
						type="text"
						name="tahunAjaranId"
						id="tahunAjaranId"
						value={periodeToActivate}
						hidden
					/>
					<p>Apakah Anda Yakin Untuk Mengaktifkan Periode ini?</p>
					<div class="modal-action">
						<button type="submit" class="btn btn-success">Ya</button>
					</div>
				</form>
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="create_periode_modal" bind:this={createPeriodeModal}>
		<div class="modal-box">
			<h2 class="card-title">Tambah Periode</h2>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<div>
				<form
					action="?/create"
					method="post"
					autocomplete="off"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								createPeriodeModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								createPeriodeModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<fieldset class="fieldset">
						<label for="tahunMulai" class="label">Tahun Mulai</label>
						<input
							type="number"
							name="tahunMulai"
							id="tahunMulai"
							class="input w-full"
							placeholder="Contoh: 2025"
							required
						/>
						<label for="tahunSelesai" class="label">Tahun Selesai</label>
						<input
							type="number"
							name="tahunSelesai"
							id="tahunSelesai"
							class="input w-full"
							placeholder="Contoh: 2026"
							required
						/>
						<label for="tipeSemester" class="label">Semester</label>
						<select name="tipeSemester" id="tipeSemester" class="select w-full">
							<option value=""></option>
							<option value="ganjil">Ganjil</option>
							<option value="genap">Genap</option>
						</select>

						<button type="submit" class="btn btn-success">Tambah Data</button>
					</fieldset>
				</form>
			</div>
		</div>
	</dialog>
	<div class="flex flex-row-reverse">
		<button class="btn btn-success" onclick={() => createPeriodeModal.showModal()}
			>Tambah Periode</button
		>
	</div>
	<dialog class="modal" id="delete_periode_modal" bind:this={deletePeriodeModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data periode ini?</p>
			<div class="modal-action justify-end">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (periodeToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deletePeriodeModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deletePeriodeModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={periodeToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
</div>

<div class="card">
	<h1 class="card-title">List Periode</h1>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Periode</th>
					<th>Status</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each data.periodeList as periode, i (periode.id)}
					<tr class="">
						<th>{i + 1}</th>
						<td
							>{periode.tahunMulai +
								'/' +
								periode.tahunSelesai +
								' ' +
								periode.tipeSemester?.toUpperCase()}</td
						>
						<td>
							{#if periode.isActive === true}
								<div class="badge badge-soft badge-success">Aktif</div>
							{:else}<div class="badge badge-soft badge-error">Tidak Aktif</div>{/if}
						</td>
						<td>
							{#if periode.isActive === false}
								<button
									name="periodeNonAktif"
									class="btn btn-success"
									onclick={() => {
										periodeToActivate = periode.id;
										activatePeriodeModal.showModal();
									}}>Aktifkan</button
								>
							{:else if periode.isActive === true}
								<button name="periodeAktif" class="btn btn-success">Aktif</button>
							{/if}
							<button
								class="btn btn-error"
								onclick={() => {
									periodeToDelete = periode.id;
									deletePeriodeModal.showModal();
								}}
							>
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div> -->
</div>

<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header & Tombol Buka Form -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
		<div>
			<h1 class="text-3xl font-bold text-base-content">Tahun Ajaran</h1>
			<p class="text-base-content/70 mt-1">Kelola data periode tahun ajaran dan semester aktif.</p>
		</div>
		<button class="btn btn-primary" onclick={() => (isFormOpen = !isFormOpen)}>
			{isFormOpen ? 'Batal / Tutup Form' : '+ Tambah Tahun Ajaran'}
		</button>
	</div>

	<!-- Form Penambahan Data (Ditampilkan Kondisional) -->
	{#if isFormOpen}
		<div class="card bg-base-100 shadow-xl card-border mb-8">
			<div class="card-body">
				<h2 class="card-title mb-4">Tambah Tahun Ajaran Baru</h2>

				<form
					method="POST"
					action="?/create"
					class="grid grid-cols-1 md:grid-cols-3 gap-4"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update(); // Memperbarui data dari server
							isSubmitting = false;
							if (!form?.error) isFormOpen = false; // Tutup form jika berhasil
						};
					}}
				>
					<!-- Input Tahun Mulai -->
					<div class="form-control">
						<label class="label" for="tahunMulai"
							><span class="label-text font-medium">Tahun Mulai</span></label
						>
						<input
							type="number"
							name="tahunMulai"
							id="tahunMulai"
							placeholder="Contoh: 2024"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<!-- Input Tahun Selesai -->
					<div class="form-control">
						<label class="label" for="tahunSelesai"
							><span class="label-text font-medium">Tahun Selesai</span></label
						>
						<input
							type="number"
							name="tahunSelesai"
							id="tahunSelesai"
							placeholder="Contoh: 2025"
							class="input input-bordered w-full"
							required
						/>
					</div>

					<!-- Input Tipe Semester (Berdasarkan Enum) -->
					<div class="form-control">
						<label class="label" for="tipeSemester"
							><span class="label-text font-medium">Semester</span></label
						>
						<select
							name="tipeSemester"
							id="tipeSemester"
							class="select select-bordered w-full"
							required
						>
							<option value="" disabled selected>Pilih Semester...</option>
							<option value="ganjil">Ganjil</option>
							<option value="genap">Genap</option>
						</select>
					</div>

					<div class="col-span-1 md:col-span-3 flex justify-end mt-4">
						<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
							{#if isSubmitting}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							Simpan Data
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Tabel Daftar Tahun Ajaran -->
	<div class="card bg-base-100 shadow-xl card-border">
		<div class="card-body p-0">
			<div class="overflow-x-auto p-4">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>Periode Tahun</th>
							<th>Semester</th>
							<th>Status Saat Ini</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#if data.periodeList && data.periodeList.length > 0}
							{#each data.periodeList as ta (ta.id)}
								<tr>
									<td class="font-bold">{ta.tahunMulai} / {ta.tahunSelesai}</td>
									<td class="capitalize">{ta.tipeSemester}</td>
									<td>
										<!-- Indikator Status -->
										{#if ta.isActive}
											<div class="badge badge-success badge-soft font-medium">Aktif</div>
										{:else}
											<div class="badge badge-neutral badge-soft">Inaktif</div>
										{/if}
									</td>
									<td class="text-right">
										<!-- Form untuk Set Aktif/Inaktif -->
										<form
											method="POST"
											action="?/setAktif"
											use:enhance={() => {
												isSettingActive = true;
												return async ({ update }) => {
													// reset: false agar scroll halaman tidak melompat ke atas
													await update({ reset: false });
													isSettingActive = false;
												};
											}}
										>
											<input type="hidden" name="id" value={ta.id} />
											<!-- Mengirim target status kebalikannya untuk proses di server -->
											<input
												type="hidden"
												name="targetStatus"
												value={ta.isActive ? 'false' : 'true'}
											/>

											<!-- Gaya tombol menyesuaikan status saat ini -->
											<button
												type="submit"
												class="btn btn-sm {ta.isActive
													? 'btn-error btn-soft'
													: 'btn-success btn-soft'}"
												disabled={isSettingActive}
											>
												{ta.isActive ? 'Nonaktifkan' : 'Set Aktif'}
											</button>
										</form>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="4" class="text-center italic text-base-content/50 py-10">
									Belum ada data Tahun Ajaran.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Notifikasi Toast jika aksi sukses atau gagal -->
	{#if form}
		<div class="toast toast-end toast-bottom z-50">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
