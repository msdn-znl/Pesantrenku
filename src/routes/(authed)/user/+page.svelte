<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();
	let createUserModal: HTMLDialogElement;
	let deleteUserModal: HTMLDialogElement;
	let userToDelete = $state<string | null>(null);
</script>

<div class="overflow-auto">
	<dialog class="modal" id="create_user_modal" bind:this={createUserModal}>
		<div class="">
			<div class="card max-w-lg bg-base-100 shadow">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
				</form>
				<div class="card-body flex-col shrink-0">
					<h2 class="card-title">Tambah User</h2>
					<form method="post" action="?/add" use:enhance>
						<fieldset class="fieldset">
							<label for="username" class="text-base label"> Email </label>
							<input
								name="username"
								type="email"
								id="username"
								placeholder="Email"
								class="input w-md"
							/>
							<label for="password" class="text-base label"> Password </label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Password"
								class="input w-md"
							/>
							<label for="nama" class="text-base label"> Nama </label>
							<input type="text" name="nama" id="nama" placeholder="Nama" class="input w-md" />
							<label for="role" class="text-base label"> Role </label>
							<select name="role" id="role" class="select w-md">
								<option value="">Role</option>
								<option value="admin">Admin</option>
								<option value="guru">Guru</option>
								<option value="santri">Santri</option>
							</select>
							<button class="btn btn-success hover:btn-warning mt-5">Tambah Data</button>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success mt-4" onclick={() => createUserModal.showModal()}
			>Tambah Santri</button
		>
	</div>
	<dialog class="modal" id="delete_user_modal" bind:this={deleteUserModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data user ini?</p>
			<div class="flex flex-row">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (userToDelete = null)}>Batal</button>
				</form>
				<form action="?/delete" method="post" use:enhance>
					<input type="hidden" name="id" value={userToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
	<div class="mt-4">
		<div class="card">
			<div class="flex">
				<h2 class="card-title">List User</h2>
			</div>
			<div class="card-bdy">
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
										<button
											class="btn btn-error"
											onclick={() => {
												userToDelete = user.id;
												deleteUserModal.showModal();
											}}>Delete</button
										>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<p>{form?.message ?? ''}</p>
			</div>
		</div>
	</div>
</div>
