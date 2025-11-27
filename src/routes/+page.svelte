<script>
	import Button from "../components/Button.svelte";
    import Game from "../components/Game.svelte";

    import { setState, home } from "$lib/pos.svelte";
</script>

<main>
    <!-- add "max-w-lg mx-auto" if want to limit width -->
    <div class="m-4">
        <Button onclick={() => setState(home)}> Exit game </Button>

        <Game></Game>
    </div>
</main>
