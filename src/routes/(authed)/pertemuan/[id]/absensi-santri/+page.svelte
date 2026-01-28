<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tableBody = $state<HTMLElement>();
	let selectedSantri: string[] = $state([]);

	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.santriKelasData.map((s) => s.santriId);
		} else {
			selectedSantri = [];
		}
	};
	const changeStatusSantri = (status: 'hadir' | 'alfa' | 'izin' | 'sakit') => {
		selectedSantri.forEach((santriId) => {
			if (!tableBody) return;
			const radio = tableBody.querySelector<HTMLInputElement>(
				`input[type="radio"][name="status_${santriId}"][value=${status}]`
			);
			if (radio) {
				radio.checked = true;
			}
		});
	};
</script>

{#if data.dataKehadiranExist}
	<p>Data Kehadiran Sudah Ada</p>
{:else}
	<div class="p-2 card">
		<h2 class="card-title ml-2">Tambah Data Absensi</h2>
		<form action="?/create" method="post">
			<table class="table">
				<thead>
					<tr>
						<th
							><label for=""
								><input
									type="checkbox"
									id="main-checkbox"
									onchange={toggleSelectAll}
									class="checkbox checkbox-md"
								/></label
							></th
						>
						<th></th>
						<th>Nama</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody id="table-body" bind:this={tableBody}>
					{#each data.santriKelasData as santrikelas, i (santrikelas.santriId)}
						<tr>
							<th
								><input
									type="checkbox"
									name=""
									id=""
									class="checkbox checkbox-md"
									value={santrikelas.santriId}
									bind:group={selectedSantri}
								/></th
							>
							<th>{i + 1}</th>
							<td>{santrikelas.santri.user.nama}</td>
							<td>
								<div>
									<input type="text" name="santriId" id="" value={santrikelas.santriId} hidden />
								</div>
								<div class="flex justify-around">
									<input
										type="radio"
										name="status_{santrikelas.santriId}"
										id="hadir_{santrikelas.santriId}"
										value="hadir"
										class="radio"
									/>
									<label for="hadir_{santrikelas.santriId}">Hadir</label>
									<input
										type="radio"
										name="status_{santrikelas.santriId}"
										id="alfa_{santrikelas.santriId}"
										value="alfa"
										class="radio"
									/>
									<label for="alfa_{santrikelas.santriId}">Alfa</label>
									<input
										type="radio"
										name="status_{santrikelas.santriId}"
										id="sakit_{santrikelas.santriId}"
										value="sakit"
										class="radio"
									/>
									<label for="sakit_{santrikelas.santriId}">Sakit</label>
									<input
										type="radio"
										name="status_{santrikelas.santriId}"
										id="izin_{santrikelas.santriId}"
										value="izin"
										class="radio"
									/>
									<label for="izin_{santrikelas.santriId}">Izin</label>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex justify-between mt-5">
				<button
					type="button"
					class="btn btn-accent btn-circle btn-outline flex-1"
					onclick={() => changeStatusSantri('hadir')}>Hadir</button
				>
				<button
					type="button"
					class="btn btn-error btn-circle btn-outline flex-1"
					onclick={() => changeStatusSantri('alfa')}>Alfa</button
				>
				<button
					type="button"
					class="btn btn-warning btn-circle btn-outline flex-1"
					onclick={() => changeStatusSantri('sakit')}>Sakit</button
				>
				<button
					type="button"
					class="btn btn-info btn-circle btn-outline flex-1"
					onclick={() => changeStatusSantri('izin')}>Izin</button
				>
			</div>
			<fieldset class="fieldset">
				<button type="submit" class="btn btn-success mt-4">Submit data Absensi</button>
			</fieldset>
		</form>
	</div>
{/if}
