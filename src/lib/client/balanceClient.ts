import type { GetBalanceResponse, UpdateBalanceRequest } from '$lib/types';
import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

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
 * Update the balance for a user.
 *
 * TODO: implement this using svelte-query
 *
 * @example
 * const updatedBalance = await updateBalance({
 *    userId: '123',
 *    amount: 100
 * });
 */
export function updateBalance() {
    const client = useQueryClient();

    const updateBalanceFn = async (rq: UpdateBalanceRequest) => {
        return await fetch(`${BASE_PATH}`, {
            method: 'PUT',
            body: JSON.stringify(rq),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => r.json());
    };

    return createMutation({
        mutationFn: updateBalanceFn,
        onMutate: async (rq: UpdateBalanceRequest) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await client.cancelQueries({ queryKey: ['balance'] });

            // Snapshot the previous value
            const previousBalance = client.getQueryData<GetBalanceResponse>(['balance']);

            // Optimistically update to the new value
            if (previousBalance) {
                client.setQueryData<GetBalanceResponse>(['balance'], {
                    ...previousBalance,
                    balance: rq.balance
                });
            }

            return { previousBalance };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err: any, variables: any, context: any) => {
            if (context?.previousBalance) {
                client.setQueryData<GetBalanceResponse>(['balance'], context.previousBalance);
            }
        },
        // Always refetch after error or success:
        onSettled: () => {
            client.invalidateQueries({ queryKey: ['balance'] });
        }
    });
}
