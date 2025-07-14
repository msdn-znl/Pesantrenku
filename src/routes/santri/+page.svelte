<script lang="ts">
	import type { ActionData, PageServerData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	console.log(data);
</script>

<div class=" w-3/4">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama</th>
				<th>Tahun Masuk</th>
				<th>Status</th>
				<th>Kamar</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#if data.santriList && data.santriList.length > 0}
				{#each data.santriList as santri, i (santri.id)}
					<tr class="hover:bg-base-300">
						<th>{i + 1}</th>
						<td>{santri.nama}</td>
						<td>{santri.tahun_masuk}</td>
						<td>{santri.status}</td>
						<td>{santri.kamar}</td>
						<td>
							<div>
								<a href={'/santri/edit-data/' + santri.userId} class="btn btn-accent">Edit</a>
							</div>
							<div>
								<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
								<form action="?/delete" method="post" use:enhance>
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
	<p>{form?.message ?? ''}</p>
</div>
