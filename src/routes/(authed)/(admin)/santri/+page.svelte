<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { toast } from 'svelte-sonner';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Menu Santri</title>
</svelte:head>

<div class="overflow-auto">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#if data.santriList && data.santriList.length > 0}
				{#each data.santriList as santri, i (santri.id)}
					<tr class="hover:bg-base-300">
						<th>{i + 1}</th>
						<td>{santri.nama}</td>
						<td>
							<div>
								<a
									href={resolve('/(authed)/(admin)/santri/[id]/edit', { id: santri.userId })}
									class="btn btn-accent">Edit</a
								>
							</div>
							<div>
								<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
								<form
									action="?/delete"
									method="post"
									id={'santri_' + santri.id}
									use:enhance={() => {
										return async ({ result, update }) => {
											if (result.type === 'success') {
												toast.success(result.data?.message ?? 'Berhasil');
											} else if (result.type === 'failure') {
												toast.error(result.data?.message ?? 'Gagal memproses data');
											} else if (result.type === 'error') {
												toast.error('Terjadi kesalahan server');
											}
											await update();
										};
									}}
								>
									<input type="hidden" name="id" value={santri.userId} />
									<button type="submit" class="btn btn-error">Delete</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			{:else}
				<tr>
					<td colspan="6" class="p-4 text-center">Tidak ada Data</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>
