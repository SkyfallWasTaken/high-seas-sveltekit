<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { fly } from "svelte/transition";

  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-green rounded-md shadow p-8 text-base">
  <div
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
    in:fly={{ y: 12, duration: 400 }}
  >
    <div class="gap-0.5">
      <p class="text-3xl">Hack Club's spent</p>
      <p class="text-6xl font-semibold">
        ${wrapped.highSeas.realMoneySpent.toFixed(2)}
      </p>
      <p class="text-3xl">on your prizes!</p>
    </div>
  </div>
</div>
