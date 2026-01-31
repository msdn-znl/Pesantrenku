<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tableBody: HTMLElement;
	let selectedSantri: string[] = $state([]);

	const toggleSelectAll = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.checked) {
			selectedSantri = data.absensiList.map((s) => s.id);
		} else {
			selectedSantri = [];
		}
	};
	const changeStatusSantri = (status: 'hadir' | 'alfa' | 'izin' | 'sakit') => {
		selectedSantri.forEach((id) => {
			const radio = tableBody.querySelector<HTMLInputElement>(
				`input[type="radio"][name="status_${id}"][value=${status}]`
			);
			if (radio) {
				radio.checked = true;
			}
		});
	};
</script>

<div class="p-2 card">
	<form action="?/edit" method="post" use:enhance>
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
				{#each data.absensiList as absensi, i (absensi.id)}
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
						<td>{absensi.santri.user.nama}</td>
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
								<label for="hadir">Hadir</label>
								<input
									type="radio"
									name="status_{absensi.id}"
									id="alfa"
									value="alfa"
									class="radio"
									checked={absensi.status_kehadiran === 'alfa'}
								/>
								<label for="alfa">Alfa</label>
								<input
									type="radio"
									name="status_{absensi.id}"
									id="sakit"
									value="sakit"
									class="radio"
									checked={absensi.status_kehadiran === 'sakit'}
								/>
								<label for="sakit">Sakit</label>
								<input
									type="radio"
									name="status_{absensi.id}"
									id="izin"
									value="izin"
									class="radio"
									checked={absensi.status_kehadiran === 'izin'}
								/>
								<label for="izin">Izin</label>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div>
			<button type="submit" class="btn btn-success">Submit data Absensi</button>
		</div>
		<div class="flex flex-row">
			<button type="button" class="btn" onclick={() => changeStatusSantri('hadir')}>Hadir</button>
			<button type="button" class="btn" onclick={() => changeStatusSantri('alfa')}>Alfa</button>
			<button type="button" class="btn" onclick={() => changeStatusSantri('sakit')}>Sakit</button>
			<button type="button" class="btn" onclick={() => changeStatusSantri('izin')}>Izin</button>
		</div>
	</form>
</div>
