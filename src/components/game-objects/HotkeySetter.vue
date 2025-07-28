<script lang="ts" setup>
import {
    getRegisteredEvent,
    getRegisteredKey,
    isValidHotkey,
    registerHotkey,
    removeHotkeyById,
} from "@/components/misc/global-keyboard-press.js";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import { GlobalMessages } from "@/core/global-messages.js";
import type { HotkeyData } from "@/core/global-objects.js";
import type { HotkeyEvent } from "@/core/Types.js";
import { text } from "@/text/text.js";
import { type PFormattedText, resolveFormattedText } from "@/util/format.js";
import { computed, type Ref, ref } from "vue";

const props = defineProps<{
    config: HotkeyEvent;
    data?: HotkeyData;
}>();

let button: Ref<HTMLButtonElement | null> = ref(null);

let waiting = ref(false);

function onClick(event: MouseEvent) {
    waiting.value = true;
}

function onBlur(event: FocusEvent) {
    waiting.value = false;
}

function onKeyDown(event: KeyboardEvent) {
    let key = event.key.toLowerCase();
    if (key === 'escape') {
        removeHotkeyById(props.config.id);
        button.value?.blur();
        if (props.data !== undefined) props.data.key = undefined;
        return;
    }
    if (!isValidHotkey(key)) {
        GlobalMessages.addMessage({
            type: 'alert',
            messageText: resolveFormattedText(text('hotkey.should-alnum')),
        });
        return;
    }
    let previous = getRegisteredEvent(key);
    if (previous === undefined) {
        registerHotkey(key, props.config);
        button.value?.blur();
        if (props.data !== undefined) props.data.key = key;
    } else if (previous.id !== props.config.id) {
        GlobalMessages.addMessage({
            type: 'confirm',
            messageText: resolveFormattedText(
                text('hotkey.occupied'), { target: text(previous.description) },
            ),
            done() {
                registerHotkey(key, props.config);
                button.value?.blur();
                if (props.data !== undefined) props.data.key = key;
            },
            cancel() {
                button.value?.focus();
                waiting.value = true;
            },
        });
    } else {
        button.value?.blur();
    }
}

let content = computed((): PFormattedText => {
    if (waiting.value) return '_';
    let key = getRegisteredKey(props.config.id);
    if (key !== undefined) return key.toUpperCase();
    return text('hotkey.none');
});

</script>

<template>
    <div v-show="data?.unlocked ?? true" class="text-row">
        <TextFormatter v-if="!waiting"
                       :args="{description: text(config.description)}"
                       :text="text('hotkey.normal')"/>
        <TextFormatter v-else
                       :text="text('hotkey.wait')"/>
        <button ref="button"
                class="hotkey-button"
                @blur="onBlur"
                @click="onClick"
                @keydown.stop="onKeyDown">
            <TextFormatter :text="content"/>
        </button>
    </div>
</template>

<style scoped>

</style>