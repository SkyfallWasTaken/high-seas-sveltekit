<script lang="ts">
  import SignIn from "./sign-in.svelte";
  import Button from "./button.svelte";
  import { page } from "$app/state";
  import { Menu, X } from "lucide-svelte";
  import { slide } from "svelte/transition";

  const { slackSession, person } = page.data;
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<header class="bg-surface0">
  <div class="flex gap-2 items-center px-4 py-3 border-b-[1px] border-surface1">
    <div class="flex gap-2 md:gap-6 flex-1 items-center">
      <h1 class="text-lg md:text-xl whitespace-nowrap">High Seas v2</h1>

      <!-- Desktop navigation -->
      <div class="hidden md:flex gap-4 items-center">
        <a
          href="/shipyard"
          class="font-semibold transition-colors duration-200"
          class:text-mauve={page.url.pathname === "/shipyard"}>Shipyard</a
        >
        <a
          href="/shop"
          class="font-semibold transition-colors duration-200"
          class:text-mauve={page.url.pathname === "/shop"}>Shop</a
        >
        <a href="/wrapped" class="font-bold text-mauve">Wrapped</a>
        <a
          href="/debug"
          class="font-semibold transition-colors duration-200"
          class:text-mauve={page.url.pathname === "/debug"}>Debug</a
        >
      </div>
    </div>

    <div class="flex gap-2 md:gap-2.5 items-center">
      {#if slackSession && person}
        <span class="hidden md:inline text-xl whitespace-nowrap"
          >{Math.floor(person.doubloonsBalance)} doubloons</span
        >
        <img
          src={slackSession.pfp}
          alt={slackSession.name}
          class="w-6 h-6 md:w-8 md:h-8 rounded-full"
        />
        <span class="hidden md:inline text-xl"
          >Hey, {slackSession.firstName}!</span
        >
      {:else}
        <SignIn>
          <Button variant="primary">Sign in</Button>
        </SignIn>
      {/if}

      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2 -mr-2"
        on:click={toggleMenu}
        aria-label="Toggle menu"
      >
        {#if isMenuOpen}
          <div>
            <X class="w-6 h-6" />
          </div>
        {:else}
          <div>
            <Menu class="w-6 h-6" />
          </div>
        {/if}
      </button>
    </div>
  </div>

  <!-- Mobile navigation -->
  {#if isMenuOpen}
    <nav
      class="md:hidden px-4 py-2 border-b-[1px] border-surface1"
      transition:slide={{ duration: 200 }}
    >
      {#if slackSession && person}
        <div class="flex items-center gap-2 py-3 border-b border-surface1">
          <span class="text-lg font-medium"
            >{Math.floor(person.doubloonsBalance)} doubloons</span
          >
        </div>
      {/if}
      <div class="flex flex-col gap-2">
        <a
          href="/shipyard"
          class="font-semibold py-2 transition-colors duration-200"
          class:text-mauve={page.url.pathname === "/shipyard"}
          on:click={() => (isMenuOpen = false)}>Shipyard</a
        >
        <a
          href="/shop"
          class="font-semibold py-2 transition-colors duration-200"
          class:text-mauve={page.url.pathname === "/shop"}
          on:click={() => (isMenuOpen = false)}>Shop</a
        >
        <a
          href="/debug"
          class="font-semibold py-2 transition-colors duration-200"
          class:text-mauve={page.url.pathname === "/debug"}
          on:click={() => (isMenuOpen = false)}>Debug</a
        >
      </div>
    </nav>
  {/if}
</header>
