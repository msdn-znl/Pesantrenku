<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<!-- kurang tambahkan value awal dari form -->

<div class="flex justify-center">
	<form action="?/edit" method="POST" use:enhance class="fieldset flex flex-col">
		<label for="nomorIndukGuru"> Nomor Induk Guru </label>
		<input
			type="text"
			name="nomorIndukGuru"
			id="nomorIndukGuru"
			class="input"
			value={data.nomorIndukGuru}
		/>
		<label for="nomorTelepon"> Nomor Telepon </label>
		<input
			type="text"
			name="nomorTelepon"
			id="nomorTelepon"
			class="input"
			value={data.nomorTelepon}
		/>
		<label for="status"> Status </label>
		<select name="status" id="status" class="select">
			{#if data.status === null}
				<option value="" selected></option>
				<option value="aktif">Aktif</option>
				<option value="inaktif">Non Aktif</option>
			{:else if data.status === 'aktif'}
				<option value=""></option>
				<option value="aktif" selected>Aktif</option>
				<option value="inaktif">Non Aktif</option>
			{:else if data.status === 'inaktif'}
				<option value=""></option>
				<option value="aktif">Aktif</option>
				<option value="inaktif" selected>Non Aktif</option>
			{/if}
		</select>
		<button type="submit" class="btn btn-success">Edit Data Guru</button>
	</form>
</div>
{#if form?.message}
	<div role="alert" class="alert alert-error">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<p>{form.message}</p>
	</div>
{/if}
