<script lang="ts">
    import { QueryClient, QueryClientProvider, useIsFetching } from '@tanstack/svelte-query';
    import { initializeStores, Modal, ProgressBar } from '@skeletonlabs/skeleton';

    const queryClient = new QueryClient();

    initializeStores();

    const isFetching = useIsFetching({}, queryClient);
</script>

<Modal />
<QueryClientProvider client={queryClient}>
    <slot />
    <div id="global-fetching-indicator-wrapper">
        {#if $isFetching}
            <ProgressBar />
        {/if}
    </div>
</QueryClientProvider>

<style>
    #global-fetching-indicator-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100vw;
    }
</style>
