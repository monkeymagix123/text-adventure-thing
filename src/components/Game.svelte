<script lang="ts">
    import { getState, getDescription, getOptions, choose } from "$lib/gameStore.svelte";
    import type { Action } from "$lib/state";

    const state = $derived(getState());
    const description = $derived(getDescription());
    const options = $derived(getOptions());

    function handleOptionClick(option: Action) {
        choose(option);
    }
</script>

<main>
    <section class="content-header">
        <h1 class="title">{state.title}</h1>
        <p class="description">{description}</p>
    </section>

    <hr class="separator" />

    <section class="actions-container">
        {#each options as option}
            <button
                class="action-button"
                onclick={() => handleOptionClick(option)}
            >
                {option.action}
            </button>
        {/each}
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