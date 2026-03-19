<script>
    import Button from "$lib/components/Button.svelte";
    import Game from "$lib/components/Game.svelte";
    import DebugPanel from "$lib/components/DebugPanel.svelte";
    import { goHome } from "$lib/gameStore.svelte";
    import { saveGame, loadGame, resetGame } from "$lib/gameStore.svelte";
</script>

<main>
    <div class="m-4">
        <div class="flex gap-2">
            <Button onclick={goHome}>Main Menu</Button>
            <Button onclick={saveGame}>Save</Button>
            <Button onclick={loadGame}>Load</Button>
            <Button onclick={resetGame}>Clear Save</Button>
        </div>

        <Game />

        {#if import.meta.env.DEV}
            <DebugPanel />
        {/if}
    </div>
</main>