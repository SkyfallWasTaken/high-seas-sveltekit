<script lang="ts">
  import "../app.css";
  import "@fontsource-variable/inter";
  import { page } from "$app/state";
  import Header from "$lib/components/header.svelte";
  const { children } = $props();
  import { dev } from "$app/environment";
  import { RenderScan } from "svelte-render-scan";
</script>

<svelte:head>
  {#if import.meta.env.UMAMI_WEBSITE_ID && import.meta.env.UMAMI_SCRIPT_URL}
    <script
      defer
      src={import.meta.env.UMAMI_SCRIPT_URL}
      data-website-id={import.meta.env.UMAMI_WEBSITE_ID}
    ></script>
  {/if}
</svelte:head>

{#if dev}
  <RenderScan />
{/if}
{#if !page.url.pathname.includes("wrapped")}
  <Header />
{/if}
<main class="pb-2 h-full">
  {@render children()}
</main>
