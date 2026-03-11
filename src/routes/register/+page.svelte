<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<svelte:head><title>Halaman Register</title></svelte:head>
<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left p-6">
			<h1 class="text-5xl font-bold">Register</h1>
			<p class="py-6">
				Selamat Datang di Pesantrenku, Untuk Penggunaan pertama kali, mohon melakukan register Akun
				Admin pada form
			</p>
		</div>
		<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
			<div class="card-body">
				<h2 class="card-title">Silahkan Register</h2>
				<form method="post" action="?/register" use:enhance>
					<fieldset class="fieldset">
						<label for="nama">Nama</label>
						<input type="text" name="nama" id="nama" placeholder="Nama" class="input" required />
						<label class="label" for="username"> Username </label>
						<input
							name="username"
							id="username"
							placeholder="Username"
							type="text"
							class="input"
							required
						/>
						<label class="label" for="password"> Password </label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							class="input validator"
							min="6"
							required
						/>
						<button class="btn btn-success hover:btn-accent mt-4">Register</button>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
</div>
