<!-- <script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageServerData } from './$types';
	import { toast } from 'svelte-sonner';
	type User = PageServerData['userList'][number];

	let { data }: { data: PageServerData } = $props();

	const users = $derived({
		admin: data.userList.filter((a) => a.role === 'admin'),
		santri: data.userList.filter((s) => s.role === 'santri'),
		guru: data.userList.filter((g) => g.role === 'guru')
	});
	let deleteUserModal: HTMLDialogElement;
	let editUserForm: HTMLFormElement;
	let editUserModal: HTMLDialogElement;
	let userToDelete = $state<string | null>(null);
	let userToEdit = $state<User | null>(null);
	let tambah: HTMLDialogElement;
	let role = $state();
	let listUserToDelete = $state<string[]>([]);
</script>

 -->

<!--Modal Hapus Data masih belum benar-->
<!-- <dialog
	class="modal"
	id="delete_user_modal"
	bind:this={deleteUserModal}
	onclose={() => (userToDelete = null)}
>
	<div class="modal-box">
		<p>Apakah Anda yakin ingin menghapus data user ini?</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-success" onclick={() => (userToDelete = null)}>Batal</button>
			</form>
			<form
				action="?/hapus"
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
					<label for="tahun" class="label">Tahun Masuk</label>
					<input type="number" name="tahun" id="" class="input w-full" placeholder="contoh: 2025" />
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
<div class="flex flex-row-reverse">
	<button class="btn btn-success" onclick={() => tambah.showModal()}>Tambah </button>
</div>

<div class="collapse border-base-300 border">
	<input type="checkbox" />
	<p class="collapse-title font-semibold">Admin</p>
	<div class="collapse-content overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th> <th></th> <th>Nama</th> <th>Username</th> <th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each users.admin as user, i (user.id)}
					<tr class="hover:bg-base-300">
						<th> </th>
						<th>{i + 1}</th>
						<td>{user.nama}</td>
						<td>{user.username}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<div class="collapse border-base-300 border">
	<input type="checkbox" />
	<p class="collapse-title font-semibold">Guru</p>
	<div class="collapse-content overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th> <th></th> <th>Nama</th> <th>Username</th> <th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each users.guru as user, i (user.id)}
					<tr class="hover:bg-base-300">
						<th
							><input
								type="checkbox"
								name="id"
								id=""
								value={user.id}
								bind:group={listUserToDelete}
							/>
						</th>
						<th>{i + 1}</th>
						<td>{user.nama}</td>
						<td>{user.username}</td>
						<td
							><button
								class="btn btn-error"
								onclick={() => {
									userToDelete = user.id;
									deleteUserModal.showModal();
								}}>Hapus</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
<div class="collapse border border-base-300">
	<input type="checkbox" />
	<p class="collapse-title font-semibold">Santri</p>
	<div class="collapse-content overflow-auto">
		<table class="table">
			<thead>
				<tr>
					<th></th> <th></th> <th>Nama</th> <th>Username</th> <th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each users.santri as user, i (user.id)}
					<tr class="hover:bg-base-300">
						<th
							><input
								type="checkbox"
								name="id"
								id=""
								value={user.id}
								bind:group={listUserToDelete}
							/>
						</th>
						<th>{i + 1}</th>
						<td>{user.nama}</td>
						<td>{user.username}</td>
						<td
							><button
								class="btn btn-error"
								onclick={() => {
									userToDelete = user.id;
									deleteUserModal.showModal();
								}}>Hapus</button
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div> -->

<!--Rancangan halaman-->

<script lang="ts">
	let { data } = $props();

	// State untuk search, filter, dan pagination
	let searchQuery = $state('');
	let selectedRole = $state('all');
	let currentPage = $state(1);
	const itemsPerPage = 10;

	// $derived akan otomatis menghitung ulang data pengguna yang difilter jika searchQuery atau selectedRole berubah
	let filteredUsers = $derived(
		data.userList.filter((u) => {
			const matchSearch =
				u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
				u.username.toLowerCase().includes(searchQuery.toLowerCase());

			// Role bisa null dari database, jadi kita tangani dengan fallback string kosong
			const role = u.role || '';
			const matchRole = selectedRole === 'all' || role === selectedRole;

			return matchSearch && matchRole;
		})
	);

	// $derived untuk total halaman dan memotong array untuk pagination
	let totalPages = $derived(Math.ceil(filteredUsers.length / itemsPerPage) || 1);
	let paginatedUsers = $derived(
		filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);

	// Fungsi kontrol pagination
	function nextPage() {
		if (currentPage < totalPages) currentPage++;
	}
	function prevPage() {
		if (currentPage > 1) currentPage--;
	}

	// Helper untuk mereset halaman ke 1 setiap kali filter atau pencarian digunakan
	function resetPagination() {
		currentPage = 1;
	}
</script>

<svelte:head>
	<title>Menu User</title>
</svelte:head>

<div class="p-6 min-h-screen">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-base-content">Daftar Pengguna</h1>
		<p class="text-base-content/70 mt-1">Kelola data admin, guru, dan santri di sistem.</p>
	</div>

	<div class="card bg-base-100 shadow-xl card-border">
		<div class="card-body">
			<!-- Top Controls: Search & Filter -->
			<div class="flex flex-col md:flex-row gap-4 mb-4 justify-between">
				<!-- Search Bar menggunakan input dari daisyUI -->
				<input
					type="text"
					placeholder="Cari nama atau username..."
					class="input input-bordered w-full md:max-w-xs"
					bind:value={searchQuery}
					oninput={resetPagination}
				/>

				<!-- Role Filter menggunakan select dari daisyUI -->
				<select
					class="select select-bordered w-full md:max-w-xs"
					bind:value={selectedRole}
					onchange={resetPagination}
				>
					<option value="all">Semua Role</option>
					<option value="admin">Admin</option>
					<option value="guru">Guru</option>
					<option value="santri">Santri</option>
				</select>
			</div>

			<!-- Tabel Pengguna -->
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th>Nama Lengkap</th>
							<th>Username (Email)</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody>
						{#each paginatedUsers as u (u.id)}
							<tr>
								<td class="font-medium">{u.nama}</td>
								<td>{u.username}</td>
								<td>
									<!-- Penggunaan Badge daisyUI 5 dengan modifikator gaya (badge-soft) -->
									{#if u.role === 'admin'}
										<div class="badge badge-error badge-soft capitalize">{u.role}</div>
									{:else if u.role === 'guru'}
										<div class="badge badge-info badge-soft capitalize">{u.role}</div>
									{:else if u.role === 'santri'}
										<div class="badge badge-success badge-soft capitalize">{u.role}</div>
									{:else}
										<div class="badge badge-neutral badge-soft capitalize">
											{u.role || 'Unassigned'}
										</div>
									{/if}
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="3" class="text-center italic text-base-content/50 py-8">
									Tidak ada data pengguna yang sesuai dengan filter.
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination Control -->
			<div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
				<span class="text-sm text-base-content/70">
					Menampilkan {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
					sampai {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
					dari {filteredUsers.length} data
				</span>

				<!-- Komponen Join daisyUI untuk grup tombol -->
				<div class="join">
					<!-- Di Svelte 5, event click menggunakan "onclick" bukan "on:click" -->
					<button class="join-item btn btn-sm" disabled={currentPage === 1} onclick={prevPage}>
						« Prev
					</button>
					<button class="join-item btn btn-sm no-animation">
						Hal {currentPage} / {totalPages}
					</button>
					<button
						class="join-item btn btn-sm"
						disabled={currentPage === totalPages}
						onclick={nextPage}
					>
						Next »
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
