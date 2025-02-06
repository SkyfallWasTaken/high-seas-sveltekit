<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { secondsToHoursAndMinutes, secondsToDays } from "$lib/utils";
  import { fly } from "svelte/transition";

  const { wrapped }: { wrapped: Wrapped } = $props();
  const days = secondsToDays(wrapped.wakatime.totalCodingSeconds);
  const hours = secondsToHoursAndMinutes(wrapped.wakatime.totalCodingSeconds);
</script>

<div class="flex w-full h-full bg-green rounded-md shadow p-8 text-base">
  <div
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
    in:fly={{ y: 12, duration: 400 }}
  >
    <div class="gap-0.5">
      <p class="text-3xl">You've spent</p>
      <p class="text-6xl font-semibold">{hours}</p>
      <p class="text-3xl">on High Seas</p>
    </div>

    <p class="text-xl mt-3">
      (that's more than {days}
      {wrapped.wakatime.totalCodingSeconds > 86400 ? "days" : "day"}!)
    </p>
  </div>
</div>
