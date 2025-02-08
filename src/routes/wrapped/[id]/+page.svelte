<script lang="ts">
  import type { MouseEvent, KeyboardEvent } from "svelte/elements";
  import { page } from "$app/state";
  import WrappedTeaser from "$lib/components/wrapped/wrapped-teaser.svelte";
  import HoursAndDaysSpent from "$lib/components/wrapped/hours-and-days-spent.svelte";
  import TopEditorAndLanguage from "$lib/components/wrapped/top-editor-and-language.svelte";
  import DoubloonsTeaser from "$lib/components/wrapped/doubloons-teaser.svelte";
  import Doubloons from "$lib/components/wrapped/doubloons.svelte";
  import ShipsTeaser from "$lib/components/wrapped/ships-teaser.svelte";
  import Ships from "$lib/components/wrapped/ships.svelte";
  import MostExpensiveOrder from "$lib/components/wrapped/most-expensive-order.svelte";
  import VotesTeaser from "$lib/components/wrapped/votes-teaser.svelte";
  import Votes from "$lib/components/wrapped/votes.svelte";
  import MoneySpentTeaser from "$lib/components/wrapped/money-spent-teaser.svelte";
  import MoneySpent from "$lib/components/wrapped/money-spent.svelte";
  import End from "$lib/components/wrapped/end.svelte";
  import Button from "$lib/components/button.svelte";

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
    MostExpensiveOrder,
    VotesTeaser,
    Votes,
    MoneySpentTeaser,
    MoneySpent,
    End,
  ];
  let slidesIndex = $state(0);
  // biome-ignore lint/style/useConst: svelte
  let Current = $derived.by(() => slides[slidesIndex]);

  function advanceSlide() {
    const newIndex = (slidesIndex + 1) % slides.length;
    slidesIndex = newIndex;
  }

  function previousSlide() {
    const newIndex = (slidesIndex - 1 + slides.length) % slides.length;
    slidesIndex = newIndex;
  }

  function goForward() {
    if (interval) clearInterval(interval);
    advanceSlide();
    interval = setInterval(() => {
      advanceSlide();
    }, 5000);
  }

  function goBackward() {
    if (interval) clearInterval(interval);
    previousSlide();
    interval = setInterval(() => {
      advanceSlide();
    }, 5000);
  }

  // biome-ignore lint/style/useConst: svelte
  let showWrapped = $state(false);
  let interval: ReturnType<typeof setInterval> | undefined = $state();
  $effect(() => {
    if (showWrapped) {
      interval = setInterval(() => {
        advanceSlide();
      }, 5000);

      return () => clearInterval(interval);
    }
  });

  let audio: HTMLAudioElement;

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "ArrowLeft") {
      goBackward();
    } else if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
      goForward();
    }
  }

  $effect(() => {
    if (showWrapped) {
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<svelte:head>
  <title>Wrapped - High Seas v2</title>
  <meta property="og:title" content="View my High Seas Wrapped" />
  <meta
    property="og:description"
    content="Check out my ships, doubloons, money spent, and more!"
  />
</svelte:head>

<audio
  bind:this={audio}
  src="https://cloud-auzh6ioja-hack-club-bot.vercel.app/041857.mp3"
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
          class="h-[2px] w-[12px] md:w-[20px] transition-colors duration-400 {i === slidesIndex
            ? 'bg-white'
            : 'bg-base'}"
        ></div>
      {/each}
    </div>
    <div
      role="button"
      tabindex="0"
      on:click={(event: MouseEvent) => {
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left; // Checks if it's on the left or right side
        if (clickX < rect.width / 2) {
          goBackward();
        } else {
          goForward();
        }
      }}
      class="h-full w-full sm:w-1/2 lg:w-1/3 rounded shadow select-none"
    >
      <Current {wrapped} />
    </div>
  </div>
{:else}
  <div class="w-full h-full justify-center items-center flex">
    <div class="p-6 space-y-3 shadow rounded-lg bg-surface0">
      <h2 class="text-3xl font-semibold">High Seas Wrapped</h2>
      <Button
        variant="primary"
        onclick={() => {
          audio.play();
          showWrapped = true;
        }}>Play Wrapped!</Button>
      <p class="text-sm">
        (This click is required due to browser audio restrictions. Sorry!)
      </p>
    </div>
  </div>
{/if}