<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const tanggal = data.santriData.tanggalLahir
		? data.santriData.tanggalLahir.toISOString().split('T')[0]
		: '';
</script>

<!-- kurang tambahkan value awal dari form -->

<div class="flex justify-center">
	<form action="?/edit" method="POST" use:enhance class="fieldset flex flex-col">
		<label for="nomorIndukSantri">Nomor Induk Santri</label>
		<input
			type="text"
			id="nomorIndukSantri"
			name="nomorIndukSantri"
			class="input"
			value={data.santriData.nomorIndukSantri}
		/>
		<label for="tahunMasuk">Tahun Masuk</label>
		<input
			type="number"
			id="tahunMasuk"
			name="tahunMasuk"
			class="input"
			value={data.santriData.tahunMasuk}
		/>
		<label for="tahunKeluar">Tahun Keluar</label>
		<input
			type="number"
			id="tahunKeluar"
			name="tahunKeluar"
			class="input"
			value={data.santriData.tahunKeluar}
		/>
		<label for="nomorTelepon">Nomor Telepon</label>
		<input
			type="tel"
			name="nomorTelepon"
			id="nomorTelepon"
			class="input"
			value={data.santriData.nomorTelepon}
		/>
		<label for="status">Status:</label>
		<select name="status" id="status" class="select">
			{#if data.santriData.status === 'aktif'}
				<option value=""></option>
				<option value="aktif" selected>Aktif</option>
				<option value="inaktif">Non Aktif</option>
			{:else if data.santriData.status === 'inaktif'}
				<option value=""></option>
				<option value="aktif">Aktif</option>
				<option value="inaktif" selected>Non Aktif</option>
			{/if}
		</select>
		<label for="tempatLahir">Tempat Lahir</label>
		<input
			type="text"
			name="tempatLahir"
			id="tempatLahir"
			class="input"
			value={data.santriData.tempatLahir}
		/>
		<label for="tanggalLahir">Tanggal Lahir</label>
		<input type="date" name="tanggalLahir" id="tanggalLahir" class="input" value={tanggal || ''} />
		<label for="kamar">Kamar</label>
		<select name="kamar" id="kamar" class="select">
			<option value="Ibrahim1" selected>Ibrahim1</option>
			<option value="Ibrahim2">Ibrahim2</option>
			<option value="Ibrahim3">Ibrahim3</option>
			<option value="Ibrahim4">Ibrahim4</option>
			<option value="Ibrahim5">Ibrahim5</option>
		</select>
		<button type="submit" class="btn btn-success">Edit Data Santri</button>
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
		<p></p>
	</div>
{/if}
