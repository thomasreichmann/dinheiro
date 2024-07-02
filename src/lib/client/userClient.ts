import { createQuery } from '@tanstack/svelte-query';
import { Prisma } from '@prisma/client';
import { createMutationWithOptimisticUpdate } from '$lib/client/baseClient';

const BASE_PATH = '/api/user';

export function getUser(sessionId: string, initialData?: Prisma.UserSelect) {
    return createQuery<Prisma.UserSelect>({
        queryKey: ['user'],
        queryFn: async () => await fetch(`${BASE_PATH}/${sessionId}`).then((r) => r.json()),
        initialData: initialData as undefined,
        staleTime: 3000
    });
}

export function updateUser() {
    const mutationFn = async (rq: Prisma.UserUpdateArgs) => {
        return await fetch('/api/user', {
            method: 'PUT',
            body: JSON.stringify(rq),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((r) => r.json());
    };

    return createMutationWithOptimisticUpdate<Prisma.UserSelect, Prisma.UserUpdateArgs>(
        ['user'],
        mutationFn
    );
}
