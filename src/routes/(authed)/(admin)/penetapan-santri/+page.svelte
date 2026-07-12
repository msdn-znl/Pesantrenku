<!-- <script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tableBody: HTMLElement;
	let untukDidaftarkan = $state<string[]>([]);
	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			untukDidaftarkan = data.santriBelumTerdaftar.map((s) => s.id);
		} else {
			untukDidaftarkan = [];
		}
	};
</script> -->

<!-- <div class="flex justify-end">
	<form action="?/daftar" method="post" id="daftarkan">
		<input
			type="text"
			name="tahunAjaranId"
			id="tahunAjaranId"
			hidden
			value={data.tahunAjaranId.id}
		/>
		<button type="submit" class="btn btn-success">Daftarkan</button>
	</form>
</div>
<div class="card">
	<h2 class="card-title">Belum Terdaftar</h2>
	<table class="table">
		<thead>
			<tr>
				<th
					><label for=""
						><input
							type="checkbox"
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
		<tbody id="table-body" bind:this={tableBody}>
			{#each data.santriBelumTerdaftar as item, i (item.id)}
				<tr>
					<td
						><input
							type="checkbox"
							name="santriId"
							id="santriId"
							value={item.id}
							bind:group={untukDidaftarkan}
							form="daftarkan"
							class="checkbox checkbox-md"
						/></td
					>
					<td>{i + 1}</td>
					<td>{item.nama}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div> -->

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	// State untuk UI
	let searchQuery = $state('');
	let selectedSantri = $state<string[]>([]); // Menyimpan ID santri yang dipilih
	let isSubmitting = $state(false);

	// Logika Pencarian
	let filteredSantri = $derived(
		data.santriBelumTerdaftar.filter(
			(s) =>
				s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(s.nis && s.nis.toLowerCase().includes(searchQuery.toLowerCase()))
		)
	);

	// Improvisasi 3: Logika "Pilih Semua"
	let allSelected = $derived(
		filteredSantri.length > 0 && selectedSantri.length === filteredSantri.length
	);

	function toggleAll(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = filteredSantri.map((s) => s.id);
		} else {
			selectedSantri = [];
		}
	}
</script>

<div class="p-6 bg-base-200 min-h-screen">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Penetapan Santri Aktif</h1>
		<p class="text-base-content/70 mt-1">Daftarkan santri untuk tahun ajaran aktif saat ini.</p>
	</div>

	{#if !data.tahunAjaranId}
		<div class="alert alert-warning mb-6">
			<span
				>Sistem tidak mendeteksi adanya Tahun Ajaran yang aktif. Silakan atur di menu Tahun Ajaran
				terlebih dahulu.</span
			>
		</div>
	{:else}
		<div class="card bg-base-100 shadow-xl card-border">
			<div class="card-body">
				<div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
					<!-- Improvisasi 4: Pencarian -->
					<input
						type="text"
						placeholder="Cari nama atau NIS..."
						class="input input-bordered w-full md:max-w-xs"
						bind:value={searchQuery}
					/>

					<div class="text-sm font-medium bg-base-200 py-2 px-4 rounded-lg">
						Terpilih: <span class="text-primary">{selectedSantri.length}</span> santri
					</div>
				</div>

				<!-- Form Action untuk Bulk Insert -->
				<form
					method="POST"
					action="?/daftar"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							await update({ reset: false }); // Cegah reset total UI form
							isSubmitting = false;
							selectedSantri = []; // Kosongkan pilihan jika sukses
						};
					}}
				>
					<input type="hidden" name="tahunAjaranId" value={data.tahunAjaranId} />

					<div class="overflow-x-auto border rounded-box max-h-[60vh]">
						<table class="table table-zebra table-pin-rows w-full">
							<thead>
								<tr>
									<th class="w-12 text-center">
										<!-- Checkbox Pilih Semua -->
										<input
											type="checkbox"
											class="checkbox checkbox-sm checkbox-primary"
											checked={allSelected}
											onchange={toggleAll}
										/>
									</th>
									<th>NIS</th>
									<th>Nama Santri</th>
								</tr>
							</thead>
							<tbody>
								{#each filteredSantri as santri (santri.id)}
									<tr>
										<td class="text-center">
											<!-- Bind group agar Svelte otomatis memasukkan value ke array selectedSantri -->
											<input
												type="checkbox"
												name="santriIds"
												value={santri.id}
												bind:group={selectedSantri}
												class="checkbox checkbox-sm"
											/>
										</td>
										<td class="font-mono text-sm">{santri.nis || '-'}</td>
										<td class="font-medium">{santri.nama}</td>
									</tr>
								{:else}
									<tr>
										<td colspan="3" class="text-center italic text-base-content/50 py-8">
											Semua santri telah terdaftar pada tahun ajaran ini.
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Area Eksekusi -->
					<div class="mt-6 flex justify-end">
						<button
							type="submit"
							class="btn btn-primary"
							disabled={selectedSantri.length === 0 || isSubmitting}
						>
							{#if isSubmitting}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							Daftarkan Santri Terpilih
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}

	<!-- Notifikasi Toast jika aksi sukses atau gagal -->
	{#if form}
		<div class="toast toast-end toast-bottom">
			<div class={`alert ${form.error ? 'alert-error' : 'alert-success'}`}>
				<span>{form.message}</span>
			</div>
		</div>
	{/if}
</div>
