<script lang="ts">
  import type { Wrapped } from "$lib/server/wrapped";
  import Button from "../button.svelte";
  import { fly } from "svelte/transition";
  import { page } from "$app/state";
  const { wrapped }: { wrapped: Wrapped } = $props();

  let copied = $state(false);
  function copyShareLink(event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(page.url.href);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 500);
  }
</script>

<div class="flex w-full h-full bg-mauve rounded-md shadow p-8 text-base">
  <div
    in:fly={{ y: 12, duration: 400 }}
    class="text-center items-center flex flex-col gap justify-center w-full text-2xl"
  >
    <h2 class="mb-2 text-4xl font-semibold">...and that's a wrap!</h2>
    <p class="mb-3">Hope you enjoyed High Seas Wrapped! See you around 🫡</p>
    <Button onclick={copyShareLink}
      >{copied ? "Copied!" : "Copy share link"}</Button
    >
    <a href="/shipyard" class="text-sm mt-2 underline">Back to shipyard</a>
    <p class="text-sm mt-8">
      psst! shameless plug here - you should join #skyfalls-airport ;)
    </p>
  </div>
</div>
