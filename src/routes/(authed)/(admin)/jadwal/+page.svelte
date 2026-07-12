<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';
	// type Jadwal = PageServerData['jadwalList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const hari = [
		{ idx: 0, hari: 'Minggu' },
		{ idx: 1, hari: 'Senin' },
		{ idx: 2, hari: 'Selasa' },
		{ idx: 3, hari: 'Rabu' },
		{ idx: 4, hari: 'Kamis' },
		{ idx: 5, hari: 'Jumat' },
		{ idx: 6, hari: 'Sabtu' }
	];

	const matrixJadwal = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		let map = new Map();
		for (const jadwal of data.jadwalList) {
			if (!map.has(jadwal.jamMulai)) {
				map.set(jadwal.jamMulai, new Map());
			}
			map.get(jadwal.jamMulai).set(jadwal.hari, jadwal);
		}
		return map;
	});
	const slotWaktu = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const map = new Map();
		for (const jadwal of data.jadwalList) {
			const key = `${jadwal.jamMulai}${jadwal.jamSelesai}`;
			if (!map.has(key)) {
				map.set(key, { jamMulai: jadwal.jamMulai, jamSelesai: jadwal.jamSelesai });
			}
		}
		const arraySlotWaktu = Array.from(map.values()).sort((a, b) =>
			a.jamMulai.localeCompare(b.jamMulai)
		);
		return arraySlotWaktu;
	});

	// $inspect(slotWaktu, matrixJadwal);
	let createJadwalModal: HTMLDialogElement;
	let deleteJadwalModal: HTMLDialogElement;
	// let editJadwalModal: HTMLDialogElement;
	let jadwalToDelete = $state<string | null>(null);
	// let jadwalToEdit = $state<Jadwal | null>(null);

	// State untuk kontrol UI
	let isFormOpen = $state(false);
	let isSubmitting = $state(false);
	let isDeleting = $state<string | null>(null);

	// Array opsional hari agar urutan checklist rapi (Senin-Minggu)
	const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
	let selectedHari = $state<string[]>([]); // Menyimpan hari yang dicentang secara reaktif
</script>

<svelte:head>
	<title>Menu Jadwal</title>
</svelte:head>
<div>
	<dialog class="modal" id="create_jadwal_modal" bind:this={createJadwalModal}>
		<div class="modal-box">
			<h2 class="card-title">Tambah Jadwal</h2>
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<form
				action="?/create"
				method="post"
				class="flex flex-col gap-4"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							invalidateAll();
							createJadwalModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							createJadwalModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<label for="kitabId" class="label">Kitab</label>
				{#await data.streamed.kitabList}
					<select class="select w-full" disabled>
						<option>Memuat Kitab...</option>
					</select>
				{:then kitabList}
					<select name="kitabId" id="kitabId" class="select w-full">
						<option value="">Pilih</option>
						{#each kitabList as kitab (kitab.id)}
							<option value={kitab.id}>{kitab.namaKitab}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="kelasId" class="label">Kelas</label>
				{#await data.streamed.kelasList}
					<select class="select w-full" disabled>
						<option>Memuat Kelas...</option>
					</select>
				{:then kelasList}
					<select name="kelasId" id="kelasId" class="select w-full">
						<option value="">Pilih</option>
						{#each kelasList as kelas (kelas.id)}
							<option value={kelas.id}>{kelas.namaKelas}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="guruId" class="label">Guru</label>
				{#await data.streamed.guruList}
					<select class="select w-full" disabled>
						<option>Memuat Guru...</option>
					</select>
				{:then guruList}
					<select name="guruId" id="guruId" class="select w-full">
						<option value="">Pilih</option>
						{#each guruList as guru (guru.id)}
							<option value={guru.id}>{guru.nama}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<fieldset class="fieldset grid grid-cols-4">
					<legend class="fieldset-legend">Hari</legend>

					<label for="Minggu" class="label">
						<input type="checkbox" name="hari" id="Minggu" value="Minggu" class="checkbox" />
						Minggu</label
					>

					<label for="Senin" class="label">
						<input type="checkbox" name="hari" id="Senin" value="Senin" class="checkbox" />
						Senin</label
					>

					<label for="Selasa" class="label"
						><input
							type="checkbox"
							name="hari"
							id="Selasa"
							value="Selasa"
							class="checkbox"
						/>Selasa</label
					>

					<label for="Rabu" class="label"
						><input
							type="checkbox"
							name="hari"
							id="Rabu"
							value="Rabu"
							class="checkbox"
						/>Rabu</label
					>

					<label for="Kamis" class="label"
						><input
							type="checkbox"
							name="hari"
							id="Kamis"
							value="Kamis"
							class="checkbox"
						/>Kamis</label
					>

					<label for="Jumat" class="label"
						><input
							type="checkbox"
							name="hari"
							id="Jumat"
							value="Jumat"
							class="checkbox"
						/>Jumat</label
					>

					<label for="Sabtu" class="label"
						><input
							type="checkbox"
							name="hari"
							id="Sabtu"
							value="Sabtu"
							class="checkbox"
						/>Sabtu</label
					>
				</fieldset>
				<label for="jamMulai" class="label">Jam Mulai</label>
				<input type="time" name="jamMulai" id="jamMulai" class="input w-full" />
				<label for="jamSelesai" class="label">Jam Selesai</label>
				<input type="time" name="jamSelesai" id="jamSelesai" class="input w-full" />
				<button type="submit" class="btn btn-success">Tambah Jadwal</button>
			</form>
		</div>
	</dialog>
	<dialog class="modal" id="delete_jadwal_modal" bind:this={deleteJadwalModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin untuk menghapus jadwal ini?</p>
			<div class="modal-action">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (jadwalToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deleteJadwalModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deleteJadwalModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={jadwalToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>

	<div class="flex flex-row-reverse">
		<button class="btn btn-success" onclick={() => createJadwalModal.showModal()}
			>Tambah Jadwal</button
		>
	</div>
	<div class="card overflow-auto">
		<h2 class="card-title">List Jadwal</h2>
		<div class="card-body">
			<table class="table">
				<thead>
					<tr>
						<th></th>
						<th>Pengajar</th>
						<th>Kelas</th>
						<th>Kitab</th>
						<th>Hari</th>
						<th>Jam Mulai</th>
						<th>Jam Selesai</th>
					</tr>
				</thead>
				<tbody>
					{#each data.jadwalList as jadwal, i (jadwal.id)}
						<tr class="hover:bg-base-300">
							<th>{i + 1}</th>
							<td>{jadwal.guru.user.name}</td>
							<td>{jadwal.kelas.namaKelas}</td>
							<td>{jadwal.kitab.namaKitab}</td>
							<td>{jadwal.hari}</td>
							<td>{jadwal.jamMulai}</td>
							<td>{jadwal.jamSelesai}</td>
							<td>
								<a href={resolve('/(authed)/(admin)/jadwal/[id]/pertemuan', { id: jadwal.id })}
									><button class="btn btn-success">Data Pertemuan</button></a
								>
								<a href={resolve('/(authed)/(admin)/jadwal/[id]/edit', { id: jadwal.id })}
									><button class="btn btn-accent">Edit</button></a
								>

								<button
									class="btn btn-error"
									onclick={() => {
										jadwalToDelete = jadwal.id;
										deleteJadwalModal.showModal();
									}}>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
<!-- <div class="card">
	<div class="card-body overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Minggu</th>
					<th>Senin</th>
					<th>Selasa</th>
					<th>Rabu</th>
					<th>Kamis</th>
					<th>Jumat</th>
					<th>Sabtu</th>
				</tr>
			</thead>
			<tbody>
				{#each slotWaktu as w (w.jamMulai)}
					<tr>
						<td>{w.jamMulai}-{w.jamSelesai}</td>
						{#each hari as h (h.idx)}
							{@const jadwalDiSelIni = matrixJadwal?.get(w.jamMulai)?.get(h.hari)}
							<td>
								{#if jadwalDiSelIni}
									<div class="card shadow-sm bg-base-100">
										<div class="card-body">
											<p>{jadwalDiSelIni.kelas.namaKelas}</p>
											<p>{jadwalDiSelIni.kitab.namaKitab}</p>
										</div>
									</div>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div> -->

<div class="p-6 bg-base-200 min-h-screen">
	<!-- Header & Control -->
	<div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
		<div>
			<h1 class="text-3xl font-bold text-base-content">Manajemen Jadwal</h1>
			<p class="text-base-content/70 mt-1">Kelola jadwal pelajaran (kitab), kelas, dan pengajar.</p>
		</div>
		<button class="btn btn-primary" onclick={() => (isFormOpen = !isFormOpen)}>
			{isFormOpen ? 'Batal / Tutup Form' : '+ Tambah Jadwal'}
		</button>
	</div>

	<!-- Section Form Penambahan Jadwal -->
	{#if isFormOpen}
		<div class="card bg-base-100 shadow-xl card-border mb-8">
			<div class="card-body">
				<h2 class="card-title text-lg border-b pb-2 mb-4">Form Jadwal Pelajaran Baru</h2>

				<form
					method="POST"
					action="?/create"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update();
							isSubmitting = false;
							if (!form?.error) {
								isFormOpen = false;
								selectedHari = []; // Reset checklist jika berhasil
							}
						};
					}}
				>
					<!-- Grid Input Data Utama -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div class="form-control">
							<label class="label" for="kitabId"
								><span class="label-text">Kitab / Pelajaran</span></label
							>
							<select name="kitabId" id="kitabId" class="select select-bordered" required>
								<option value="" disabled selected>Pilih Kitab...</option>
								{#each data.streamed.kitabList as kitab (kitab.id)}
									<option value={kitab.id}>{kitab.namaKitab}</option>
								{/each}
							</select>
						</div>

						<div class="form-control">
							<label class="label" for="kelasId"><span class="label-text">Kelas</span></label>
							<select name="kelasId" id="kelasId" class="select select-bordered" required>
								<option value="" disabled selected>Pilih Kelas...</option>
								{#each data.streamed.kelasList as kelas (kelas.id)}
									<option value={kelas.id}>{kelas.namaKelas}</option>
								{/each}
							</select>
						</div>

						<div class="form-control">
							<label class="label" for="guruId"><span class="label-text">Guru Pengajar</span></label
							>
							<select name="guruId" id="guruId" class="select select-bordered" required>
								<option value="" disabled selected>Pilih Guru...</option>
								{#each data.streamed.guruList as guru (guru.id)}
									<option value={guru.id}>{guru.nama}</option>
								{/each}
							</select>
						</div>

						<div class="form-control">
							<label class="label"><span class="label-text">Jam Mulai</span></label>
							<input type="time" name="jamMulai" class="input input-bordered" required />
						</div>

						<div class="form-control">
							<label class="label"><span class="label-text">Jam Selesai</span></label>
							<input type="time" name="jamSelesai" class="input input-bordered" required />
						</div>

						<div class="grid grid-cols-2 gap-2">
							<div class="form-control">
								<label class="label"><span class="label-text">Berlaku Mulai</span></label>
								<input
									type="date"
									name="berlakuMulai"
									class="input input-bordered w-full"
									required
								/>
							</div>
							<div class="form-control">
								<label class="label"><span class="label-text">Sampai (Opsional)</span></label>
								<input type="date" name="berlakuSampai" class="input input-bordered w-full" />
							</div>
						</div>
					</div>

					<!-- Checklist Hari -->
					<div class="form-control mt-4 bg-base-200/50 p-4 rounded-box border border-base-300">
						<span class="label-text font-medium mb-3 block"
							>Pilih Hari Pelaksanaan (Bisa lebih dari satu)</span
						>
						<div class="flex flex-wrap gap-4">
							{#each hari as h (h.idx)}
								<label class="cursor-pointer label justify-start gap-2">
									<input
										type="checkbox"
										name="hari"
										value={h.hari}
										bind:group={selectedHari}
										class="checkbox checkbox-sm checkbox-primary"
									/>
									<span class="label-text">{h.hari}</span>
								</label>
							{/each}
						</div>
						<!-- Validasi ringan di frontend -->
						{#if selectedHari.length === 0}
							<span class="text-xs text-error mt-2">Pilih minimal satu hari pelaksanaan.</span>
						{/if}
					</div>

					<div class="flex justify-end mt-6">
						<button
							type="submit"
							class="btn btn-primary"
							disabled={selectedHari.length === 0 || isSubmitting}
						>
							{#if isSubmitting}<span class="loading loading-spinner loading-sm"></span>{/if}
							Simpan Jadwal
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Section Read / Table -->
	<div class="card bg-base-100 shadow-xl card-border">
		<div class="card-body p-0">
			<div class="overflow-x-auto p-4">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th></th>
							<th>Hari</th>
							<th>Waktu</th>
							<th>Pelajaran / Kitab</th>
							<th>Kelas</th>
							<th>Pengajar</th>
							<th class="text-right">Aksi</th>
						</tr>
					</thead>
					<tbody>
						{#if data.jadwalList && data.jadwalList.length > 0}
							{#each data.jadwalList as jadwal, i (jadwal.id)}
								<tr>
									<td>{i + 1}</td>
									<td class="font-bold">{jadwal.hari}</td>
									<td>
										<div class="badge badge-neutral badge-soft font-mono">
											{jadwal.jamMulai.slice(0, 5)} - {jadwal.jamSelesai.slice(0, 5)}
										</div>
									</td>
									<td class="font-medium text-primary">{jadwal.kitab.namaKitab}</td>
									<td>{jadwal.kelas.namaKelas}</td>
									<td>{jadwal.guru.user.name}</td>
									<td class="text-right">
										<!-- Action Form untuk Delete -->
										<form
											method="POST"
											action="?/hapus"
											use:enhance={() => {
												isDeleting = jadwal.id;
												return async ({ update }) => {
													await update({ reset: false });
													isDeleting = null;
												};
											}}
										>
											<input type="hidden" name="jadwalId" value={jadwal.id} />
											<button
												type="submit"
												class="btn btn-sm btn-error btn-soft"
												disabled={isDeleting === jadwal.id}
												onclick={(e) => {
													if (!confirm('Yakin ingin menghapus jadwal ini?')) e.preventDefault();
												}}
											>
												{#if isDeleting === jadwal.id}
													<span class="loading loading-spinner loading-xs"></span>
												{:else}
													Hapus
												{/if}
											</button>
										</form>
									</td>
								</tr>
							{/each}
						{:else}
							<tr>
								<td colspan="6" class="text-center italic text-base-content/50 py-10">
									Belum ada data jadwal.
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Notifikasi Form Action -->
	{#if form}
		<div class="toast toast-end toast-bottom z-50">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
