<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();
</script>

<div class="">
	<h2 class="">Edit Data</h2>
	<div class="card">
		<form action="?/edit" method="post" class="card-body flex flex-col" use:enhance>
			<label for="username">Email</label>
			<input type="email" name="username" id="username" class="input" value={data.user.username} />
			<label for="nama">Nama</label>
			<input type="text" name="nama" id="nama" class="input" value={data.user.nama} />
			<label for="password">Password</label>
			<input type="password" name="password" id="password" class="input" />
			<label for="role">Role</label>
			<select name="role" id="role" value={data.user.role} class="select" disabled>
				<option value=""></option>
				<option value="admin">Admin</option>
				<option value="guru">Guru</option>
				<option value="santri">Santri</option>
			</select>
			<div class="card-actions">
				<button type="submit" class="btn btn-success mt-4">Edit Data</button>
			</div>
		</form>
		<p style="color: red">{form?.message ?? ''}</p>
	</div>
</div>
