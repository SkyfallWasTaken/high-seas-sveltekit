<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-mauve rounded-md shadow p-8 text-base">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap justify-center w-full text-2xl"
  >
    <h2 class="mb-2 text-4xl font-semibold">...and that's a wrap!</h2>
    <p>Hope you enjoyed High Seas Wrapped! See you around 🫡</p>
    <p class="text-sm mt-8">
      psst! shameless plug here - you should join #skyfalls-airport ;)
    </p>
  </div>
</div>
