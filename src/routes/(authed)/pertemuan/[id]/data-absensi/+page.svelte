<script lang="ts">
	import type { PageServerData, ActionData } from './types';
	let { data, form }: { data: PageServerData; form: ActionData } = $props();
</script>

<div>
	<div class="flex flex-row-reverse">
		<a href={'/pertemuan/' + data.idPertemuan + '/data-absensi/edit'}
			><button class="btn btn-accent">Edit Absensi</button></a
		>
	</div>
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
					<th>{absensi.santri.user.nama}</th>
					<th>{absensi.status_kehadiran}</th>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
