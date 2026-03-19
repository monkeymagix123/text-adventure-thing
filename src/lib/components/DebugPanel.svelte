<script lang="ts">
    import {
        getCurrentStateId,
        getDebugFlags,
        getDebugVisitCounts,
        saveGame,
        loadGame,
        clearSave,
        resetGame
    } from "$lib/gameStore.svelte";
    import Button from "$lib/components/Button.svelte";

    const stateId = $derived(getCurrentStateId());
    const flags = $derived(getDebugFlags());
    const visitCounts = $derived(getDebugVisitCounts());

    const enabledFlags = $derived(
        Object.entries(flags).filter(([, value]) => value)
    );

    const visitedStates = $derived(
        Object.entries(visitCounts)
    );
</script>

<details class="debug-panel">
    <summary>Debug</summary>

    <div class="debug-section">
        <strong>Current state:</strong> {stateId}
    </div>

    <div class="debug-section">
        <strong>Enabled flags:</strong>
        {#if enabledFlags.length === 0}
            <div>None</div>
        {:else}
            <ul>
                {#each enabledFlags as [flag]}
                    <li>{flag}</li>
                {/each}
            </ul>
        {/if}
    </div>

    <div class="debug-section">
        <strong>Visited states:</strong>
        {#if visitedStates.length === 0}
            <div>None</div>
        {:else}
            <ul>
                {#each visitedStates as [id, count]}
                    <li>{id}: {count}</li>
                {/each}
            </ul>
        {/if}
    </div>

    <div class="debug-actions">
        <Button onclick={saveGame}>Save</Button>
        <Button onclick={loadGame}>Load</Button>
        <Button onclick={clearSave}>Clear Save</Button>
        <Button onclick={resetGame}>Restart Game</Button>
    </div>
</details>

<style>
    .debug-panel {
        margin-top: 1rem;
        padding: 0.75rem;
        border: 1px solid #666;
        border-radius: 0.5rem;
    }

    .debug-section {
        margin-top: 0.75rem;
    }

    .debug-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 1rem;
    }

    ul {
        margin: 0.25rem 0 0 1rem;
        padding: 0;
    }
</style>