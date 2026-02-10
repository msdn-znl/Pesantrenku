<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageServerData, ActionData } from './$types';
	import { toast } from 'svelte-sonner';
	type Pertemuan = PageServerData['pertemuanList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let createPertemuanModal: HTMLDialogElement;
	let deletePertemuanModal: HTMLDialogElement;
	let editPertemuanModal: HTMLDialogElement;
	let pertemuanToEdit = $state<Pertemuan | null>(null);
	let pertemuanToDelete = $state<string | null>(null);
</script>

<div class="">
	<dialog class="modal" id="create_pertemuan_modal" bind:this={createPertemuanModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>

			<form
				action="?/create"
				method="post"
				class="flex flex-col"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							createPertemuanModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
							await applyAction(result);
						}
					};
				}}
			>
				<h2 class="card-title">Tambah Pertemuan</h2>
				<fieldset class="fieldset">
					<label for="jadwalId" class="label">Jadwal</label>
					<select name="jadwalId" id="jadwalId" class="select select-md w-full">
						<option value=""></option>
						{#each data.jadwalList as jadwal (jadwal.id)}
							<option value={jadwal.id}
								>Guru: {jadwal.guru.user.nama}, Kelas: {jadwal.kelas.namaKelas}, Hari: {jadwal.hari},
								Mulai: {jadwal.jamMulai}, Kitab: {jadwal.kitab.namaKitab}
							</option>
						{/each}
					</select>
					<label for="jurnalMengajar" class="label">Jurnal Mengajar</label>
					<textarea
						name="jurnalMengajar"
						id="jurnalMengajar"
						class="textarea textarea-md w-full"
						placeholder="Masukkan Jurnal Mengajar di sini"
					></textarea>
					<label for="tanggalPertemuan" class="label">Tanggal</label>
					<input
						type="date"
						name="tanggalPertemuan"
						id="tanggalPertemuan"
						class="input input-md w-full"
					/>
					<label for="status" class="label">Status Pertemuan</label>
					<select name="status" id="status" class="select select-md w-full">
						<option value=""></option>
						<option value="selesai">Selesai</option>
						<option value="batal">Batal</option>
						<option value="tugas mandiri">Tugas Mandiri</option>
					</select>

					<button type="submit" class="btn btn-success mt-4">Tambah Pertemuan</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<dialog class="modal" id="delete_pertemuan_modal" bind:this={deletePertemuanModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data pertemuan ini?</p>
			<div class="flex flex-row">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (pertemuanToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								deletePertemuanModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deletePertemuanModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="string" name="id" id="id" value={pertemuanToDelete} hidden />
					<button type="submit" class="btn btn-error">Hapus Data Pertemuan</button>
				</form>
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="edit_pertemuan_modal" bind:this={editPertemuanModal}>
		<div class="modal-box">
			<form method="dialog">
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					onclick={() => (pertemuanToEdit = null)}>✕</button
				>
			</form>
			<form
				action="?/edit"
				method="post"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							editPertemuanModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
							await applyAction(result);
						}
					};
				}}
			>
				<fieldset class="fieldset">
					<label for="jadwalId" class="label">Jadwal</label>
					<select name="jadwalId" id="jadwalId" class="select w-full">
						<option value=""></option>
						{#each data.jadwalList as jadwal (jadwal.id)}
							<option value={jadwal.id} selected={jadwal.id === pertemuanToEdit?.jadwalId}
								>Guru: {jadwal.guru.user.nama}, Kelas: {jadwal.kelas.namaKelas}, Hari: {jadwal.hari},
								Mulai: {jadwal.jamMulai}, Kitab: {jadwal.kitab.namaKitab}
							</option>
						{/each}
					</select>
					<label for="jurnalMengajar" class="label">Jurnal Mengajar</label>
					<textarea
						name="jurnalMengajar"
						id="jurnalMengajar"
						class="textarea w-full"
						placeholder="Masukkan Jurnal Mengajar di sini"
						value={pertemuanToEdit?.jurnalMengajar}
					></textarea>
					<label for="tanggalPertemuan" class="label">Tanggal</label>
					<input
						type="date"
						name="tanggalPertemuan"
						id="tanggalPertemuan"
						class="input w-full"
						value={pertemuanToEdit?.tanggalPertemuan}
					/>
					<label for="status" class="label">Status Pertemuan</label>
					<select name="status" id="status" class="select w-full">
						<option value=""></option>
						<option value="selesai" selected={pertemuanToEdit?.status === 'selesai'}>Selesai</option
						>
						<option value="batal" selected={pertemuanToEdit?.status === 'batal'}>Batal</option>
						<option value="tugas mandiri" selected={pertemuanToEdit?.status === 'tugas mandiri'}
							>Tugas Mandiri</option
						>
					</select>

					<button type="submit" class="btn btn-success">Edit Data Pertemuan</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<div class="flex flex-row-reverse">
		<button onclick={() => createPertemuanModal.showModal()} class="btn btn-success">
			Tambah Pertemuan
		</button>
	</div>
</div>

<div class="card overflow-auto">
	<h2 class="card-title">List Pertemuan</h2>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Kitab</th>
					<th>Kelas</th>
					<th>Jurnal Mengajar</th>
					<th>Hari</th>
					<th>Tanggal Pertemuan</th>
					<th>status</th>
				</tr>
			</thead>
			<tbody>
				{#each data.pertemuanList as pertemuan, i (pertemuan.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{pertemuan.jadwal.kitab.namaKitab}</td>
						<td>{pertemuan.jadwal.kelas.namaKelas}</td>
						<td>{pertemuan.jurnalMengajar}</td>
						<td>{pertemuan.jadwal.hari}</td>
						<td>{pertemuan.tanggalPertemuan}</td>
						<td>{pertemuan.status}</td>
						<td class="flex flex-col">
							<a href={'/pertemuan/' + pertemuan.id + '/absensi-santri'}
								><button class="btn btn-success w-full">Absensi Santri</button></a
							>
							<a href={'/pertemuan/' + pertemuan.id + '/data-absensi'}
								><button class="btn btn-accent w-full">Data Absensi</button></a
							>
							<button
								class="btn btn-warning w-full"
								onclick={() => {
									pertemuanToEdit = { ...pertemuan };
									editPertemuanModal.showModal();
								}}>Edit Pertemuan</button
							>
							<button
								class="btn btn-error w-full"
								onclick={() => {
									pertemuanToDelete = pertemuan.id;
									deletePertemuanModal.showModal();
								}}>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
