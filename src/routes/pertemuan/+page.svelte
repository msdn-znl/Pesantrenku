<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div class="">
	<form action="?/create" method="post" use:enhance class="">
		<label for="jadwalId">Jadwal</label>
		<select name="jadwalId" id="jadwalId" class="select">
			<option value=""></option>
			{#each data.jadwalList as jadwal (jadwal.id)}
				<option value={jadwal.id}
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
		></textarea>
		<label for="tanggalPertemuan">Tanggal</label>
		<input type="date" name="tanggalPertemuan" id="tanggalPertemuan" class="input" />
		<label for="status">Status Pertemuan</label>
		<select name="status" id="status" class="select">
			<option value=""></option>
			<option value="selesai">Selesai</option>
			<option value="batal">Batal</option>
			<option value="tugas mandiri">Tugas Mandiri</option>
		</select>

		<button type="submit" class="btn btn-success">Tambah Pertemuan</button>
	</form>
	{#if form?.success}
		<p>{form?.message}</p>
	{/if}
</div>

<div>
	<h2>List Pertemuan</h2>
	<div>
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Kitab</th>
					<th>Kelas</th>
					<th>Jurnal Mengajar</th>
					<th>Hari</th>
					<th>Tanggal Pertemuan</th>
					<th>status</th>
				</tr>
			</thead>
			<tbody>
				{#each data.pertemuanList as pertemuan, i (pertemuan.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{pertemuan.jadwal.kitab.namaKitab}</td>
						<td>{pertemuan.jadwal.kelas.namaKelas}</td>
						<td>{pertemuan.jurnalMengajar}</td>
						<td>{pertemuan.jadwal.hari}</td>
						<td>{pertemuan.tanggalPertemuan?.toDateString()}</td>
						<td>{pertemuan.status}</td>
						<td>
							<a href={'/pertemuan/' + pertemuan.id + '/absensi-santri'}
								><button class="btn btn-success">Absensi Santri</button></a
							>
						</td>
						<td>
							<a href={'/pertemuan/' + pertemuan.id + '/data-absensi'}
								><button class="btn btn-accent">Data Absensi</button></a
							>
						</td>
						<td>
							<a href={'/pertemuan/edit-data/' + pertemuan.id}
								><btn class="btn btn-warning">Edit Data</btn></a
							>
						</td>
						<td>
							<form action="?/delete" method="post" use:enhance>
								<input type="number" name="id" id="id" value={pertemuan.id} hidden />
								<button type="submit" class="btn btn-error">Hapus Data Pertemuan</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
