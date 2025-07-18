<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();
</script>

<!-- <button class="btn" onclick={tambahData.showModal()}>Tambah Data</button>
<dialog id="tambahData" class="modal"> -->
<div class="flex flex-col">
	<!-- Todo: Buat modal untuk form tambah user -->
	<h1>Register</h1>
	<form method="post" action="?/add" use:enhance>
		<label>
			Email
			<input name="username" type="email" class="input" />
		</label>
		<label>
			Password
			<input type="password" name="password" class="input" />
		</label>
		<label>
			Nama
			<input type="text" name="nama" class="input" />
		</label>
		<label>
			Role
			<select name="role" id="" class="select">
				<option value=""></option>
				<option value="admin">Admin</option>
				<option value="guru">Guru</option>
				<option value="santri">Santri</option>
			</select>
		</label>
		<button class="btn btn-success hover:btn-warning">Tambah Data</button>
	</form>
	<p>{form?.message ?? ''}</p>
</div>
<!-- </dialog> -->

<div>
	<h1>User List</h1>
	<div class=" w-3/4">
		<table class="table">
			<thead>
				<tr>
					<th></th>
					<th>Nama</th>
					<th>Username</th>
					<th>Role</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each data.userList as user, i (user.id)}
					<tr class="hover:bg-base-300">
						<th>{i + 1}</th>
						<td>{user.nama}</td>
						<td>{user.username}</td>
						<td>{user.role}</td>

						<td>
							<!-- Todo: Buat modal untuk tombol edit -->
							<div>
								<a href={'/user/edit-data/' + user.id}
									><button class="btn btn-accent">Edit</button></a
								>
							</div>
							<div>
								<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
								<form action="?/delete" method="post" use:enhance>
									<input type="hidden" name="id" value={user.id} />
									<button type="submit" class="btn btn-error">Delete</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<p>{form?.message ?? ''}</p>
	</div>
</div>
