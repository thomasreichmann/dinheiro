<form on:submit={() => onUpdate(value ?? 0)} class="flex flex-col items-center justify-center h-screen gap-4">
	{#if $balance === undefined}
		<h1 class="text-2xl font-bold">Loading...</h1>
	{:else}
		<h1 class="text-2xl font-bold">{$balance}</h1>
	{/if}
	<div class="flex flex-col items-center h-20 w-20">
		<input type="number" id="value-input" bind:value={value}
					 class="leading-20 px-2 text-2xl text-center rounded-none w-full appearance-none h-full input">
	</div>
	<button type="submit" class="btn variant-filled-primary">add</button>
</form>

<script lang="ts">
	import { writable } from 'svelte/store';
	import type { GetBalanceResponse, UpdateBalanceRequest } from '$lib/types';
	import { onMount } from 'svelte';

	let balance = writable<number>();
	let value: number | undefined;

	onMount(async () => {
		balance.subscribe((val) => sendUpdateBalanceRequest({ balance: val, userId: '123' }));
		// TODO: figure out if we can do the fetching here, because we can cause an infinite loop if we update the balance and then are subscribed to the balance store
	});

	function onUpdate(val: number) {
		balance.update((prev) => prev + val);
		value = undefined; // Clear value
	}

	async function getBalance(userId: string) {
		const res = await fetch(`/api/balance/${userId}`).then((res) => res.json()) as GetBalanceResponse;
		return res.balance;
	}

	async function sendUpdateBalanceRequest(updateRequest: UpdateBalanceRequest) {
		const res = await fetch('/api/balance', {
			method: 'PUT',
			body: JSON.stringify(updateRequest),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json()) as UpdateBalanceRequest;

		console.log(res);
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