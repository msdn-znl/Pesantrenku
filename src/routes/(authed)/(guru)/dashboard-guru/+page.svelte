<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let jadwalId = $state<string | null>(null);
	let mulaiKelasModal: HTMLDialogElement;
</script>

<dialog class="modal" id="mulai_kelas_modal" bind:this={mulaiKelasModal}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form
			action="?/begin"
			class="flex flex-col"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Berhasil');
						mulaiKelasModal.close();
					} else if (result.type === 'failure') {
						toast.error(result.data?.message ?? 'Gagal memproses data');
					} else if (result.type === 'error') {
						toast.error('Terjadi kesalahan server');
					}
					await update();
				};
			}}
		>
			<h2 class="card-title">Tambah Jurnal Mengajar</h2>
			<fieldset class="fieldset">
				<input type="text" name="jadwalId" value={jadwalId} hidden />
				<label for="jurnalMengajar">Jurnal Mengajar</label>
				<textarea
					name="jurnalMengajar"
					id="jurnalMengajar"
					class="textarea textarea-md w-full"
					placeholder="Masukkan Jurnal Mengajar"
				></textarea>
				<button type="submit" class="btn btn-success mt-4">Tambah Jurnal</button>
			</fieldset>
		</form>
	</div>
</dialog>

<div class="flex flex-col flex-wrap w-full gap-4 md:flex-row">
	{#each data.jadwalHariIni as jadwal, i (jadwal.id)}
		<div class="card card-md bg-base-100 shadow-sm">
			<div class="card-body">
				<h2 class="card-title">{jadwal.kitab.namaKitab} - {jadwal.kelas.namaKelas}</h2>
				<p>Jam Mulai: {jadwal.jamMulai}</p>
				<p>Jam Selesai: {jadwal.jamSelesai}</p>
				<div class="card-actions justify-end">
					<button
						type="submit"
						class="btn btn-success"
						onclick={() => {
							jadwalId = jadwal.id;
							mulaiKelasModal.showModal();
						}}>Mulai Kelas</button
					>
				</div>
			</div>
		</div>
	{/each}
	<!-- <div class="card card-md bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">Preview Nama Kitab - Preview Nama Kelas</h2>
			<p>Jam Mulai: Preview jam Mulai</p>
			<p>Jam Selesai: preview jam selesai</p>
			<div class="card-actions justify-end">
				<button
					type="submit"
					class="btn btn-success"
					onclick={() => {
						jadwalId = null;
						mulaiKelasModal.showModal();
					}}>Mulai Kelas</button
				>
			</div>
		</div>
	</div> -->
</div>

<!-- <div class="card overflow-auto">
	<h2 class="card-title">Jadwal Hari Ini</h2>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Kitab</th>
					<th>Kelas</th>
					<th>Jam Mulai</th>
					<th>Jam Selesai</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each data.jadwalHariIni as jadwal, i (jadwal.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{jadwal.kitab.namaKitab}</td>
						<td>{jadwal.kelas.namaKelas}</td>
						<td>{jadwal.jamMulai}</td>
						<td>{jadwal.jamSelesai}</td>
						<td>
							<button
								type="submit"
								class="btn btn-success"
								onclick={() => {
									jadwalId = jadwal.id;
									mulaiKelasModal.showModal();
								}}>Mulai Kelas</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div> -->
