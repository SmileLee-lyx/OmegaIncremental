<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { text } from "@/text/text.js";
import type { InputData } from "@/util/message-manager.js";
import { ref, type Ref } from "vue";

defineProps<{
    index: number;
    data: InputData
}>();

defineEmits<{
    (e: 'close'): void;
    (e: 'done', text: string): void;
}>();

const input: Ref<string> = ref("");
</script>

<template>
    <div :style="{ zIndex: index * 2 + 102 }" class="message-window">
        <TextFormatter :text="data.messageText"/>
        <input v-model="input" :type="data.inputType" style="flex-grow: 1"/>
        <div class="text-box">
            <button class="message-button" @click="$emit('done', input)">
                <TextFormatter :text="text('settings.confirm')"/>
            </button>
            <button class="message-button" @click="$emit('close')">
                <TextFormatter :text="text('settings.cancel')"/>
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>