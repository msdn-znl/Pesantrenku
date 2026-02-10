<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Menu Santri: Edit Data Santri</title>
</svelte:head>
<div class="">
	<div class="card justify-center">
		<form
			action="?/edit"
			method="POST"
			use:enhance
			class="grid grid-cols-1 place-content-around lg:grid-cols-2"
		>
			<fieldset class="fieldset p-4">
				<legend class="fieldset-legend">Data Santri</legend>
				<label for="nomorIndukSantri" class="label">Nomor Induk Santri</label>
				<input
					type="text"
					id="nomorIndukSantri"
					name="nomorIndukSantri"
					class="input"
					value={data.santriData.nomorIndukSantri}
				/>
				<label for="tahunMasuk" class="label">Tahun Masuk</label>
				<input
					type="number"
					id="tahunMasuk"
					name="tahunMasuk"
					class="input"
					value={data.santriData.tahunMasuk}
				/>
				<label for="tahunKeluar" class="label">Tahun Keluar</label>
				<input
					type="number"
					id="tahunKeluar"
					name="tahunKeluar"
					class="input"
					value={data.santriData.tahunKeluar}
				/>
				<label for="status" class="label">Status:</label>
				<select name="status" id="status" class="select">
					{#if data.santriData.status === 'aktif'}
						<option value=""></option>
						<option value="aktif" selected>Aktif</option>
						<option value="lulus">Lulus</option>
						<option value="keluar" selected>Keluar</option>
					{:else if data.santriData.status === 'lulus'}
						<option value=""></option>
						<option value="aktif">Aktif</option>
						<option value="lulus" selected>Lulus</option>
						<option value="keluar" selected>Keluar</option>
					{:else if data.santriData.status === 'keluar'}
						<option value=""></option>
						<option value="aktif">Aktif</option>
						<option value="lulus" selected>Lulus</option>
						<option value="keluar" selected>Keluar</option>
					{/if}
				</select>
				<label for="kamar" class="label">Kamar</label>
				<select name="kamar" id="kamar" class="select">
					<option value="">Belum Ditentukan</option>
					{#each data.kamarList as kamar}
						{#if data.santriData.kamarId === kamar.id}
							<option value={kamar.id} selected>{kamar.nama}</option>
						{:else}
							<option value={kamar.id}>{kamar.nama}</option>
						{/if}
					{/each}
				</select>
			</fieldset>
			<fieldset class="fieldset p-4">
				<legend class="fieldset-legend">Data Pribadi</legend>
				<label for="nomorTelepon" class="label">Nomor Telepon</label>
				<input
					type="tel"
					name="nomorTelepon"
					id="nomorTelepon"
					class="input"
					value={data.santriData.nomorTelepon}
				/>
				<label for="tempatLahir" class="label">Tempat Lahir</label>
				<input
					type="text"
					name="tempatLahir"
					id="tempatLahir"
					class="input"
					value={data.santriData.tempatLahir}
				/>
				<label for="tanggalLahir" class="label">Tanggal Lahir</label>
				<input
					type="date"
					name="tanggalLahir"
					id="tanggalLahir"
					class="input"
					value={data.santriData.tanggalLahir || ''}
				/>
			</fieldset>
			<div></div>
			<div class="card-actions flex flex-row-reverse pr-4">
				<button type="submit" class="btn btn-success p-2">Edit Data Santri</button>
			</div>
		</form>
	</div>
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
