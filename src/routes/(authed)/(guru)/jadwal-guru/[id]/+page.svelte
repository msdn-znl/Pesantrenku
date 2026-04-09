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
	<title>Menu Pertemuan : Detail</title>
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

<div class="flex flex-col flex-wrap gap-4 w-full md:flex-row">
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
	<!--Hapus Preview ini kalau sudah selesai-->
	<!-- <div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">10-10-2025</h2>
			<p>Preview Jurnal Mengajar, sudah bisa dilihat</p>
			<p>Status: Selesai</p>
			<div class="card-actions justify-end">
				<button
					class="btn btn-primary"
					onclick={() => {
						pertemuanId = 'abc';
						defaultJurnal = 'ini default value di awal';
						defaultStatus = 'tugas mandiri';
						editPertemuanModal.showModal();
					}}>Edit Jurnal</button
				>
			</div>
		</div>
	</div>
	<div class="card bg-base-100 shadow-sm">
		<div class="card-body">
			<h2 class="card-title">10-10-2025</h2>
			<p>Preview Jurnal Mengajar, sdah bisa dilihat</p>
			<p>Status: Selesai</p>
			<div class="card-actions justify-end">
				<button
					class="btn btn-primary"
					onclick={() => {
						pertemuanId = 'xyz';
						defaultJurnal = 'Default value lain';
						defaultStatus = 'selesai';
						editPertemuanModal.showModal();
					}}>Edit Jurnal</button
				>
				<a href="/pertemuan-guru/abc" class="btn btn-accent">Detail Absensi</a>
			</div>
		</div>
	</div> -->
</div>
