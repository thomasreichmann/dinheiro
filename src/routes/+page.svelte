<form on:submit={() => onUpdate(value ?? 0)} class="flex flex-col items-center justify-center h-screen gap-4">
	<h1 class="text-2xl font-bold">{$balance}</h1>
	<div class="flex flex-col items-center h-20 w-20">
		<input type="number" id="value-input" bind:value={value}
					 class="leading-20 px-2 text-2xl text-center rounded-none w-full appearance-none h-full input">
	</div>
	<button type="submit" class="btn variant-filled-primary">add</button>
</form>

<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let balance = writable(120);
	let value: number | undefined;

	onMount(() => {
		balance.subscribe((val) => {
			console.log(val);
		});
	});

	function onUpdate(val: number) {
		balance.update((prev) => prev + val);

		value = undefined; // Clear value
	}
</script>

<style>
    /* For Chrome, Safari, Edge, Opera */
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* For Firefox */
    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>