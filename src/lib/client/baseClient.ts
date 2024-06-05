import { createMutation, useQueryClient } from '@tanstack/svelte-query';

/**
 * Generic function to create mutations with optimistic updates.
 *
 * @param queryKey - The query key for the data being mutated.
 * @param mutationFn - The function that performs the mutation.
 * @param updateFn - The function that updates the cached data optimistically.
 * @param revertFn - The function that reverts the optimistic update in case of an error.
 *
 * @example
 * const updateMutation = createMutationWithOptimisticUpdate(
 *   ['balance'],
 *   async (rq) => await fetch('/api/balance', { method: 'PUT', body: JSON.stringify(rq), headers: { 'Content-Type': 'application/json' } }).then((r) => r.json())
 * );
 *
 * await updateMutation.mutate({ sessionId, balance: 100 });
 */
export function createMutationWithOptimisticUpdate<TData, TRequest>(
    queryKey: unknown[],
    mutationFn: (rq: TRequest) => Promise<TData>,
    updateFn: (oldData: TData | undefined, rq: TRequest) => TData = (oldData, rq) =>
        ({ ...oldData, ...rq }) as unknown as TData,
    revertFn: (oldData: TData | undefined) => TData | undefined = (oldData) => oldData
) {
    const client = useQueryClient();

    return createMutation({
        mutationFn,
        onMutate: async (rq: TRequest) => {
            await client.cancelQueries({ queryKey });

            const previousData = client.getQueryData<TData>(queryKey);

            client.setQueryData<TData>(queryKey, (oldData) => updateFn(oldData, rq));

            return { previousData };
        },
        onError: (err, variables, context) => {
            if (context?.previousData) {
                client.setQueryData<TData>(queryKey, revertFn(context.previousData));
            }
        },
        onSettled: () => {
            client.invalidateQueries({ queryKey });
        }
    });
}
