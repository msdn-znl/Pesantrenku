<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { resolve } from '$app/paths';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	console.log('Test pertemuan guru page');
</script>

<div class="card">
	<div class="card-body overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Kitab</th>
					<th>Kelas</th>
					<th>Jurnal Mengajar</th>
					<th>Hari</th>
					<th>Tanggal Pertemuan</th>
					<th>Status</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each data.pertemuanGuruList as pertemuan, i (pertemuan.id)}
					<tr>
						<td>{i + 1}</td>
						<td>{pertemuan.jadwal.kitab.namaKitab}</td>
						<td>{pertemuan.jadwal.kelas.namaKelas}</td>
						<td>{pertemuan.jurnalMengajar}</td>
						<td>{pertemuan.jadwal.hari}</td>
						<td>{pertemuan.tanggalPertemuan}</td>
						{#if pertemuan.status === 'selesai'}
							<td><p class="badge badge-success">{pertemuan.status}</p></td>
						{:else if pertemuan.status === 'batal'}
							<td><p class="badge badge-error">{pertemuan.status}</p></td>
						{:else}
							<td><p class="badge badge-accent">{pertemuan.status}</p></td>
						{/if}
						<td
							><button class="btn btn-accent"
								><a href={resolve('/pertemuan-guru/[id]/', { id: pertemuan.id })}>Detail</a></button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
