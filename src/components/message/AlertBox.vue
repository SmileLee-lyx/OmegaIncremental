<script lang="ts" setup>
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { text } from "@/text/text.js";
import type { AlertData } from "@/util/message-manager.js";

defineProps<{
    index: number;
    data: AlertData
}>();

defineEmits<{
    (e: 'done'): void;
}>();
</script>

<template>
    <div :style="{ zIndex: index * 2 + 102 }" class="message-window">
        <TextFormatter :text="data.messageText"/>
        <button class="message-button" @click="$emit('done')">
            <TextFormatter :text="text('settings.confirm')"/>
        </button>
    </div>
</template>

<style scoped>

</style>