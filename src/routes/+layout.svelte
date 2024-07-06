<script lang="ts">
    import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/svelte-query';
    import { initializeStores, Modal, ProgressBar } from '@skeletonlabs/skeleton';
    import { writable } from 'svelte/store';

    const queryClient = new QueryClient();
    initializeStores();
    const isFetching = useIsFetching({}, queryClient);
    const showIndicator = writable(false);

    let timeoutId: number;

    $: {
        if ($isFetching) {
            showIndicator.set(true);
            clearTimeout(timeoutId);
        } else {
            timeoutId = setTimeout(() => {
                showIndicator.set(false);
            }, 200) as unknown as number; // setTimeout returns a number in the browser;
        }
    }
</script>

<QueryClientProvider client={queryClient}>
    <Modal />
    <slot />
    <div id="global-fetching-indicator-wrapper" class:visible={$showIndicator}>
        <ProgressBar meter="bg-secondary-500" />
    </div>
</QueryClientProvider>

<style>
    #global-fetching-indicator-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
        opacity: 0;
        transform: translateY(100%);
        transition:
            opacity 0.2s,
            transform 0.2s;
    }

    #global-fetching-indicator-wrapper.visible {
        opacity: 1;
        transform: translateY(0);
    }
</style>
