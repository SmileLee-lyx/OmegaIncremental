<script lang="ts" setup>

import { isShift } from "@/core/misc/global-keyboard-press.js";
import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import type { Upgrade } from "@/core/Types.js";
import { text } from "@/text/text.js";
import { toBoolean } from "@/util/util.js";
import { ref, type Ref } from "vue";

const props = defineProps<{
    upgrade: Upgrade;
}>();

let mouseHover: Ref<boolean> = ref(false);

function state(): string {
    if (!toBoolean(props.upgrade.unlocked, true)) return 'not-unlocked';
    if (props.upgrade.bought) return 'fully-bought';
    if (props.upgrade.buyable()) return 'buyable';
    return 'not-buyable';
}
</script>

<template>
    <span class="tooltip-container">
        <button
            v-show="toBoolean(upgrade.visible, true)"
            :class="[state(), upgrade.extraClasses]"
            :disabled="state() !== 'buyable'"
            class="upgrade-button"
            v-bind="$attrs"
            @click="upgrade.buy()"
            @mouseenter="mouseHover = true"
            @mouseleave="mouseHover = false"
        >
            <span class="small">
                <template v-if="!isShift || upgrade.hiddenDescriptionId === undefined">
                    <span class="large upgrade-button-title">{{ upgrade.name }}</span>
                    <TextFormatter :args="upgrade.args"
                                   :text="text(upgrade.dynamicDescriptionId?.call(upgrade)
                                       ?? upgrade.descriptionId)"
                                   class="upgrade-button-description"
                    />
                    <TextFormatter v-if="upgrade.effectDescriptionId !== undefined"
                                   :args="upgrade.args"
                                   :text="text(upgrade.effectDescriptionId)"
                                   class="upgrade-button-effect"
                    />
                    <TextFormatter :args="upgrade.args"
                                   :text="text(upgrade.priceDescriptionId)"
                                   class="upgrade-button-price"
                    />
                </template>
                <template v-else>
                    <TextFormatter :args="upgrade.args"
                                   :text="text(upgrade.hiddenDescriptionId)"/>
                </template>
            </span>
        </button>
        <span v-if="upgrade.hiddenTooltipId !== undefined"
              v-show="mouseHover && isShift"
              class="tooltip-top">
            <TextFormatter :text="text(upgrade.hiddenTooltipId)"/>
        </span>
    </span>
</template>

<style scoped>

</style>