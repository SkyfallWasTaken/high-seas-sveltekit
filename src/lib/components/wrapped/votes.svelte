<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-lavender text-base rounded-md shadow p-8">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
  >
    <div class="gap-0.5">
      <p class="text-2xl">You voted</p>
      <p class="text-4xl font-semibold">
        {wrapped.highSeas.voteCount}
      </p>
      <p class="text-2xl">times</p>
    </div>

    <div class="gap-0.5">
      <p class="text-2xl">Average vote time</p>
      <p class="text-4xl font-semibold">
        {Math.round(wrapped.highSeas.averageVoteTime)}s
      </p>
    </div>

    <p class="text-sm mt-8">STOP THE FRAUD!</p>
  </div>
</div>
