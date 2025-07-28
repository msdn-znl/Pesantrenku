<script lang="ts">
	import type { PageServerData, PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: PageProps } = $props();
	let { guruList } = data;
</script>

<div class="overflow-auto">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th>Nama</th>
				<th>Nomor Induk Guru</th>
				<th>Status</th>
				<th>Nomor Telepon</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{#each guruList as guru, i (guru.id)}
				<tr class="hover:bg-base-300">
					<th>{i + 1}</th>
					<td>{guru.nama}</td>
					<td>{guru.nomorIndukGuru}</td>
					<td>{guru.status}</td>
					<td>{guru.nomorTelepon}</td>
					<td>
						<div><a href={'/guru/edit-data/' + guru.id} class="btn btn-accent">Edit</a></div>
						<div>
							<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
							<form action="?/delete" method="post" use:enhance>
								<input type="hidden" name="id" value={guru.id} />
								<button type="submit" class="btn btn-error">Delete</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
