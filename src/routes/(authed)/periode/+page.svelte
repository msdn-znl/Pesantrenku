<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let createPeriodeModal: HTMLDialogElement;
	let deletePeriodeModal: HTMLDialogElement;
	let periodeToDelete = $state<number | null>(null);
</script>

<div class="">
	<dialog class="modal" id="create_periode_modal" bind:this={createPeriodeModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<div>
				<form action="?/create" method="post" use:enhance autocomplete="off" class="flex flex-col">
					<fieldset class="fieldset">
						<label for="tahunAjaran">Periode</label>
						<input
							type="text"
							name="tahunAjaran"
							id="tahunAjaran"
							class="input"
							placeholder="Contoh: 2025/2026 Genap"
							required
						/>
						<button type="submit" class="btn btn-success">Tambah Data</button>
					</fieldset>
				</form>
			</div>
			<p>{form?.message ?? ''}</p>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success mr-2" onclick={() => createPeriodeModal.showModal()}
			>Tambah Periode</button
		>
	</div>
	<dialog class="modal" id="delete_periode_modal" bind:this={deletePeriodeModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data periode ini?</p>
			<div class="flex flex-row">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (periodeToDelete = null)}>Batal</button>
				</form>
				<form action="?/delete" method="post" use:enhance>
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
				</tr>
			</thead>
			<tbody>
				{#each data.periodeList as periode, i (periode.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{periode.tahunAjaran}</td>
						<td>
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
	</div>
</div>
