<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	type Kelas = PageServerData['tAjaranDanKelasList'][number]['kelas'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let createKelasModal: HTMLDialogElement;
	let deleteKelasModal: HTMLDialogElement;
	let editKelasModal: HTMLDialogElement;
	let kelasToDelete = $state<string | null>(null);
	let kelasToEdit = $state<Kelas | null>(null);
	const tahunAjaranAktif = $derived(
		data.tAjaranDanKelasList.filter((i) => {
			return i.isActive !== null && i.isActive === true;
		})
	);
	const opsiTa = $derived(
		data.tAjaranDanKelasList.map((i) => {
			return {
				id: i.id,
				tahunMulai: i.tahunMulai,
				tahunSelesai: i.tahunSelesai,
				tipeSemester: i.tipeSemester,
				isActive: i.isActive
			};
		})
	);
	let selectedTa = $state('');
	let selectedTipe = $state('');
	const filteredTaKelas = $derived(
		data.tAjaranDanKelasList
			.filter((baris) => {
				const tAId = baris.id;
				return selectedTa === '' || tAId === selectedTa;
			})
			.map((ta) => {
				return {
					...ta,
					kelas: ta.kelas.filter((k) => {
						return selectedTipe === '' || k.tipeKelas === selectedTipe;
					})
				};
			})
			.filter((ta) => ta.kelas.length > 0)
	);

	let isSubmitting = $state(false);
	let isFormOpen = $state(false); // Untuk toggle form pembuatan kelas
</script>

<svelte:head>
	<title>Menu Kelas</title>
</svelte:head>

<div>
	<dialog class="modal" id="create_kelas_modal" bind:this={createKelasModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<form
				method="post"
				action="?/create"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							createKelasModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							createKelasModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<h2 class="card-title">Tambah Kelas</h2>
				<fieldset class="fieldset">
					<label for="namaKelas" class="label">Nama Kelas</label>
					<input
						type="text"
						name="namaKelas"
						id="namaKelas"
						class="input w-full"
						placeholder="Contoh: Dirosah 2"
						required
					/>
					<label for="tipekelas" class="label">Tipe Kelas</label>
					<select name="tipeKelas" id="tipeKelas" class="select w-full">
						<option value=""></option>
						<option value="diniyah">Diniyah</option>
						<option value="quran">Quran</option>
					</select>
					<label for="tahunAjaranId" class="label">Tahun Ajaran</label>
					<select name="tahunAjaranId" id="tahunAjaranId" class="select w-full">
						<option value=""></option>
						{#each tahunAjaranAktif as item (item.id)}
							<option value={item.id}
								>{item.tahunMulai +
									'/' +
									item.tahunSelesai +
									' ' +
									item.tipeSemester?.toUpperCase()}</option
							>
						{/each}
					</select>
					<button type="submit" class="btn btn-success mt-4">Tambah Kelas</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<dialog class="modal" id="delete_kelas_modal" bind:this={deleteKelasModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin untuk menghapus kelas ini?</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-success w-full" onclick={() => (kelasToDelete = null)}
						>Batal</button
					>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deleteKelasModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deleteKelasModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={kelasToDelete} />
					<button type="submit" class="btn btn-error w-full">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="edit_kelas_modal" bind:this={editKelasModal}>
		<div class="modal-box">
			<form method="dialog">
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					onclick={() => (kelasToEdit = null)}>✕</button
				>
			</form>
			<form
				action="?/edit"
				method="post"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							editKelasModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							editKelasModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<fieldset class="fieldset">
					<label for="namaKelas" class="label">Nama Kelas</label>
					<input
						type="text"
						name="namaKelas"
						id="namaKelas"
						class="input w-full"
						value={kelasToEdit?.namaKelas}
						required
					/>
					<button type="submit" class="btn btn-accent mt-4">Edit Data</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<div>
		<label for="" class="select">
			<span class="label">Tahun Ajaran</span>
			<select name="" id="" bind:value={selectedTa}>
				<option value="" disabled selected></option>
				{#each opsiTa as ta (ta.id)}
					<option value={ta.id}
						>{ta.tahunMulai + '/' + ta.tahunSelesai + ' ' + ta.tipeSemester?.toUpperCase()}</option
					>
				{/each}
			</select>
		</label>
		<label for="" class="select">
			<span class="label">Tipe</span>
			<select name="" id="" bind:value={selectedTipe}>
				<option></option>
				<option value="diniyah">Diniyah</option>
				<option value="quran">Quran</option>
			</select>
		</label>
	</div>
	<!-- <div class="flex flex-row-reverse">
		<button class="btn btn-success" onclick={() => createKelasModal.showModal()}>
			Tambah Kelas</button
		>
	</div> -->
</div>

<!-- <div class="card overflow-auto">
	<h1 class="card-title">List Kelas</h1>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Nama Kelas</th>
					<th>Tahun Ajaran</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredTaKelas as item (item.id)}
					{#each item.kelas as k, i (k.id)}
						<tr class="hover:bg-base-300">
							<th>{i + 1}</th>
							<td>{k.namaKelas}</td>
							<td
								>{item.tahunMulai +
									'/' +
									item.tahunSelesai +
									' ' +
									item.tipeSemester?.toUpperCase()}</td
							>
							<td class="flex flex-col">
								<a href={resolve(`/kelas/${k.id}`)} class="btn btn-accent w-full">Detail</a>

								<button
									class="btn btn-warning w-full"
									onclick={() => {
										kelasToEdit = { ...k };
										editKelasModal.showModal();
									}}>Edit Kelas</button
								>
								<button
									class="btn btn-error w-full"
									onclick={() => {
										kelasToDelete = k.id;
										deleteKelasModal.showModal();
									}}>Delete Kelas</button
								>
							</td>
						</tr>
					{/each}
				{:else}
					<tr class="hover:bg-base-300">
						<td colspan="4"
							>Tidak ada data kelas pada Tahun Ajaran Terpilih, Tambahkan terlebih dahulu</td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div> -->

<div class="p-6 bg-base-200 min-h-screen">
	<div class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-base-content">Manajemen Kelas</h1>
			<p class="text-base-content/70 mt-1">
				Kelola data kelas dan lihat detail pendaftaran santri.
			</p>
		</div>
		<!-- <button class="btn btn-primary" onclick={() => (isFormOpen = !isFormOpen)}>
			{isFormOpen ? 'Tutup Form' : '+ Buat Kelas Baru'}
		</button> -->
		<button class="btn btn-primary" onclick={() => createKelasModal.showModal()}>
			+ Buat Kelas Baru</button
		>
	</div>

	<!-- Form Pembuatan Kelas (Ditampilkan kondisional) -->
	<!-- {#if isFormOpen} -->
	<!-- <div class="card bg-base-100 shadow-xl card-border mb-8">
			<div class="card-body">
				<h2 class="card-title mb-4">Buat Kelas Baru</h2>
				<form
					method="POST"
					action="?/buatKelas"
					class="grid grid-cols-1 md:grid-cols-2 gap-4"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
							if (!form?.error) isFormOpen = false; // Tutup form jika sukses
						};
					}}
				>
					Input Nama Kelas -->
	<!-- <div class="form-control">
						<label class="label" for="inputKelas"><span class="label-text">Nama Kelas</span></label>
						<input
							type="text"
							id="inputKelas"
							name="namaKelas"
							placeholder="Misal: 1A Diniyah"
							class="input input-bordered"
							required
						/> -->
	<!-- </div> -->

	<!-- Input Tipe Kelas -->
	<!-- <div class="form-control">
						<label class="label" for="inputTipe"><span class="label-text">Tipe Kelas</span></label>
						<select name="tipeKelas" id="inputTipe" class="select select-bordered" required>
							<option value="diniyah">Diniyah</option>
							<option value="quran">Al-Quran</option>
						</select>
					</div> -->

	<!-- Input Tahun Ajaran -->
	<!-- <div class="form-control">
						<label class="label" for="tahunAjaran"
							><span class="label-text">Tahun Ajaran</span></label
						>
						<select name="tahunAjaranId" id="tahunAjaran" class="select select-bordered" required>
							<option value="" disabled selected>Pilih Tahun Ajaran...</option>
							{#each data.daftarTahunAjaran as ta}
								<option value={ta.id}>
									{ta.tahunMulai}/{ta.tahunSelesai} - Semester {ta.tipeSemester}
									{#if ta.isActive}(Aktif){/if}
								</option>
							{/each}
						</select>
					</div> -->

	<!-- Input Wali Kelas -->
	<!-- <div class="form-control">
						<label class="label"><span class="label-text">Wali Kelas (Opsional)</span></label>
						<select name="waliKelasId" class="select select-bordered">
							<option value="">Pilih Wali Kelas...</option>
							{#each data.daftarGuru as guru}
								<option value={guru.id}>{guru.nama}</option>
							{/each}
						</select>
					</div> -->

	<!-- <div class="col-span-1 md:col-span-2 flex justify-end mt-4">
						<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
							{#if isSubmitting}<span class="loading loading-spinner loading-sm"></span>{/if}
							Simpan Kelas
						</button>
					</div>
				</form>
			</div>
		</div> -->
	<!-- {/if} -->

	<!-- Tabel Daftar Kelas -->
	<div class="card bg-base-100 shadow-xl card-border">
		<div class="card-body">
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>Nama Kelas</th>
							<th>Tipe</th>
							<th>Tahun Ajaran</th>
							<th>Wali Kelas</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredTaKelas as item (item.id)}
							{#each item.kelas as k (k.id)}
								<tr>
									<td class="font-bold">{k.namaKelas}</td>
									<td>
										<div
											class="badge {k.tipeKelas === 'diniyah'
												? 'badge-info'
												: 'badge-success'} badge-soft capitalize"
										>
											{k.tipeKelas}
										</div>
									</td>
									<td>{item?.tahunMulai}/{item?.tahunSelesai}</td>
									<td>{k.waliKelasId || 'Belum diatur'}</td>
									<td class="text-right">
										<!-- Tombol Detail yang mengarah ke routing dinamis SvelteKit -->
										<a href="/kelas/{k.id}" class="btn btn-sm btn-outline"> Lihat Detail </a>
									</td>
								</tr>
							{:else}
								<tr>
									<td colspan="5" class="text-center py-6 italic text-base-content/50"
										>Belum ada data kelas.</td
									>
								</tr>
							{/each}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Notifikasi Toast -->
	{#if form}
		<div class="toast toast-end toast-bottom z-50">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
