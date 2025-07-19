<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tambahData: HTMLDialogElement | undefined;
</script>

<div>
	<h1>Tambah Santri</h1>
	<div>
		<button class="btn btn-primary" onclick={() => tambahData?.showModal()}> Tambah Data</button>
	</div>
	<dialog id="tambahData" class="modal" bind:this={tambahData}>
		<div class="modal-box">
			<h2>Tambah Data Uy</h2>
			<div>
				<table class="table">
					<thead>
						<tr>
							<th></th>
							<th>Nama</th>
						</tr>
					</thead>
					<tbody>
						{#each data.santriWithoutClass as santri, i (santri.id)}
							<tr>
								<th>{i + 1}</th>
								<td>{santri.user.nama}</td>
								<td>
									<form action="?/create" method="post" use:enhance>
										<input type="number" name="id" id="id" value={santri.id} hidden />
										<button type="submit" class="btn btn-success">Tambah</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</div>
<div>
	<h2>List Santri</h2>
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama</th>
			</tr>
		</thead>
		<tbody>
			{#each data.santriWithClass as santri, i (santri.santriId)}
				<tr>
					<th>{i + 1}</th>
					<td>{santri.santri.user.nama}</td>
					<td>
						<form action="?/delete" method="post" use:enhance>
							<input type="number" name="id" id="id" value={santri.santriId} hidden />
							<button type="submit" class="btn btn-error">Hapus Data</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
