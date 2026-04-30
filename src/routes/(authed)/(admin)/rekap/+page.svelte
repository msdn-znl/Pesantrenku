<script lang="ts">
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let searchQuery = $state<string>('');
	const filteredRekap = $derived(
		data.rekap.filter((baris) => {
			const namaSantri = baris.user.name.toLowerCase();
			const kataKunci = searchQuery.toLowerCase();
			return namaSantri.includes(kataKunci);
		})
	);
	let opsiTa = $derived([
		...new Map(data.filterRecompute.map((i) => [i.tahunAjaran.id, i.tahunAjaran])).values()
	]);
	let opsiKelas = $derived([
		...new Map(data.filterRecompute.map((i) => [i.kelas.id, i.kelas])).values()
	]);
	let selectedTAId = $state('');
	let selectedKelasId = $state('');
	let selectedBulanIdx = $state<number | string>('');
	let selectedTahun = $state<number | string>('');
	let kombinasiTerpilih = $derived(
		data.filterRecompute.find(
			(d) => d.tahunAjaran.id === selectedTAId && d.kelas.id === selectedKelasId
		)
	);
	let opsiBulan = $derived(kombinasiTerpilih?.bulan ?? []);
	let opsiTahun = $derived(kombinasiTerpilih?.tahun ?? []);
	$effect(() => {
		// Cek dan reset Bulan
		if (opsiBulan.length > 0) {
			const isBulanValid = opsiBulan.some((b) => b.idx === selectedBulanIdx);
			if (!isBulanValid) selectedBulanIdx = opsiBulan[0].idx;
		} else {
			selectedBulanIdx = '';
		}

		// Cek dan reset Tahun
		if (opsiTahun.length > 0) {
			const isTahunValid = opsiTahun.includes(selectedTahun as number);
			if (!isTahunValid) selectedTahun = opsiTahun[0];
		} else {
			selectedTahun = '';
		}
	});

	let rekapModal: HTMLDialogElement;
</script>

<div class="card">
	<form action="" method="get" id="filter-rekap" class="card-body lg:flex-row">
		<label class="select w-full lg:max-w-3/10">
			<span class="label">Tahun Ajaran</span>
			<select name="tahunAjaranId" id="" value={data.filters.tahunAjaranId}>
				{#each data.tahunAjaranList as t (t.tahunAjaran.id)}
					<option value={t.tahunAjaran.id}
						>{t.tahunAjaran.tahunMulai +
							'/' +
							t.tahunAjaran.tahunSelesai +
							' ' +
							t.tahunAjaran.tipeSemester}</option
					>
				{/each}
			</select>
		</label>
		<label class="select w-full lg:max-w-2/10">
			<span class="label">Kelas</span>
			<select name="kelasId" id="" value={data.filters.kelasId}>
				{#each data.kelasList as kelas (kelas.kelasId)}
					<option value={kelas.kelasId}>{kelas.namaKelas}</option>
				{/each}
			</select>
		</label>
		<label class="select w-full lg:max-w-2/10">
			<span class="label">Bulan</span>
			<select name="bulan" id="" value={data.filters.bulan}>
				{#each data.bulanTersedia as b (b.idx)}
					<option value={b.idx}>{b.month}</option>
				{/each}
			</select>
		</label>
		<label for="" class="select w-full lg:max-w-2/10">
			<span class="label">Tahun</span>
			<select name="tahun" id="" value={data.filters.tahun}>
				{#each data.tahunRekap as t (t.tahun)}
					<option value={t.tahun}>{t.tahun}</option>
				{/each}
			</select>
		</label>
		<div class="card-actions justify-end">
			<button type="submit" class="btn">Cari</button>
		</div>
	</form>
</div>
<div class="card">
	<div class="card-body lg:flex-row">
		<div class="flex gap-1 w-full lg:w-auto">
			<input
				type="text"
				name="nama"
				id=""
				placeholder="Cari Nama Santri"
				class="input flex-1"
				autocomplete="off"
				bind:value={searchQuery}
			/>
		</div>
		<div class="card-actions ml-auto">
			<button
				class="btn"
				onclick={() => {
					rekapModal.showModal();
				}}>Rekap</button
			>
		</div>
	</div>
</div>

<div class="card">
	<div class="card-body overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Nama</th>
					<th>Hadir</th>
					<th>Alfa</th>
					<th>Sakit</th>
					<th>Izin</th>
					<th>% Kehadiran</th>
					<th>Rekap Terakhir</th>
				</tr>
			</thead>
			<tbody>
				{#if data.rekap.length > 0}
					{#each filteredRekap as r, i (r.rekap.id)}
						<tr>
							<th>{i + 1}</th>
							<td>{r.user.name}</td>
							<td>{r.rekap.totalHadir}</td>
							<td>{r.rekap.totalAlfa}</td>
							<td>{r.rekap.totalSakit}</td>
							<td>{r.rekap.totalIzin}</td>
							<td>
								{#if r.rekap.presentaseKehadiran === null}
									{r.rekap.presentaseKehadiran}
								{:else}
									<p
										class={r.rekap.presentaseKehadiran < 70
											? 'badge  badge-error'
											: 'badge  badge-success'}
									>
										{r.rekap.presentaseKehadiran + '%'}
									</p>
								{/if}
							</td>
							<td>{r.rekap.lastComputedAt}</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="8" class="p-4 text-center">
							Tidak Ada Data Rekap, Klik tombol Rekap Ulang
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<dialog class="modal" id="rekapModal" bind:this={rekapModal}>
	<div>
		<form action="?/compute" method="post" class="modal-box gap-4">
			<p class="card-title">Pilih Target untuk Rekap</p>
			<label class="select w-full">
				<span class="label">Tahun Ajaran</span>
				<select name="tahunAjaranId" id="">
					{#each opsiTa as ta (ta.id)}
						<option value={ta.id}>
							{ta.tahunMulai}/{ta.tahunSelesai} - {ta.tipeSemester}
						</option>
					{/each}
				</select>
			</label>
			<label class="select w-full">
				<span class="label">Kelas</span>
				<select name="kelasId" id="" class="">
					{#each opsiKelas as kls (kls.id)}
						<option value={kls.id}>{kls.namaKelas}</option>
					{/each}
				</select>
			</label>
			<label for="" class="select w-full">
				<span class="label">Bulan</span><select name="bulan" id="" class="select">
					{#if opsiBulan.length === 0}
						<option value="">-- Kosong --</option>
					{:else}
						{#each opsiBulan as bln (bln.idx)}
							<option value={bln.idx}>{bln.month}</option>
						{/each}
					{/if}
				</select>
			</label>
			<label for="" class="select w-full">
				<span class="label">Tahun</span>
				<select name="tahun" id="" class="select">
					{#if opsiTahun.length === 0}
						<option value="">-- Kosong --</option>
					{:else}
						{#each opsiTahun as thn}
							<option value={thn}>{thn}</option>
						{/each}
					{/if}
				</select>
			</label>
			<div class="modal-action">
				<button type="submit" class="btn">Rekap</button>
			</div>
		</form>
	</div>
</dialog>
