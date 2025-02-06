<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { secondsToHoursAndMinutes } from "$lib/utils";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-green rounded-md shadow p-8 text-base">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap-6 justify-center w-full text-2xl"
  >
    <div class="gap-0.5">
      <p class="text-2xl">Top editor</p>
      <p class="text-4xl font-semibold">
        {wrapped.wakatime.mostUsedEditor.key === "Vscode"
          ? "VS Code"
          : wrapped.wakatime.mostUsedEditor.key}
      </p>
      <p class="text-2xl">
        {secondsToHoursAndMinutes(wrapped.wakatime.mostUsedEditor.total)}
      </p>
    </div>

    <div class="gap-0.5">
      <p class="text-2xl">Top language</p>
      <p class="text-4xl font-semibold">
        {wrapped.wakatime.mostUsedLanguage.key}
      </p>
      <p class="text-2xl">
        {secondsToHoursAndMinutes(wrapped.wakatime.mostUsedLanguage.total)}
      </p>
    </div>
  </div>
</div>
