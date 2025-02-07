<script lang="ts">
  import ShopRegionPicker from "$lib/components/shop-region-picker.svelte";
  import ShopItemDialog from "$lib/components/shop-item-dialog.svelte";
  import ShowOutOfStock from "$lib/components/show-out-of-stock.svelte";
  import Button from "$lib/components/button.svelte";
  import { regions } from "$lib/regionPicker";
  import { page } from "$app/state";
  import type { ShopItem } from "$lib/server/shop";
  import flexsearch from "flexsearch";

  const Document = flexsearch.Document;

  const { shopItems, person } = page.data;
  // biome-ignore lint/style/useConst: svelte moment
  let region = $state(regions[0]);
  // biome-ignore lint/style/useConst: svelte moment
  let regionValue = $derived(region.value);
  const regionKey = $derived.by(() => {
    switch (regionValue) {
      case "eu-uk":
        return "enabledEu";
      case "us":
        return "enabledUs";
      case "australia":
        return "enabledAu";
      case "india":
        return "enabledIn";
      case "canada":
        return "enabledCa";
      default:
        return "enabledXx";
    }
  });

  console.time("index-gen");
  const index = new Document({
    tokenize: "forward",
    cache: 100,
    document: {
      id: "id",
      store: [],
      index: ["name", "subtitle", "description"],
    },
  });

  shopItems.forEach((item, count) => {
    index.add({
      ...item,
      id: count,
    });
  });
  console.timeEnd("index-gen");

  // biome-ignore lint/style/useConst: svelte moment
  let query = $state("");
  // biome-ignore lint/style/useConst: svelte moment
  let showOutOfStock = $state(false);
  const availableShopItems = $derived.by(() => {
    return (
      query.trim() !== ""
        ? new Set(index.search(query.trim()).flatMap((result) => result.result))
            .values()
            .map((index) => shopItems[index as number])
            .toArray()
        : shopItems
    )
      .filter((item) => item[regionKey])
      .filter((item) => showOutOfStock || !item.outOfStock)
      .map((item) => {
        const price = region.value === "us" ? item.priceUs : item.priceGlobal;
        return {
          ...item,
          price,
          canAfford: (person?.doubloonsBalance || 0) >= price,
        };
      })
      .sort((a, b) => a.price - b.price);
  });

  let shopItemDialogOpen = $state(false);
  let shopItemDialogItem = $state<ShopItem | null>(null);

  function openShopItemDialog(item: ShopItem) {
    shopItemDialogItem = item;
    shopItemDialogOpen = true;
  }
</script>

<svelte:head>
  <title>Shop - High Seas v2</title>
</svelte:head>

<div class="m-6 space-y-3">
  <div class="mb-6 text-center flex justify-center flex-col">
    <h1 class="text-4xl text-center font-black mb-1">Shop</h1>
    <p class="mb-4">Choose a region to view the items available!</p>
    <div class="mb-3.5"><ShopRegionPicker bind:region /></div>
    <div class="flex flex-col items-center gap-3">
      <input
        type="text"
        bind:value={query}
        class="inline-flex bg-base py-3 px-4 w-[296px] items-center rounded-md px-[11px] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-surface0 focus:ring-offset-2 focus:ring-offset-overlay0"
        placeholder="Search items..."
      />
      <ShowOutOfStock bind:checked={showOutOfStock} />
    </div>
  </div>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each availableShopItems as item}
      <div
        role="button"
        tabindex="0"
        class="h-full text-center"
        onclick={() => openShopItemDialog(item)}
        onkeydown={(event) => event.key === "Enter" && openShopItemDialog(item)}
      >
        <div class="bg-surface0 shadow p-4 rounded-lg h-full flex flex-col">
          <div class="flex-grow">
            <h2 class="text-xl font-bold">{item.name}</h2>
            <p class="text-sm text-muted-foreground mb-2">
              {@html item.subtitle}
            </p>
            <p class="text-lg font-medium">
              {item.price}
              {item.price == 1 ? "doubloon" : "doubloons"}
            </p>
            {#if item.imageUrl}
              <img
                src={item.imageUrl}
                alt="Image for {item.name}"
                class="rounded-lg mt-4"
              />
            {/if}
          </div>
          <a
            href="/api/buy?itemId={item.id}"
            target="_blank"
            onclick={(event) => {
              if (!item.canAfford || item.outOfStock) {
                event.preventDefault();
              }
            }}
            class="w-full"
          >
            <Button
              variant="surface1"
              class="w-full hover:bg-mauve hover:text-black duration-250 mt-4"
              disabled={!item.canAfford || item.outOfStock}
              onclick={(event) => event.stopPropagation()}
              >{item.outOfStock
                ? "Out of stock!"
                : item.canAfford
                  ? "Buy"
                  : `${item.price - (person?.doubloonsBalance || 0)} more doubloons needed`}</Button
            >
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>
{#if shopItemDialogItem}
  <ShopItemDialog
    bind:open={shopItemDialogOpen}
    bind:item={shopItemDialogItem}
  />
{/if}
