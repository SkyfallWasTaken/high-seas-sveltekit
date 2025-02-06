<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { secondsToHoursAndMinutes } from "$lib/utils";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-flamingo text-base rounded-md shadow p-8">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
  >
    <div class="gap-0.5">
      <p class="text-2xl">You shipped</p>
      <p class="text-4xl font-semibold">
        {wrapped.highSeas.shipsCount}
        {wrapped.highSeas.shipsCount === 1 ? "ship" : "ships"}
      </p>
    </div>

    <div class="gap-0.5">
      <p class="text-2xl">Your best ship was</p>
      <p class="text-4xl font-semibold">
        {wrapped.highSeas.mostSuccessfulShip.name}
      </p>
      <p class="text-2xl">
        {secondsToHoursAndMinutes(
          wrapped.highSeas.mostSuccessfulShip.totalSeconds
        )}
      </p>
      <p class="text-2xl">
        {Math.floor(wrapped.highSeas.mostSuccessfulShip.totalDoubloons)} doubloons
        - that's {(
          wrapped.highSeas.mostSuccessfulShip.totalDoubloons /
          wrapped.highSeas.mostSuccessfulShip.totalHours
        ).toFixed(2)} doubloons per hour!
      </p>
    </div>
  </div>
</div>
