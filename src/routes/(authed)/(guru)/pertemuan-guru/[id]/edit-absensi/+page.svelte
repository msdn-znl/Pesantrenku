<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	const absensi = $derived({
		hadir: data.dataAbsensiSantri.filter((item) => item.status_kehadiran === 'hadir'),
		izin: data.dataAbsensiSantri.filter((item) => item.status_kehadiran === 'izin'),
		alfa: data.dataAbsensiSantri.filter((item) => item.status_kehadiran === 'alfa'),
		sakit: data.dataAbsensiSantri.filter((item) => item.status_kehadiran === 'sakit')
	});

	let tableBody = $state<HTMLElement>();
	let selectedSantri: string[] = $state([]);

	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.dataAbsensiSantri.map((s) => s.santriId);
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

<div class="card bg-base-100 shadow-sm">
	<div class="card-body">
		<h2 class="card-title">Edit Data Absensi</h2>
		<form action="?/edit" method="post">
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
				<tbody id="table-body-hadir" bind:this={tableBody}>
					{#each absensi.hadir as item, i (item.id)}
						<tr>
							<th>
								<input
									type="checkbox"
									class="checkbox checkbox-md"
									value={item.id}
									bind:group={selectedSantri}
								/>
							</th>
							<th>{i + 1}</th>
							<td>{item.santri.user.nama}</td>
							<td>
								<input type="text" name="id" id="" value={item.id} hidden />
								<div>
									<input
										type="radio"
										name="status_{item.id}"
										id="hadir"
										value="hadir"
										class="radio"
										checked
									/>
									<label for="hadir_{item.id}">Hadir</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="alfa"
										value="alfa"
										class="radio"
									/>
									<label for="alfa_{item.id}">Alfa</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="izin"
										value="izin"
										class="radio"
									/>
									<label for="izin_{item.id}">Izin</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="sakit"
										value="sakit"
										class="radio"
									/>
									<label for="sakit_{item.id}">Sakit</label>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
				<tbody id="table-body-alfa" bind:this={tableBody}>
					{#each absensi.alfa as item, i (item.id)}
						<tr>
							<th>
								<input
									type="checkbox"
									class="checkbox checkbox-md"
									value={item.id}
									bind:group={selectedSantri}
								/>
							</th>
							<th>{i + 1}</th>
							<td>{item.santri.user.nama}</td>
							<td>
								<input type="text" name="id" id="" value={item.id} hidden />
								<div>
									<input
										type="radio"
										name="status_{item.id}"
										id="hadir"
										value="hadir"
										class="radio"
									/>
									<label for="hadir_{item.id}">Hadir</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="alfa"
										value="alfa"
										class="radio"
										checked
									/>
									<label for="alfa_{item.id}">Alfa</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="izin"
										value="izin"
										class="radio"
									/>
									<label for="izin_{item.id}">Izin</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="sakit"
										value="sakit"
										class="radio"
									/>
									<label for="sakit_{item.id}">Sakit</label>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
				<tbody id="table-body-izin" bind:this={tableBody}>
					{#each absensi.izin as item, i (item.id)}
						<tr>
							<th>
								<input
									type="checkbox"
									class="checkbox checkbox-md"
									value={item.id}
									bind:group={selectedSantri}
								/>
							</th>
							<th>{i + 1}</th>
							<td>{item.santri.user.nama}</td>
							<td>
								<input type="text" name="id" id="" value={item.id} hidden />
								<div>
									<input
										type="radio"
										name="status_{item.id}"
										id="hadir"
										value="hadir"
										class="radio"
									/>
									<label for="hadir_{item.id}">Hadir</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="alfa"
										value="alfa"
										class="radio"
									/>
									<label for="alfa_{item.id}">Alfa</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="izin"
										value="izin"
										class="radio"
										checked
									/>
									<label for="izin_{item.id}">Izin</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="sakit"
										value="sakit"
										class="radio"
									/>
									<label for="sakit_{item.id}">Sakit</label>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
				<tbody id="table-body-sakit" bind:this={tableBody}>
					{#each absensi.sakit as item, i (item.id)}
						<tr>
							<th>
								<input
									type="checkbox"
									class="checkbox checkbox-md"
									value={item.id}
									bind:group={selectedSantri}
								/>
							</th>
							<th>{i + 1}</th>
							<td>{item.santri.user.nama}</td>
							<td>
								<input type="text" name="id" id="" value={item.id} hidden />
								<div>
									<input
										type="radio"
										name="status_{item.id}"
										id="hadir"
										value="hadir"
										class="radio"
									/>
									<label for="hadir_{item.id}">Hadir</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="alfa"
										value="alfa"
										class="radio"
									/>
									<label for="alfa_{item.id}">Alfa</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="izin"
										value="izin"
										class="radio"
									/>
									<label for="izin_{item.id}">Izin</label>
									<input
										type="radio"
										name="status_{item.id}"
										id="sakit"
										value="sakit"
										class="radio"
										checked
									/>
									<label for="sakit_{item.id}">Sakit</label>
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
