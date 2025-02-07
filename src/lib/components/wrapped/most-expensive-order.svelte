<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
  const mostExpensiveOrder = wrapped.orders.sort(
    (a, b) => b.doubloonsPaid - a.doubloonsPaid
  )[0];
</script>

<div class="flex w-full h-full bg-sapphire text-base rounded-md shadow p-8">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
  >
    <div class="gap-0.5">
      <p class="text-2xl">Your most expensive<br />order was</p>
      <p class="text-4xl font-semibold">
        {mostExpensiveOrder.name}
      </p>
      {#if mostExpensiveOrder.imageUrl}
        <img
          src={mostExpensiveOrder.imageUrl}
          alt="Image for {mostExpensiveOrder.name}"
          class="rounded-lg my-4"
        />
      {/if}
      <p class="text-2xl">({mostExpensiveOrder.doubloonsPaid} doubloons)</p>
    </div>
  </div>
</div>
