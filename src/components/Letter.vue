
<script setup lang="ts">
import colors from './colors';


    defineProps({
        val: String,
        status: String
    });

    const statusToClass : {[key: string]: string} = {
        "true": "border-none " + colors.true,
        "false": "border-none " + colors.false,
        "POS": "border-none " + colors.POS
    }
</script>
<template>
    <div class="mx-1 mb-4 aspect-square w-16
                border-2 border-neutral-600  
                flex items-center justify-center 
                text-neutral-200 text-4xl uppercase font-bold" :class="status ? statusToClass[status.toString()] : ''">
        {{val}}
    </div>
</template>