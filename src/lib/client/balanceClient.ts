import type { GetBalanceResponse, UpdateBalanceRequest } from '$lib/types';
import { createQuery } from '@tanstack/svelte-query';
import { createMutationWithOptimisticUpdate } from '$lib/client/baseClient';

const BASE_PATH = '/api/balance';

/**
 * Get the balance for a user.
 * This uses the `svelte-query` library to cache the result.
 * @example
 * const balanceQuery = await getBalance('123');
 *
 * {#if $query.isPending}
 *   <p>Loading...</p>
 * {:else}
 *   <p>Balance: {balance.data.amount}</p>
 * {/if}
 */
export function getBalance(sessionId: string, initialData?: GetBalanceResponse) {
    return createQuery<GetBalanceResponse>({
        queryKey: ['balance'],
        queryFn: async () => await fetch(`${BASE_PATH}/${sessionId}`).then((r) => r.json()),
        initialData: initialData as undefined,
        staleTime: 3000
    });
}

/**
 * Specific function to update the balance for a user.
 *
 * @example
 * const updateMutation = updateBalance();
 *
 * await updateMutation.mutate({ sessionId, balance: 100 });
 */
export function updateBalance() {
    const mutationFn = async (rq: UpdateBalanceRequest) => {
        return await fetch('/api/balance', {
            method: 'PUT',
            body: JSON.stringify(rq),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => r.json());
    };

    return createMutationWithOptimisticUpdate<GetBalanceResponse, UpdateBalanceRequest>(
        ['balance'],
        mutationFn
    );
}
