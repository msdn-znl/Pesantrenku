<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();
</script>

<div class="w-xs">
	<form action="?/edit" method="post" class="flex flex-col" use:enhance>
		<label for="namaKitab">Nama Kitab</label>
		<input type="text" name="namaKitab" id="namaKitab" class="input" value={data.kitab.namaKitab} />
		<label for="pengarang">Pengarang</label>
		<input
			type="text"
			name="pengarang"
			id="pengarang"
			class="input"
			value={data.kitab.pengarang}
			placeholder="Contoh: Imam Nawawi"
		/>
		<label for="kategori">Kategori</label>
		<input type="text" name="kategori" id="kategori" class="input" placeholder="Contoh: Fiqih" value={data.kitab.kategori} />
		<button type="submit" class="btn btn-success">Edit Data</button>
	</form>
	<p >{form?.message ?? ''}</p>
</div>
