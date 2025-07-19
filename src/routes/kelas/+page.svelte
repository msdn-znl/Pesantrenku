<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div>
	<form method="post" action="?/add" use:enhance>
		<label for="namaKelas">Nama Kelas</label>
		<input
			type="text"
			name="namaKelas"
			id="namaKelas"
			class="input"
			placeholder="Contoh: Dirosah 2"
			required
		/>
		<label for="tahunAjaran">Tahun Ajaran</label>
		<input
			type="text"
			name="tahunAjaran"
			id="tahunAjaran"
			class="input"
			placeholder="Contoh: 2025/2026 Genap"
			required
		/>
		<button type="submit" class="btn btn-success">Tambah Kelas</button>
	</form>
</div>

<div>
	<h1>List Kelas</h1>
	<div>
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Nama Kelas</th>
					<th>Tahun Ajaran</th>
					<th>Ketua Kelas</th>
				</tr>
			</thead>
			<tbody>
				{#each data.kelasList as kelas, i (kelas.id)}
					<tr class="hover:bg-base-300">
						<th>{i + 1}</th>
						<td>{kelas.namaKelas}</td>
						<td>{kelas.tahunAjaran}</td>
						<td>{kelas.ketuaKelas}</td>
						<td>
							<!-- Todo: Buat modal untuk tombol edit -->
							<div>
								<button class="btn btn-accent"
									><a href={'/kelas/edit-data/' + kelas.id}>Edit</a></button
								>
							</div>
							<div>
								<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
								<form action="?/delete" method="post">
									<input type="hidden" name="id" value={kelas.id} />
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
