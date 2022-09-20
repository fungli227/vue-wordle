<script setup>
    import { computed } from '@vue/reactivity';
    
    import colors from './colors';
    const emit =  defineEmits(['keyclick'])
    

    const keyColors = structuredClone(colors);
    keyColors["false"] += " !text-neutral-300 opacity-50";

    const props = defineProps({
        "pastAttempts": Array,
        "checkingResults": Array
    });
    const priority = {"true":3, "POS":2, "false":1};


    const rows = ["qwertyuiop","asdfghjkl","⎆zxcvbnm␡"]
    const letterStatusMap = computed(() => {
        const result = {};
        props.pastAttempts.forEach((rowString, rowIndex) => Array.from(rowString).forEach((letter, colIndex) => {
            let curItem = props.checkingResults[rowIndex][colIndex];
            let existing = result[letter];
            if (!existing || priority[existing]<priority[curItem]) result[letter] = curItem;
        }))
        return result;
    })

    const getColor = (letter) => {
        let letterStatus = letterStatusMap.value[letter];
        if (letterStatus === undefined) return "bg-slate-700";
        
        return keyColors[letterStatus];
    }

    const click = function(letter) {
        emit("keyclick", letter);
    }

</script>
<template>
    <div class="row flex mb-[2px] justify-center" v-for="row in rows">
        <div class="key p-3 m-[2px] rounded-sm flex content-center uppercase items-center text-white" 
             :class="getColor(key)" v-for="key in row" @click="click(key)">
            <svg v-if="key === '␡'" class="w-[18px] fill-white stroke-white stroke-2" viewBox="-3 0 50 44" vector-effect="non-scaling-stroke">
                <path d="M10.625,5.09L0,22.09l10.625,17H44.18v-34H10.625z M42.18,37.09H11.734l-9.375-15l9.375-15H42.18V37.09z"/>
                <polygon points="18.887,30.797 26.18,23.504 33.473,30.797 34.887,29.383 27.594,22.09 34.887,14.797 33.473,13.383 26.18,20.676    18.887,13.383 17.473,14.797 24.766,22.09 17.473,29.383  "/>
            </svg>
            <span class=" text-[10px] font-bold" v-else-if="key=='⎆'">Enter</span>
            <span class=" text-sm font-bold" v-text="key" v-else></span>
        </div>
    </div>
</template>