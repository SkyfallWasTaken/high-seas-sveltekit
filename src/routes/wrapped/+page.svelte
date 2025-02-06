<script lang="ts">
  import { page } from "$app/state";
  import WrappedTeaser from "$lib/components/wrapped/wrapped-teaser.svelte";
  import HoursAndDaysSpent from "$lib/components/wrapped/hours-and-days-spent.svelte";
  import TopEditorAndLanguage from "$lib/components/wrapped/top-editor-and-language.svelte";
  import DoubloonsTeaser from "$lib/components/wrapped/doubloons-teaser.svelte";
  import Doubloons from "$lib/components/wrapped/doubloons.svelte";
  import ShipsTeaser from "$lib/components/wrapped/ships-teaser.svelte";
  import Ships from "$lib/components/wrapped/ships.svelte";
  import MoneySpentTeaser from "$lib/components/wrapped/money-spent-teaser.svelte";
  import MoneySpent from "$lib/components/wrapped/money-spent.svelte";
  import End from "$lib/components/wrapped/end.svelte";
  import Button from "$lib/components/button.svelte";
  import { onMount } from "svelte";

  // biome-ignore lint/style/noNonNullAssertion: server always sets it
  const wrapped = page.data.wrapped!;
  const slides = [
    WrappedTeaser,
    HoursAndDaysSpent,
    TopEditorAndLanguage,
    DoubloonsTeaser,
    Doubloons,
    ShipsTeaser,
    Ships,
    MoneySpentTeaser,
    MoneySpent,
    End,
  ];
  let slidesIndex = $state(0);
  // biome-ignore lint/style/useConst: svelte
  let Current = $derived.by(() => slides[slidesIndex]);

  // biome-ignore lint/style/useConst: svelte
  let showWrapped = $state(false);
  $effect(() => {
    if (showWrapped) {
      const interval = setInterval(() => {
        const newIndex = (slidesIndex + 1) % slides.length;
        if (newIndex === slides.length) {
          clearInterval(interval);
          return;
        }
        slidesIndex = newIndex;
      }, 5000);
    }
  });
</script>

<svelte:head>
  <title>Wrapped - High Seas v2</title>
</svelte:head>

<audio
  src="https://cloud-auzh6ioja-hack-club-bot.vercel.app/041857.mp3"
  autoplay
  loop
>
  <p>
    If you are reading this, it is because your browser does not support the
    audio element.
  </p>
</audio>
{#if showWrapped}
  <div class="py-4 px-4 h-full flex justify-center">
    <div class="absolute top-8 flex w-full justify-center gap-2">
      {#each slides as _, i}
        <div
          class="h-[2px] w-[20px] md:w-[29px] transition-colors duration-400 {i ==
          slidesIndex
            ? 'bg-white'
            : 'bg-base'}"
        ></div>
      {/each}
    </div>
    <div class="h-full w-full sm:w-1/2 lg:w-1/3 rounded shadow">
      <Current {wrapped} />
    </div>
  </div>
{:else}
  <div class="w-full h-full justify-center items-center flex">
    <div class="p-6 space-y-3 shadow rounded-lg bg-surface0">
      <h2 class="text-3xl font-semibold">High Seas Wrapped</h2>
      <Button variant="primary" onclick={() => (showWrapped = true)}
        >Play Wrapped!</Button
      >
    </div>
  </div>
{/if}
