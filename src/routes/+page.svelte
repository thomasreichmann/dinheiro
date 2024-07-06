<script lang="ts">
    import { getModalStore, type ModalSettings, ProgressRadial } from '@skeletonlabs/skeleton';
    import ConfigModal from '$lib/components/ConfigModal.svelte';
    import { UserService } from '$lib/services/userService';
    import { fade, fly, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let value: number | undefined;

    const userService = UserService.getInstance() as UserService;

    let { userIdStore, userStore } = userService;

    async function onUpdate(sessionId: string, val: number) {
        // Set the input value to undefined
        value = undefined;

        userService.updateUser({
            data: {
                sessionId,
                balance: val + $userStore.balance
            },
            where: {
                sessionId
            }
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
    on:submit={() => onUpdate($userStore.sessionId, value ?? 0)}
    class="flex h-screen flex-col items-center justify-center gap-4"
>
    {#if $userStore}
        <h1 transition:slide={{ duration: 600 }} class="text-2xl font-bold">
            {$userStore.balance}
        </h1>
    {:else}
        <div transition:slide={{ duration: 150 }}>
            <ProgressRadial class="flex h-20 w-20 flex-col items-center" />
        </div>
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
