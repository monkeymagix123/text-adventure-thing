<main>
    <button onclick={prop.onclick} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> <slot> </slot> </button>
</main>

<script lang="ts">
    const prop = $props();
</script>

<style>
    /* 🔘 Action Button Styling (Assuming Button.svelte handles some of this) */
    /* This style applies to the custom Button component */
    button {
        padding: 15px 20px;
        font-size: 1.1em;
        font-weight: 600;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
        background-color: #4285f4; /* Google Blue */
        color: white;
        
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        min-width: auto;
    }

    button:hover {
        background-color: #3367d6; /* Darker blue on hover */
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }
</style>