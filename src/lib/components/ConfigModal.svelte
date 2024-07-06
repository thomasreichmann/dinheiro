<script lang="ts">
    import FieldChangeInput from '$lib/components/FieldChangeInput.svelte';
    import { UserService } from '$lib/services/userService';

    let userService = UserService.getInstance() as UserService;

    let { updateUser, userStore, userIdStore } = userService;

    const updateSession = (sessionId: string) => {
        updateUser({
            data: {
                sessionId
            },
            where: { sessionId }
        });
    };

    const updateAllowance = (sessionId: string, allowance: number) => {
        updateUser({
            data: {
                sessionId,
                allowance
            },
            where: {
                sessionId
            }
        });
    };
</script>

<div class="w-modal flex h-auto justify-evenly rounded-md bg-surface-700 p-10">
    <FieldChangeInput
        title="Session ID"
        currentValue={$userIdStore}
        on:click={(e) => updateSession(e.detail)}
        type="number"
    />
    <FieldChangeInput
        title="Daily allowance"
        currentValue={$userStore.allowance.toString()}
        on:click={(e) => updateAllowance($userStore.sessionId, e.detail)}
        type="number"
    />
</div>
