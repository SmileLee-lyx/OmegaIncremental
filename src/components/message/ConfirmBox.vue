<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { text } from "@/text/text.js";
import type { ConfirmData } from "@/util/message-manager.js";

defineProps<{
    index: number;
    data: ConfirmData
}>();

defineEmits<{
    (e: 'done'): void;
    (e: 'close'): void;
}>();
</script>

<template>
    <div :style="{ zIndex: index * 2 + 102 }" class="message-window">
        <TextFormatter :text="data.messageText"/>
        <div class="text-box">
            <button class="message-button" @click="$emit('done')">
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