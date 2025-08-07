<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	type Kelas = PageServerData['kelasList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let createKelasModal: HTMLDialogElement;
	let deleteKelasModal: HTMLDialogElement;
	let editKelasModal: HTMLDialogElement;
	let kelasToDelete = $state<number | null>(null);
	let kelasToEdit = $state<Kelas | undefined>();
</script>

<div>
	<dialog class="modal" id="create_kelas_modal" bind:this={createKelasModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<form method="post" action="?/create" use:enhance class="flex flex-col">
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
					<label for="tahunAjaran" class="label">Tahun Ajaran</label>
					<select name="tahunAjaran" id="tahunAjaran" class="select w-full">
						<option value=""></option>
						{#each data.tahunAjaranList as item}
							<option value={item.id}>{item.tahunAjaran}</option>
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
			<div class="modal-actions">
				<form method="dialog">
					<button class="btn btn-success w-full" onclick={() => (kelasToDelete = null)}
						>Batal</button
					>
				</form>
				<form action="?/delete" method="post">
					<input type="hidden" name="id" value={kelasToDelete} />
					<button type="submit" class="btn btn-error w-full">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="edit_kelas_modal" bind:this={editKelasModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<form action="?/edit" method="post">
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
					<label for="tahunAjaran" class="label">Tahun Ajaran</label>
					<select name="tahunAjaran" id="tahunAjaran" class="select w-full">
						{#each data.tahunAjaranList as item}
							<option value={item.id} selected={item.id == kelasToEdit?.tahun_ajaran?.id}
								>{item.tahunAjaran}</option
							>
						{/each}
					</select>
					<button type="submit" class="btn btn-accent mt-4">Edit Data</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success mt-2" onclick={() => createKelasModal.showModal()}>
			Tambah Kelas</button
		>
	</div>
</div>

<div class="card overflow-auto">
	<h1 class="card-title">List Kelas</h1>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Nama Kelas</th>
					<th>Tahun Ajaran</th>
					<th>Ketua Kelas</th>
				</tr>
			</thead>
			<tbody>
				{#each data.kelasList as kelas, i (kelas.id)}
					<tr class="hover:bg-base-300">
						<th>{i + 1}</th>
						<td>{kelas.namaKelas}</td>
						<td>{kelas.tahun_ajaran?.tahunAjaran}</td>
						<td>{kelas.ketuaKelas}</td>
						<td class="flex flex-col">
							<a href={'/kelas/tambah-santri/' + kelas.id}
								><button class="btn btn-accent w-full">Edit Anggota Kelas</button></a
							>

							<button
								class="btn btn-warning w-full"
								onclick={() => {
									kelasToEdit = { ...kelas };
									editKelasModal.showModal();
								}}>Edit Nama Kelas</button
							>
							<button
								class="btn btn-error w-full"
								onclick={() => {
									kelasToDelete = kelas.id;
									deleteKelasModal.showModal();
								}}>Delete Kelas</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
