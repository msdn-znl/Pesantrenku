<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div class="card max-w-md">
	<h2 class="card-title">Tambah Kelas</h2>
	<div class="card-body">
		<form method="post" action="?/create" use:enhance class="flex flex-col">
			<fieldset class="fieldset">
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
				<select name="tahunAjaran" id="tahunAjaran" class="select">
					<option value=""></option>
					{#each data.tahunAjaranList as item}
						<option value={item.tahunAjaran}>{item.tahunAjaran}</option>
					{/each}
				</select>
				<button type="submit" class="btn btn-success mt-4">Tambah Kelas</button>
			</fieldset>
		</form>
	</div>
</div>

<div class="card overflow-auto">
	<h1 class="card-title">List Kelas</h1>
	<div class="card-body">
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
							<div>
								<button class="btn btn-accent"
									><a href={'/kelas/edit-data/' + kelas.id}>Edit</a></button
								>
							</div>
							<div>
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
