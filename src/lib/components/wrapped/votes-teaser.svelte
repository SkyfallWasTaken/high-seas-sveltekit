<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import { fly } from "svelte/transition";
  const { wrapped }: { wrapped: Wrapped } = $props();
</script>

<div class="flex w-full h-full bg-lavender rounded-md shadow p-8 text-base">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap justify-center w-full text-2xl"
  >
    <p>Vote, vote, vote! Let's check out how your votes were...</p>
  </div>
</div>
