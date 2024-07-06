<script lang="ts">
    import { getModalStore, type ModalSettings, ProgressRadial } from '@skeletonlabs/skeleton';
    import ConfigModal from '$lib/components/ConfigModal.svelte';
    import { UserService } from '$lib/services/userService';
    import { slide } from 'svelte/transition';
    import { browser } from '$app/environment';

    let value: number | undefined;

    const userService = UserService.getInstance() as UserService;

    let { userIdStore, userStore } = userService;

    if (browser) {
        userStore.subscribe((val) => {
            if (!val) return;
            let lastVisited = localStorage.getItem('lastVisited');
            let now = new Date();

            if (!lastVisited) {
                // first visit
                localStorage.setItem('lastVisited', now.toISOString());
            } else {
                // Compare the last visited time with the current time
                // calculate how many days have passed since the last visit rounded down
                let days = Math.floor(
                    (now.getTime() - new Date(lastVisited).getTime()) / (1000 * 60 * 60 * 24)
                );

                // Calculate the balance change based on current balance and daily allowance
                let balanceChange = days * $userStore.allowance;
                if (balanceChange > 0) {
                    onUpdate($userIdStore, balanceChange);
                }
            }

            // Update the last visited time
            localStorage.setItem('lastVisited', now.toISOString());
        });
    }

    async function onUpdate(sessionId: string, val: number) {
        // Set the input value to undefined
        value = undefined;

        await userService.updateUser({
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
    on:submit={() => onUpdate($userIdStore, value ?? 0)}
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

    <div class="flex flex-col gap-2">
        <button type="submit" class="variant-filled-primary btn">add</button>
        <button
            type="button"
            class="variant-filled-secondary btn"
            on:click={() => {
                // Add or remove a negative sign to the input value
                value = value ? -value : value;
            }}>invert</button
        >
    </div>
</form>
