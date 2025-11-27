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
        <p class="description"> {state.description} </p>
    </section>

    <hr class="separator" />

    <section class="actions-container">
        {#each state.options as option}
            <Button 
                class="action-button" 
                onclick={ () => handleOptionClick(option) }
            > 
                {option.action} 
            </Button>
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

    /* 🏷️ Header Section */
    .content-header {
        margin-bottom: 20px;
    }

    .title {
        font-size: 2.2em; /* Slightly larger, but not overwhelming */
        font-weight: 300; /* Light weight for a modern look */
        color: #1a73e8; /* A primary blue color */
        margin-top: 0;
        margin-bottom: 5px;
    }

    .description {
        font-size: 1.1em;
        color: #666; /* Subdued color for descriptive text */
        line-height: 1.5;
        margin-bottom: 0;
    }

    /* 📏 Separator */
    .separator {
        border: none;
        border-top: 1px solid #eee;
        margin: 20px 0;
    }

    /* ⚙️ Actions Container (Buttons) */
    .actions-container {
        display: grid;
        /* Create a responsive grid: 2 columns on small screens, 3 on larger */
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
        gap: 15px; /* Spacing between grid items */
        padding-top: 10px;
    }

    /* 🛠️ Utility Button (e.g., the 'test' button) */
    .utility-button {
        /* Style it differently to show it has a different function */
        grid-column: 1 / -1; /* Make it span the full width */
        background-color: #ccc;
        color: #333;
        padding: 10px;
        border: none;
        border-radius: 6px;
        font-size: 1em;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .utility-button:hover {
        background-color: #999;
    }
</style>