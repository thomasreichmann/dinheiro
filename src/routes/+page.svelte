<script lang="ts">
    import { ProgressRadial } from '@skeletonlabs/skeleton';
    import { getBalance, updateBalance } from '$lib/client/balanceClient';
    import type { PageData } from './$types';

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
</script>

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

    <button type="submit" class="variant-filled-primary btn">add</button>
</form>

<style>
    /* For Chrome, Safari, Edge, Opera */
    input[type='number']::-webkit-inner-spin-button,
    input[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* For Firefox */
    input[type='number'] {
        -moz-appearance: textfield;
    }
</style>
