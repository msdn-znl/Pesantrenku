<script lang="ts">
	import type { PageServerData, ActionData } from './$types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div>
	<div class="flex flex-row-reverse">
		<a href={'/pertemuan/' + data.id + '/data-absensi/edit'}
			><button class="btn btn-accent">Edit Absensi</button></a
		>
	</div>
	<div class="card">
		<div class="card-body">
			<table class="table">
				<thead
					><tr>
						<th></th>
						<th>Nama</th>
						<th>Status Kehadiran</th>
					</tr></thead
				>
				<tbody>
					{#each data.absensiList as absensi, i (absensi.id)}
						<tr>
							<th>{i + 1}</th>
							<td>{absensi.santri.user.name}</td>
							{#if absensi.status_kehadiran === 'hadir'}
								<td><p class="badge badge-accent">{absensi.status_kehadiran}</p></td>
							{:else if absensi.status_kehadiran === 'alfa'}
								<td><p class="badge badge-error">{absensi.status_kehadiran}</p></td>
							{:else if absensi.status_kehadiran === 'sakit'}
								<td><p class="badge badge-warning">{absensi.status_kehadiran}</p></td>
							{:else}
								<td><p class="badge badge-info">{absensi.status_kehadiran}</p></td>
							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
