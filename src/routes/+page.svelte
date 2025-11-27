<script>
	import { getState } from "$lib/pos.svelte";

    const state = $derived(getState());
</script>

<main>
    <h2> {state.title} </h2>
    <p> {state.description} </p>

    {#each state.options as option}
        <button onclick={ () => { console.log(option); state.doOption(option); } }> {option.action} </button>
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
