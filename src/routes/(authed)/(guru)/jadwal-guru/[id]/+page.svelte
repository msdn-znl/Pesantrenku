<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { resolve } from '$app/paths';

	import type { PageServerData } from './$types';
	let { data }: { data: PageServerData } = $props();
	let editPertemuanModal: HTMLDialogElement;
	let pertemuanId = $state<string | null>(null);
	let defaultJurnal = $state<string | null>(null);
	let defaultStatus = $state<string | null>(null);
</script>

<svelte:head>
	<title>Riwayat Jurnal</title>
</svelte:head>
<dialog class="modal" id="edit_perteman_modal" bind:this={editPertemuanModal}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<form
			action="?/edit"
			method="post"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Berhasil');
						editPertemuanModal.close();
					} else if (result.type === 'failure') {
						toast.error('Gagal memproses data');
					} else if (result.type === 'error') {
						toast.error('terjadi kesalahan di server');
					}
					await update();
				};
			}}
		>
			<h2 class="card-title">Edit Jurnal</h2>
			<fieldset class="fieldset">
				<input type="text" hidden value={pertemuanId} />
				<label for="jurnalMengajar" class="label">Jurnal</label>
				<textarea
					name="jurnalMengajar"
					id="jurnalMengajar"
					class="textarea textarea-md w-full"
					defaultValue={defaultJurnal}
				></textarea>
				<label for="status" class="label">Status Pertemuan</label>
				<select name="status" id="status" class="select select-md w-full">
					<option value=""></option>
					<option value="selesai" selected={defaultStatus === 'selesai' ? true : false}
						>Selesai</option
					>
					<option value="batal" selected={defaultStatus === 'batal' ? true : false}>Batal</option>
					<option value="tugas mandiri" selected={defaultStatus === 'tugas mandiri' ? true : false}
						>Tugas Mandiri</option
					>
				</select>
				<button type="submit" class="btn btn-success mt-4">Edit Pertemuan</button>
			</fieldset>
		</form>
	</div>
</dialog>

<!-- <div class="flex flex-col flex-wrap gap-4 w-full md:flex-row">
	{#each data.jurnalList as jurnal (jurnal.id)}
		<div class="card card-md bg-base-100 shadow-sm">
			<div class="card-body">
				<h2 class="card-title">{jurnal.tanggalPertemuan}</h2>
				<p>{jurnal.jurnalMengajar}</p>
				<div class="card-actions justify-end">
					 <button
						class="btn btn-primary"
						onclick={() => {
							pertemuanId = jurnal.id;
							defaultJurnal = jurnal.jurnalMengajar;
							defaultStatus = jurnal.status;
							editPertemuanModal.showModal();
						}}>Edit Jurnal</button
					> 
					<a
						href={resolve('/(authed)/(guru)/pertemuan-guru/[id]', { id: jurnal.id })}
						class="btn btn-accent">Detail Absensi</a
					>
				</div>
			</div>
		</div>
	{/each}
</div> -->
<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header Halaman -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Riwayat Jurnal & Absensi</h1>
		<p class="text-base-content/70 mt-1">
			Daftar pertemuan kelas dan catatan materi yang telah diajarkan.
		</p>
	</div>

	<!-- Layout Grid untuk Card Jurnal -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.jurnalList as jurnal (jurnal.id)}
			<div class="card bg-base-100 shadow-xl card-border">
				<div class="card-body">
					<!-- Top Info: Tanggal & Status -->
					<div class="flex flex-wrap justify-between items-start gap-2 mb-4">
						<div class="badge badge-primary badge-soft font-medium">
							<!-- Format tanggal menjadi lebih ramah dibaca (contoh: 18 Juli 2026) -->
							{new Date(jurnal.tanggalPertemuan).toLocaleDateString('id-ID', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</div>

						<!-- Badge status berdasarkan enum di skema -->
						{#if jurnal.status === 'selesai'}
							<div class="badge badge-success badge-soft capitalize">Selesai</div>
						{:else if jurnal.status === 'tugas mandiri'}
							<div class="badge badge-info badge-soft capitalize">Tugas Mandiri</div>
						{:else if jurnal.status === 'batal'}
							<div class="badge badge-error badge-soft capitalize">Batal</div>
						{/if}
					</div>

					<!-- Konten Jurnal -->
					<h2 class="card-title text-base-content text-lg">Catatan Mengajar:</h2>
					<!-- line-clamp-3 menjaga agar text panjang tidak merusak tinggi card secara berlebihan -->
					<p class="text-base-content/70 text-sm line-clamp-3 mt-1">
						{jurnal.jurnalMengajar || 'Tidak ada catatan yang diisi pada pertemuan ini.'}
					</p>

					<!-- Tombol Aksi -->
					<div class="card-actions justify-end mt-6">
						<a
							href={resolve('/(authed)/(guru)/pertemuan-guru/[id]', { id: jurnal.id })}
							class="btn btn-accent w-full sm:w-auto"
						>
							Detail Absensi
						</a>
					</div>
				</div>
			</div>
		{:else}
			<!-- Fallback Tampilan Kosong -->
			<div class="col-span-full">
				<div class="card bg-base-100 shadow-sm border border-base-200">
					<div class="card-body text-center py-12">
						<p class="text-lg font-medium text-base-content/70">
							Belum ada riwayat jurnal mengajar untuk jadwal ini.
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
