<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tableBody = $state<HTMLElement>();
	let selectedSantri: number[] = $state([]);

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
									<input type="number" name="santriId" id="" value={santrikelas.santriId} hidden />
								</div>
								<div class="">
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
{/if}
