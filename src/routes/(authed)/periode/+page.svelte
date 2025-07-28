<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div class="card max-w-md">
	<h2 class="card-title">Tambah Kitab</h2>
	<div class="card-body">
		<form action="?/create" method="post" use:enhance autocomplete="off" class="flex flex-col">
			<fieldset class="fieldset">
				<label for="tahunAjaran">Periode</label>
				<input
					type="text"
					name="tahunAjaran"
					id="tahunAjaran"
					class="input"
					placeholder="Contoh: 2025/2026 Genap"
					required
				/>
				<button type="submit" class="btn btn-success">Tambah Data</button>
			</fieldset>
		</form>
		<p>{form?.message ?? ''}</p>
	</div>
</div>

<div class="card">
	<h1 class="card-title">List Periode</h1>
	<div class="card-body">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Periode</th>
				</tr>
			</thead>
			<tbody>
				{#each data.periodeList as periode, i (periode.id)}
					<tr>
						<th>{i + 1}</th>
						<td>{periode.tahunAjaran}</td>
						<td>
							<div>
								<form action="?/delete" method="post" use:enhance>
									<input type="hidden" name="id" value={periode.id} />
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
