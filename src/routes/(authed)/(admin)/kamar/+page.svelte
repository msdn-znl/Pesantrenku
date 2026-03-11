<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	type Kamar = PageServerData['kamarList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let createKamarModal: HTMLDialogElement;
	let deleteKamarModal: HTMLDialogElement;
	let editKamarModal: HTMLDialogElement;
	let kamarToDelete = $state<string | null>();
	let kamarToEdit = $state<Kamar | null>();
</script>

<svelte:head>
	<title>Menu Kamar</title>
</svelte:head>

<dialog class="modal" id="create_kamar_modal" bind:this={createKamarModal}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form
			action="?/create"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success(result.data?.message ?? 'Berhasil');
						createKamarModal.close();
					} else if (result.type === 'failure') {
						toast.error(result.data?.message ?? 'Gagal memproses data');
					} else if (result.type === 'error') {
						toast.error('Terjadi kesalahan server');
					}
					await update();
				};
			}}
		>
			<h2 class="card-title">Tambah Kamar</h2>
			<fieldset class="fieldset">
				<label for="namaKamar" class="label">Nama Kamar</label>
				<input
					class="input w-full validator"
					type="text"
					name="namaKamar"
					id="namaKamar"
					required
				/>
			</fieldset>
			<div class="modal-action">
				<button class="btn btn-success mt-4" type="submit">Tambah Kamar</button>
			</div>
		</form>
	</div>
</dialog>

<dialog
	class="modal"
	id="edit_kamar_modal"
	bind:this={editKamarModal}
	onclose={() => {
		kamarToEdit = null;
	}}
>
	<div class="modal-box">
		<form method="dialog">
			<button
				class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
				onclick={() => {
					kamarToEdit = null;
				}}>✕</button
			>
		</form>
		<form
			action="?/edit"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success(result.data?.message ?? 'Berhasil');
						createKamarModal.close();
					} else if (result.type === 'failure') {
						toast.error(result.data?.message ?? 'Gagal memproses data');
					} else if (result.type === 'error') {
						toast.error('Terjadi kesalahan server');
					}
					await update();
				};
			}}
		>
			<fieldset class="fieldset">
				<input type="text" name="id" value={kamarToEdit?.id} hidden />
				<label for="namaKamar" class="label">Nama Kamar</label>
				<input
					type="text"
					name="namaKamar"
					id="namaKamar"
					class="input w-full"
					value={kamarToEdit?.namaKamar}
				/>
			</fieldset>
			<div class="modal-action">
				<button type="submit" class="btn btn-accent">Edit Data Kamar</button>
			</div>
		</form>
	</div>
</dialog>

<dialog class="modal" id="delete_kamar_modal" bind:this={deleteKamarModal}>
	<div class="modal-box">
		<p>
			Apakah Anda yakin menghapus ingin menghapus kamar ini? Data santri akan tetap disimpan, namun
			anda perlu menetapkan ulang kamar santri.
		</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-success" onclick={() => (kamarToDelete = null)}>Batal</button>
			</form>
			<form
				action="?/delete"
				method="post"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							toast.success(result.data?.message ?? 'Berhasil');
							deleteKamarModal.close();
						}
						await update();
					};
				}}
			>
				<input type="text" name="id" value={kamarToDelete} hidden />
				<button type="submit" class="btn btn-error">Delete</button>
			</form>
		</div>
	</div>
</dialog>

<div class="flex flex-row-reverse">
	<button class="btn btn-success" onclick={() => createKamarModal.showModal()}>
		Tambah Kamar</button
	>
</div>
<div>
	<h2 class="card-title">List Kamar</h2>
</div>
<div class="overflow-auto">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama Kamar</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.kamarList as kamar, i (kamar.id)}
				<tr>
					<th>{i + 1}</th>
					<td>{kamar.namaKamar}</td>
					<td class="flex flex-col md:flex-row gap-4"
						><button
							class="btn btn-accent"
							onclick={() => {
								kamarToEdit = { ...kamar };
								editKamarModal.showModal();
							}}>Edit</button
						>
						<button
							class="btn btn-error"
							onclick={() => {
								kamarToDelete = kamar.id;
								deleteKamarModal.showModal();
							}}>Delete</button
						></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
