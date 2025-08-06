<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	console.log(data);
</script>

<div class="">
	<form action="?/edit" method="post" use:enhance class="">
		<label for="jadwalId">Jadwal</label>
		<select name="jadwalId" id="jadwalId" class="select">
			<option value=""></option>
			{#each data.jadwalList as jadwal (jadwal.id)}
				<option value={jadwal.id} selected={jadwal.id === data.pertemuanData?.jadwalId}
					>Guru: {jadwal.guru.user.nama}, Kelas: {jadwal.kelas.namaKelas}, Hari: {jadwal.hari},
					Mulai: {jadwal.jamMulai}, Kitab: {jadwal.kitab.namaKitab}
				</option>
			{/each}
		</select>
		<label for="jurnalMengajar">Jurnal Mengajar</label>
		<textarea
			name="jurnalMengajar"
			id="jurnalMengajar"
			class="textarea"
			placeholder="Masukkan Jurnal Mengajar di sini"
			value={data.pertemuanData?.jurnalMengajar}
		></textarea>
		<label for="tanggalPertemuan">Tanggal</label>
		<input
			type="date"
			name="tanggalPertemuan"
			id="tanggalPertemuan"
			class="input"
			value={data.pertemuanData?.tanggalPertemuan}
		/>
		<label for="status">Status Pertemuan</label>
		<select name="status" id="status" class="select">
			<option value=""></option>
			<option value="selesai" selected={data.pertemuanData?.status === 'selesai'}>Selesai</option>
			<option value="batal" selected={data.pertemuanData?.status === 'batal'}>Batal</option>
			<option value="tugas mandiri" selected={data.pertemuanData?.status === 'tugas mandiri'}
				>Tugas Mandiri</option
			>
		</select>

		<button type="submit" class="btn btn-success">Edit Data Pertemuan</button>
	</form>
	{#if form?.success}
		<p>{form?.message}</p>
	{/if}
</div>
