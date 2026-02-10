<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	type Kamar = PageServerData['kamarList'][number];

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Menu Kamar</title>
</svelte:head>

<dialog class="modal" id="create_kamar_modal">
	<div class="modal-box"></div>
</dialog>
<dialog class="modal" id="edit_kamar_modal">
	<div class="modal-box"></div>
</dialog>

<div>
	<h2 class="card-title">List Kamar</h2>
</div>
<div class="overflow-auto">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama Kamar</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.kamarList as kamar, i (kamar.id)}
				<tr>
					<th>{i + 1}</th>
					<td>{kamar.namaKamar}</td>
					<td><button>Edit</button></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
