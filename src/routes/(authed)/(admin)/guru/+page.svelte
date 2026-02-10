<script lang="ts">
	import type { PageServerData, PageProps } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	type Guru = PageServerData['guruList'][number];

	let { data }: { data: PageServerData; form: PageProps } = $props();
	let deleteGuruModal: HTMLDialogElement;
	let editGuruModal: HTMLDialogElement;
	let guruToDelete = $state<string | null>(null);
	let guruToEdit = $state<Guru | null>(null);
</script>

<svelte:head>
	<title>Menu Guru</title>
</svelte:head>
<div>
	<dialog class="modal" id="delete_guru_modal" bind:this={deleteGuruModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data user ini?</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (guruToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deleteGuruModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deleteGuruModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={guruToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="edit_guru_modal" bind:this={editGuruModal}>
		<div class="modal-box">
			<form method="dialog">
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					onclick={() => (guruToEdit = null)}>✕</button
				>
			</form>
			<form
				action="?/edit"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							editGuruModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							editGuruModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<h2 class="card-title">Edit Data Guru</h2>
				<fieldset class="fieldset">
					<input type="text" name="id" id="id" value={guruToEdit?.id} hidden />
					<label for="nomorIndukGuru"> Nomor Induk Guru </label>
					<input
						type="text"
						name="nomorIndukGuru"
						id="nomorIndukGuru"
						class="input w-full"
						value={guruToEdit?.nomorIndukGuru}
					/>
					<label for="nomorTelepon"> Nomor Telepon </label>
					<input
						type="text"
						name="nomorTelepon"
						id="nomorTelepon"
						class="input w-full"
						value={guruToEdit?.nomorTelepon}
					/>
					<label for="status"> Status </label>
					<select name="status" id="status" class="select w-full">
						{#if guruToEdit?.status === null}
							<option value="" selected></option>
							<option value="aktif">Aktif</option>
							<option value="inaktif">Non Aktif</option>
						{:else if guruToEdit?.status === 'aktif'}
							<option value=""></option>
							<option value="aktif" selected>Aktif</option>
							<option value="inaktif">Non Aktif</option>
						{:else if guruToEdit?.status === 'inaktif'}
							<option value=""></option>
							<option value="aktif">Aktif</option>
							<option value="inaktif" selected>Non Aktif</option>
						{/if}
					</select>
					<button type="submit" class="btn btn-success mt-4">Edit Data Guru</button>
				</fieldset>
			</form>
		</div>
	</dialog>
</div>
<div>
	<h2 class="card-title">List Guru</h2>
</div>
<div class="overflow-auto">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama</th>
				<th>Nomor Induk Guru</th>
				<th>Status</th>
				<th>Nomor Telepon</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.guruList as guru, i (guru.id)}
				<tr class="hover:bg-base-300">
					<th>{i + 1}</th>
					<td>{guru.nama}</td>
					<td>{guru.nomorIndukGuru}</td>
					<td>{guru.status}</td>
					<td>{guru.nomorTelepon}</td>
					<td>
						<div>
							<button
								class="btn btn-accent"
								onclick={() => {
									guruToEdit = { ...guru };
									editGuruModal.showModal();
								}}>Edit</button
							>
							<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
							<button
								class="btn btn-error"
								onclick={() => {
									guruToDelete = guru.id;
									deleteGuruModal.showModal();
								}}
								>Delete
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
