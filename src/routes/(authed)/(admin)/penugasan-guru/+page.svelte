<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';
	let { data }: { data: PageServerData } = $props();
	const tahunAjaran = $derived(
		data.tahunAjaran.tahunMulai +
			'/' +
			data.tahunAjaran.tahunSelesai +
			' ' +
			data.tahunAjaran.tipeSemester
	);
	let tahunAjaranId = $state<string | undefined>();
	let guruId = $state<string | undefined>();
	let PenugasanModal: HTMLDialogElement;
	let PenghapusanModal: HTMLDialogElement;
</script>

<div class="card">
	<table class="table">
		<thead>
			<tr
				><th></th>
				<th></th>
				<th>Nama</th>
				<th>Status</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each data.guruList as guru, i (guru.guruId)}
				<tr>
					<th></th>
					<th>{i + 1}</th>
					<td>{guru.name}</td>
					<td><p class={guru.status ? 'badge badge-success' : ''}>{guru.status}</p></td>
					{#if guru.status === null && guru.penugasanId === null}
						<td>
							<button
								class="btn btn-success"
								onclick={() => {
									guruId = guru.guruId;
									tahunAjaranId = data.tahunAjaran?.id;
									PenugasanModal.showModal();
								}}>Tetapkan Aktif</button
							>
						</td>
					{:else if guru.status === 'aktif'}
						<td>
							<button
								class="btn btn-error"
								onclick={() => {
									guruId = guru.guruId;
									tahunAjaranId = data.tahunAjaran?.id;
									PenghapusanModal.showModal();
								}}>Nonaktifkan</button
							>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<dialog
	class="modal"
	bind:this={PenugasanModal}
	onclose={() => {
		guruId = undefined;
		tahunAjaranId = undefined;
	}}
>
	<div class="modal-box">
		<form
			action="?/create"
			method="post"
			id="penugasan-guru"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						PenugasanModal.close();
					}
					await update();
				};
			}}
		>
			<input type="text" name="tahunAjaranId" value={tahunAjaranId} hidden />
			<input type="text" name="guruId" value={guruId} hidden />
			<p>Apakah anda yakin untuk menetapkan guru ini di tahun ajaran {tahunAjaran}?</p>
			<div class="modal-action justify-end">
				<button type="submit" class="btn btn-success">Ya</button>
			</div>
		</form>
	</div>
</dialog>
<dialog
	class="modal"
	bind:this={PenghapusanModal}
	onclose={() => {
		guruId = undefined;
		tahunAjaranId = undefined;
	}}
>
	<div class="modal-box">
		<form
			action="?/delete"
			method="post"
			id="penghapusan-guru"
			use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') {
						PenghapusanModal.close();
					}
					await update();
				};
			}}
		>
			<input type="text" name="tahunAjaranId" value={tahunAjaranId} hidden />
			<input type="text" name="guruId" value={guruId} hidden />
			<p>Apakah anda yakin untuk menonaktifkan guru ini di tahun ajaran {tahunAjaran}?</p>
			<div class="modal-action justify-end">
				<button type="submit" class="btn btn-success">Ya</button>
			</div>
		</form>
	</div>
</dialog>
