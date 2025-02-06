<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/inter";
  import { page } from "$app/state";
  import Header from "$lib/components/header.svelte";
  const { children } = $props();
</script>

{#if !page.url.pathname.includes("wrapped")}
  <Header />
{/if}
<main class="pb-2 h-full">
  {@render children()}
</main>
