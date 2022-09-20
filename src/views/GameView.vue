<script setup>
    import { ref } from 'vue'

    import WordHelper from "@/components/WordHelper";
    import Letter from "@/components/Letter.vue";
    import { computed } from '@vue/reactivity';
    import Keyboard from '../components/keyboard.vue';
    const correctNumberOfLetter = 5;

    // window.WordHelper = WordHelper;
    const pastAttempts = ref([]);
    const checkingResults = ref([]);

    const currentAttempt = ref('');
    const debugMessage = ref('');
    let mainInput = ref(null);

    const stateDict = {
        "started" : "started",
        "win": "You got it",
        "too-many-trial": "Exceed max number of attempts"
    };
    const gameState = computed(() => {
        if (!checkingResults.value.length) return "started";

        const latestChecking = checkingResults.value[checkingResults.value.length - 1];
        if (latestChecking.filter(x => x === "true").length == correctNumberOfLetter) return "END,win";
        if (pastAttempts.value.length >= 6) return "END,too-many-trial";
        
        return "started";
    });


    function handleSubmit() {
        if (gameState.value != "started") return console.error("GAMESTATE ERROR");

        const result = WordHelper.check(currentAttempt.value);

        if (typeof result === "string") return debugMessage.value = result;

        pastAttempts.value.push(currentAttempt.value);
        currentAttempt.value = "";

        if (!Array.isArray(result)) return console.error("incorrect response", result);
        checkingResults.value.push(result);   
        if (result.filter(x => x === "true").length === result.length) {
            debugMessage.value = stateDict[gameState.value];
        }
        debugMessage.value = stateDict[gameState.value];
    }

    function filterInput() {
        console.log("changed");
        currentAttempt.value = currentAttempt.value.replace(/[^a-zA-Z]+/g, '').toLowerCase();
    }

    function refocus() {
        setTimeout(()=>mainInput.value.focus());
    }
    refocus();

    function simulateKey(key) {
        if (key === "⎆") return mainInput.value.submit();
        if (key === "␡") {
            currentAttempt.value = currentAttempt.value.slice(0, -1);
        } else {
            currentAttempt.value += key;
        }
        return setTimeout(() => mainInput.value.dispatchEvent( new Event("input")));
    }
</script>

<template>
    <main class="flex flex-col h-full py-4">
        <div class="text-center min-h-[1rem] mb-4">
            {{debugMessage}}
        </div>
        <div class="flex-1">
            <div class="attempt flex justify-center"  v-for="(item, row) in pastAttempts.slice(0,6)">
                <Letter name="letter" v-for="i in 5" :val="item[i-1]" :status="checkingResults[row][i-1]" />
            </div>
            <div class="attempt current-attempt flex justify-center" v-if="gameState === 'started'">
                <Letter name="letter" v-for="i in 5" :val="currentAttempt[i-1]" :status="undefined"/>
            </div>
            <form @submit.prevent="handleSubmit" v-if="gameState === 'started'">
            <input ref="mainInput" class="text-black opacity-0 fixed -top-3/4" maxlength="5"
                    v-model="currentAttempt"
                    @input="filterInput"
                    @blur="refocus" auto-focus/>
            </form>
        </div>
        
        <Keyboard :past-attempts="pastAttempts" :checking-results="checkingResults" @keyclick="simulateKey"/>
    </main>
</template>