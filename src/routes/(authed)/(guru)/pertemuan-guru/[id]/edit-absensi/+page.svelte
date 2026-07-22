<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();

	let tableBody = $state<HTMLElement>();
	let selectedSantri: string[] = $state([]);

	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.dataAbsensiSantri.map((s) => s.id);
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
				<tbody id="table-body" bind:this={tableBody}>
					{#each data.dataAbsensiSantri as absensi, i (absensi.id)}
						<tr>
							<th
								><input
									type="checkbox"
									name=""
									id=""
									class="checkbox checkbox-md"
									value={absensi.id}
									bind:group={selectedSantri}
								/></th
							>
							<th>{i + 1}</th>
							<td>{absensi.santri.user.name}</td>
							<td>
								<div>
									<input type="text" name="id" id="" value={absensi.id} hidden />
								</div>
								<div class="">
									<input
										type="radio"
										name="status_{absensi.id}"
										id="hadir"
										value="hadir"
										class="radio"
										checked={absensi.status_kehadiran === 'hadir'}
									/>
									<label for="hadir" class="badge badge-soft badge-accent">Hadir</label>
									<input
										type="radio"
										name="status_{absensi.id}"
										id="alfa"
										value="alfa"
										class="radio"
										checked={absensi.status_kehadiran === 'alfa'}
									/>
									<label for="alfa" class="badge badge-soft badge-error">Alfa</label>
									<input
										type="radio"
										name="status_{absensi.id}"
										id="sakit"
										value="sakit"
										class="radio"
										checked={absensi.status_kehadiran === 'sakit'}
									/>
									<label for="sakit" class="badge badge-soft badge-warning">Sakit</label>
									<input
										type="radio"
										name="status_{absensi.id}"
										id="izin"
										value="izin"
										class="radio"
										checked={absensi.status_kehadiran === 'izin'}
									/>
									<label for="izin" class="badge badge-soft badge-info">Izin</label>
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
