import { Service } from '$lib/services/Service';
import { Prisma } from '@prisma/client';
import {
    type CreateMutationResult,
    createQuery,
    type CreateQueryResult
} from '@tanstack/svelte-query';
import { readable, type Writable, writable } from 'svelte/store';
import { createMutationWithOptimisticUpdate } from '$lib/client/baseClient';

export class UserService extends Service {
    private static queryKey: string = 'user';
    protected createInstance(): Service {
        return new UserService();
    }

    constructor() {
        super('/api/user');

        let initialId = localStorage.getItem('userId');
        if (!initialId) {
            initialId = UserService.generateUserId();
        }

        this.userIdStore = writable(initialId);
        this.userIdStore.subscribe((id) => {
            localStorage.setItem('userId', id);
            this.fetchUser(id);
        });

        this.fetchUser(initialId);
    }

    userIdStore: Writable<string>;
    userStore: CreateQueryResult<Prisma.UserSelect> = readable();
    updateUserMutation: CreateUserUpdateMutationResult = this.createUpdateUserMutation();

    fetchUser(sessionId: string, initialData?: Prisma.UserSelect) {
        const result = createQuery<Prisma.UserSelect>({
            queryKey: [UserService.queryKey],
            queryFn: async () =>
                await fetch(new URL(sessionId, this.baseURL)).then((r) => r.json()),
            initialData: initialData as undefined,
            staleTime: 3000
        });

        this.userStore = result;

        return result;
    }

    updateUser(variables: Prisma.UserUpdateArgs) {
        this.updateUserMutation.subscribe(({ mutate }) => {
            mutate(variables);
        });
    }

    private static generateUserId(length: number = 8): string {
        return Math.floor(
            Math.random() * ((1 + '0'.repeat(length)) as unknown as number)
        ).toString();
    }

    private createUpdateUserMutation(): CreateUserUpdateMutationResult {
        const mutationFn = async (rq: Prisma.UserUpdateArgs) => {
            return await fetch(this.baseURL, {
                method: 'PUT',
                body: JSON.stringify(rq),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((r) => r.json());
        };

        return createMutationWithOptimisticUpdate<Prisma.UserSelect, Prisma.UserUpdateArgs>(
            [UserService.queryKey],
            mutationFn
        );
    }
}

type CreateUserUpdateMutationResult = CreateMutationResult<
    Prisma.UserSelect,
    Error,
    Prisma.UserUpdateArgs
>;
