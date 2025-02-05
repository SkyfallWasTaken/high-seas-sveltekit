<script lang="ts">
  import { page } from "$app/state";
  import Button from "$lib/components/button.svelte";

  const { ships, person } = page.data;
</script>

<svelte:head>
  <title>Debug - High Seas v2</title>
</svelte:head>

<div class="p-6 space-y-4">
  <a href="#ships" class="text-mauve underline font-semibold">Jump to Ships</a>
  <a href="#person" class="text-mauve underline font-semibold">Jump to Person</a
  >

  <div>
    <h2 class="text-4xl font-black my-2">Caches</h2>
    <p class="mb-2">
      This button will flush your shipyard and person caches. Please use
      responsibly!
    </p>
    <a href="/api/flush-person-and-ships"
      ><Button variant="primary">Flush caches</Button></a
    >
  </div>

  <div>
    <h2 class="text-4xl font-black my-2" id="ships">Ships ({ships?.length})</h2>
    {#if ships}
      <pre>{JSON.stringify(ships, null, 2)}</pre>
    {:else}
      No ships
    {/if}
  </div>

  <div>
    <h2 class="text-4xl font-black my-2" id="person">Person</h2>
    <pre>{JSON.stringify(person, null, 2)}</pre>
  </div>
</div>
