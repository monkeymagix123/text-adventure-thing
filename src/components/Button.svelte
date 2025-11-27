<main>
    <button onclick={prop.onclick} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> <slot> </slot> </button>
</main>

<script lang="ts">
    const prop = $props();
</script>