<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-blue rounded-md shadow p-8 text-base">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap justify-center w-full text-2xl"
  >
    <h2 class="mb-2 text-4xl font-semibold">Welcome to High Seas Wrapped!</h2>
    <p>Let's see how you've been getting on with your coding...</p>
  </div>
</div>
