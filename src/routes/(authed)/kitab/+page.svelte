<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div class="card max-w-md">
	<h2 class="card-title">Tambah Kitab</h2>
	<div class="card-body">
		<form action="?/add" method="post" use:enhance autocomplete="off" class="flex flex-col">
			<fieldset class="fieldset">
				<label for="namaKitab">Nama Kitab</label>
				<input
					type="text"
					name="namaKitab"
					id="namaKitab"
					class="input"
					placeholder="Contoh: Muttamimmah"
				/>
				<label for="pengarang">Pengarang</label>
				<input
					type="text"
					name="pengarang"
					id="pengarang"
					class="input"
					placeholder="Contoh: Syekh Nawawi"
				/>
				<label for="kategori">Kategori</label>
				<input
					type="text"
					name="kategori"
					id="kategori"
					class="input"
					placeholder="Contoh: Fiqih"
				/>
				<button type="submit" class="btn btn-success mt-4">Tambah Data</button>
			</fieldset>
		</form>
		<p>{form?.message ?? ''}</p>
	</div>
</div>

<div class="card overflow-auto">
	<h1 class="card-title">List Kitab</h1>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Nama Kitab</th>
					<th>Pengarang</th>
					<th>Kategori</th>
				</tr>
			</thead>
			<tbody>
				{#each data.kitabList as kitab, i (kitab.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{kitab.namaKitab}</td>
						<td>{kitab.pengarang}</td>
						<td>{kitab.kategori}</td>
						<td>
							<div>
								<button class="btn btn-accent"
									><a href={'/kitab/edit-data/' + kitab.id}>Edit</a></button
								>
							</div>
							<div>
								<form action="?/delete" method="post" use:enhance>
									<input type="hidden" name="id" value={kitab.id} />
									<button type="submit" class="btn btn-error">Delete</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
