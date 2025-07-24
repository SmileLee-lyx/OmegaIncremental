<script lang="ts" setup>

import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import type { Buyable } from "@/core/Types.js";
import { text } from "@/text/text.js";
import { toBoolean } from "@/util/util.js";
import { ref, type Ref } from "vue";

const props = defineProps<{
    buyable: Buyable;
    extra_classes?: string | string[];
    width?: string | number;
    height?: string | number;
}>();

let mouseHover: Ref<boolean> = ref(false);

function state(): string {
    if (!toBoolean(props.buyable.unlocked, true)) return 'not-unlocked';
    if (props.buyable.buyable()) return 'buyable';
    return 'not-buyable';
}

function style(): any {
    return {
        width: props.width,
        height: props.height,
    };
}
</script>

<template>
    <span class="tooltip-container">
        <span
            v-show="toBoolean(buyable.visible, true)"
            :class="extra_classes"
            :style="style()"
            class="buyable-panel"
            v-bind="$attrs"
        >
            <span class="large buyable-panel-title">{{ buyable.name }}</span>
            <TextFormatter :args="buyable.args"
                           :text="text(buyable.dynamicDescriptionId?.call(buyable)
                                       ?? buyable.descriptionId)"
                           class="buyable-panel-description"
            />
            <TextFormatter v-if="buyable.effectDescriptionId !== undefined"
                           :args="buyable.args"
                           :text="text(buyable.effectDescriptionId)"
                           class="buyable-panel-effect"/>
            <button :class="[state(), extra_classes]"
                    class="buyable-panel-button"
                    @click="() => buyable.buy()"
            >
                <TextFormatter :args="buyable.args"
                               :text="text(buyable.priceDescriptionId)"/>
            </button>
        </span>
    </span>
</template>

<style scoped>

</style>