<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let untukDidaftarakan = $state<string[]>([]);
</script>

<div class="flex justify-end">
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
				<th></th>
				<th>Nama</th>
			</tr>
		</thead>
		<tbody>
			{#each data.santriBelumTerdaftar as item, i (item.id)}
				<tr>
					<td
						><input
							type="checkbox"
							name="santriId"
							id="santriId"
							value={item.id}
							bind:group={untukDidaftarakan}
							form="daftarkan"
						/></td
					>
					<td>{i + 1}</td>
					<td>{item.nama}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
