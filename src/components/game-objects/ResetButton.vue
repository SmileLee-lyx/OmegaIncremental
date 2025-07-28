<script lang="ts" setup>

import { isShiftPressed } from "@/components/misc/global-keyboard-press.js";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import type { Reset } from "@/core/Types.js";
import { text } from "@/text/text.js";
import { toBoolean } from "@/util/util.js";
import { ref, type Ref } from "vue";

const props = defineProps<{
    reset: Reset;
}>();

let mouseHover: Ref<boolean> = ref(false);

function state(): string {
    if (!toBoolean(props.reset.unlocked, true)) return 'not-unlocked';
    if (props.reset.buyable()) return 'buyable';
    return 'not-buyable';
}
</script>

<template>
    <span class="tooltip-container">
        <button
            v-show="toBoolean(reset.visible, true)"
            :class="[state(), reset.extraClasses]"
            :disabled="state() !== 'buyable'"
            class="upgrade-button"
            style="height: 80px"
            v-bind="$attrs"
            @click="reset.buy()"
            @mouseenter="mouseHover = true"
            @mouseleave="mouseHover = false"
        >
            <span class="small">
                <template v-if="!isShiftPressed || reset.hiddenDescriptionId === undefined">
                    <TextFormatter :args="reset.args"
                                   :text="text(reset.dynamicDescriptionId?.call(reset)
                                       ?? reset.descriptionId)"
                    />
                </template>
                <template v-else>
                    <TextFormatter :args="reset.args"
                                   :text="text(reset.hiddenDescriptionId)"/>
                </template>
            </span>
        </button>
    </span>
</template>

<style scoped>

</style>