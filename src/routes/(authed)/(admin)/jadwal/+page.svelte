<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	type Jadwal = PageServerData['jadwalList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const hari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

	let createJadwalModal: HTMLDialogElement;
	let deleteJadwalModal: HTMLDialogElement;
	let editJadwalModal: HTMLDialogElement;
	let jadwalToDelete = $state<string | null>(null);
	let jadwalToEdit = $state<Jadwal | null>(null);
</script>

<div>
	<dialog class="modal" id="create_jadwal_modal" bind:this={createJadwalModal}>
		<div class="modal-box">
			<h2 class="card-title">Tambah Jadwal</h2>
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
							createJadwalModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							createJadwalModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<label for="kitabId">Kitab</label>
				{#await data.streamed.kitabList}
					<select class="select w-full" disabled>
						<option>Memuat Kitab...</option>
					</select>
				{:then kitabList}
					<select name="kitabId" id="kitabId" class="select w-full">
						<option value="">Pilih</option>
						{#each kitabList as kitab (kitab.id)}
							<option value={kitab.id}>{kitab.namaKitab}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="kelasId">Kelas</label>
				{#await data.streamed.kelasList}
					<select class="select w-full" disabled>
						<option>Memuat Kelas...</option>
					</select>
				{:then kelasList}
					<select name="kelasId" id="kelasId" class="select w-full">
						<option value="">Pilih</option>
						{#each kelasList as kelas (kelas.id)}
							<option value={kelas.id}>{kelas.namaKelas}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="guruId">Guru</label>
				{#await data.streamed.guruList}
					<select class="select w-full" disabled>
						<option>Memuat Guru...</option>
					</select>
				{:then guruList}
					<select name="guruId" id="guruId" class="select w-full">
						<option value="">Pilih</option>
						{#each guruList as guru (guru.id)}
							<option value={guru.id}>{guru.nama}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="hari">Hari</label>
				<select name="hari" id="hari" class="select w-full">
					<option value="">Pilih</option>
					{#each hari as h}
						<option value={h}>{h}</option>
					{/each}
				</select>
				<label for="jamMulai">Jam Mulai</label>
				<input type="time" name="jamMulai" id="jamMulai" class="input w-full" />
				<label for="jamSelesai">Jam Selesai</label>
				<input type="time" name="jamSelesai" id="jamSelesai" class="input w-full" />
				<button type="submit" class="btn btn-success">Tambah Jadwal</button>
			</form>
		</div>
	</dialog>
	<dialog class="modal" id="delete_jadwal_modal" bind:this={deleteJadwalModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin untuk menghapus jadwal ini?</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (jadwalToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deleteJadwalModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deleteJadwalModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={jadwalToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>

	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success" onclick={() => createJadwalModal.showModal()}
			>Tambah Jadwal</button
		>
	</div>
	<div class="card overflow-auto">
		<h2 class="card-title">List Jadwal</h2>
		<div class="card-body">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>Pengajar</th>
						<th>Kelas</th>
						<th>Kitab</th>
						<th>Hari</th>
						<th>Jam Mulai</th>
						<th>Jam Selesai</th>
					</tr>
				</thead>
				<tbody>
					{#each data.jadwalList as jadwal, i (jadwal.id)}
						<tr class="hover:bg-base-300">
							<th>{i + 1}</th>
							<td>{jadwal.guru.user.nama}</td>
							<td>{jadwal.kelas}</td>
							<td>{jadwal.kitab}</td>
							<td>{jadwal.hari}</td>
							<td>{jadwal.jamMulai}</td>
							<td>{jadwal.jamSelesai}</td>
							<td>
								<a href={'/jadwal/' + jadwal.id + '/pertemuan'}
									><button class="btn btn-success">Data Pertemuan</button></a
								>
								<a href={'/jadwal/' + jadwal.id + '/edit'}
									><button class="btn btn-accent">Edit</button></a
								>

								<button
									class="btn btn-error"
									onclick={() => {
										jadwalToDelete = jadwal.id;
										deleteJadwalModal.showModal();
									}}>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
