<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	const hari = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
</script>

<div class="flex flex-row">
	<div class="w-xs">
		<h2>Tambah Jadwal</h2>
		<form action="?/edit" method="post" class="flex flex-col" use:enhance>
			<label for="kitabId">Kitab</label>
			{#await data.streamed.kitabList}
				<select class="select" disabled>
					<option>Memuat Kitab...</option>
				</select>
			{:then kitabList}
				<select name="kitabId" id="kitabId" class="select" required>
					<option value=""></option>
					{#each kitabList as kitab (kitab.id)}
						<option value={kitab.id} selected={kitab.id === data.jadwal?.kitabId}
							>{kitab.namaKitab}</option
						>
					{/each}
				</select>
			{:catch error}
				<p>{error.message}</p>
			{/await}
			<label for="kelasId">Kelas</label>
			{#await data.streamed.kelasList}
				<select class="select" disabled>
					<option>Memuat Kelas...</option>
				</select>
			{:then kelasList}
				<select name="kelasId" id="kelasId" class="select" required>
					<option value=""></option>
					{#each kelasList as kelas (kelas.id)}
						<option value={kelas.id} selected={kelas.id === data.jadwal?.kelasId}
							>{kelas.namaKelas}</option
						>
					{/each}
				</select>
			{:catch error}
				<p>{error.message}</p>
			{/await}
			<label for="guruId">Guru</label>
			{#await data.streamed.guruList}
				<select class="select" disabled>
					<option>Memuat Guru...</option>
				</select>
			{:then guruList}
				<select name="guruId" id="guruId" class="select" required>
					<option value=""></option>
					{#each guruList as guru (guru.id)}
						<option value={guru.id} selected={guru.id === data.jadwal?.guruId}>{guru.nama}</option>
					{/each}
				</select>
			{:catch error}
				<p>{error.message}</p>
			{/await}
			<label for="hari">Hari</label>
			<select name="hari" id="hari" class="select" required>
				{#each hari as h}
					<option value={h} selected={h === data.jadwal?.hari}>{h}</option>
				{/each}
			</select>
			<label for="jamMulai">Jam Mulai</label>
			<input
				type="time"
				name="jamMulai"
				id="jamMulai"
				class="input"
				required
				value={data.jadwal?.jamMulai}
			/>
			<label for="jamSelesai">Jam Selesai</label>
			<input
				type="time"
				name="jamSelesai"
				id="jamSelesai"
				class="input"
				required
				value={data.jadwal?.jamSelesai}
			/>
			<button type="submit" class="btn btn-success">Edit Data</button>
		</form>
	</div>
</div>
