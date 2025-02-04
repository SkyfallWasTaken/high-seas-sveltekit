<script lang="ts">
  import Pill from "$lib/components/pill.svelte";
  import Button from "$lib/components/button.svelte";
  import ShipDialog from "$lib/components/ship-dialog.svelte";
  import GenerateIdeaDialog from "$lib/components/generate-idea-dialog.svelte";
  import ViewShipDialog from "$lib/components/view-ship-dialog.svelte";
  import { page } from "$app/state";
  import type { ShipGroup } from "$lib/server/data";

  const { ships } = page.data;

  let shipDialogOpen = $state(false);
  let generateIdeaDialogOpen = $state(false);
  let viewShipDialogOpen = $state(false);
  let viewShipDialogShipGroup = $state<ShipGroup | null>(null);

  function openShipDialog() {
    shipDialogOpen = true;
  }

  function openGenerateIdeaDialog() {
    generateIdeaDialogOpen = true;
  }

  function openViewShipDialog(shipGroup: ShipGroup) {
    viewShipDialogShipGroup = shipGroup;
    viewShipDialogOpen = true;
  }
</script>

<svelte:head>
  <title>Shipyard - High Seas v2</title>
</svelte:head>

<div class="p-4 md:p-6 space-y-4">
  <div class="mb-4 md:mb-6">
    <h1 class="text-3xl md:text-4xl text-center font-black mb-4">Shipyard</h1>
    <div class="flex flex-col sm:flex-row justify-center gap-2 px-2">
      <Button
        variant="primary"
        class="w-full sm:w-auto"
        onclick={openShipDialog}>Draft a ship</Button
      >
      <Button
        variant="surface0"
        class="w-full sm:w-auto"
        onclick={openGenerateIdeaDialog}>Generate an idea</Button
      >
    </div>
  </div>
  <ul class="space-y-3">
    {#each ships! as ship}
      <li class="w-full">
        <div
          role="button"
          tabindex="0"
          onclick={() => openViewShipDialog(ship)}
          onkeydown={(event) =>
            event.key === "Enter" && openViewShipDialog(ship)}
          class="rounded-lg {ship.isInYswsBase
            ? 'border-yellow-200 border-2 text-yellow-200'
            : ''} w-full bg-surface0 hover:bg-surface1 shadow-sm flex flex-col sm:flex-row sm:items-center p-4 transition-colors duration-200"
        >
          <div
            class="flex gap-3 sm:gap-4 items-start sm:items-center flex-grow"
          >
            <div class="w-14 h-14 sm:w-16 sm:h-16 relative flex-shrink-0">
              <img
                src={ship.ships[ship.ships.length - 1].screenshotUrl}
                alt={`Screenshot of ${ship.title}`}
                class="object-cover w-full h-full absolute top-0 left-0 rounded"
              />
            </div>
            <div class="flex-grow min-w-0">
              <h2
                class="text-lg sm:text-xl {ship.isInYswsBase
                  ? 'font-bold'
                  : 'font-semibold'} text-left mb-2 truncate"
              >
                {ship.title}
              </h2>

              <div class="flex flex-wrap items-start gap-2 text-sm">
                {#if ship.ships.at(-1)?.shipStatus === "shipped"}
                  {#if ship.ships.at(-1)?.paidOut}
                    <Pill>{ship.totalDoubloons} doubloons</Pill>
                  {:else}
                    <Pill
                      >Waiting for {10 - ship.ships.at(-1)?.matchupsCount!} more
                      {10 - ship.ships.at(-1)?.matchupsCount! === 1
                        ? "vote"
                        : "votes"}</Pill
                    >
                  {/if}
                  <Pill>{Math.round(ship.totalHours * 10) / 10} hours</Pill>
                  {#if ship.ships.at(-1)?.paidOut}
                    <Pill>
                      {Math.round(
                        (ship.totalDoubloons / ship.totalHours) * 10
                      ) / 10} doubloons/hr</Pill
                    >
                  {/if}
                {:else}
                  <Pill
                    >Draft {ship.ships.at(-1)?.shipType === "project"
                      ? "ship"
                      : "update"}
                  </Pill>
                {/if}
              </div>
            </div>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-4">
            <Button variant="secondary" class="w-full sm:w-auto"
              >Ship an update!</Button
            >
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>

<ShipDialog bind:open={shipDialogOpen} />
<GenerateIdeaDialog bind:open={generateIdeaDialogOpen} />
{#if viewShipDialogShipGroup}
  <ViewShipDialog
    bind:open={viewShipDialogOpen}
    bind:shipGroup={viewShipDialogShipGroup}
  />
{/if}
