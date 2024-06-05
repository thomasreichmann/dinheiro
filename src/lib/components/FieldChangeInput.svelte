<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let title: string;
    export let currentValue: string;

    let value: string;

    const dispatch = createEventDispatcher();

    const onClick = () => {
        dispatch('click', value);
        value = '';
    };
</script>

<form
    class=" flex w-min flex-col items-center gap-3 text-nowrap rounded-md bg-surface-600 p-5 text-3xl"
    on:submit={onClick}
>
    <h1 class="text-gray-200">{title}</h1>
    <h1 class="w-full bg-surface-700 p-3.5 text-center text-gray-400">{currentValue}</h1>
    <input
        class="leading-20 input h-14 w-full appearance-none rounded-none px-2 text-center text-2xl"
        bind:value
        {...$$restProps}
    />
    <button class="variant-filled-primary btn mt-1">confirm</button>
</form>
