<script lang="ts">
    import { getState } from "$lib/pos.svelte";
	import { type Action } from "$lib/state";
    import Button from "../components/Button.svelte"; // Assuming this is a custom button component

    // Use $state for reactive state management in modern Svelte
    const state = $derived(getState());

    // Function to handle option click for cleaner template
    const handleOptionClick = (option: Action) => {
        console.log(option);
        state.doOption(option);
    };
</script>

<main>
    <section class="content-header">
        <h1 class="title"> {state.title} </h1>
        <p class="description"> {state.getDescription()} </p>
    </section>

    <hr class="separator" />

    <section class="actions-container">
        {#each state.options as option}
            <button 
                class="action-button" 
                onclick={ () => handleOptionClick(option) }
            > 
                {option.action} 
            </button>
        {/each}

        <!-- <button class="utility-button"> Test Functionality </button> -->
    </section>
</main>

<style>
    /* 🎨 Global Styling for better base */
    :global(body) {
        font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        background-color: #f4f6f9; /* Light, neutral background */
        color: #333;
        margin: 0;
        padding: 0;
        min-height: 100vh;
    }

    /* 🏠 Main Layout */
    main {
        max-width: 900px; /* Constrain width for readability on large screens */
        margin: 40px auto; /* Center the content */
        padding: 30px;
        background-color: #fff;
        border-radius: 8px; /* Soft rounded corners */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    }
</style>