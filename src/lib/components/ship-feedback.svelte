<script lang="ts">
  import { Accordion } from "bits-ui";
  import { slide } from "svelte/transition";
  import { ChevronDown } from "lucide-svelte";

  const { feedback }: { feedback: string } = $props();
</script>

<Accordion.Root class="w-full">
  <Accordion.Item value="0" class="group rounded-md bg-surface0 pl-3 pr-1.5">
    <Accordion.Header>
      <Accordion.Trigger
        class="flex w-full flex-1 items-center justify-between py-3 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 "
      >
        AI Feedback
        <span
          class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
        >
          <ChevronDown class="size-[18px] transition-all duration-200" />
        </span>
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
      transition={slide}
      transitionConfig={{ duration: 150 }}
      class="pb-[25px]"
    >
      {feedback}
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
