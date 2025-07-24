<script lang="ts" setup>
import {
    format,
    type FormattedText,
    type FormattedTextArgs,
    type PFormattedText,
    resolveFormattedText,
} from "@/util/format.ts";
import OmegaNum from "omega_num.js";
import { h, type VNode } from "vue";

let props = withDefaults(defineProps<{
    text: PFormattedText,
    args?: FormattedTextArgs,
}>(), {
    args: () => ({}),
});

function parseTextImpl(text: FormattedText): (VNode | string)[] {
    if (text === null) return [];
    if (typeof text === "string") return [text];
    if (typeof text === "number") return [text.toString()];
    if (Array.isArray(text)) return text.flatMap((t) => parseTextImpl(t));
    if (text instanceof OmegaNum) return [h('span', { class: 'decimal' }, format(text))];
    if (text.type === 'br') return [h('br')];
    return [h(text.type, { class: text.classes }, parseTextImpl(text.text))];
}

function parseText(text: PFormattedText, args: FormattedTextArgs): VNode {
    return h('span', {}, parseTextImpl(resolveFormattedText(text, args)));
}
</script>

<template>
    <Component :is="parseText(text, args)" v-bind="$attrs"></Component>
</template>

<style scoped>

</style>