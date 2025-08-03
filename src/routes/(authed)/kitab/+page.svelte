<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let createKitabModal: HTMLDialogElement;
	let deleteKitabModal: HTMLDialogElement;
	let kitabToDelete = $state<number | null>(null);
</script>

<div class="">
	<dialog class="modal" id="create_kitab_modal" bind:this={createKitabModal}>
		<div class="card bg-base-100">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<div class="card-body">
				<h2 class="card-title">Tambah Kitab</h2>
				<form action="?/create" method="post" use:enhance autocomplete="off" class="flex flex-col">
					<fieldset class="fieldset">
						<label for="namaKitab" class="label">Nama Kitab</label>
						<input
							type="text"
							name="namaKitab"
							id="namaKitab"
							class="input w-xs lg:w-lg"
							placeholder="Contoh: Muttamimmah"
						/>
						<label for="pengarang" class="label">Pengarang</label>
						<input
							type="text"
							name="pengarang"
							id="pengarang"
							class="input w-xs lg:w-lg"
							placeholder="Contoh: Syekh Nawawi"
						/>
						<label for="kategori" class="label">Kategori</label>
						<input
							type="text"
							name="kategori"
							id="kategori"
							class="input w-xs lg:w-lg"
							placeholder="Contoh: Fiqih"
						/>
						<button type="submit" class="btn btn-success mt-5">Tambah Data</button>
					</fieldset>
				</form>
				<p>{form?.message ?? ''}</p>
			</div>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success" onclick={() => createKitabModal.showModal()}
			>Tambah Kitab</button
		>
	</div>
	<dialog class="modal" id="delete_user_modal" bind:this={deleteKitabModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data ini?</p>
			<div class="flex flex-row">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (kitabToDelete = null)}>Batal</button>
				</form>
				<form action="?/delete" method="post" use:enhance>
					<input type="hidden" name="id" value={kitabToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
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
							<td>
								<a href={'/kitab/edit-data/' + kitab.id} class="btn btn-accent"
									><button>Edit</button></a
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
