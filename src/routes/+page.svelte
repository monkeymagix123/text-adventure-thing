<script>
	import { getState } from "$lib/pos.svelte";
	import Game from "../components/Game.svelte";

    const state = $derived(getState());
</script>

<main>
    <!-- add "max-w-lg mx-auto" if want to limit width -->
    <div class="m-4">
        <Game></Game>
    </div>
</main>
