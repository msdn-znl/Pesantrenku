<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data }: { data: PageServerData } = $props();
	let createPeriodeModal: HTMLDialogElement;
	let deletePeriodeModal: HTMLDialogElement;
	let activatePeriodeModal: HTMLDialogElement;
	let periodeToDelete = $state<string | null>(null);
	let periodeToActivate = $state<string | null>(null);
</script>

<svelte:head>
	<title>Menu Tahun Ajar</title>
</svelte:head>
<div>
	<dialog
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
	</div>
</div>
