<script>
  import Button from "$lib/components/button.svelte";
  import { page } from "$app/state";
</script>

<main>
  <div class="flex flex-col items-center justify-center mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-6xl font-bold leading-relaxed">
        {page.status}
      </h1>
      <p class="text-xl mb-8 leading-relaxed">
        {page.error?.message}
      </p>

      {#if page.status === 500}
        <p class="text-xl mb-8 leading-relaxed">
          This might be due to Airtable ratelimits - please try again later :)
        </p>
      {/if}

      <div class="flex justify-center gap-2">
        <a href="/shipyard"><Button variant="primary">Visit Shipyard</Button></a
        >
        <a href="/shop"><Button>Visit Shop</Button></a>
      </div>
    </div>
  </div>
</main>
