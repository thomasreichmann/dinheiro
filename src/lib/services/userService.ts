import { Prisma } from '@prisma/client';
import {
    type CreateMutateFunction,
    type CreateMutationResult,
    createQuery
} from '@tanstack/svelte-query';
import { type Writable, writable } from 'svelte/store';
import { createMutationWithOptimisticUpdate } from '$lib/client/baseClient';
import { Service } from '$lib/services/Service';
import { browser } from '$app/environment';

export class UserService extends Service {
    private static queryKey: string = 'user';
    protected createInstance() {
        return new UserService();
    }

    constructor() {
        super('/api/user/');

        if (!browser) return;

        let initialId = localStorage.getItem('userId');
        if (!initialId) {
            initialId = UserService.generateUserId();
        }

        this.userId = initialId;
        this.userIdStore = writable(initialId);

        this.fetchUser();

        this.userIdStore.subscribe((id) => {
            localStorage.setItem('userId', id);
        });

        this.updateUserMutation = this.createUpdateUserMutation();
        this.updateUserMutation.subscribe((mutationResult) => {
            this.mutateUser = mutationResult.mutate;
        });
    }

    private userId!: string;
    public userIdStore: Writable<string> = writable();
    public userStore: Writable<Prisma.UserGetPayload<Prisma.UserDefaultArgs>> = writable();
    public updateUserMutation!: CreateUserUpdateMutationResult;
    public mutateUser!: CreateBaseUserMutation;

    fetchUser(initialData?: Prisma.UserSelect) {
        const result = createQuery<Prisma.UserSelect>({
            queryKey: [UserService.queryKey],
            queryFn: async () =>
                await fetch(new URL(this.userId, this.baseURL)).then((r) => r.json()),
            initialData: initialData as undefined
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

    async updateUser(variables: Prisma.UserUpdateArgs) {
        if (this.mutateUser) {
            this.userId = variables.data.sessionId as string;
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
