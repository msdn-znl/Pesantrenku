<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let jadwalId = $state<string | null>(null);
	let mulaiKelasModal: HTMLDialogElement;

	let selectedJadwalId = $state<string | null>(null);
	let modalElement = $state<HTMLDialogElement | null>(null);

	// Fungsi untuk membuka modal dan mengatur context jadwal
	function bukaModal(id: string) {
		selectedJadwalId = id;
		if (modalElement) modalElement.showModal();
	}
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

<!-- <div class="flex flex-col flex-wrap w-full gap-4 md:flex-row">
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
	</div> -->
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
<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header Dashboard -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Dashboard Guru</h1>
		<p class="text-base-content/70 mt-1">
			Selamat datang, Ustadz. Berikut adalah jadwal mengajar Anda hari ini.
		</p>
	</div>

	<!-- Layout Grid untuk Card Jadwal -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.jadwalSekarang as item (item.jadwal.id)}
			<div class="card bg-base-100 shadow-xl card-border">
				<div class="card-body">
					<!-- Header Card: Waktu & Status -->
					<div class="flex justify-between items-start mb-2">
						<div class="badge badge-neutral badge-soft font-mono">
							<!-- Potong detik agar tampil HH:MM -->
							{item.jadwal.jamMulai.slice(0, 5)} - {item.jadwal.jamSelesai.slice(0, 5)}
						</div>

						<!-- 
							Logika Pengecekan Status:
							Asumsi bahwa data dari server memiliki properti `pertemuanId` 
							jika guru sudah membuat entri pertemuan (jurnal) hari ini.
						-->
						{#if item?.pertemuan?.id}
							<div class="badge badge-success badge-soft font-medium">Selesai</div>
						{:else}
							<div class="badge badge-warning badge-soft font-medium">Belum Diisi</div>
						{/if}
					</div>

					<!-- Informasi Mata Pelajaran & Kelas -->
					<h2 class="card-title text-primary text-xl mt-2">
						{item?.kitab?.namaKitab}
					</h2>
					<p class="text-base-content/70 font-medium">Kelas: {item?.kelas?.namaKelas}</p>

					<!-- Area Tombol Aksi -->
					<div class="card-actions justify-end mt-6">
						{#if item?.pertemuan?.id}
							<!-- Tombol Outline jika kelas sudah berstatus selesai -->
							<a
								href="/pertemuan-guru/{item?.pertemuan?.id}"
								class="btn btn-outline btn-success w-full sm:w-auto"
							>
								Lihat/Edit Absensi
							</a>
						{:else}
							<!-- Tombol Utama untuk memulai kelas -->
							<button
								class="btn btn-primary w-full sm:w-auto"
								onclick={() => bukaModal(item.jadwal.id)}
							>
								Mulai Kelas & Isi Jurnal
							</button>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<!-- Tampilan Kosong Jika Tidak Ada Jadwal -->
			<div class="col-span-full">
				<div class="card bg-base-100 shadow-sm border border-base-200">
					<div class="card-body text-center py-12">
						<p class="text-lg font-medium text-base-content/70">
							Alhamdulillah, Anda tidak memiliki jadwal mengajar hari ini.
						</p>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- 
		Modal Dialog untuk Pengisian Jurnal
		Menggunakan pendekatan semantik HTML <dialog> yang disarankan daisyUI
	-->
	<dialog bind:this={modalElement} class="modal">
		<div class="modal-box card-border">
			<h3 class="font-bold text-lg mb-2">Mulai Kelas</h3>
			<p class="text-base-content/70 text-sm mb-4">
				Silakan isi jurnal mengajar ringkas sebelum melanjutkan ke form absensi santri.
			</p>

			<!-- Form disubmit ke Action Server SvelteKit (?/mulaiKelas) -->
			<form method="POST" action="?/begin">
				<input type="hidden" name="jadwalId" value={selectedJadwalId} />

				<div class="form-control mb-6">
					<label class="label" for="jurnalMengajar">
						<span class="label-text font-medium">Jurnal / Materi yang Diajarkan</span>
					</label>
					<textarea
						name="jurnalMengajar"
						id="jurnalMengajar"
						class="textarea textarea-bordered h-28 w-full"
						placeholder="Misal: Melanjutkan pembahasan Bab Thaharah pasal wudhu..."
						required
					></textarea>
				</div>

				<div class="modal-action">
					<!-- Tombol Batal untuk menutup modal -->
					<button type="button" class="btn btn-ghost" onclick={() => modalElement?.close()}>
						Batal
					</button>
					<button type="submit" class="btn btn-primary"> Simpan & Lanjut Absen </button>
				</div>
			</form>
		</div>

		<!-- Menutup modal dengan mengklik area latar (backdrop) -->
		<form method="dialog" class="modal-backdrop">
			<button>Tutup</button>
		</form>
	</dialog>

	<!-- Notifikasi Toast Jika Sukses/Gagal -->
	{#if form}
		<div class="toast toast-end toast-bottom z-50">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
