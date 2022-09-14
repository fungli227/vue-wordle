
<script setup lang="ts">

    defineProps({
        val: String,
        status: String
    });

    const statusToClass : {[key: string]: string} = {
        "true": "bg-green-800",
        "false": "bg-rose-900",
        "POS": "bg-yellow-600"
    }
</script>
<template>
    <div class="mx-1 mb-4 aspect-square w-16
                border-2 border-neutral-400 
                flex items-center justify-center 
                text-neutral-200 text-4xl uppercase font-bold" :class="status ? statusToClass[status.toString()] : ''">
        {{val}}
    </div>
</template>