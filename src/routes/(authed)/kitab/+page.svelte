<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	type Kitab = PageServerData['kitabList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let createKitabModal: HTMLDialogElement;
	let deleteKitabModal: HTMLDialogElement;
	let editKitabModal: HTMLDialogElement;
	let kitabToDelete = $state<string | null>(null);
	let kitabToEdit = $state<Kitab | null>(null);
</script>

<div class="">
	<dialog class="modal" id="create_kitab_modal" bind:this={createKitabModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<h2 class="card-title">Tambah Kitab</h2>
			<form
				action="?/create"
				method="post"
				autocomplete="off"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							createKitabModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							createKitabModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<fieldset class="fieldset">
					<label for="namaKitab" class="label">Nama Kitab</label>
					<input
						type="text"
						name="namaKitab"
						id="namaKitab"
						class="input w-full"
						placeholder="Contoh: Muttamimmah"
					/>
					<label for="pengarang" class="label">Pengarang</label>
					<input
						type="text"
						name="pengarang"
						id="pengarang"
						class="input w-full"
						placeholder="Contoh: Syekh Nawawi"
					/>
					<label for="kategori" class="label">Kategori</label>
					<input
						type="text"
						name="kategori"
						id="kategori"
						class="input w-full"
						placeholder="Contoh: Fiqih"
					/>
					<button type="submit" class="btn btn-success mt-5">Tambah Data</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<dialog class="modal" id="delete_user_modal" bind:this={deleteKitabModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data ini?</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (kitabToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deleteKitabModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deleteKitabModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={kitabToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="edit_user_modal" bind:this={editKitabModal}>
		<div class="modal-box">
			<h2 class="card-title">Edit Kitab</h2>
			<form method="dialog">
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					onclick={() => (kitabToEdit = null)}>✕</button
				>
			</form>
			<form
				action="?/edit"
				method="post"
				class=""
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							editKitabModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							editKitabModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<fieldset class="fieldset">
					<input type="string" name="id" id="id" value={kitabToEdit?.id} hidden />
					<label class="label" for="namaKitab">Nama Kitab</label>
					<input
						type="text"
						name="namaKitab"
						id="namaKitab"
						class="input w-full"
						value={kitabToEdit?.namaKitab}
					/>
					<label for="pengarang">Pengarang</label>
					<input
						type="text"
						name="pengarang"
						id="pengarang"
						class="input w-full"
						value={kitabToEdit?.pengarang}
						placeholder="Contoh: Imam Nawawi"
					/>
					<label for="kategori">Kategori</label>
					<input
						type="text"
						name="kategori"
						id="kategori"
						class="input w-full"
						placeholder="Contoh: Fiqih"
						value={kitabToEdit?.kategori}
					/>
				</fieldset>
				<button type="submit" class="btn btn-success mt-4">Edit Data</button>
			</form>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success" onclick={() => createKitabModal.showModal()}
			>Tambah Kitab</button
		>
	</div>
	<div class="p-2">
		<h1 class="card-title">List Kitab</h1>
		<div class="overflow-auto">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>Nama Kitab</th>
						<th>Pengarang</th>
						<th>Kategori</th>
					</tr>
				</thead>
				<tbody>
					{#each data.kitabList as kitab, i (kitab.id)}
						<tr>
							<th>{i + 1}</th>
							<td>{kitab.namaKitab}</td>
							<td>{kitab.pengarang}</td>
							<td>{kitab.kategori}</td>
							<td class="flex flex-col">
								<button
									class="btn btn-accent"
									onclick={() => {
										kitabToEdit = { ...kitab };
										editKitabModal.showModal();
									}}>Edit</button
								>
								<button
									class="btn btn-error"
									onclick={() => {
										kitabToDelete = kitab.id;
										deleteKitabModal.showModal();
									}}
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
