<script lang="ts">
    import { getModalStore, type ModalSettings, ProgressRadial } from '@skeletonlabs/skeleton';
    import { getBalance, updateBalance } from '$lib/client/balanceClient';
    import type { PageData } from './$types';
    import ConfigModal from '$lib/components/ConfigModal.svelte';

    export let data: PageData;
    const { user } = data;
    const sessionId = '123';

    let value: number | undefined;

    const updateMutation = updateBalance();

    const getQuery = getBalance(
        sessionId,
        user ? { userId: user.sessionId, balance: user.balance } : undefined
    );

    async function onUpdate(val: number) {
        value = undefined;
        $updateMutation.mutate({
            userId: sessionId,
            balance: val + ($getQuery.data?.balance ?? 0)
        });
    }

    const modalStore = getModalStore();
    const modal: ModalSettings = {
        type: 'component',
        component: { ref: ConfigModal }
    };

    // modalStore.trigger(modal);
</script>

<button
    on:click={() => modalStore.trigger(modal)}
    type="button"
    class="btn-icon absolute right-0 m-3 text-2xl"
    tabindex="-1"
>
    <i class="fa-solid fa-gear" />
</button>

<form
    on:submit={() => onUpdate(value ?? 0)}
    class="flex h-screen flex-col items-center justify-center gap-4"
>
    {#if $getQuery.isPending}
        <ProgressRadial value={undefined} />
    {:else}
        <h1 class="text-2xl font-bold">{$getQuery.data?.balance}</h1>
    {/if}
    <div class="flex h-20 w-20 flex-col items-center">
        <input
            type="number"
            id="value-input"
            bind:value
            class="leading-20 input h-full w-full appearance-none rounded-none px-2 text-center text-2xl"
        />
    </div>

    <div class="flex gap-2">
        <button type="submit" class="variant-filled-primary btn">add</button>
        <!--        <button type="submit" class="variant-filled-secondary btn">reset</button>-->
    </div>
</form>
