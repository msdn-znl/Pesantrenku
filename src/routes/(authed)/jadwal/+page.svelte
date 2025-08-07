<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const hari = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

	let createJadwalModal: HTMLDialogElement;
</script>

<div class="">
	<dialog class="modal" bind:this={createJadwalModal}>
		<div class="modal-box">
			<h2 class="card-title">Tambah Jadwal</h2>
			<form action="?/create" method="post" class="flex flex-col" use:enhance>
				<label for="kitabId">Kitab</label>
				{#await data.streamed.kitabList}
					<select class="select" disabled>
						<option>Memuat Kitab...</option>
					</select>
				{:then kitabList}
					<select name="kitabId" id="kitabId" class="select">
						<option value=""></option>
						{#each kitabList as kitab (kitab.id)}
							<option value={kitab.id}>{kitab.namaKitab}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="kelasId">Kelas</label>
				{#await data.streamed.kelasList}
					<select class="select" disabled>
						<option>Memuat Kelas...</option>
					</select>
				{:then kelasList}
					<select name="kelasId" id="kelasId" class="select">
						<option value=""></option>
						{#each kelasList as kelas (kelas.id)}
							<option value={kelas.id}>{kelas.namaKelas}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="guruId">Guru</label>
				{#await data.streamed.guruList}
					<select class="select" disabled>
						<option>Memuat Guru...</option>
					</select>
				{:then guruList}
					<select name="guruId" id="guruId" class="select">
						<option value=""></option>
						{#each guruList as guru (guru.id)}
							<option value={guru.id}>{guru.nama}</option>
						{/each}
					</select>
				{:catch error}
					<p>{error.message}</p>
				{/await}
				<label for="hari">Hari</label>
				<select name="hari" id="hari" class="select">
					{#each hari as h}
						<option value={h}>{h}</option>
					{/each}
				</select>
				<label for="jamMulai">Jam Mulai</label>
				<input type="time" name="jamMulai" id="jamMulai" class="input" />
				<label for="jamSelesai">Jam Selesai</label>
				<input type="time" name="jamSelesai" id="jamSelesai" class="input" />
				<button type="submit" class="btn btn-success">Tambah Jadwal</button>
			</form>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
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
							<td>{jadwal.nama}</td>
							<td>{jadwal.kelas}</td>
							<td>{jadwal.kitab}</td>
							<td>{jadwal.hari}</td>
							<td>{jadwal.jamMulai}</td>
							<td>{jadwal.jamSelesai}</td>
							<td>
								<a href={'/jadwal/' + jadwal.id + '/pertemuan'}
									><button class="btn btn-success">Data Pertemuan</button></a
								>
								<a href={'/jadwal/edit-data/' + jadwal.id}
									><button class="btn btn-accent">Edit</button></a
								>

								<div>
									<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
									<form action="?/delete" method="post" use:enhance>
										<input type="hidden" name="id" value={jadwal.id} />
										<button type="submit" class="btn btn-error">Delete</button>
									</form>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
