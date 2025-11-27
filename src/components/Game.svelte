<script>
	import { getState } from "$lib/pos.svelte";
	import Button from "../components/Button.svelte";

    const state = $derived(getState());
</script>

<main>
    <h1> {state.title} </h1>

    <p> {state.description} </p>

    {#each state.options as option}
        <Button onclick={ () => { console.log(option); state.doOption(option); } }> {option.action} </Button>
    {/each}

    <button> test </button>

    <!-- <style>
        h1 {
            color: #ff3e00;
            text-transform: uppercase;
            font-size: 4em;
            font-weight: 100;
        }
    </style> -->
</main>

<style>
    :global(h1) {
        /* color: #ff3e00; */
        /* text-transform: uppercase; */
        /* font-size: 4em; */
        font-size: 2em;
        font-weight: 100;
    }
</style>