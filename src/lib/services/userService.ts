import { Prisma } from '@prisma/client';
import {
    type CreateMutateFunction,
    type CreateMutationResult,
    createQuery,
    type CreateQueryResult
} from '@tanstack/svelte-query';
import { type Readable, readable, type Writable, writable } from 'svelte/store';
import { createMutationWithOptimisticUpdate } from '$lib/client/baseClient';
import { Service } from '$lib/services/Service';
import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

export class UserService extends Service {
    private static queryKey: string = 'user';
    protected createInstance() {
        return new UserService();
    }

    constructor() {
        super('/api/user/');

        console.log(browser);

        if (browser) {
            let initialId = localStorage.getItem('userId');
            if (!initialId) {
                initialId = UserService.generateUserId();
            }

            this.userIdStore = writable(initialId);

            this.fetchUser(initialId);

            this.userIdStore.subscribe((id) => {
                localStorage.setItem('userId', id);
                this.fetchUser(id);
            });

            this.updateUserMutation = this.createUpdateUserMutation();
            this.updateUserMutation.subscribe((mutationResult) => {
                this.mutateUser = mutationResult.mutate;
            });
        } else {
            this.userIdStore = writable('');
        }
    }

    public userIdStore: Writable<string>;
    userStore: Writable<Prisma.UserGetPayload<Prisma.UserDefaultArgs>> = writable();
    updateUserMutation!: CreateUserUpdateMutationResult;
    mutateUser!: CreateBaseUserMutation;

    fetchUser(sessionId: string, initialData?: Prisma.UserSelect) {
        const result = createQuery<Prisma.UserSelect>({
            queryKey: [UserService.queryKey],
            queryFn: async () =>
                await fetch(new URL(sessionId, this.baseURL)).then((r) => r.json()),
            initialData: initialData as undefined,
            staleTime: 3000
        });

        return new Promise((resolve, reject) => {
            result.subscribe((value) => {
                if (value.isLoading) return;
                if (value.error) reject(value.error);
                this.userStore.set(
                    value.data as unknown as Prisma.UserGetPayload<Prisma.UserDefaultArgs>
                );
                resolve(value.data);
            });
        });
    }

    updateUser(variables: Prisma.UserUpdateArgs) {
        if (this.mutateUser) {
            this.mutateUser(variables);
        } else {
            console.error('Mutate function not initialized');
        }
    }

    private static generateUserId(length: number = 8): string {
        return Math.floor(
            Math.random() * ((1 + '0'.repeat(length)) as unknown as number)
        ).toString();
    }

    private createUpdateUserMutation(): CreateUserUpdateMutationResult {
        const mutationFn = async (rq: Prisma.UserUpdateArgs) => {
            return await fetch(new URL(rq.where.sessionId!, this.baseURL), {
                method: 'PUT',
                body: JSON.stringify(rq.data),
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

type CreateBaseUserMutation = CreateMutateFunction<Prisma.UserSelect, Error, Prisma.UserUpdateArgs>;

type CreateUserUpdateMutationResult = CreateMutationResult<
    Prisma.UserSelect,
    Error,
    Prisma.UserUpdateArgs
>;
