<script>
	import { getState } from "$lib/pos.svelte";
	import Game from "../components/Game.svelte";

    const state = $derived(getState());
</script>

<main>
    <Game></Game>
</main>
