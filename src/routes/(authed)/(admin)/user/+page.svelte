<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionData, PageServerData } from './$types';
	import { toast } from 'svelte-sonner';
	type User = PageServerData['userList'][number];

	let { form, data }: { form: ActionData; data: PageServerData } = $props();

	const users = $derived({
		admin: data.userList.filter((a) => a.role === 'admin'),
		santri: data.userList.filter((s) => s.role === 'santri'),
		guru: data.userList.filter((g) => g.role === 'guru')
	});
	let createUserForm: HTMLFormElement;
	let createUserModal: HTMLDialogElement;
	let deleteUserModal: HTMLDialogElement;
	let editUserForm: HTMLFormElement;
	let editUserModal: HTMLDialogElement;
	let userToDelete = $state<string | null>(null);
	let userToEdit = $state<User | null>(null);
	let tambah: HTMLDialogElement;
	let role = $state();
	let listUserToDelete = $state<string[] | null>(null);

	$inspect(listUserToDelete);
</script>

<svelte:head>
	<title>Menu User</title>
</svelte:head>
<div>
	<dialog class="modal" id="create_user_modal" bind:this={createUserModal}>
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
					bind:this={createUserForm}
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								createUserForm.reset();
								invalidateAll();
								createUserModal.close();
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								createUserModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
							}
							await applyAction(result);
						};
					}}
				>
					<label for="username" class="text-base label"> Username</label>
					<input
						name="username"
						type="string"
						id="username"
						placeholder="Username"
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
			</div>
		</div>
	</dialog>
	<dialog class="modal" id="delete_user_modal" bind:this={deleteUserModal}>
		<div class="modal-box">
			<p>Apakah Anda yakin ingin menghapus data user ini?</p>
			<div class="modal-action">
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
								if (result.data?.message && typeof result.data?.message === 'string') {
									toast.success(result.data?.message);
								}
							} else if (result.type === 'failure') {
								deleteUserModal.close();
								if (result.data?.message && typeof result.data.message === 'string') {
									toast.error(result.data?.message);
								}
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
	<dialog class="modal" id="edit_user_modal" bind:this={editUserModal}>
		<div class="modal-box">
			<form method="dialog">
				<button
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
					onclick={() => (userToEdit = null)}>✕</button
				>
			</form>
			<form
				action="?/edit"
				method="post"
				bind:this={editUserForm}
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							editUserForm.reset();
							invalidateAll();
							editUserModal.close();
							if (result.data?.message && typeof result.data?.message === 'string') {
								toast.success(result.data?.message);
							}
						} else if (result.type === 'failure') {
							editUserModal.close();
							if (result.data?.message && typeof result.data.message === 'string') {
								toast.error(result.data?.message);
							}
						}
						await applyAction(result);
					};
				}}
			>
				<fieldset class="fieldset">
					<input type="text" name="id" id="id" value={userToEdit?.id} hidden />
					<label for="edit_username" class="text-base label"> Username</label>
					<input
						type="text"
						name="username"
						id="edit_username"
						class="input w-full"
						value={userToEdit?.username}
					/>
					<label for="edit_nama" class="text-base label"> Nama </label>
					<input
						type="text"
						name="nama"
						id="edit_nama"
						class="input w-full"
						value={userToEdit?.nama}
					/>
					<label for="edit_password" class="text-base label">Password</label>
					<input type="password" name="password" id="edit_password" class="input w-full" />
					<label for="edit_role" class="text-base label"> Role</label>
					<select name="role" id="edit_role" class="select w-full" disabled>
						<option value="">Role</option>
						<option value="admin" selected={userToEdit?.role == 'admin'}>Admin</option>
						<option value="guru" selected={userToEdit?.role == 'guru'}>Guru</option>
						<option value="santri" selected={userToEdit?.role == 'santri'}>Santri</option>
					</select>
					<button type="submit" class="btn btn-success mt-4">Edit Data</button>
				</fieldset>
			</form>
		</div>
	</dialog>
	<div class="flex flex-row-reverse">
		<button class="btn btn-success" onclick={() => createUserModal.showModal()}>Tambah User</button>
		<button class="btn btn-success" onclick={() => tambah.showModal()}>Tambah </button>
	</div>

	<div>
		<div class="flex">
			<h2 class="card-title">List User</h2>
		</div>
		<div class="overflow-auto">
			<table class="table">
				<thead>
					<tr>
						<th></th>
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
							<th
								><input
									type="checkbox"
									name="id"
									id=""
									value={user.id}
									bind:group={listUserToDelete}
								/></th
							>
							<th>{i + 1}</th>
							<td>{user.nama}</td>
							<td>{user.username}</td>
							<td>{user.role}</td>

							<td>
								<!-- Todo: Buat modal untuk tombol edit -->

								<button
									class="btn btn-success mr-2"
									onclick={() => {
										userToEdit = { ...user };
										editUserModal.showModal();
									}}>Edit</button
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

<dialog class="modal" id="tambah" bind:this={tambah}>
	<div class="modal-box w-11/12 max-w-5xl">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h2 class="card-title">Tambah User</h2>
		<form action="?/tambah" method="post" class="flex flex-col gap-4">
			<label for="role" class="label">Role</label>
			<select name="role" id="role" bind:value={role} class="select w-full">
				<option value="">Pilih</option>
				<option value="admin">Admin</option>
				<option value="guru">Guru</option>
				<option value="santri">Santri</option>
			</select>
			{#if role === 'santri'}
				<fieldset class="fieldset">
					<legend class="fieldset-legend"> Nama Santri </legend>
					<textarea
						name="nama"
						id="nama"
						class="textarea w-full h-24"
						placeholder="Masukkan satu Nama untuk satu baris. Contoh: 
Abdullah Zaid 
Ahmad Umar"
					></textarea>
					<label for="tipe" class="label">Pondok</label>
					<select name="tipe" id="tipe" class="select w-full">
						<option value=""></option>
						<option value="putra">Putra</option>
						<option value="putri">Putri</option>
					</select>
				</fieldset>
				<button type="submit" class="btn btn-success">Kirim</button>
			{:else if role === 'guru'}
				<fieldset class="fieldset">
					<legend class="fieldset-legend"> Nama Guru </legend>
					<textarea
						name="nama"
						id="nama"
						class="textarea w-full h-24"
						placeholder="Masukkan satu Nama untuk satu baris. Contoh:
Abdul Aziz
Amirul Hasan"
					></textarea>
				</fieldset>
				<button type="submit" class="btn btn-success">Kirim</button>
			{:else if role === 'admin'}
				<label for="username" class="text-base label"> Username</label>
				<input
					name="username"
					type="string"
					id="username"
					placeholder="Username"
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
				<button type="submit" class="btn btn-success">Kirim</button>
			{/if}
		</form>
	</div>
</dialog>
