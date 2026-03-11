<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let tableBody = $state<HTMLElement>();
	let selectedSantri: string[] = $state([]);

	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.dataSantriKelas.map((s) => s.santriId);
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

<div class="card shadow-sm">
	<div class="card-body">
		<h2 class="card-title">Tambah Data Absensi</h2>
		<form action="?/add" method="post">
			<table class="table">
				<thead>
					<tr>
						<th>
							<label>
								<input
									type="checkbox"
									id="main-checkbox"
									onchange={toggleSelectAll}
									class="checkbox chceckbox-md"
								/></label
							>
						</th>
						<th></th>
						<th>Nama</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody id="table-body" bind:this={tableBody}>
					{#each data.dataSantriKelas as santriKelas, i (santriKelas.santriId)}
						<tr>
							<th>
								<input
									type="checkbox"
									class="checkbox checkbox-md"
									value={santriKelas.santriId}
									bind:group={selectedSantri}
								/>
							</th>
							<th>{i + 1}</th>
							<td>{santriKelas.santri.user.nama}</td>
							<td>
								<input type="text" name="santriId" id="" value={santriKelas.santriId} hidden />
								<div>
									<input
										type="radio"
										name="status_{santriKelas.santriId}"
										id="hadir_{santriKelas.santriId}"
										value="hadir"
										class="radio"
									/>
									<label for="hadir_{santriKelas.santriId}">Hadir</label>
									<input
										type="radio"
										name="status_{santriKelas.santriId}"
										id="alfa_{santriKelas.santriId}"
										value="alfa"
										class="radio"
									/>
									<label for="alfa_{santriKelas.santriId}">Alfa</label>
									<input
										type="radio"
										name="status_{santriKelas.santriId}"
										id="izin_{santriKelas.santriId}"
										value="izin"
										class="radio"
									/>
									<label for="izin_{santriKelas.santriId}">Izin</label>
									<input
										type="radio"
										name="status_{santriKelas.santriId}"
										id="sakit_{santriKelas.santriId}"
										value="sakit"
										class="radio"
									/>
									<label for="sakit_{santriKelas.santriId}">Sakit</label>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex justify-between">
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
				<button type="submit" class="btn btn-success">Submit</button>
			</fieldset>
		</form>
	</div>
</div>
