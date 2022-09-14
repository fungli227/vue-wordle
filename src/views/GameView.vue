<script setup>
    import { ref } from 'vue'

    import WordHelper from "@/components/WordHelper";
    import Letter from "@/components/Letter.vue";

    const pastAttempts = ref([]);
    const checkingResults = ref([]);

    const currentAttempt = ref('');
    const debugMessage = ref('');
    let mainInput = ref(null);



    function handleSubmit() {
        if (pastAttempts.value.length > 6) return console.error("Exceed max number of attempts");

        const result = WordHelper.check(currentAttempt.value);

        if (typeof result === "string") return debugMessage.value = result;

        pastAttempts.value.push(currentAttempt.value);
        currentAttempt.value = "";

        if (!Array.isArray(result)) return console.error("incorrect response", result);
        checkingResults.value.push(result);   
    }

    function filterInput() {
        currentAttempt.value = currentAttempt.value.replace(/[^a-zA-Z]+/g, '').toLowerCase();
    }

    function refocus() {
        setTimeout(()=>mainInput.value.focus());
    }
    refocus();
</script>

<template>
    <main>
        <div>
            <div class="attempt flex"  v-for="(item, row) in pastAttempts.slice(0,6)">
                <Letter name="letter" v-for="i in 5" :val="item[i-1]" :status="checkingResults[row][i-1]" />
            </div>
            <div class="attempt current-attempt flex" v-if="pastAttempts.length < 6">
                <Letter name="letter" v-for="i in 5" :val="currentAttempt[i-1]" :status="undefined"/>
            </div>
        </div>
        <form @submit.prevent="handleSubmit" v-if="pastAttempts.length < 6">
            <input ref="mainInput" class="text-black" maxlength="5"
                    v-model="currentAttempt"
                    @input="filterInput"
                    @blur="refocus" auto-focus/>
        </form>
        {{debugMessage}}
    </main>
</template>