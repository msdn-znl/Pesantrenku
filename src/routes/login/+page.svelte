<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<p style="color: red">{form?.message ?? ''}</p>
<div class="hero bg-base-200 min-h-screen">
	<div class="hero-content flex-col lg:flex-row-reverse">
		<div class="text-center lg:text-left p-6">
			<h1 class="text-5xl font-bold">Login</h1>
			<p class="py-6">Selamat Datang di Pesantrenku, Silahkan Login</p>
		</div>
		<div class="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
			<div class="card-body">
				<h2 class="card-title">Silahkan Login</h2>
				<form method="post" action="?/login" use:enhance>
					<fieldset class="fieldset">
						<label class="label" for="username"> Username(Email) </label>
						<input
							name="username"
							id="username"
							placeholder="mail@mail.co"
							type="text"
							class="input"
						/>
						<label class="label" for="password"> Password </label>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="Password"
							class="input validator"
							min="6"
						/>
						<button class="btn btn-success hover:btn-accent mt-4">Login</button>
					</fieldset>
				</form>
			</div>
		</div>
	</div>
</div>
