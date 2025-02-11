<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/inter";
  import { page } from "$app/state";
  import Header from "$lib/components/header.svelte";
  const { children } = $props();
  import { dev } from "$app/environment";
  import { RenderScan } from "svelte-render-scan";
</script>

{#if dev}
  <RenderScan />
{/if}
{#if !page.url.pathname.includes("wrapped")}
  <Header />
{/if}
<main class="pb-2 h-full">
  {@render children()}
</main>
