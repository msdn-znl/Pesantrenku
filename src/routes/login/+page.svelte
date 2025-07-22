<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
	<label>
		Username
		<input name="username" type="email" class="input" />
	</label>
	<label>
		Password
		<input type="password" name="password" class="input" />
	</label>
	<button class="btn btn-success hover:btn-accent">Login</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
