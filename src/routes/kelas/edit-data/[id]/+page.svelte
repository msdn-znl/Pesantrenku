<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();
</script>

<div class="w-xs">
	<form action="?/edit" method="post" class="flex flex-col" use:enhance>
		<label for="namaKelas">Nama Kelas</label>
		<input type="text" name="namaKelas" id="namaKelas" class="input" value={data.kelas.namaKelas} />
		<label for="tahunAjaran">Tahun Ajaran</label>
		<input
			type="text"
			name="tahunAjaran"
			id="tahunAjaran"
			class="input"
			value={data.kelas.tahunAjaran}
			placeholder="Contoh: 2025/2026 Genap"
		/>
		<button type="submit" class="btn btn-success">Edit Data</button>
	</form>
	<p style="color: red">{form?.message ?? ''}</p>
</div>
