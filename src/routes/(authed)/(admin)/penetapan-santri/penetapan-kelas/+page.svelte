<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div class="card">
	<div class="card-body overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th> <th></th> <th>Nama</th> <th>Kelas</th>
				</tr>
			</thead>
			<tbody>
				{#each data.daftarSantri as santri, i (santri.id)}
					<tr>
						<th></th> <th>{i + 1}</th> <td>{santri.user.name}</td>
						<td>
							{#each santri.kelas_santri as kelas_santri (kelas_santri.id)}
								<p class="badge badge-soft">{kelas_santri.kelas.namaKelas}</p>
							{/each}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
