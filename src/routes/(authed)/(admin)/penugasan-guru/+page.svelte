<!-- <script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	let { data }: { data: PageServerData } = $props();
	const tahunAjaran = $derived(
		data.tahunAjaran.tahunMulai +
			'/' +
			data.tahunAjaran.tahunSelesai +
			' ' +
			data.tahunAjaran.tipeSemester
	);
	let tahunAjaranId = $state<string | undefined>();
	let guruId = $state<string | undefined>();
	let PenugasanModal: HTMLDialogElement;
	let PenghapusanModal: HTMLDialogElement;
</script> -->

<!-- <div class="card">
	<table class="table">
		<thead>
			<tr
				><th></th>
				<th></th>
				<th>Nama</th>
				<th>Status</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.guruList as guru, i (guru.guruId)}
				<tr>
					<th></th>
					<th>{i + 1}</th>
					<td>{guru.name}</td>
					<td><p class={guru.status ? 'badge badge-success' : ''}>{guru.status}</p></td>
					{#if guru.status === null && guru.penugasanId === null}
						<td>
							<button
								class="btn btn-success"
								onclick={() => {
									guruId = guru.guruId;
									tahunAjaranId = data.tahunAjaran?.id;
									PenugasanModal.showModal();
								}}>Tetapkan Aktif</button
							>
						</td>
					{:else if guru.status === 'aktif'}
						<td>
							<button
								class="btn btn-error"
								onclick={() => {
									guruId = guru.guruId;
									tahunAjaranId = data.tahunAjaran?.id;
									PenghapusanModal.showModal();
								}}>Nonaktifkan</button
							>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div> -->
<!-- <dialog
	class="modal"
	bind:this={PenugasanModal}
	onclose={() => {
		guruId = undefined;
		tahunAjaranId = undefined;
	}}
>
	<div class="modal-box">
		<form
			action="?/create"
			method="post"
			id="penugasan-guru"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						PenugasanModal.close();
					}
					await update();
				};
			}}
		>
			<input type="text" name="tahunAjaranId" value={tahunAjaranId} hidden />
			<input type="text" name="guruId" value={guruId} hidden />
			<p>Apakah anda yakin untuk menetapkan guru ini di tahun ajaran {tahunAjaran}?</p>
			<div class="modal-action justify-end">
				<button type="submit" class="btn btn-success">Ya</button>
			</div>
		</form>
	</div>
</dialog> -->
<!-- <dialog
	class="modal"
	bind:this={PenghapusanModal}
	onclose={() => {
		guruId = undefined;
		tahunAjaranId = undefined;
	}}
>
	<div class="modal-box">
		<form
			action="?/delete"
			method="post"
			id="penghapusan-guru"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						PenghapusanModal.close();
					}
					await update();
				};
			}}
		>
			<input type="text" name="tahunAjaranId" value={tahunAjaranId} hidden />
			<input type="text" name="guruId" value={guruId} hidden />
			<p>Apakah anda yakin untuk menonaktifkan guru ini di tahun ajaran {tahunAjaran}?</p>
			<div class="modal-action justify-end">
				<button type="submit" class="btn btn-success">Ya</button>
			</div>
		</form>
	</div>
</dialog> -->

<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	// Svelte 5 state
	let searchQuery = $state('');
	let selectedGuru = $state<string[]>([]);
	let isSubmitting = $state(false);

	// Derived state untuk hasil pencarian real-time
	let filteredGuru = $derived(
		data.guruList?.filter(
			(g) =>
				g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(g.nig && g.nig.toLowerCase().includes(searchQuery.toLowerCase()))
		) || []
	);

	// Derived state untuk status checkbox 'Pilih Semua'
	let allSelected = $derived(
		filteredGuru.length > 0 && selectedGuru.length === filteredGuru.length
	);

	function toggleAll(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			selectedGuru = filteredGuru.map((g) => g.guruId);
		} else {
			selectedGuru = [];
		}
	}
</script>

<div class="p-6 bg-base-200 min-h-screen">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Penugasan Guru</h1>
		<p class="text-base-content/70 mt-1">
			Tetapkan status aktif mengajar guru pada tahun ajaran ini.
		</p>
	</div>

	{#if !data.tahunAjaran}
		<div class="alert alert-warning mb-6">
			<span
				>Sistem tidak mendeteksi adanya Tahun Ajaran yang aktif. Silakan atur di menu Tahun Ajaran
				terlebih dahulu.</span
			>
		</div>
	{:else}
		<div class="card bg-base-100 shadow-xl card-border">
			<div class="card-body">
				<!-- Header Control (Search & Selection Info) -->
				<div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
					<input
						type="text"
						placeholder="Cari nama guru atau NIG..."
						class="input input-bordered w-full md:max-w-xs"
						bind:value={searchQuery}
					/>

					<div class="text-sm font-medium bg-base-200 py-2 px-4 rounded-lg">
						Terpilih: <span class="text-primary">{selectedGuru.length}</span> guru
					</div>
				</div>

				<form
					method="POST"
					action="?/create"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update({ reset: false }); // Menghindari halaman refresh kosong total
							isSubmitting = false;
							selectedGuru = []; // Bersihkan pilihan setelah aksi sukses
						};
					}}
				>
					<input type="hidden" name="tahunAjaranId" value={data.tahunAjaran.id} />

					<!-- Tabel Data Guru -->
					<div class="overflow-x-auto border rounded-box max-h-[60vh]">
						<table class="table table-zebra table-pin-rows w-full">
							<thead>
								<tr>
									<th class="w-12 text-center">
										<!-- Master Checkbox (Select All) -->
										<input
											type="checkbox"
											class="checkbox checkbox-sm checkbox-primary"
											checked={allSelected}
											onchange={toggleAll}
										/>
									</th>
									<th>NIG</th>
									<th>Nama Guru</th>
									<th>Jabatan</th>
									<th>Status Saat Ini</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredGuru as guru (guru.guruId)}
									<tr>
										<td class="text-center">
											<!-- Bind group otomatis menyinkronkan array selectedGuru -->
											<input
												type="checkbox"
												name="guruIds"
												value={guru.guruId}
												bind:group={selectedGuru}
												class="checkbox checkbox-sm"
											/>
										</td>
										<td class="font-mono text-sm">{guru.nig || '-'}</td>
										<td class="font-medium">{guru.name}</td>
										<td class="text-sm">{guru.jabatan || '-'}</td>
										<td>
											<!-- Implementasi Badge daisyUI -->
											{#if guru.status === 'aktif'}
												<div class="badge badge-success badge-soft">Aktif</div>
											{:else if guru.status === 'inaktif'}
												<div class="badge badge-error badge-soft">Inaktif</div>
											{:else}
												<div class="badge badge-neutral badge-soft">Belum Ditugaskan</div>
											{/if}
										</td>
									</tr>
								{:else}
									<tr>
										<td colspan="5" class="text-center italic text-base-content/50 py-8">
											Tidak ada data guru yang ditemukan.
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Bulk Action Buttons -->
					<div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
						<!-- Dua tombol submit dalam satu form, value-nya ditangkap server sebagai 'actionType' -->
						<button
							type="submit"
							name="actionType"
							value="inaktif"
							class="btn btn-error btn-soft"
							disabled={selectedGuru.length === 0 || isSubmitting}
						>
							Nonaktifkan Terpilih
						</button>
						<button
							type="submit"
							name="actionType"
							value="aktif"
							class="btn btn-primary"
							disabled={selectedGuru.length === 0 || isSubmitting}
						>
							{#if isSubmitting}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							Tetapkan Aktif Terpilih
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Notifikasi Toast Jika Sukses/Gagal -->
	{#if form}
		<div class="toast toast-end toast-bottom z-50">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
