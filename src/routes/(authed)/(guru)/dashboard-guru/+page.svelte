<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let jadwalId = $state<string | null>(null);
</script>

<h1>Hi, {data.user.username}!</h1>

<div class="card overflow-auto">
	<h2 class="card-title">Jadwal Hari Ini</h2>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Kitab</th>
					<th>Kelas</th>
					<th>Jam Mulai</th>
					<th>Jam Selesai</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each data.jadwalHariIni as jadwal, i (jadwal.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{jadwal.kitab.namaKitab}</td>
						<td>{jadwal.kelas.namaKelas}</td>
						<td>{jadwal.jamMulai}</td>
						<td>{jadwal.jamSelesai}</td>
						<td>
							<form action="?/begin" method="post">
								<input type="string" hidden name="jadwalId" id="jadwalId" value={jadwal.id} />
								<button type="submit" class="btn btn-success">Mulai Kelas</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
