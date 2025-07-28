<script lang="ts" setup>

import TextFormatter from "@/components/util-objects/TextFormatter.vue";
import type { Challenge } from "@/core/Types.js";
import { text } from "@/text/text.js";
import { br, type PFormattedText } from "@/util/format.js";
import { toBoolean } from "@/util/util.js";

const props = defineProps<{
    challenge: Challenge;
}>();

function state(): string {
    if (!toBoolean(props.challenge.unlocked, true)) return 'not-unlocked';
    return 'buyable';
}

function effectAndTarget(): PFormattedText {
    const { effectDescriptionId, targetDescriptionId } = props.challenge;
    if (effectDescriptionId === undefined) return text(targetDescriptionId);
    else return [text(targetDescriptionId), br(), text(effectDescriptionId)];
}
</script>

<template>
    <span class="tooltip-container">
        <span
            v-show="toBoolean(challenge.visible, true)"
            :class="challenge.extraClasses"
            class="challenge-panel"
            v-bind="$attrs"
        >
            <span class="large buyable-panel-title">{{ challenge.name }}</span>
            <TextFormatter :args="challenge.args"
                           :text="text(challenge.dynamicDescriptionId?.call(challenge)
                                       ?? challenge.descriptionId)"
                           class="challenge-panel-description"
            />
            <TextFormatter :args="challenge.args"
                           :text="effectAndTarget()"
                           class="challenge-panel-effect small2"
            />
            <button :class="[state(), challenge.extraClasses]"
                    class="challenge-panel-button"
                    @click="challenge.action()"
            >
                <TextFormatter :args="challenge.args"
                               :text="text(challenge.dynamicActionId())"
                />
            </button>
        </span>
    </span>
</template>

<style scoped>

</style>