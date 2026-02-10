<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();

	let jadwalId = $state<string | null>(null);
</script>

<svelte:head>
	<title>Dashboard Admin</title>
</svelte:head>
<h1>Hi, {data.user.username}!</h1>
