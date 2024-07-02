<script lang="ts">
    import FieldChangeInput from '$lib/components/FieldChangeInput.svelte';

    let currentAllowance = 110;
    let sessionId = '12345678';

    const updateSession = (id: string) => {
        // does update session stuff
        console.log(`Session ID updated to ${id}`);
    };

    const updateAllowance = (allowance: number) => {
        // does update session stuff
        console.log(`Daily allowance updated to ${allowance}`);
    };
</script>

<div class="w-modal flex h-auto justify-evenly rounded-md bg-surface-700 p-10">
    <FieldChangeInput
        title="Session ID"
        currentValue={sessionId}
        on:click={(e) => updateSession(e.detail)}
        type="number"
    />
    <FieldChangeInput
        title="Daily allowance"
        currentValue={currentAllowance.toString()}
        on:click={(e) => updateAllowance(e.detail)}
        type="number"
    />
</div>
