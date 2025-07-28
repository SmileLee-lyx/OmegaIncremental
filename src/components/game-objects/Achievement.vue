<script lang="ts" setup>

import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import type { Achievement } from "@/core/Types.js";
import { text } from "@/text/text.js";
import { toBoolean } from "@/util/util.js";
import { ref, type Ref } from "vue";

const props = defineProps<{
    achievement: Achievement;
}>();

let mouseHover: Ref<boolean> = ref(false);

function state(): string {
    return props.achievement.bought ? 'fully-bought' : 'not-unlocked';
}
</script>

<template>
    <span class="tooltip-container">
        <span
            v-show="toBoolean(achievement.visible, true)"
            :class="[state(), achievement.extraClasses]"
            class="achievement"
            v-bind="$attrs"
            @mouseenter="mouseHover = true"
            @mouseleave="mouseHover = false"
        >
            <span class="small">
                <TextFormatter
                    :text="achievement.nameId ? text(achievement.nameId) : achievement.name"/>
            </span>

            <span class="achievement-status-span">
                <img v-if="achievement.bought"
                     alt="✓" class="achievement-status-icon" src="@/assets/correct.svg"/>
                <img v-else
                     alt="✗" class="achievement-status-icon" src="@/assets/incorrect.svg"/>
            </span>
        </span>

        <span v-if="mouseHover" class="tooltip-top">
            <TextFormatter
                :text="text(achievement.dynamicDescriptionId?.call(achievement) ?? achievement.descriptionId)"/>
        </span>
    </span>
</template>

<style scoped>
</style>