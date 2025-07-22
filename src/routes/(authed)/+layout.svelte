<script lang="ts">
	import { enhance } from '$app/forms';
	let { children } = $props();
</script>

{@render children()}

<form action="/logout" method="post" use:enhance>
	<button class="btn btn-error">Sign Out</button>
</form>
