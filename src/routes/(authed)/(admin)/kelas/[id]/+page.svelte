<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

	let { data }: { data: PageServerData } = $props();
	let selectedSantri: string[] = $state([]);
	let deleteSantriKelasModal: HTMLDialogElement;

	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.listSantri.map((item) => item.santriId);
		} else {
			selectedSantri = [];
		}
	};
</script>

<svelte:head><title>Detail Kelas</title></svelte:head>

<dialog class="modal" id="delete_santri_kelas_modal" bind:this={deleteSantriKelasModal}>
	<div class="modal-box">
		<p>Apakah Anda Yakin untuk Menghapus data yang terpilih?</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-success">Batal</button>
			</form>
			<form
				action="?/delete"
				method="post"
				id="delete-santri-kelas"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							deleteSantriKelasModal.close();
						}
						await update();
					};
				}}
			>
				<button type="submit" class="btn btn-error">Hapus</button>
			</form>
		</div>
	</div>
</dialog>

<div class="card">
	<div class="card-body">
		<h2 class="card-title">Detail Kelas</h2>
		<div>
			<table class="table">
				{#if data.infoKelas != undefined}
					<tbody>
						<tr>
							<th>Nama Kelas</th>
							<td>{data.infoKelas.namaKelas}</td>
						</tr>
						<tr>
							<th>Tahun Ajaran</th>
							<td
								>{data.infoKelas.tahun_ajaran?.tahunMulai +
									'/' +
									data.infoKelas.tahun_ajaran?.tahunSelesai +
									' ' +
									data.infoKelas.tahun_ajaran?.tipeSemester?.toUpperCase()}</td
							>
						</tr>
						<tr>
							<th>Wali Kelas</th>
							<td>{data.infoKelas.guru?.user.name}</td>
						</tr>
					</tbody>
				{/if}
			</table>
			{#if data.infoKelas != undefined}
				<div class="card-actions justify-end mt-4">
					<a href={resolve(`/kelas/${data.infoKelas.id}/tambah-santri`)} class="btn btn-accent"
						>Tambah Santri</a
					>
					{#if selectedSantri.length > 0}
						<button
							class="btn btn-error"
							onclick={() => {
								deleteSantriKelasModal.showModal();
							}}>Hapus Data</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
<div class="card">
	<table class="table">
		<thead>
			<tr>
				<th
					><label for=""
						><input
							type="checkbox"
							name=""
							id="main-checkbox"
							onchange={toggleSelectAll}
							class="checkbox checkbox-md"
						/></label
					></th
				>
				<th></th>
				<th>Nama</th>
			</tr>
		</thead>
		<tbody>
			{#each data.listSantri as santri_kelas, i (santri_kelas.id)}
				<tr>
					<th
						><label for=""
							><input
								type="checkbox"
								name="idSantri"
								id=""
								class="checkbox checkbox-md"
								form="delete-santri-kelas"
								value={santri_kelas.santriId}
								bind:group={selectedSantri}
							/></label
						></th
					>
					<th>{i + 1}</th>
					<td>{santri_kelas.santri.user.name}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
