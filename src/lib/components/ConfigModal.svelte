<script lang="ts">
    import FieldChangeInput from '$lib/components/FieldChangeInput.svelte';
    import { UserService } from '$lib/services/userService';

    const userService = UserService.getInstance() as UserService;

    let { userIdStore, userStore } = userService;

    const updateSession = (originalSessionId: string, sessionId: string) => {
        // Change the local store value
        userService.userIdStore.set(sessionId);
        userService.updateUser({
            data: {
                sessionId: sessionId
            },
            where: { sessionId: originalSessionId }
        });
    };

    const updateAllowance = (sessionId: string, allowance: number) => {
        userService.updateUser({
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
        on:click={(e) => updateSession($userIdStore, e.detail)}
        type="number"
    />
    <FieldChangeInput
        title="Daily allowance"
        currentValue={$userStore.allowance.toString()}
        on:click={(e) => updateAllowance($userStore.sessionId, parseInt(e.detail))}
        type="number"
    />
</div>
