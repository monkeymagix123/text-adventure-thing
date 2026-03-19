<script>
    import Button from "../components/Button.svelte";
    import Game from "../components/Game.svelte";
    import { goHome } from "$lib/pos.svelte";
</script>

<main>
    <div class="m-4">
        <Button onclick={goHome}>Exit game</Button>
        <Game />
    </div>
</main>