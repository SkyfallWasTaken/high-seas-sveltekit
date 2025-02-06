<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { secondsToHoursAndMinutes } from "$lib/utils";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-yellow text-base rounded-md shadow p-8">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
  >
    <div class="gap-0.5">
      <p class="text-2xl">You earned...</p>
      <p class="text-4xl font-semibold">
        {wrapped.highSeas.doubloonsReceived}
      </p>
    </div>

    <div class="gap-0.5">
      <p class="text-2xl">and spent...</p>
      <p class="text-4xl font-semibold">
        {wrapped.highSeas.doubloonsSpent}
      </p>
    </div>
  </div>
</div>
