<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData, ActionData } from './$types';

	let { data, form }: { data: PageServerData; form: ActionData } = $props();
	let tableBody: HTMLElement;
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
			const radio = tableBody.querySelector<HTMLInputElement>(
				`input[type="radio"][name="status_${santriId}"][value=${status}]`
			);
			if (radio) {
				radio.checked = true;
			}
		});
	};
</script>

{#if data.dataPertemuanExist}
	<p>Data pertemuan Sudah Ada</p>
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
					{#each data.santriKelasData as santri, i (santri.santriId)}
						<tr>
							<th
								><input
									type="checkbox"
									name=""
									id=""
									class="checkbox checkbox-md"
									value={santri.santriId}
									bind:group={selectedSantri}
								/></th
							>
							<th>{i + 1}</th>
							<td>{santri.santri.user.nama}</td>
							<td>
								<div>
									<!-- <input type="number" name="pertemuanId" id="" value={data?.id} hidden /> -->
									<input type="number" name="santriId" id="" value={santri.santriId} hidden />
								</div>
								<div class="">
									<input
										type="radio"
										name="status_{santri.santriId}"
										id="hadir"
										value="hadir"
										class="radio"
									/>
									<label for="hadir">Hadir</label>
									<input
										type="radio"
										name="status_{santri.santriId}"
										id="alfa"
										value="alfa"
										class="radio"
									/>
									<label for="alfa">Alfa</label>
									<input
										type="radio"
										name="status_{santri.santriId}"
										id="sakit"
										value="sakit"
										class="radio"
									/>
									<label for="sakit">Sakit</label>
									<input
										type="radio"
										name="status_{santri.santriId}"
										id="izin"
										value="izin"
										class="radio"
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
{/if}
