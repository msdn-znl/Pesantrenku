<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<p style="color: red">{form?.message ?? ''}</p>
<div>
	<div class="card card-md max-w-sm shadow-2xl">
		<div class="card-body">
			<h2 class="card-title">Login</h2>
			<form method="post" action="?/login" use:enhance>
				<fieldset class="fieldset">
					<label class="label" for="username"> Username(Email) </label>
					<input
						name="username"
						id="username"
						placeholder="mail@mail.co"
						type="email"
						class="input"
					/>
					<label class="label" for="password"> Password </label>
					<input
						type="password"
						name="password"
						id="password"
						placeholder="Password"
						class="input"
					/>
					<button class="btn btn-success hover:btn-accent mt-4">Login</button>
				</fieldset>
			</form>
		</div>
	</div>
</div>
