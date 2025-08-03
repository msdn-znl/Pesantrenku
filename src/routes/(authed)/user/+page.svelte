<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionData, PageServerData } from './$types';
	import { toast } from 'svelte-sonner';

	let { form, data }: { form: ActionData; data: PageServerData } = $props();
	let createUserModal: HTMLDialogElement;
	let deleteUserModal: HTMLDialogElement;
	let userToDelete = $state<string | null>(null);
</script>

<div class="">
	<dialog class="modal" id="create_user_modal2" bind:this={createUserModal}>
		<div class="modal-box">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			</form>
			<div class="">
				<h2 class="card-title">Tambah User</h2>
				<form
					class="fieldset"
					method="post"
					action="?/create"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								createUserModal.close();
								toast.success(result.data?.message);
							} else if (result.type === 'failure') {
								createUserModal.close();
								toast.error(result.data?.message);
							}
							await applyAction(result);
						};
					}}
				>
					<label for="username" class="text-base label"> Email </label>
					<input
						name="username"
						type="email"
						id="username"
						placeholder="Email"
						class="input w-full"
					/>
					<label for="password" class="text-base label"> Password </label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Password"
						class="input w-full"
					/>
					<label for="nama" class="text-base label"> Nama </label>
					<input type="text" name="nama" id="nama" placeholder="Nama" class="input w-full" />
					<label for="role" class="text-base label"> Role </label>
					<select name="role" id="role" class="select w-full">
						<option value="">Role</option>
						<option value="admin">Admin</option>
						<option value="guru">Guru</option>
						<option value="santri">Santri</option>
					</select>
					<button class="btn btn-success mt-5">Tambah Data</button>
				</form>
				<!-- <button onclick={() => toast.success('toast test')} class="btn btn-success"
					>Test Toast</button
				> -->
			</div>
		</div>
	</dialog>
	<div class="flex flex-row-reverse p-2">
		<button class="btn btn-success mr-2" onclick={() => createUserModal.showModal()}
			>Tambah User</button
		>
	</div>
	<dialog class="modal" id="delete_user_modal" bind:this={deleteUserModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data user ini?</p>
			<div class="flex flex-row">
				<form method="dialog">
					<button class="btn btn-success" onclick={() => (userToDelete = null)}>Batal</button>
				</form>
				<form
					action="?/delete"
					method="post"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								invalidateAll();
								deleteUserModal.close();
								toast.success(result.data?.message);
							} else if (result.type === 'failure') {
								deleteUserModal.close();
								toast.error(result.data?.message);
							}
							await applyAction(result);
						};
					}}
				>
					<input type="hidden" name="id" value={userToDelete} />
					<button type="submit" class="btn btn-error">Delete</button>
				</form>
			</div>
		</div>
	</dialog>
	<div class="p-2">
		<div class="">
			<div class="flex">
				<h2 class="card-title">List User</h2>
			</div>
			<div class="overflow-auto">
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

									<a href={'/user/edit-data/' + user.id} class="btn btn-accent"
										><button>Edit</button></a
									>

									<!-- Todo: Update list setelah tombol di delete tanpa reload halaman -->
									<button
										class="btn btn-error"
										onclick={() => {
											userToDelete = user.id;
											deleteUserModal.showModal();
										}}>Delete</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
